import { ReloadPayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action, Node } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine } from "../types.js";
import { useLocalStore } from "../../state/useLocalStore.js";
import { bindRequestPayload } from "../cond/resolve-request-refs.js";
import { resolveEndpointUrl, buildBffHeaders } from "./_shared/bff-request.js";

/**
 * Per-region in-flight registry — latest-wins concurrency for `reload`.
 *
 * A reload replaces/merges the regions it targets, so for any region only the
 * MOST RECENT reload should win. Rapid tab switches each fire a reload of the
 * same regions; without coordination they all run and apply in arrival order,
 * so the page flickers through every response and the last to *arrive* wins
 * (not the last clicked). We key in-flight fetches by region: a new reload of
 * region `r` takes ownership of `r` from whoever held it. Region overlap is
 * exactly "multiple parallel fetches targeting the same view"; reloads with
 * DISJOINT regions never contend and run in parallel.
 *
 * Abort vs. partial supersession: a reload's regions share one fetch (one
 * `AbortController`), so we abort it ONLY when ALL its regions have been taken
 * by newer reloads. If only some were taken (e.g. a `["content"]` filter lands
 * over an in-flight `["header","content"]` tab switch), the older fetch is left
 * to finish and applies just the regions it STILL owns — so its header isn't
 * lost while the newer reload wins the shared `content`.
 */
interface ReloadRequest {
  regions: Set<string>;
  controller: AbortController;
}
const requests = new Map<number, ReloadRequest>();
const regionOwners = new Map<string, number>();
let reloadCounter = 0;

/** The content region maps to `items`; every other region maps to `data.<region>`. */
const CONTENT_REGION = "content";

/** Test-only: abort + clear the in-flight registry between cases. */
export function __resetReloadConcurrency(): void {
  for (const { controller } of requests.values()) controller.abort();
  requests.clear();
  regionOwners.clear();
  reloadCounter = 0;
}

/**
 * reload — region-scoped page refresh. Marks the named `regions` loading (so the
 * renderer shows each one's skeleton), fetches `endpoint` with the bound request
 * context, then applies the response as a PARTIAL page: `response.data`
 * shallow-merges into the live page's `data`, `response.items` replaces `items`.
 * Regions not named (e.g. a footer shell) stay mounted and untouched.
 *
 * Latest-wins per region (see the registry note above): chained tab switches
 * render only the latest, with each skeleton held across the hand-off. One verb,
 * every scope: `["content"]` for a filter, `["header","content"]` for a tab
 * switch / first content load. Response is set RAW (no schema parse) so
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

  // Claim every targeted region for this call, taking ownership from prior
  // reloads. A prior reload that loses ALL its regions is aborted; one that
  // still owns some is left to finish (and will apply only those).
  const token = ++reloadCounter;
  const controller = new AbortController();
  requests.set(token, { regions: new Set(payload.regions), controller });
  const superseded = new Set<number>();
  for (const region of payload.regions) {
    const prev = regionOwners.get(region);
    if (prev !== undefined && prev !== token) {
      requests.get(prev)?.regions.delete(region);
      superseded.add(prev);
    }
    regionOwners.set(region, token);
  }
  for (const t of superseded) {
    const req = requests.get(t);
    if (req && req.regions.size === 0) req.controller.abort();
  }

  /** Regions this call still owns (not yet taken by a newer reload). */
  const ownedRegions = () =>
    payload.regions.filter((r) => regionOwners.get(r) === token);

  const { usePageStore } = await import("../../state/usePageStore.js");
  usePageStore.getState().setRegionsLoading(payload.regions, true);

  try {
    const res = await fetch(url, {
      method: payload.method,
      headers,
      body: payload.request_body ? JSON.stringify(payload.request_body) : undefined,
      signal: controller.signal,
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

    // Apply ONLY the regions we still own — a newer reload may have taken some
    // (or all) of them while this fetch was in flight.
    const owned = ownedRegions();
    if (owned.length > 0) {
      const dataKeys = owned.filter((r) => r !== CONTENT_REGION);
      const data =
        dataKeys.length > 0 && body.data
          ? Object.fromEntries(
              dataKeys.filter((k) => k in body.data!).map((k) => [k, body.data![k]]),
            )
          : undefined;
      const items = owned.includes(CONTENT_REGION) ? body.items : undefined;
      usePageStore.getState().mergeRegions({ data, items });
    }
  } catch (err) {
    // Fully superseded — our controller was aborted. Drop silently; the newer
    // reloads own these regions and keep their skeletons up.
    if (controller.signal.aborted) return;
    throw err;
  } finally {
    // Release + clear loading only for regions we still hold. Regions taken by
    // a newer reload stay loading until that reload settles.
    const stillOwned = ownedRegions();
    if (stillOwned.length > 0) {
      usePageStore.getState().setRegionsLoading(stillOwned, false);
      for (const r of stillOwned) regionOwners.delete(r);
    }
    requests.delete(token);
  }
}
