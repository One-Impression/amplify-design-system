import { test } from "node:test";
import assert from "node:assert/strict";
import { handleSetLocal } from "../set-local.ts";
import type { ActionEngine, ActionEngineConfig } from "../../types.ts";
import { useLocalStore } from "../../../state/useLocalStore.ts";

const noopConfig: ActionEngineConfig = {
  bffBaseUrl: "https://bff.example.test",
  authToken: () => null,
  onNavigate: () => undefined,
  onToast: () => undefined,
  onDeeplink: () => undefined,
};
const noopEngine: ActionEngine = { dispatch: async () => undefined };

function resetStore(): void {
  useLocalStore.setState({ data: {} });
}

test("set_local — set op writes literal", async () => {
  resetStore();
  await handleSetLocal(
    {
      type: "set_local",
      payload: { key: "filters.tier", op: "set", value: "pro" },
    },
    noopConfig,
    noopEngine,
  );
  assert.equal(useLocalStore.getState().get("filters.tier"), "pro");
});

test("set_local — set op defaults when op omitted", async () => {
  resetStore();
  await handleSetLocal(
    {
      type: "set_local",
      payload: { key: "k", value: "v" },
    },
    noopConfig,
    noopEngine,
  );
  assert.equal(useLocalStore.getState().get("k"), "v");
});

test("set_local — merge op combines objects", async () => {
  resetStore();
  useLocalStore.getState().set("user", { id: "u1", name: "alice" });
  await handleSetLocal(
    {
      type: "set_local",
      payload: { key: "user", op: "merge", value: { name: "bob", age: 30 } },
    },
    noopConfig,
    noopEngine,
  );
  assert.deepEqual(useLocalStore.getState().get("user"), {
    id: "u1",
    name: "bob",
    age: 30,
  });
});

test("set_local — toggle flips boolean", async () => {
  resetStore();
  useLocalStore.getState().set("flag", true);
  await handleSetLocal(
    { type: "set_local", payload: { key: "flag", op: "toggle" } },
    noopConfig,
    noopEngine,
  );
  assert.equal(useLocalStore.getState().get("flag"), false);
});

test("set_local — increment adds numeric value", async () => {
  resetStore();
  useLocalStore.getState().set("count", 5);
  await handleSetLocal(
    {
      type: "set_local",
      payload: { key: "count", op: "increment", value: 3 },
    },
    noopConfig,
    noopEngine,
  );
  assert.equal(useLocalStore.getState().get("count"), 8);
});

test("set_local — remove deletes key", async () => {
  resetStore();
  useLocalStore.getState().set("tmp", "x");
  await handleSetLocal(
    { type: "set_local", payload: { key: "tmp", op: "remove" } },
    noopConfig,
    noopEngine,
  );
  assert.equal(useLocalStore.getState().get("tmp"), undefined);
});

test("set_local — $.now ref resolves to a numeric timestamp", async () => {
  resetStore();
  const before = Date.now();
  await handleSetLocal(
    {
      type: "set_local",
      payload: { key: "ts", op: "set", value: { ref: "$.now" } },
    },
    noopConfig,
    noopEngine,
  );
  const after = Date.now();
  const stored = useLocalStore.getState().get("ts") as number;
  assert.equal(typeof stored, "number");
  assert.ok(
    stored >= before && stored <= after,
    `expected ${before} <= ${stored} <= ${after}`,
  );
});

test("set_local — unresolved ref (no payload context) resolves to null", async () => {
  resetStore();
  await handleSetLocal(
    {
      type: "set_local",
      payload: {
        key: "missing",
        op: "set",
        value: { ref: "$.response.user.id" },
      },
    },
    noopConfig,
    noopEngine,
  );
  assert.equal(useLocalStore.getState().get("missing"), null);
});

test("set_local — merge with non-object resolved value is a no-op", async () => {
  resetStore();
  useLocalStore.getState().set("u", { id: "u1" });
  // Ref resolves to null because no response/payload context is wired.
  await handleSetLocal(
    {
      type: "set_local",
      payload: {
        key: "u",
        op: "merge",
        value: { ref: "$.response.profile" },
      },
    },
    noopConfig,
    noopEngine,
  );
  // u is unchanged — null merge would corrupt the record.
  assert.deepEqual(useLocalStore.getState().get("u"), { id: "u1" });
});
