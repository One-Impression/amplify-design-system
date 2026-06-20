import { ReloadSectionPayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine } from "../types.js";
import { resolveRequestRefs } from "../cond/resolve-request-refs.js";
import { useLocalStore } from "../../state/useLocalStore.js";

/**
 * reload_section — fetches a fresh node from the BFF and replaces the
 * target section in the current page store by its ID.
 */
export async function handleReloadSection(
  action: Action,
  config: ActionEngineConfig,
  _engine: ActionEngine,
): Promise<void> {
  // Resolve `{ ref: "$.local.*" }` in the request body against the local store
  // BEFORE parse — so a search box's typed value (mirrored to the local store
  // on change) rides into the request. Before parse because the body schema
  // would otherwise reject a ref-object value.
  const raw = (action.payload ?? {}) as Record<string, unknown>;
  const bound =
    "payload" in raw
      ? {
          ...raw,
          payload: resolveRequestRefs(raw.payload, {
            local: useLocalStore.getState().data,
          }),
        }
      : raw;
  const payload = ReloadSectionPayloadSchema.parse(bound);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = config.authToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Path-direct: the BFF emits the concrete `path`; fetch `bffBaseUrl + path`
  // verbatim (no endpoint-id registry). Trim a trailing slash off the base so
  // we never produce a double slash with the leading-`/` path.
  const base = config.bffBaseUrl.replace(/\/$/, "");
  const url = `${base}${payload.path}`;
  const res = await fetch(url, {
    method: payload.payload ? "POST" : "GET",
    headers,
    body: payload.payload ? JSON.stringify(payload.payload) : undefined,
  });

  if (!res.ok) {
    throw new Error(
      `reload_section: BFF ${payload.path} returned ${res.status}`,
    );
  }

  const node = await res.json();

  const { usePageStore } = await import("../../state/usePageStore.js");
  usePageStore.getState().replaceNode(payload.target, node);
}
