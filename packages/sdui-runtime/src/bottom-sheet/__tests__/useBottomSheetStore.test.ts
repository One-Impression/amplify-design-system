import { test } from "node:test";
import assert from "node:assert/strict";
import {
  useBottomSheetStore,
  type SheetEntry,
} from "../useBottomSheetStore.ts";

function resetStore(): void {
  useBottomSheetStore.setState({
    registry: {},
    openSheets: {},
    openOrder: [],
    contexts: {},
  });
}

function makeSheet(id: string, overrides: Partial<SheetEntry> = {}): SheetEntry {
  return {
    id,
    size: "medium",
    items: [],
    ...overrides,
  };
}

test("register — adds a sheet without opening it", () => {
  resetStore();
  const sheet = makeSheet("info");
  useBottomSheetStore.getState().register("info", sheet);

  const state = useBottomSheetStore.getState();
  assert.deepEqual(state.registry["info"], sheet);
  assert.equal(state.openSheets["info"], undefined);
});

test("register — is idempotent and overwrites existing entry", () => {
  resetStore();
  useBottomSheetStore.getState().register("info", makeSheet("info", { size: "small" }));
  useBottomSheetStore.getState().register("info", makeSheet("info", { size: "large" }));

  assert.equal(useBottomSheetStore.getState().registry["info"]?.size, "large");
});

test("open — sets openSheets true for a registered sheet", () => {
  resetStore();
  useBottomSheetStore.getState().register("info", makeSheet("info"));
  useBottomSheetStore.getState().open("info");

  assert.equal(useBottomSheetStore.getState().openSheets["info"], true);
});

test("open — stamps context payload against the sheet id", () => {
  resetStore();
  useBottomSheetStore.getState().register("info", makeSheet("info"));
  useBottomSheetStore.getState().open("info", { campaignId: "c1" });

  assert.deepEqual(useBottomSheetStore.getState().contexts["info"], {
    campaignId: "c1",
  });
});

test("open — is a no-op when sheet is not registered", () => {
  resetStore();
  // Silence the warn during the test by stubbing console.warn.
  const originalWarn = console.warn;
  let warned = false;
  console.warn = () => {
    warned = true;
  };
  try {
    useBottomSheetStore.getState().open("ghost");
    assert.equal(useBottomSheetStore.getState().openSheets["ghost"], undefined);
    assert.equal(warned, true, "expected console.warn to be called");
  } finally {
    console.warn = originalWarn;
  }
});

test("close — removes a sheet from openSheets but keeps it in registry", () => {
  resetStore();
  useBottomSheetStore.getState().register("info", makeSheet("info"));
  useBottomSheetStore.getState().open("info", { x: 1 });
  useBottomSheetStore.getState().close("info");

  const state = useBottomSheetStore.getState();
  assert.equal(state.openSheets["info"], undefined);
  assert.equal(state.contexts["info"], undefined);
  // Registry survives — sheet can be reopened.
  assert.ok(state.registry["info"]);
});

test("close — without id closes the most-recently opened sheet", () => {
  resetStore();
  useBottomSheetStore.getState().register("a", makeSheet("a"));
  useBottomSheetStore.getState().register("b", makeSheet("b"));
  useBottomSheetStore.getState().open("a");
  useBottomSheetStore.getState().open("b");

  useBottomSheetStore.getState().close();

  const state = useBottomSheetStore.getState();
  assert.equal(state.openSheets["a"], true);
  assert.equal(state.openSheets["b"], undefined);
});

test("close — without id is a no-op when nothing is open", () => {
  resetStore();
  useBottomSheetStore.getState().register("a", makeSheet("a"));

  assert.doesNotThrow(() => useBottomSheetStore.getState().close());
  assert.deepEqual(useBottomSheetStore.getState().openSheets, {});
});

test("closeAll — clears every open sheet and context, registry survives", () => {
  resetStore();
  useBottomSheetStore.getState().register("a", makeSheet("a"));
  useBottomSheetStore.getState().register("b", makeSheet("b"));
  useBottomSheetStore.getState().open("a", { v: 1 });
  useBottomSheetStore.getState().open("b", { v: 2 });

  useBottomSheetStore.getState().closeAll();

  const state = useBottomSheetStore.getState();
  assert.deepEqual(state.openSheets, {});
  assert.deepEqual(state.contexts, {});
  assert.ok(state.registry["a"]);
  assert.ok(state.registry["b"]);
});

test("open — appends to openOrder, reopening promotes id to topmost", () => {
  resetStore();
  useBottomSheetStore.getState().register("a", makeSheet("a"));
  useBottomSheetStore.getState().register("b", makeSheet("b"));
  useBottomSheetStore.getState().open("a");
  useBottomSheetStore.getState().open("b");
  useBottomSheetStore.getState().open("a"); // reopen already-open sheet

  // "a" was already open; reopening should promote it to topmost without
  // duplicating it in the order array.
  assert.deepEqual(useBottomSheetStore.getState().openOrder, ["b", "a"]);
});

test("close(id) — removes id from openOrder", () => {
  resetStore();
  useBottomSheetStore.getState().register("a", makeSheet("a"));
  useBottomSheetStore.getState().register("b", makeSheet("b"));
  useBottomSheetStore.getState().open("a");
  useBottomSheetStore.getState().open("b");
  useBottomSheetStore.getState().close("a");

  assert.deepEqual(useBottomSheetStore.getState().openOrder, ["b"]);
});

test("close() — pops the last entry from openOrder", () => {
  resetStore();
  useBottomSheetStore.getState().register("a", makeSheet("a"));
  useBottomSheetStore.getState().register("b", makeSheet("b"));
  useBottomSheetStore.getState().open("a");
  useBottomSheetStore.getState().open("b");
  useBottomSheetStore.getState().close();

  assert.deepEqual(useBottomSheetStore.getState().openOrder, ["a"]);
});

test("closeAll — clears openOrder", () => {
  resetStore();
  useBottomSheetStore.getState().register("a", makeSheet("a"));
  useBottomSheetStore.getState().register("b", makeSheet("b"));
  useBottomSheetStore.getState().open("a");
  useBottomSheetStore.getState().open("b");
  useBottomSheetStore.getState().closeAll();

  assert.deepEqual(useBottomSheetStore.getState().openOrder, []);
});

test("register + open + close — full round trip allows reopening", () => {
  resetStore();
  useBottomSheetStore.getState().register("info", makeSheet("info"));
  useBottomSheetStore.getState().open("info");
  useBottomSheetStore.getState().close("info");
  useBottomSheetStore.getState().open("info", { again: true });

  const state = useBottomSheetStore.getState();
  assert.equal(state.openSheets["info"], true);
  assert.deepEqual(state.contexts["info"], { again: true });
});
