import { buildBffHeaders } from "../action-engine/handlers/_shared/bff-request.js";
import type { ActionEngineConfig } from "../action-engine/types.js";

/**
 * Fetch an addressable surface's OWN document path-direct: `bffBaseUrl + path`,
 * verbatim, with the standard BFF headers (auth + dev/active-social). Used by
 * sheets that fetch their content on open and by reload-by-name refetch — the
 * same plumbing the `bff_call` / `reload` handlers use, lifted so a React screen
 * can call it without going through the action engine (whose response contract
 * is an action chain, not a full document).
 *
 * Returns the parsed JSON document (a Page envelope for a page surface, a
 * sheet-content document for a sheet). Throws on a non-OK response so the
 * caller can render an error state.
 *
 * `queryParams` (optional) are appended to the path as a query string — used by
 * reload-by-name to carry the triggering action's request params into the
 * surface's own refetch (e.g. a just-picked address id). Null/undefined values
 * are skipped; if `path` already has a query string the params merge onto it.
 */
export async function fetchSurfaceDocument<T = unknown>(
  bffBaseUrl: string,
  authToken: () => string | null,
  path: string,
  queryParams?: Record<string, unknown>,
): Promise<T> {
  if (!path) {
    throw new Error("fetchSurfaceDocument: missing path (path-direct only)");
  }
  // buildBffHeaders reads bffBaseUrl off the config to localhost-gate
  // X-Dev-Identity; pass a minimal config carrying just what it needs.
  const config = { bffBaseUrl, authToken } as ActionEngineConfig;
  const base = bffBaseUrl.replace(/\/$/, "");
  let url = `${base}${path}`;
  if (queryParams) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(queryParams)) {
      if (v != null) qs.append(k, String(v));
    }
    const s = qs.toString();
    if (s) url += (url.includes("?") ? "&" : "?") + s;
  }
  const res = await fetch(url, { method: "GET", headers: buildBffHeaders(config) });
  if (!res.ok) {
    throw new Error(`surface fetch GET ${url} returned ${res.status}`);
  }
  return (await res.json()) as T;
}
