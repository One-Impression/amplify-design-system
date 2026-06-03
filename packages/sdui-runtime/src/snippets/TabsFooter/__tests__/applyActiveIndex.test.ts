import { test } from "node:test";
import assert from "node:assert/strict";
import type { Node } from "@one-impression/sdk-native-sdui";
import { applyActiveIndex } from "../applyActiveIndex.ts";

function makeTab(id: string, active = false): Node {
  return {
    id,
    type: "creator.ui_component.tab",
    data: {
      label: { text: id },
      active,
    },
    on_click: { type: "navigate", payload: {} },
  } as Node;
}

test("returns items unchanged when activeIndex is undefined", () => {
  const items = [makeTab("a", true), makeTab("b")];
  const out = applyActiveIndex(items, undefined);
  assert.strictEqual(out, items);
});

test("marks the active-index tab as active and resets others", () => {
  const items = [makeTab("a", true), makeTab("b"), makeTab("c")];
  const out = applyActiveIndex(items, 1);

  assert.equal(
    (out[0].data as { active: boolean }).active,
    false,
    "previously active tab is reset",
  );
  assert.equal(
    (out[1].data as { active: boolean }).active,
    true,
    "active_index tab is marked active",
  );
  assert.equal(
    (out[2].data as { active: boolean }).active,
    false,
    "other tabs are inactive",
  );
});

test("does not mutate input items", () => {
  const items = [makeTab("a", true), makeTab("b")];
  const before = JSON.stringify(items);
  applyActiveIndex(items, 1);
  assert.equal(JSON.stringify(items), before, "input untouched");
});

test("dispatches per-tab on_click (verified by interpreter — on_click is preserved on output)", () => {
  const items = [makeTab("home"), makeTab("search")];
  const out = applyActiveIndex(items, 1);
  assert.ok(out[0].on_click, "home tab keeps on_click");
  assert.ok(out[1].on_click, "search tab keeps on_click");
});

test("passes through Nodes whose data is not a plain object", () => {
  // Defensive: producer ships a bogus tab — we must not crash.
  const bogus = { id: "bogus", type: "creator.ui_component.tab", data: null } as unknown as Node;
  const tab = makeTab("ok");
  const out = applyActiveIndex([bogus, tab], 0);
  assert.equal(out[0], bogus);
  // tab at idx 1 isn't the active one
  assert.equal((out[1].data as { active: boolean }).active, false);
});

test("handles empty items array", () => {
  const out = applyActiveIndex([], 0);
  assert.deepEqual(out, []);
});

test("activeIndex out of range marks all inactive", () => {
  const items = [makeTab("a", true), makeTab("b", true)];
  const out = applyActiveIndex(items, 99);
  assert.equal((out[0].data as { active: boolean }).active, false);
  assert.equal((out[1].data as { active: boolean }).active, false);
});
