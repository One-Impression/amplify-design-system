import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { handleReload, __resetReloadConcurrency } from "../reload.ts";
import type { ActionEngine, ActionEngineConfig } from "../../types.ts";
import type { Action, Node, Page } from "@one-impression/sdk-native-sdui";
import { useLocalStore } from "../../../state/useLocalStore.ts";
import { usePageStore } from "../../../state/usePageStore.ts";
import {
  rebuildSurfaceIndex,
  registerSurfaceReload,
  setNavigationAccessor,
  __resetSurfaceRegistry,
  type NavigationAccessor,
} from "../../../navigation/surfaceRegistry.ts";

const config: ActionEngineConfig = {
  bffBaseUrl: "https://bff.example.test",
  authToken: () => "tok-123",
  onNavigate: () => undefined,
  onToast: () => undefined,
  onDeeplink: () => undefined,
};
const noopEngine: ActionEngine = { dispatch: async () => undefined };

let originalFetch: typeof globalThis.fetch | undefined;
let lastUrl: string | undefined;

function installFetch(body: unknown, status = 200): void {
  originalFetch = globalThis.fetch;
  globalThis.fetch = (async (input: unknown) => {
    lastUrl = String(input);
    return new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }) as unknown as typeof globalThis.fetch;
}

// A loaded page with a footer shell + a header skeleton already present.
const BASE_PAGE = {
  id: "demo.feed",
  title: "My Campaigns",
  protocol_version: "1.0.0",
  layout: "feed",
  data: {
    footer: { type: "sdui.snippet.tabs_footer", id: "feed-tabs", data: { items: [] } },
    header_skeleton: { type: "sdui.snippet.skeleton", id: "sk-h", data: {} },
    content_skeleton: { type: "sdui.snippet.skeleton", id: "sk-c", data: {} },
  },
  items: [],
} as unknown as Page;

// A deferred fetch: each call records its signal + a `resolve` handle so a test
// can land responses in a chosen order and observe abort behavior mid-flight.
interface Pending {
  url: string;
  signal?: AbortSignal;
  resolve: (body: unknown, status?: number) => void;
}
function installDeferredFetch(): Pending[] {
  const pendings: Pending[] = [];
  originalFetch = globalThis.fetch;
  globalThis.fetch = ((input: unknown, init?: { signal?: AbortSignal }) => {
    const signal = init?.signal;
    const abortErr = () => Object.assign(new Error("aborted"), { name: "AbortError" });
    return new Promise<Response>((resolve, reject) => {
      if (signal?.aborted) {
        reject(abortErr());
        return;
      }
      pendings.push({
        url: String(input),
        signal,
        resolve: (body, status = 200) =>
          resolve(
            new Response(JSON.stringify(body), {
              status,
              headers: { "Content-Type": "application/json" },
            }),
          ),
      });
      signal?.addEventListener("abort", () => reject(abortErr()));
    });
  }) as unknown as typeof globalThis.fetch;
  return pendings;
}

/** Flush the microtask/timer queue so an in-flight handler reaches its fetch. */
const flush = () => new Promise<void>((r) => setImmediate(r));

const composite = (id: string) =>
  ({ type: "sdui.snippet.composite", id, data: {} }) as unknown as Node;
// The header UI zone is a single node (the producer wraps page_header + filters
// in one container); the merge stores it as-is under `data.header`.
const header = (id: string) =>
  ({ type: "sdui.snippet.page_header", id, data: {} }) as unknown as Node;

beforeEach(() => {
  originalFetch = globalThis.fetch;
  lastUrl = undefined;
  __resetReloadConcurrency();
  useLocalStore.setState({ data: {} });
  usePageStore.setState({ page: BASE_PAGE, pageId: BASE_PAGE.id, loadingUiZones: {} });
});

afterEach(() => {
  __resetReloadConcurrency();
  if (originalFetch) globalThis.fetch = originalFetch;
});

const reloadAction = (payload: Record<string, unknown>): Action =>
  ({ type: "reload", payload }) as unknown as Action;

test("reload — content-only response replaces items, preserves chrome", async () => {
  installFetch({ items: [{ type: "sdui.snippet.composite", id: "c1", data: {} }] });
  await handleReload(
    reloadAction({ path: "/v1/creator/campaigns", ui_zones: ["content"] }),
    config,
    noopEngine,
  );
  const page = usePageStore.getState().page!;
  assert.equal(page.items.length, 1);
  assert.equal(page.items[0].id, "c1");
  // footer + skeletons (unrefreshed data) survive the partial merge.
  assert.ok((page.data as Record<string, unknown>).footer);
  assert.ok((page.data as Record<string, unknown>).header_skeleton);
  assert.equal(usePageStore.getState().loadingUiZones.content, false);
});

test("reload — header+content response merges data.header and replaces items", async () => {
  installFetch({
    data: { header: { type: "sdui.snippet.page_header", id: "h1", data: {} } },
    items: [{ type: "sdui.snippet.composite", id: "c1", data: {} }],
  });
  await handleReload(
    reloadAction({ path: "/v1/creator/campaigns", ui_zones: ["header", "content"] }),
    config,
    noopEngine,
  );
  const data = usePageStore.getState().page!.data as Record<string, Node>;
  assert.equal(data.header.id, "h1");
  assert.ok(data.footer, "footer (unrefreshed) preserved");
  assert.equal(usePageStore.getState().page!.items[0].id, "c1");
});

test("reload — binds $.local refs into the query string", async () => {
  useLocalStore.getState().set("selected_tab", "applied");
  useLocalStore.getState().set("selected_filters", ["beauty", "tech"]);
  installFetch({ items: [] });
  await handleReload(
    reloadAction({
      path: "/v1/creator/campaigns",
      ui_zones: ["content"],
      query_params: { tab: { ref: "$.local.selected_tab" }, filter: { ref: "$.local.selected_filters" } },
    }),
    config,
    noopEngine,
  );
  const url = new URL(lastUrl!);
  assert.equal(url.searchParams.get("tab"), "applied");
  assert.equal(url.searchParams.get("filter"), "beauty,tech");
});

test("reload — clears loading even on a non-OK response (and throws)", async () => {
  installFetch({ error: "boom" }, 500);
  await assert.rejects(
    () => handleReload(reloadAction({ path: "/v1/creator/campaigns", ui_zones: ["content"] }), config, noopEngine),
    /reload: BFF GET .* returned 500/,
  );
  assert.equal(usePageStore.getState().loadingUiZones.content, false);
});

test("reload — chained same-zone reloads: latest wins, earlier aborted, skeleton held", async () => {
  const pendings = installDeferredFetch();
  const a = reloadAction({ path: "/v1/creator/campaigns", ui_zones: ["content"] });
  const b = reloadAction({ path: "/v1/creator/campaigns", ui_zones: ["content"] });

  const pA = handleReload(a, config, noopEngine);
  await flush(); // A reaches its fetch (pending)
  assert.equal(pendings.length, 1);
  assert.equal(usePageStore.getState().loadingUiZones.content, true);

  const pB = handleReload(b, config, noopEngine);
  await flush(); // B claims content → aborts A; B reaches its fetch
  assert.equal(pendings[0].signal!.aborted, true, "A's fetch aborted by B");
  assert.equal(pendings.length, 2);
  assert.equal(pendings[1].signal!.aborted, false);
  assert.equal(usePageStore.getState().loadingUiZones.content, true, "skeleton held across hand-off");

  await pA; // A was aborted → resolves without applying or clearing loading
  assert.equal(usePageStore.getState().page!.items.length, 0, "A applied nothing");
  assert.equal(usePageStore.getState().loadingUiZones.content, true, "A did not clear loading");

  pendings[1].resolve({ items: [composite("b")] });
  await pB;
  assert.equal(usePageStore.getState().page!.items[0].id, "b", "only the latest response rendered");
  assert.equal(usePageStore.getState().loadingUiZones.content, false);
});

test("reload — disjoint zones run in parallel, neither aborted", async () => {
  const pendings = installDeferredFetch();
  const pH = handleReload(reloadAction({ path: "/v1/creator/campaigns", ui_zones: ["header"] }), config, noopEngine);
  await flush();
  const pC = handleReload(reloadAction({ path: "/v1/creator/campaigns", ui_zones: ["content"] }), config, noopEngine);
  await flush();

  assert.equal(pendings.length, 2);
  assert.equal(pendings[0].signal!.aborted, false, "header reload not aborted by content reload");
  assert.equal(pendings[1].signal!.aborted, false);

  pendings[0].resolve({ data: { header: header("h1") } });
  pendings[1].resolve({ items: [composite("c1")] });
  await Promise.all([pH, pC]);

  const page = usePageStore.getState().page!;
  assert.equal((page.data as Record<string, Node>).header.id, "h1");
  assert.equal(page.items[0].id, "c1");
});

test("reload — partial overlap: newer wins the shared zone, older still applies its own", async () => {
  const pendings = installDeferredFetch();
  // Tab switch: header + content. Filter: content only, lands mid-flight.
  const pTab = handleReload(reloadAction({ path: "/v1/creator/campaigns", ui_zones: ["header", "content"] }), config, noopEngine);
  await flush();
  const pFilter = handleReload(reloadAction({ path: "/v1/creator/campaigns", ui_zones: ["content"] }), config, noopEngine);
  await flush();

  // Filter took `content`; tab still owns `header`, so its fetch is NOT aborted.
  assert.equal(pendings[0].signal!.aborted, false, "tab fetch survives (still owns header)");

  // Tab response carries header + content; only its header should apply.
  pendings[0].resolve({ data: { header: header("hTab") }, items: [composite("tabContent")] });
  await pTab;
  pendings[1].resolve({ items: [composite("filtered")] });
  await pFilter;

  const page = usePageStore.getState().page!;
  assert.equal((page.data as Record<string, Node>).header.id, "hTab", "header from the tab reload applied");
  assert.equal(page.items[0].id, "filtered", "content from the filter reload won; tab's content dropped");
  assert.equal(usePageStore.getState().loadingUiZones.content, false);
  assert.equal(usePageStore.getState().loadingUiZones.header, false);
});

// ── reload-by-name (B2) ────────────────────────────────────────────────────
// `reload { page }` resolves an already-open surface by name (relative to the
// caller / current focused route) and signals THAT surface to refetch — it does
// not fetch from the caller. We drive a fake route stack so the by-name index
// resolves; each surface's refetch is its registered handler.

interface FakeRoute {
  key: string;
  name: string;
  params?: { screenId?: string; sheetId?: string; contentPath?: string };
}

function setStack(routes: FakeRoute[], focusedKey: string): void {
  const accessor: NavigationAccessor = {
    isReady: () => true,
    getRoutes: () => routes,
    getCurrentRouteKey: () => focusedKey,
  };
  setNavigationAccessor(accessor);
  rebuildSurfaceIndex();
}
function clearStack(): void {
  setNavigationAccessor({
    isReady: () => false,
    getRoutes: () => [],
    getCurrentRouteKey: () => undefined,
  });
  __resetSurfaceRegistry();
}
const pageRoute = (key: string, screenId: string): FakeRoute => ({
  key,
  name: "SduiPage",
  params: { screenId },
});

test("reload-by-name — nearest signals the surface just below the caller, not the caller", async () => {
  __resetSurfaceRegistry();
  try {
    // home, address-select, address-form (focused). reload{page:"address-select"}
    // from the form should refetch address-select, NOT re-fetch the form.
    setStack(
      [
        pageRoute("k1", "home"),
        pageRoute("k2", "address-select"),
        pageRoute("k3", "address-form"),
      ],
      "k3",
    );
    let selectReloads = 0;
    let formReloads = 0;
    registerSurfaceReload("k2", () => { selectReloads += 1; });
    registerSurfaceReload("k3", () => { formReloads += 1; });

    await handleReload(
      reloadAction({ page: "address-select", scope: "nearest" }),
      config,
      noopEngine,
    );
    assert.equal(selectReloads, 1, "the named ancestor refetched");
    assert.equal(formReloads, 0, "the caller did not refetch itself");
  } finally {
    clearStack();
  }
});

test("reload-by-name — scope:all signals every open instance of the name", async () => {
  __resetSurfaceRegistry();
  try {
    setStack(
      [pageRoute("k1", "home"), pageRoute("k2", "list"), pageRoute("k3", "list")],
      "k3",
    );
    const hits: string[] = [];
    registerSurfaceReload("k2", () => hits.push("k2"));
    registerSurfaceReload("k3", () => hits.push("k3"));
    await handleReload(reloadAction({ page: "list", scope: "all" }), config, noopEngine);
    assert.deepEqual(hits.sort(), ["k2", "k3"]);
  } finally {
    clearStack();
  }
});

test("reload-by-name — no open surface with that name is a no-op (no throw)", async () => {
  __resetSurfaceRegistry();
  try {
    setStack([pageRoute("k1", "home")], "k1");
    await handleReload(
      reloadAction({ page: "nonexistent", scope: "nearest" }),
      config,
      noopEngine,
    );
    // No throw, no fetch — the caller's own page is untouched.
    assert.ok(true);
  } finally {
    clearStack();
  }
});

test("reload — requires path or page (schema refine rejects empty)", async () => {
  await assert.rejects(
    () => handleReload(reloadAction({}), config, noopEngine),
    /reload payload requires/,
  );
});
