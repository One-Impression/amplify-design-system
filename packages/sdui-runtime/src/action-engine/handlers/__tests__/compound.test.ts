import { test } from "node:test";
import assert from "node:assert/strict";
import { handleCompound } from "../compound.ts";
import type { ActionEngine, ActionEngineConfig } from "../../types.ts";
import type { Action } from "@one-impression/sdk-native-sdui";

const noopConfig: ActionEngineConfig = {
  bffBaseUrl: "https://bff.example.test",
  authToken: () => null,
  onNavigate: () => undefined,
  onToast: () => undefined,
  onDeeplink: () => undefined,
};

interface SpyEngine extends ActionEngine {
  log: Array<{ type: string; at: number }>;
}

function makeSpyEngine(
  delays: Record<string, number> = {},
  failFor: string[] = [],
): SpyEngine {
  const log: SpyEngine["log"] = [];
  const start = Date.now();
  const engine: SpyEngine = {
    log,
    dispatch: async (action: Action) => {
      const tag = (action.payload?.tag as string) ?? action.type;
      const delay = delays[tag] ?? 0;
      if (delay > 0) {
        await new Promise<void>((r) => setTimeout(r, delay));
      }
      log.push({ type: tag, at: Date.now() - start });
      if (failFor.includes(tag)) {
        throw new Error(`spy: ${tag} failed`);
      }
    },
  };
  return engine;
}

const toastAction = (tag: string): Action => ({
  type: "toast",
  payload: { tag },
});

test("compound — sequence runs children in declared order", async () => {
  const engine = makeSpyEngine();
  await handleCompound(
    {
      type: "compound",
      payload: {
        mode: "sequence",
        actions: [toastAction("a"), toastAction("b"), toastAction("c")],
      },
    },
    noopConfig,
    engine,
  );
  assert.deepEqual(
    engine.log.map((e) => e.type),
    ["a", "b", "c"],
  );
});

test("compound — sequence (default mode) when mode omitted", async () => {
  const engine = makeSpyEngine();
  await handleCompound(
    {
      type: "compound",
      payload: { actions: [toastAction("x"), toastAction("y")] },
    },
    noopConfig,
    engine,
  );
  assert.deepEqual(
    engine.log.map((e) => e.type),
    ["x", "y"],
  );
});

test("compound — parallel dispatches all children", async () => {
  const engine = makeSpyEngine();
  await handleCompound(
    {
      type: "compound",
      payload: {
        mode: "parallel",
        actions: [toastAction("p1"), toastAction("p2"), toastAction("p3")],
      },
    },
    noopConfig,
    engine,
  );
  assert.equal(engine.log.length, 3);
  const tags = engine.log.map((e) => e.type).sort();
  assert.deepEqual(tags, ["p1", "p2", "p3"]);
});

test("compound — parallel wait:first resolves on first settle", async () => {
  const engine = makeSpyEngine({ slow: 80, fast: 5 });
  const start = Date.now();
  await handleCompound(
    {
      type: "compound",
      payload: {
        mode: "parallel",
        wait: "first",
        actions: [toastAction("slow"), toastAction("fast")],
      },
    },
    noopConfig,
    engine,
  );
  const elapsed = Date.now() - start;
  // Should resolve close to the fast child, not the slow one.
  assert.ok(
    elapsed < 60,
    `wait:first should resolve before the slow child (~80ms); elapsed=${elapsed}ms`,
  );
  // Wait long enough that the slow child completes its side effect too
  // (fire-and-forget — log should still reflect both eventually).
  await new Promise<void>((r) => setTimeout(r, 100));
  const tags = engine.log.map((e) => e.type).sort();
  assert.deepEqual(tags, ["fast", "slow"]);
});

test("compound — parallel with all rejections throws aggregate", async () => {
  const engine = makeSpyEngine({}, ["bad1", "bad2"]);
  // Pin two contracts:
  //   1. The thrown value is the raw Error from the first rejection's
  //      `reason` — not a wrapper class, not an AggregateError, not a Zod
  //      parse error.
  //   2. Both children must be awaited before the rejection surfaces
  //      (the `Promise.allSettled` contract). A `Promise.race`-based
  //      implementation would throw immediately on bad1 without dispatching
  //      bad2 — `engine.log` containing both tags proves both ran.
  await assert.rejects(
    handleCompound(
      {
        type: "compound",
        payload: {
          mode: "parallel",
          actions: [toastAction("bad1"), toastAction("bad2")],
        },
      },
      noopConfig,
      engine,
    ),
    (err: unknown) =>
      err instanceof Error && err.message === "spy: bad1 failed",
  );
  const tags = engine.log.map((e) => e.type).sort();
  assert.deepEqual(
    tags,
    ["bad1", "bad2"],
    "allSettled contract: both siblings must dispatch before the rejection surfaces",
  );
});

test("compound — parallel partial failure does NOT abort", async () => {
  const engine = makeSpyEngine({}, ["bad"]);
  await handleCompound(
    {
      type: "compound",
      payload: {
        mode: "parallel",
        actions: [toastAction("ok1"), toastAction("bad"), toastAction("ok2")],
      },
    },
    noopConfig,
    engine,
  );
  const tags = engine.log.map((e) => e.type).sort();
  assert.deepEqual(tags, ["bad", "ok1", "ok2"]);
});

test("compound — empty actions array is a no-op", async () => {
  const engine = makeSpyEngine();
  await handleCompound(
    {
      type: "compound",
      payload: { mode: "sequence", actions: [toastAction("only")] },
    },
    noopConfig,
    engine,
  );
  assert.equal(engine.log.length, 1);
});
