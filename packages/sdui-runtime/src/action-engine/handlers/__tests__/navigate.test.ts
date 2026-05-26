import { test } from "node:test";
import assert from "node:assert/strict";
import { handleNavigate } from "../navigate.ts";
import type {
  ActionEngine,
  ActionEngineConfig,
  ActionEngineLogger,
} from "../../types.ts";
import type { Action } from "@one-impression/sdk-native-sdui";

interface NavCall {
  op: string;
  target: string;
  params: Record<string, unknown> | undefined;
}

interface WarnCall {
  message: string;
  context?: Record<string, unknown>;
}

function makeConfig(): {
  config: ActionEngineConfig;
  navCalls: NavCall[];
  warnCalls: WarnCall[];
} {
  const navCalls: NavCall[] = [];
  const warnCalls: WarnCall[] = [];
  const logger: ActionEngineLogger = {
    warn: (message, context) => {
      warnCalls.push({ message, context });
    },
  };
  const config: ActionEngineConfig = {
    bffBaseUrl: "https://bff.example.test",
    authToken: () => null,
    onNavigate: (op, target, params) => {
      navCalls.push({ op, target, params });
    },
    onToast: () => undefined,
    onDeeplink: () => undefined,
    logger,
  };
  return { config, navCalls, warnCalls };
}

const noopEngine: ActionEngine = { dispatch: async () => undefined };

test("handleNavigate — new-style emit (target in payload) is forwarded as-is", async () => {
  const { config, navCalls, warnCalls } = makeConfig();
  const action: Action = {
    type: "navigate",
    payload: {
      op: "push",
      target: "/creator/earnings",
      params: { tab: "withdrawals" },
    },
  };

  await handleNavigate(action, config, noopEngine);

  assert.equal(navCalls.length, 1);
  assert.equal(navCalls[0].op, "push");
  assert.equal(navCalls[0].target, "/creator/earnings");
  assert.deepEqual(navCalls[0].params, { tab: "withdrawals" });
  // No deprecation: the new shape never warns.
  assert.equal(warnCalls.length, 0);
});

test("handleNavigate — legacy emit (action.target only) still works with deprecation warning", async () => {
  const { config, navCalls, warnCalls } = makeConfig();
  // Legacy shape — `target` sits at the action level, not in payload.
  const action: Action = {
    type: "navigate",
    payload: { op: "push" },
    target: "/legacy/route",
  } as Action & { target: string };

  await handleNavigate(action, config, noopEngine);

  assert.equal(navCalls.length, 1);
  assert.equal(navCalls[0].op, "push");
  assert.equal(navCalls[0].target, "/legacy/route");
  // Deprecation surfaced through the structured logger.
  assert.equal(warnCalls.length, 1);
  assert.match(warnCalls[0].message, /legacy action\.target/);
  assert.equal(warnCalls[0].context?.target, "/legacy/route");
});

test("handleNavigate — both payload.target and action.target — payload wins, no warning", async () => {
  const { config, navCalls, warnCalls } = makeConfig();
  const action: Action = {
    type: "navigate",
    payload: { op: "push", target: "/from-payload" },
    target: "/from-legacy",
  } as Action & { target: string };

  await handleNavigate(action, config, noopEngine);

  assert.equal(navCalls.length, 1);
  assert.equal(navCalls[0].target, "/from-payload");
  // We must not warn when the new field is present — that's a healthy
  // emit even if it also happens to have the legacy field.
  assert.equal(warnCalls.length, 0);
});

test("handleNavigate — neither field present — empty target, no warning", async () => {
  const { config, navCalls, warnCalls } = makeConfig();
  const action: Action = {
    type: "navigate",
    payload: { op: "back" },
  };

  await handleNavigate(action, config, noopEngine);

  assert.equal(navCalls.length, 1);
  assert.equal(navCalls[0].target, "");
  // Empty / pop-style navs are valid and shouldn't be flagged as legacy.
  assert.equal(warnCalls.length, 0);
});

test("handleNavigate — missing logger falls back to console.warn for the deprecation", async () => {
  const navCalls: NavCall[] = [];
  // Same config as makeConfig() but with no logger field.
  const config: ActionEngineConfig = {
    bffBaseUrl: "https://bff.example.test",
    authToken: () => null,
    onNavigate: (op, target, params) => {
      navCalls.push({ op, target, params });
    },
    onToast: () => undefined,
    onDeeplink: () => undefined,
  };
  const consoleWarnCalls: unknown[][] = [];
  const originalConsoleWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    consoleWarnCalls.push(args);
  };
  try {
    const action: Action = {
      type: "navigate",
      payload: { op: "push" },
      target: "/legacy/dev",
    } as Action & { target: string };
    await handleNavigate(action, config, noopEngine);
  } finally {
    console.warn = originalConsoleWarn;
  }
  assert.equal(navCalls.length, 1);
  assert.equal(navCalls[0].target, "/legacy/dev");
  assert.equal(consoleWarnCalls.length, 1);
});
