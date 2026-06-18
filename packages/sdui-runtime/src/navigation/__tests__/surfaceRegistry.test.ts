import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import {
  rebuildSurfaceIndex,
  resolveSurface,
  registerSurfaceReload,
  signalSurfaceReload,
  pathForRouteKey,
  setNavigationAccessor,
  __resetSurfaceRegistry,
  type NavigationAccessor,
} from "../surfaceRegistry.ts";

/**
 * Drive the by-name index directly off a fake route stack via the injected
 * navigation accessor — no real NavigationContainer (and no react-navigation /
 * react-native import). Each route mirrors the live shape:
 * `{ key, name, params: { screenId | sheetId, contentPath } }`.
 */
interface FakeRoute {
  key: string;
  name: string;
  params?: { screenId?: string; sheetId?: string; contentPath?: string };
}

function setStack(routes: FakeRoute[], focusedKey?: string): void {
  const accessor: NavigationAccessor = {
    isReady: () => true,
    getRoutes: () => routes,
    getCurrentRouteKey: () => focusedKey ?? routes[routes.length - 1]?.key,
  };
  setNavigationAccessor(accessor);
  rebuildSurfaceIndex();
}

const page = (key: string, screenId: string, contentPath?: string): FakeRoute => ({
  key,
  name: "SduiPage",
  params: { screenId, contentPath },
});
const sheet = (key: string, sheetId: string, contentPath?: string): FakeRoute => ({
  key,
  name: "SduiSheet",
  params: { sheetId, contentPath },
});

beforeEach(() => {
  __resetSurfaceRegistry();
});

afterEach(() => {
  __resetSurfaceRegistry();
  setNavigationAccessor({
    isReady: () => false,
    getRoutes: () => [],
    getCurrentRouteKey: () => undefined,
  });
});

test("resolveSurface — name not open → []", () => {
  setStack([page("k1", "home")]);
  assert.deepEqual(resolveSurface("nope", "nearest", "k1"), []);
});

test("resolveSurface — top picks the most-recently-opened instance", () => {
  setStack([
    page("k1", "home"),
    page("k2", "list"),
    page("k3", "detail"),
    page("k4", "list"),
  ]);
  assert.deepEqual(resolveSurface("list", "top", "k1"), ["k4"]);
});

test("resolveSurface — all returns every open instance in stack order", () => {
  setStack([page("k1", "home"), page("k2", "list"), page("k3", "list")]);
  assert.deepEqual(resolveSurface("list", "all", "k1"), ["k2", "k3"]);
});

test("resolveSurface — nearest = highest-index match strictly below the caller", () => {
  // home, list#1, detail, list#2, form. Caller = form (k5). The surface you
  // return to via `back` and want to refresh is list#2 (k4), not list#1.
  setStack(
    [
      page("k1", "home"),
      page("k2", "list"),
      page("k3", "detail"),
      page("k4", "list"),
      page("k5", "form"),
    ],
    "k5",
  );
  assert.deepEqual(resolveSurface("list", "nearest", "k5"), ["k4"]);
});

test("resolveSurface — nearest with no match below the caller falls back to topmost", () => {
  setStack(
    [page("k1", "home"), page("k2", "list"), page("k3", "detail"), page("k4", "list")],
    "k2",
  );
  // Caller is list#1 (k2); no 'list' strictly below it → fall back to topmost (k4).
  assert.deepEqual(resolveSurface("list", "nearest", "k2"), ["k4"]);
});

test("resolveSurface — nearest with unknown caller falls back to topmost match", () => {
  setStack([page("k1", "home"), page("k2", "list"), page("k3", "list")]);
  assert.deepEqual(resolveSurface("list", "nearest", "ghost"), ["k3"]);
});

test("by-name index keys on screenId AND sheetId; pathForRouteKey reads contentPath", () => {
  setStack([
    page("k1", "apply-checklist", "/v1/creator/apply/overview"),
    sheet("k2", "address-select", "/v1/creator/profile/addresses"),
  ]);
  assert.deepEqual(resolveSurface("apply-checklist", "top", "k2"), ["k1"]);
  assert.deepEqual(resolveSurface("address-select", "top", "k1"), ["k2"]);
  assert.equal(pathForRouteKey("k1"), "/v1/creator/apply/overview");
  assert.equal(pathForRouteKey("k2"), "/v1/creator/profile/addresses");
});

test("signalSurfaceReload — fires the registered handler; returns false when none", () => {
  setStack([page("k1", "home"), page("k2", "list")]);
  let calls = 0;
  const dispose = registerSurfaceReload("k2", () => {
    calls += 1;
  });
  assert.equal(signalSurfaceReload("k2"), true);
  assert.equal(calls, 1);
  assert.equal(signalSurfaceReload("k-unknown"), false);
  dispose();
  assert.equal(signalSurfaceReload("k2"), false, "disposed handler no longer fires");
});

test("signalSurfaceReload — forwards reload options (uiZones + queryParams) to the handler", () => {
  // Reload-by-name carries the triggering action's request params into the
  // target surface's OWN refetch — e.g. a just-picked address id flows
  // address-select → reload{page:"apply-checklist", query_params} → the sheet's
  // refetch, which appends it to its content path. The registry is the pipe;
  // assert the opts arrive intact.
  setStack([page("k1", "apply-checklist"), sheet("k2", "address-select")]);
  let received: unknown;
  registerSurfaceReload("k1", (opts) => {
    received = opts;
  });
  signalSurfaceReload("k1", {
    uiZones: ["content"],
    queryParams: { selected_address_id: "addr-home" },
  });
  assert.deepEqual(received, {
    uiZones: ["content"],
    queryParams: { selected_address_id: "addr-home" },
  });
});

test("rebuildSurfaceIndex prunes reload handlers for routes that left the stack", () => {
  setStack([page("k1", "home"), page("k2", "list")]);
  let calls = 0;
  registerSurfaceReload("k2", () => {
    calls += 1;
  });
  // Pop 'list' off the stack and rebuild — the handler for k2 must be dropped.
  setStack([page("k1", "home")]);
  assert.equal(signalSurfaceReload("k2"), false);
  assert.equal(calls, 0);
});
