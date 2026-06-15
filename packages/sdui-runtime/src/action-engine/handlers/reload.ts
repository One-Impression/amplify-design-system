import { ReloadPayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action, Node } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine } from "../types.js";
import { useLocalStore } from "../../state/useLocalStore.js";
import { bindRequestPayload } from "../cond/resolve-request-refs.js";
import { resolveEndpointUrl, buildBffHeaders } from "./_shared/bff-request.js";

/**
 * reload — region-scoped page refresh. Marks the named `regions` loading (so the
 * renderer shows each one's skeleton), fetches `endpoint` with the bound request
 * context, then applies the response as a PARTIAL page: `response.data`
 * shallow-merges into the live page's `data`, `response.items` replaces `items`.
 * Regions not named (e.g. a footer shell) stay mounted and untouched.
 *
 * One verb, every scope: `["content"]` for a filter, `["header","content"]` for
 * a tab switch / first content load. Response is set RAW (no schema parse) so
 * node-level fields like `viewability` survive.
 */
export async function handleReload(
  action: Action,
  config: ActionEngineConfig,
  _engine: ActionEngine,
): Promise<void> {
  const bound = bindRequestPayload(action.payload, useLocalStore.getState().data);
  const payload = ReloadPayloadSchema.parse(bound);

  // Tell the server which regions to return (so it answers with a matching
  // partial page) alongside the bound context.
  const url = resolveEndpointUrl(config, {
    endpoint: payload.endpoint,
    path_params: payload.path_params,
    query_params: { ...(payload.query_params ?? {}), regions: payload.regions.join(",") },
  });
  const headers = buildBffHeaders(config);

  const { usePageStore } = await import("../../state/usePageStore.js");
  usePageStore.getState().setRegionsLoading(payload.regions, true);

  try {
    const res = await fetch(url, {
      method: payload.method,
      headers,
      body: payload.request_body ? JSON.stringify(payload.request_body) : undefined,
    });

    if (!res.ok) {
      throw new Error(
        `reload: BFF ${payload.method} ${url} returned ${res.status}`,
      );
    }

    // Partial page: { data?: Record<string, unknown>, items?: Node[] }.
    const body = (await res.json()) as {
      data?: Record<string, unknown>;
      items?: Node[];
    };
    usePageStore.getState().mergeRegions({ data: body.data, items: body.items });
  } finally {
    usePageStore.getState().setRegionsLoading(payload.regions, false);
  }
}
