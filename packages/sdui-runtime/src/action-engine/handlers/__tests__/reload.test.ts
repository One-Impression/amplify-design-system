import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { handleReload } from "../reload.ts";
import type { ActionEngine, ActionEngineConfig } from "../../types.ts";
import type { Action, Page } from "@one-impression/sdk-native-sdui";
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

beforeEach(() => {
  originalFetch = globalThis.fetch;
  lastUrl = undefined;
  useLocalStore.setState({ data: {} });
  usePageStore.setState({ page: BASE_PAGE, pageId: BASE_PAGE.id, loadingRegions: {} });
});

afterEach(() => {
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
