import { ReloadPayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action, Node } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine } from "../types.js";
import { useLocalStore } from "../../state/useLocalStore.js";
import { bindRequestPayload } from "../cond/resolve-request-refs.js";
import { resolveRequestUrl, buildBffHeaders } from "./_shared/bff-request.js";
import {
  resolveSurface,
  signalSurfaceReload,
  currentRouteKey,
} from "../../navigation/surfaceRegistry.js";

/**
 * Per-UI-zone in-flight registry — latest-wins concurrency for `reload`.
 *
 * A reload replaces/merges the UI zones it targets, so for any zone only the
 * MOST RECENT reload should win. Rapid tab switches each fire a reload of the
 * same zones; without coordination they all run and apply in arrival order,
 * so the page flickers through every response and the last to *arrive* wins
 * (not the last clicked). We key in-flight fetches by zone: a new reload of
 * zone `z` takes ownership of `z` from whoever held it. Zone overlap is
 * exactly "multiple parallel fetches targeting the same view"; reloads with
 * DISJOINT zones never contend and run in parallel.
 *
 * Abort vs. partial supersession: a reload's zones share one fetch (one
 * `AbortController`), so we abort it ONLY when ALL its zones have been taken
 * by newer reloads. If only some were taken (e.g. a `["content"]` filter lands
 * over an in-flight `["header","content"]` tab switch), the older fetch is left
 * to finish and applies just the zones it STILL owns — so its header isn't
 * lost while the newer reload wins the shared `content`.
 */
interface ReloadRequest {
  uiZones: Set<string>;
  controller: AbortController;
}
const requests = new Map<number, ReloadRequest>();
const uiZoneOwners = new Map<string, number>();
let reloadCounter = 0;

/** The content zone maps to `items`; every other zone maps to `data.<zone>`. */
const CONTENT_UI_ZONE = "content";

/** Test-only: abort + clear the in-flight registry between cases. */
export function __resetReloadConcurrency(): void {
  for (const { controller } of requests.values()) controller.abort();
  requests.clear();
  uiZoneOwners.clear();
  reloadCounter = 0;
}

/**
 * reload — UI-zone-scoped page refresh. Marks the named `ui_zones` loading (so
 * the renderer shows each one's skeleton), fetches `endpoint` with the bound
 * request context, then applies the response as a PARTIAL page: `response.data`
 * shallow-merges into the live page's `data`, `response.items` replaces `items`.
 * Zones not named (e.g. a footer shell) stay mounted and untouched.
 *
 * Latest-wins per zone (see the registry note above): chained tab switches
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

  // ── reload-by-name ──────────────────────────────────────────────────────
  // `page` targets an already-OPEN surface (page.id / sheet.id) somewhere in
  // the stack. Resolve it to route.key(s) via the by-name index, relative to
  // the caller's route (the focused surface that dispatched this action), then
  // signal each resolved surface to refetch ITS OWN document by the path it was
  // opened with. The caller doesn't fetch here — each target surface owns its
  // refetch (route stack stays authoritative).
  if (payload.page) {
    const callerKey = currentRouteKey();
    const targets = resolveSurface(payload.page, payload.scope, callerKey);
    if (targets.length === 0) {
      config.logger?.warn(
        `[reload] no open surface named "${payload.page}" to reload (scope=${payload.scope})`,
      );
      return;
    }
    // Forward both the zone hint AND any request params the action carried into
    // each target's OWN refetch. `bindRequestPayload` above already resolved any
    // `{ref}` bindings, so `query_params` here are concrete values the surface
    // can append to its fetch path (e.g. a just-picked address id).
    const reloadOpts = {
      uiZones: payload.ui_zones,
      queryParams: payload.query_params,
    };
    for (const key of targets) {
      const signalled = signalSurfaceReload(key, reloadOpts);
      if (!signalled) {
        config.logger?.warn(
          `[reload] surface "${payload.page}" (route ${key}) is not listening for refetch`,
        );
      }
    }
    return;
  }

  // ── zone reload (current surface) ───────────────────────────────────────
  // `path`-direct refresh of the CURRENT surface's named UI zones. `ui_zones`
  // is optional now; default to the content zone so an omitted-zones reload
  // still has a concrete owner for the concurrency registry.
  const path = payload.path;
  if (!path) {
    // The schema's refine guarantees path|page, but keep a clear runtime error.
    throw new Error("reload: payload requires `path` or `page`");
  }
  const uiZones = payload.ui_zones ?? [CONTENT_UI_ZONE];

  // Tell the server which UI zones to return (so it answers with a matching
  // partial page) alongside the bound context.
  const url = resolveRequestUrl(config, {
    path,
    path_params: payload.path_params,
    query_params: { ...(payload.query_params ?? {}), ui_zones: uiZones.join(",") },
  });
  const headers = buildBffHeaders(config);

  // Claim every targeted UI zone for this call, taking ownership from prior
  // reloads. A prior reload that loses ALL its zones is aborted; one that
  // still owns some is left to finish (and will apply only those).
  const token = ++reloadCounter;
  const controller = new AbortController();
  requests.set(token, { uiZones: new Set(uiZones), controller });
  const superseded = new Set<number>();
  for (const zone of uiZones) {
    const prev = uiZoneOwners.get(zone);
    if (prev !== undefined && prev !== token) {
      requests.get(prev)?.uiZones.delete(zone);
      superseded.add(prev);
    }
    uiZoneOwners.set(zone, token);
  }
  for (const t of superseded) {
    const req = requests.get(t);
    if (req && req.uiZones.size === 0) req.controller.abort();
  }

  /** UI zones this call still owns (not yet taken by a newer reload). */
  const ownedUiZones = () =>
    uiZones.filter((z) => uiZoneOwners.get(z) === token);

  const { usePageStore } = await import("../../state/usePageStore.js");
  usePageStore.getState().setUiZonesLoading(uiZones, true);

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

    // Apply ONLY the UI zones we still own — a newer reload may have taken some
    // (or all) of them while this fetch was in flight.
    const owned = ownedUiZones();
    if (owned.length > 0) {
      const dataKeys = owned.filter((z) => z !== CONTENT_UI_ZONE);
      const data =
        dataKeys.length > 0 && body.data
          ? Object.fromEntries(
              dataKeys.filter((k) => k in body.data!).map((k) => [k, body.data![k]]),
            )
          : undefined;
      const items = owned.includes(CONTENT_UI_ZONE) ? body.items : undefined;
      usePageStore.getState().mergeUiZones({ data, items });
    }
  } catch (err) {
    // Fully superseded — our controller was aborted. Drop silently; the newer
    // reloads own these zones and keep their skeletons up.
    if (controller.signal.aborted) return;
    throw err;
  } finally {
    // Release + clear loading only for zones we still hold. Zones taken by
    // a newer reload stay loading until that reload settles.
    const stillOwned = ownedUiZones();
    if (stillOwned.length > 0) {
      usePageStore.getState().setUiZonesLoading(stillOwned, false);
      for (const z of stillOwned) uiZoneOwners.delete(z);
    }
    requests.delete(token);
  }
}
