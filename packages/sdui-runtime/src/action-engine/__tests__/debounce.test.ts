import { test, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { createActionEngine } from "../action-engine.ts";
import { actionHandlerMap } from "../handlers/index.ts";
import type { ActionEngineConfig } from "../types.ts";
import type { Action } from "@one-impression/sdk-native-sdui";

const config: ActionEngineConfig = {
  bffBaseUrl: "https://bff.example.test",
  authToken: () => null,
  onNavigate: () => undefined,
  onToast: () => undefined,
  onDeeplink: () => undefined,
};

// Spy on the `toast` handler with a synchronous counter so debounce coalescing
// is observable without a real network/store side effect.
let calls: Array<Record<string, unknown> | undefined>;
let originalToast: (typeof actionHandlerMap)["toast"];

beforeEach(() => {
  calls = [];
  originalToast = actionHandlerMap["toast"];
  actionHandlerMap["toast"] = async (action: Action) => {
    calls.push(action.payload as Record<string, unknown> | undefined);
  };
  mock.timers.enable({ apis: ["setTimeout"] });
});

afterEach(() => {
  mock.timers.reset();
  actionHandlerMap["toast"] = originalToast;
});

const toast = (payload: Record<string, unknown>, debounceMs?: number): Action =>
  ({
    type: "toast",
    payload,
    ...(debounceMs !== undefined ? { debounce_ms: debounceMs } : {}),
  }) as unknown as Action;

test("debounce — a burst of the same action coalesces to one trailing run", async () => {
  const engine = createActionEngine(config);

  await engine.dispatch(toast({ msg: "a" }, 300));
  await engine.dispatch(toast({ msg: "b" }, 300));
  await engine.dispatch(toast({ msg: "c" }, 300));
  assert.equal(calls.length, 0, "nothing runs before the window elapses");

  mock.timers.tick(299);
  assert.equal(calls.length, 0, "still pending just before the window");

  mock.timers.tick(1);
  await Promise.resolve();
  assert.equal(calls.length, 1, "exactly one run after the window");
  assert.equal((calls[0] as { msg: string }).msg, "c", "the trailing payload wins");
});

test("debounce — debounce_ms of 0 / absent runs immediately", async () => {
  const engine = createActionEngine(config);
  await engine.dispatch(toast({ msg: "now" }));
  assert.equal(calls.length, 1);
  await engine.dispatch(toast({ msg: "also-now" }, 0));
  assert.equal(calls.length, 2);
});

test("debounce — distinct keys (different targets) do not coalesce", async () => {
  const engine = createActionEngine(config);
  await engine.dispatch({ type: "toast", target: "x", payload: { msg: "x" }, debounce_ms: 200 } as unknown as Action);
  await engine.dispatch({ type: "toast", target: "y", payload: { msg: "y" }, debounce_ms: 200 } as unknown as Action);

  mock.timers.tick(200);
  await Promise.resolve();
  assert.equal(calls.length, 2, "two distinct keys → two runs");
});

test("debounce — the scheduled run does not itself re-debounce (no loop)", async () => {
  const engine = createActionEngine(config);
  await engine.dispatch(toast({ msg: "once" }, 150));
  mock.timers.tick(150);
  await Promise.resolve();
  // If the trailing run re-entered the debounce path it would never execute the
  // handler; one call proves debounce_ms was stripped on the scheduled dispatch.
  assert.equal(calls.length, 1);
  mock.timers.tick(150);
  await Promise.resolve();
  assert.equal(calls.length, 1, "no further runs scheduled");
});
