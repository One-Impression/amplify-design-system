/**
 * Addressable-surface registry — a DERIVED by-name index over the one ordered
 * route stack. It is NOT a parallel store: the route stack is the single source
 * of truth for presence, order, and uniqueness; this index is rebuilt from the
 * navigation state on every navigation `state` change so a name → route.key[]
 * lookup is O(1) without walking the stack each time.
 *
 * The registry reads the live route stack through an injected accessor
 * ({@link setNavigationAccessor}) rather than importing the React-Navigation
 * `navigationRef` directly — so the resolution logic is unit-testable in Node
 * without pulling react-navigation / react-native into the transform.
 * `SduiNavigationHost` wires the real `navigationRef` accessor on mount.
 *
 * Addressing model (locked):
 *  - **unique id (per open instance)** = `route.key` (React-Navigation-minted).
 *  - **referenceable name** = `page.id` / `sheet.id`, carried as the
 *    `screenId` / `sheetId` route param.
 *  - **order / "nearest" tiebreak** = the route's index in `getState().routes`.
 *
 * A name may map to MANY open `route.key`s (the same surface opened twice). The
 * index keeps them in stack order (low index → high index) so callers can pick
 * `nearest` / `top` / `all` deterministically.
 */

/** The shape of a single route entry we read off the navigation state. */
interface RouteLike {
  key: string;
  name?: string;
  params?: { screenId?: string; sheetId?: string; contentPath?: string };
}

/**
 * Read accessor over the live route stack. Production wires this from
 * `navigationRef`; tests inject a fake. Returns `undefined` route list when the
 * navigation container isn't ready.
 */
export interface NavigationAccessor {
  isReady: () => boolean;
  getRoutes: () => RouteLike[];
  getCurrentRouteKey: () => string | undefined;
}

let accessor: NavigationAccessor = {
  isReady: () => false,
  getRoutes: () => [],
  getCurrentRouteKey: () => undefined,
};

/** Wire the live navigation accessor (called once by `SduiNavigationHost`). */
export function setNavigationAccessor(next: NavigationAccessor): void {
  accessor = next;
}

/** name (`page.id` / `sheet.id`) → route.key[], in stack order (oldest → newest). */
let byName = new Map<string, string[]>();

/**
 * The path each route was fetched with, keyed by `route.key`. Addressable
 * surfaces (pages opened path-direct, sheets that fetch their own content) carry
 * a `contentPath` route param; reload-by-name reuses it to refetch the surface.
 * Kept here (rather than walking params on read) so resolution is a single map
 * lookup. Entries are pruned when their route leaves the stack.
 */
let pathByKey = new Map<string, string>();

/** Subscribers notified after each rebuild (so screens can re-resolve presence). */
type Listener = () => void;
const listeners = new Set<Listener>();

/**
 * Reload bus — reload-by-name resolves target `route.key`(s) and signals each to
 * refetch. The owning screen (page or sheet) subscribes by its own `route.key`
 * and re-runs its fetch when signalled. This keeps the route stack authoritative
 * (the index only *finds* the surface; the surface owns its own refetch) and
 * mirrors the existing zustand-store handler shape — no imperative ref bridge.
 */
/**
 * What a reload-by-name carries to the target surface's refetch:
 * - `uiZones` — which zones to mark loading (page zone-reload; sheets refetch whole).
 * - `queryParams` — request params the triggering action passed (already bound
 *   from any `{ref}` by the reload handler), appended to the surface's OWN fetch
 *   path so the refetched document can reflect them (e.g. a just-picked id).
 */
export interface SurfaceReloadOptions {
  uiZones?: string[];
  queryParams?: Record<string, unknown>;
}
type ReloadHandler = (opts?: SurfaceReloadOptions) => void;
const reloadHandlers = new Map<string, ReloadHandler>();

/**
 * Rebuild the by-name index + path map from the current route stack. Called from
 * the single `navigationRef.addListener('state', …)` wired in
 * `SduiNavigationHost`; also exported for tests that drive the stack directly.
 */
export function rebuildSurfaceIndex(): void {
  const routes = accessor.isReady() ? accessor.getRoutes() : [];

  const nextByName = new Map<string, string[]>();
  const nextPathByKey = new Map<string, string>();

  for (const route of routes) {
    const name = route.params?.screenId ?? route.params?.sheetId;
    if (name) {
      const keys = nextByName.get(name);
      if (keys) keys.push(route.key);
      else nextByName.set(name, [route.key]);
    }
    if (route.params?.contentPath) {
      nextPathByKey.set(route.key, route.params.contentPath);
    }
  }

  byName = nextByName;
  pathByKey = nextPathByKey;

  // Drop reload handlers whose route has left the stack so we don't signal a
  // dead screen (the screen also unsubscribes on unmount; this is belt-and-braces).
  const live = new Set(routes.map((r) => r.key));
  for (const key of reloadHandlers.keys()) {
    if (!live.has(key)) reloadHandlers.delete(key);
  }

  for (const l of listeners) l();
}

/** Subscribe to index rebuilds. Returns an unsubscribe disposer. */
export function subscribeSurfaceIndex(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Resolve a name to open `route.key`(s) per `scope`, relative to the caller's
 * `route.key`:
 *  - `nearest` — the matching route with the highest index strictly BELOW the
 *    caller (the surface you return to via `back`). Falls back to the topmost
 *    match when the caller isn't found (e.g. resolution relative to the focused
 *    route) or has no match below it.
 *  - `top` — the most-recently opened matching instance (highest index).
 *  - `all` — every open instance of that name.
 *
 * Returns `[]` when no instance of `name` is open.
 */
export function resolveSurface(
  name: string,
  scope: "nearest" | "top" | "all",
  callerKey?: string,
): string[] {
  const keys = byName.get(name);
  if (!keys || keys.length === 0) return [];

  if (scope === "all") return [...keys];
  if (scope === "top") return [keys[keys.length - 1]!];

  // nearest: matches are already in stack order. Find the caller's stack index;
  // pick the highest-index match strictly below it. If the caller can't be
  // located (no key, or not on the stack), nearest degrades to the topmost match.
  const routes = accessor.isReady() ? accessor.getRoutes() : [];
  const callerIndex =
    callerKey != null ? routes.findIndex((r) => r.key === callerKey) : -1;
  if (callerIndex < 0) return [keys[keys.length - 1]!];

  let best: string | undefined;
  let bestIndex = -1;
  for (const k of keys) {
    const idx = routes.findIndex((r) => r.key === k);
    if (idx >= 0 && idx < callerIndex && idx > bestIndex) {
      bestIndex = idx;
      best = k;
    }
  }
  // Nothing below the caller (e.g. caller is the only/oldest instance) — fall
  // back to the topmost match so reload-by-name is never a silent no-op.
  return best != null ? [best] : [keys[keys.length - 1]!];
}

/** The path a route was fetched with, if it carried a `contentPath` param. */
export function pathForRouteKey(key: string): string | undefined {
  return pathByKey.get(key);
}

/** Register the focused route's reload handler so reload-by-name can signal it. */
export function registerSurfaceReload(
  routeKey: string,
  handler: ReloadHandler,
): () => void {
  reloadHandlers.set(routeKey, handler);
  return () => {
    if (reloadHandlers.get(routeKey) === handler) reloadHandlers.delete(routeKey);
  };
}

/**
 * Signal a resolved route to refetch its own document. Returns true if a handler
 * was registered for that key (the surface is mounted and listening).
 */
export function signalSurfaceReload(
  routeKey: string,
  opts?: SurfaceReloadOptions,
): boolean {
  const handler = reloadHandlers.get(routeKey);
  if (!handler) return false;
  handler(opts);
  return true;
}

/** The current focused route's key, or undefined if the stack isn't ready. */
export function currentRouteKey(): string | undefined {
  if (!accessor.isReady()) return undefined;
  return accessor.getCurrentRouteKey();
}

/** Test-only: clear the index + handlers between cases. */
export function __resetSurfaceRegistry(): void {
  byName = new Map();
  pathByKey = new Map();
  reloadHandlers.clear();
  listeners.clear();
}
