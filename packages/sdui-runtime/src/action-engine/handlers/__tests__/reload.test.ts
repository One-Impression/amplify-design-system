import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { handleReload, __resetReloadConcurrency } from "../reload.ts";
import type { ActionEngine, ActionEngineConfig } from "../../types.ts";
import type { Action, Node, Page } from "@one-impression/sdk-native-sdui";
import { useLocalStore } from "../../../state/useLocalStore.ts";
import { usePageStore } from "../../../state/usePageStore.ts";

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
    footer: { type: "creator.snippet.tabs_footer", id: "feed-tabs", data: { items: [] } },
    header_skeleton: { type: "creator.snippet.skeleton", id: "sk-h", data: {} },
    content_skeleton: { type: "creator.snippet.skeleton", id: "sk-c", data: {} },
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
const header = (id: string) =>
  [{ type: "creator.snippet.page_header", id, data: {} }] as unknown as Node[];

beforeEach(() => {
  originalFetch = globalThis.fetch;
  lastUrl = undefined;
  __resetReloadConcurrency();
  useLocalStore.setState({ data: {} });
  usePageStore.setState({ page: BASE_PAGE, pageId: BASE_PAGE.id, loadingRegions: {} });
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
    reloadAction({ endpoint: "creator.campaigns.list", regions: ["content"] }),
    config,
    noopEngine,
  );
  const page = usePageStore.getState().page!;
  assert.equal(page.items.length, 1);
  assert.equal(page.items[0].id, "c1");
  // footer + skeletons (unrefreshed data) survive the partial merge.
  assert.ok((page.data as Record<string, unknown>).footer);
  assert.ok((page.data as Record<string, unknown>).header_skeleton);
  assert.equal(usePageStore.getState().loadingRegions.content, false);
});

test("reload — header+content response merges data.header and replaces items", async () => {
  installFetch({
    data: { header: [{ type: "creator.snippet.page_header", id: "h1", data: {} }] },
    items: [{ type: "sdui.snippet.composite", id: "c1", data: {} }],
  });
  await handleReload(
    reloadAction({ endpoint: "creator.campaigns.list", regions: ["header", "content"] }),
    config,
    noopEngine,
  );
  const data = usePageStore.getState().page!.data as Record<string, unknown>;
  assert.ok(Array.isArray(data.header));
  assert.ok(data.footer, "footer (unrefreshed) preserved");
  assert.equal(usePageStore.getState().page!.items[0].id, "c1");
});

test("reload — binds $.local refs into the query string", async () => {
  useLocalStore.getState().set("selected_tab", "applied");
  useLocalStore.getState().set("selected_filters", ["beauty", "tech"]);
  installFetch({ items: [] });
  await handleReload(
    reloadAction({
      endpoint: "creator.campaigns.list",
      regions: ["content"],
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
    () => handleReload(reloadAction({ endpoint: "creator.campaigns.list", regions: ["content"] }), config, noopEngine),
    /reload: BFF GET .* returned 500/,
  );
  assert.equal(usePageStore.getState().loadingRegions.content, false);
});

test("reload — chained same-region reloads: latest wins, earlier aborted, skeleton held", async () => {
  const pendings = installDeferredFetch();
  const a = reloadAction({ endpoint: "creator.campaigns.list", regions: ["content"] });
  const b = reloadAction({ endpoint: "creator.campaigns.list", regions: ["content"] });

  const pA = handleReload(a, config, noopEngine);
  await flush(); // A reaches its fetch (pending)
  assert.equal(pendings.length, 1);
  assert.equal(usePageStore.getState().loadingRegions.content, true);

  const pB = handleReload(b, config, noopEngine);
  await flush(); // B claims content → aborts A; B reaches its fetch
  assert.equal(pendings[0].signal!.aborted, true, "A's fetch aborted by B");
  assert.equal(pendings.length, 2);
  assert.equal(pendings[1].signal!.aborted, false);
  assert.equal(usePageStore.getState().loadingRegions.content, true, "skeleton held across hand-off");

  await pA; // A was aborted → resolves without applying or clearing loading
  assert.equal(usePageStore.getState().page!.items.length, 0, "A applied nothing");
  assert.equal(usePageStore.getState().loadingRegions.content, true, "A did not clear loading");

  pendings[1].resolve({ items: [composite("b")] });
  await pB;
  assert.equal(usePageStore.getState().page!.items[0].id, "b", "only the latest response rendered");
  assert.equal(usePageStore.getState().loadingRegions.content, false);
});

test("reload — disjoint regions run in parallel, neither aborted", async () => {
  const pendings = installDeferredFetch();
  const pH = handleReload(reloadAction({ endpoint: "creator.campaigns.list", regions: ["header"] }), config, noopEngine);
  await flush();
  const pC = handleReload(reloadAction({ endpoint: "creator.campaigns.list", regions: ["content"] }), config, noopEngine);
  await flush();

  assert.equal(pendings.length, 2);
  assert.equal(pendings[0].signal!.aborted, false, "header reload not aborted by content reload");
  assert.equal(pendings[1].signal!.aborted, false);

  pendings[0].resolve({ data: { header: header("h1") } });
  pendings[1].resolve({ items: [composite("c1")] });
  await Promise.all([pH, pC]);

  const page = usePageStore.getState().page!;
  assert.equal((page.data as Record<string, Node[]>).header[0].id, "h1");
  assert.equal(page.items[0].id, "c1");
});

test("reload — partial overlap: newer wins the shared region, older still applies its own", async () => {
  const pendings = installDeferredFetch();
  // Tab switch: header + content. Filter: content only, lands mid-flight.
  const pTab = handleReload(reloadAction({ endpoint: "creator.campaigns.list", regions: ["header", "content"] }), config, noopEngine);
  await flush();
  const pFilter = handleReload(reloadAction({ endpoint: "creator.campaigns.list", regions: ["content"] }), config, noopEngine);
  await flush();

  // Filter took `content`; tab still owns `header`, so its fetch is NOT aborted.
  assert.equal(pendings[0].signal!.aborted, false, "tab fetch survives (still owns header)");

  // Tab response carries header + content; only its header should apply.
  pendings[0].resolve({ data: { header: header("hTab") }, items: [composite("tabContent")] });
  await pTab;
  pendings[1].resolve({ items: [composite("filtered")] });
  await pFilter;

  const page = usePageStore.getState().page!;
  assert.equal((page.data as Record<string, Node[]>).header[0].id, "hTab", "header from the tab reload applied");
  assert.equal(page.items[0].id, "filtered", "content from the filter reload won; tab's content dropped");
  assert.equal(usePageStore.getState().loadingRegions.content, false);
  assert.equal(usePageStore.getState().loadingRegions.header, false);
});
