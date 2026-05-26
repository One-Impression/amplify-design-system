import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { handleBffCall } from "../bff-call.ts";
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
  log: Array<{ type: string; tag?: string }>;
}

function makeSpyEngine(): SpyEngine {
  const log: SpyEngine["log"] = [];
  return {
    log,
    dispatch: async (action: Action) => {
      const tag = (action.payload?.tag as string | undefined) ?? undefined;
      log.push({ type: action.type, tag });
    },
  };
}

// Mock fetch — replace global fetch with a programmable stub for each test.
type FetchStub = (input: unknown, init?: unknown) => Promise<Response>;
let originalFetch: typeof globalThis.fetch | undefined;

function installFetch(stub: FetchStub): void {
  originalFetch = globalThis.fetch;
  globalThis.fetch = stub as unknown as typeof globalThis.fetch;
}

beforeEach(() => {
  originalFetch = globalThis.fetch;
});

afterEach(() => {
  if (originalFetch) {
    globalThis.fetch = originalFetch;
  }
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const bffAction = (overrides: Record<string, unknown> = {}): Action =>
  ({
    type: "bff_call",
    payload: {
      method: "POST",
      endpoint: "creator.events.track",
      ...overrides,
    },
  }) as Action;

test("bff_call — 200 with body.action dispatches that action", async () => {
  installFetch(async () =>
    jsonResponse({
      action: { type: "toast", payload: { tag: "from-body" } },
    }),
  );
  const engine = makeSpyEngine();
  await handleBffCall(bffAction(), noopConfig, engine);
  assert.deepEqual(
    engine.log.map((e) => e.tag),
    ["from-body"],
  );
});

test("bff_call — 200 with body.action + on_success dispatches body.action first, then on_success", async () => {
  installFetch(async () =>
    jsonResponse({
      action: { type: "toast", payload: { tag: "body" } },
    }),
  );
  const engine = makeSpyEngine();
  await handleBffCall(
    bffAction({
      on_success: { type: "toast", payload: { tag: "success" } },
    }),
    noopConfig,
    engine,
  );
  assert.deepEqual(
    engine.log.map((e) => e.tag),
    ["body", "success"],
    "body.action must dispatch before payload.on_success",
  );
});

test("bff_call — 500 with on_error dispatches on_error", async () => {
  installFetch(async () => jsonResponse({ error: "boom" }, 500));
  const engine = makeSpyEngine();
  await handleBffCall(
    bffAction({
      on_error: { type: "toast", payload: { tag: "err" } },
    }),
    noopConfig,
    engine,
  );
  assert.deepEqual(
    engine.log.map((e) => e.tag),
    ["err"],
  );
});

test("bff_call — 200 with no body.action and no on_success — nothing fires", async () => {
  installFetch(async () => jsonResponse({ data: "ok" }));
  const engine = makeSpyEngine();
  await handleBffCall(bffAction(), noopConfig, engine);
  assert.equal(engine.log.length, 0);
});

test("bff_call — 200 with empty / non-JSON body — nothing fires, no throw", async () => {
  installFetch(
    async () =>
      new Response("", {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      }),
  );
  const engine = makeSpyEngine();
  await handleBffCall(bffAction(), noopConfig, engine);
  assert.equal(engine.log.length, 0);
});

test("bff_call — 200 with body.action and on_success — both dispatched in order, with telemetry between", async () => {
  installFetch(async () =>
    jsonResponse({
      action: {
        type: "append_items",
        payload: { tag: "append", section_id: "feed", items: [] },
      },
    }),
  );
  const engine = makeSpyEngine();
  await handleBffCall(
    bffAction({
      on_success: { type: "navigate", payload: { tag: "nav", to: "/next" } },
    }),
    noopConfig,
    engine,
  );
  assert.deepEqual(
    engine.log.map((e) => ({ type: e.type, tag: e.tag })),
    [
      { type: "append_items", tag: "append" },
      { type: "navigate", tag: "nav" },
    ],
  );
});
