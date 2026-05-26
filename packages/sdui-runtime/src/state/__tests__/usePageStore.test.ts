import { test } from "node:test";
import assert from "node:assert/strict";
import { usePageStore, __internal } from "../usePageStore.ts";
import type { Node, Page } from "@one-impression/sdk-native-sdui";

const { replaceNodeInTree, appendItemsInTree } = __internal;

function leaf(id: string, extra: Record<string, unknown> = {}): Node {
  return { type: "text", id, data: { ...extra } } as unknown as Node;
}

function container(id: string, items: Node[]): Node {
  return { type: "stack", id, data: { items } } as unknown as Node;
}

function page(items: Node[]): Page {
  return {
    id: "test-page",
    title: "Test",
    protocol_version: "1.0.0",
    items,
    bottom_sheets: [],
  } as unknown as Page;
}

function resetStore(): void {
  usePageStore.getState().reset();
}

// ---------------------------------------------------------------------------
// Pure tree-walker tests
// ---------------------------------------------------------------------------

test("replaceNodeInTree replaces a top-level node by id", () => {
  const tree = [leaf("a"), leaf("b"), leaf("c")];
  const [next, matched] = replaceNodeInTree(tree, "b", leaf("b", { x: 1 }));
  assert.equal(matched, true);
  assert.equal(next.length, 3);
  assert.deepEqual((next[1] as Node).data, { x: 1 });
  // Unmodified siblings preserved by reference (immutable update).
  assert.equal(next[0], tree[0]);
  assert.equal(next[2], tree[2]);
});

test("replaceNodeInTree replaces a deeply nested node by id", () => {
  const tree = [
    leaf("a"),
    container("outer", [
      leaf("p"),
      container("inner", [leaf("target"), leaf("sibling")]),
    ]),
  ];
  const replacement = leaf("target", { fresh: true });
  const [next, matched] = replaceNodeInTree(tree, "target", replacement);
  assert.equal(matched, true);
  const outer = next[1] as Node;
  const inner = (outer.data as { items: Node[] }).items[1] as Node;
  const replaced = (inner.data as { items: Node[] }).items[0] as Node;
  assert.deepEqual(replaced.data, { fresh: true });
});

test("replaceNodeInTree is a no-op when id not found", () => {
  const tree = [leaf("a"), container("c", [leaf("b")])];
  const [next, matched] = replaceNodeInTree(tree, "missing", leaf("missing"));
  assert.equal(matched, false);
  // Returns a freshly-allocated array, but the leaves are === to the input.
  assert.equal(next[0], tree[0]);
  assert.equal(next[1], tree[1]);
});

test("appendItemsInTree appends to a container's data.items", () => {
  const tree = [container("feed", [leaf("x"), leaf("y")])];
  const [next, matched, mutated] = appendItemsInTree(
    tree,
    "feed",
    [leaf("z"), leaf("w")],
    {},
  );
  assert.equal(matched, true);
  assert.equal(mutated, true);
  const feed = next[0] as Node;
  const items = (feed.data as { items: Node[] }).items;
  assert.deepEqual(
    items.map((n) => n.id),
    ["x", "y", "z", "w"],
  );
});

test("appendItemsInTree merges cursor + has_more into target.data", () => {
  const tree = [container("feed", [leaf("x")])];
  const [next] = appendItemsInTree(
    tree,
    "feed",
    [leaf("y")],
    { cursor: "abc123", hasMore: false },
  );
  const data = (next[0] as Node).data as Record<string, unknown>;
  assert.equal(data["cursor"], "abc123");
  assert.equal(data["has_more"], false);
});

test("appendItemsInTree is a no-op when target not found", () => {
  const tree = [container("feed", [leaf("x")])];
  const [next, matched, mutated] = appendItemsInTree(
    tree,
    "missing",
    [leaf("z")],
    {},
  );
  assert.equal(matched, false);
  assert.equal(mutated, false);
  assert.equal(next[0], tree[0]);
});

test("appendItemsInTree is a no-op when target has no data.items array", () => {
  const target: Node = { type: "image", id: "img", data: { src: "x.png" } } as unknown as Node;
  const tree = [target];
  const [next, matched, mutated] = appendItemsInTree(tree, "img", [leaf("y")], {});
  assert.equal(matched, true);
  assert.equal(mutated, false);
  // Target preserved by reference (no mutation occurred).
  assert.equal(next[0], tree[0]);
});

// ---------------------------------------------------------------------------
// Store-action integration tests
// ---------------------------------------------------------------------------

test("usePageStore.replaceNode replaces a node in the loaded page", () => {
  resetStore();
  usePageStore.getState().setPageTree(
    page([leaf("a"), container("section", [leaf("target")])]),
  );
  usePageStore.getState().replaceNode("target", leaf("target", { fresh: true }));
  const updated = usePageStore.getState().page!;
  const section = updated.items[1] as Node;
  const replaced = (section.data as { items: Node[] }).items[0] as Node;
  assert.deepEqual(replaced.data, { fresh: true });
});

test("usePageStore.replaceNode is a no-op (with warning) when id not found", () => {
  resetStore();
  const warnings: unknown[][] = [];
  const origWarn = console.warn;
  console.warn = (...args: unknown[]) => warnings.push(args);
  try {
    usePageStore.getState().setPageTree(page([leaf("a")]));
    const before = usePageStore.getState().page;
    usePageStore.getState().replaceNode("missing", leaf("missing"));
    const after = usePageStore.getState().page;
    // No-op — same reference.
    assert.equal(after, before);
    assert.ok(
      warnings.some((w) =>
        String(w[0]).includes('no node with id "missing"'),
      ),
      "expected a warning",
    );
  } finally {
    console.warn = origWarn;
  }
});

test("usePageStore.replaceNode is a no-op when no page is loaded", () => {
  resetStore();
  const warnings: unknown[][] = [];
  const origWarn = console.warn;
  console.warn = (...args: unknown[]) => warnings.push(args);
  try {
    usePageStore.getState().replaceNode("anything", leaf("anything"));
    assert.equal(usePageStore.getState().page, null);
    assert.ok(
      warnings.some((w) => String(w[0]).includes("no page loaded")),
      "expected a warning",
    );
  } finally {
    console.warn = origWarn;
  }
});

test("usePageStore.appendItems appends to a container's data.items", () => {
  resetStore();
  usePageStore.getState().setPageTree(
    page([container("feed", [leaf("x")])]),
  );
  usePageStore
    .getState()
    .appendItems("feed", [leaf("y"), leaf("z")], { cursor: "c2", hasMore: true });
  const feed = usePageStore.getState().page!.items[0] as Node;
  const items = (feed.data as { items: Node[] }).items;
  assert.deepEqual(
    items.map((n) => n.id),
    ["x", "y", "z"],
  );
  const data = feed.data as Record<string, unknown>;
  assert.equal(data["cursor"], "c2");
  assert.equal(data["has_more"], true);
});

test("usePageStore.appendItems is a no-op when target not found (warns)", () => {
  resetStore();
  const warnings: unknown[][] = [];
  const origWarn = console.warn;
  console.warn = (...args: unknown[]) => warnings.push(args);
  try {
    usePageStore.getState().setPageTree(page([container("feed", [leaf("x")])]));
    const before = usePageStore.getState().page;
    usePageStore.getState().appendItems("missing", [leaf("y")]);
    assert.equal(usePageStore.getState().page, before);
    assert.ok(
      warnings.some((w) => String(w[0]).includes('no node with id "missing"')),
    );
  } finally {
    console.warn = origWarn;
  }
});

test("usePageStore.appendItems is a no-op when target has no data.items (warns)", () => {
  resetStore();
  const warnings: unknown[][] = [];
  const origWarn = console.warn;
  console.warn = (...args: unknown[]) => warnings.push(args);
  try {
    const imgNode: Node = {
      type: "image",
      id: "img",
      data: { src: "x.png" },
    } as unknown as Node;
    usePageStore.getState().setPageTree(page([imgNode]));
    const before = usePageStore.getState().page;
    usePageStore.getState().appendItems("img", [leaf("y")]);
    assert.equal(usePageStore.getState().page, before);
    assert.ok(
      warnings.some((w) =>
        String(w[0]).includes('node "img" has no data.items array'),
      ),
    );
  } finally {
    console.warn = origWarn;
  }
});
