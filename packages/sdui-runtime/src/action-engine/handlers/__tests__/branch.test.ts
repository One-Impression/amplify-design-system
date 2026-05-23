import { test } from "node:test";
import assert from "node:assert/strict";
import { handleBranch } from "../branch.ts";
import { handleCompound } from "../compound.ts";
import type { ActionEngine, ActionEngineConfig } from "../../types.ts";
import type { Action } from "@one-impression/sdk-native-sdui";
import { useLocalStore } from "../../../state/useLocalStore.ts";

const noopConfig: ActionEngineConfig = {
  bffBaseUrl: "https://bff.example.test",
  authToken: () => null,
  onNavigate: () => undefined,
  onToast: () => undefined,
  onDeeplink: () => undefined,
};

interface SpyEngine extends ActionEngine {
  log: string[];
}

function makeEngine(): SpyEngine {
  const log: string[] = [];
  const engine: SpyEngine = {
    log,
    dispatch: async (action: Action) => {
      const tag = (action.payload?.tag as string) ?? action.type;
      log.push(tag);
      // Recursive dispatch — let branch / compound find this engine.
      if (action.type === "branch") {
        await handleBranch(action, noopConfig, engine);
      } else if (action.type === "compound") {
        await handleCompound(action, noopConfig, engine);
      }
    },
  };
  return engine;
}

function resetStore(): void {
  useLocalStore.setState({ data: {} });
}

const tag = (t: string): Action => ({ type: "toast", payload: { tag: t } });

test("branch — truthy cond dispatches then", async () => {
  resetStore();
  useLocalStore.getState().set("auth.token", "abc");
  const engine = makeEngine();
  await handleBranch(
    {
      type: "branch",
      payload: {
        if: { type: "cond:local", key: "auth.token", op: "exists" },
        then: tag("authed"),
        else: tag("anon"),
      },
    },
    noopConfig,
    engine,
  );
  assert.deepEqual(engine.log, ["authed"]);
});

test("branch — falsy cond dispatches else", async () => {
  resetStore();
  const engine = makeEngine();
  await handleBranch(
    {
      type: "branch",
      payload: {
        if: { type: "cond:local", key: "auth.token", op: "exists" },
        then: tag("authed"),
        else: tag("anon"),
      },
    },
    noopConfig,
    engine,
  );
  assert.deepEqual(engine.log, ["anon"]);
});

test("branch — falsy cond with no else is a no-op", async () => {
  resetStore();
  const engine = makeEngine();
  await handleBranch(
    {
      type: "branch",
      payload: {
        if: { type: "cond:local", key: "auth.token", op: "exists" },
        then: tag("authed"),
      },
    },
    noopConfig,
    engine,
  );
  assert.deepEqual(engine.log, []);
});

test("branch — eq op against literal value", async () => {
  resetStore();
  useLocalStore.getState().set("user.role", "admin");
  const engine = makeEngine();
  await handleBranch(
    {
      type: "branch",
      payload: {
        if: {
          type: "cond:local",
          key: "user.role",
          op: "eq",
          value: "admin",
        },
        then: tag("admin-path"),
        else: tag("other-path"),
      },
    },
    noopConfig,
    engine,
  );
  assert.deepEqual(engine.log, ["admin-path"]);
});

test("branch nested inside compound — sequenced after sibling", async () => {
  resetStore();
  useLocalStore.getState().set("feature.flag", true);
  const engine = makeEngine();
  await handleCompound(
    {
      type: "compound",
      payload: {
        mode: "sequence",
        actions: [
          tag("first"),
          {
            type: "branch",
            payload: {
              if: { type: "cond:local", key: "feature.flag", op: "exists" },
              then: tag("flagged-on"),
              else: tag("flagged-off"),
            },
          },
          tag("last"),
        ],
      },
    },
    noopConfig,
    engine,
  );
  assert.deepEqual(engine.log, ["first", "branch", "flagged-on", "last"]);
});

test("branch — compound nested inside branch then", async () => {
  resetStore();
  useLocalStore.getState().set("k", 1);
  const engine = makeEngine();
  await handleBranch(
    {
      type: "branch",
      payload: {
        if: { type: "cond:local", key: "k", op: "exists" },
        then: {
          type: "compound",
          payload: {
            mode: "sequence",
            actions: [tag("inner-a"), tag("inner-b")],
          },
        },
      },
    },
    noopConfig,
    engine,
  );
  assert.deepEqual(engine.log, ["compound", "inner-a", "inner-b"]);
});
