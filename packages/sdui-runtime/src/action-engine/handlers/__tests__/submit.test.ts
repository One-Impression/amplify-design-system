import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { handleSubmit } from "../submit.ts";
import type { ActionEngine, ActionEngineConfig } from "../../types.ts";
import type { Action } from "@one-impression/sdk-native-sdui";
import { useFormStore } from "../../../state/useFormStore.ts";

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

type FetchStub = (input: unknown, init?: unknown) => Promise<Response>;
let originalFetch: typeof globalThis.fetch | undefined;

function installFetch(stub: FetchStub): void {
  originalFetch = globalThis.fetch;
  globalThis.fetch = stub as unknown as typeof globalThis.fetch;
}

beforeEach(() => {
  originalFetch = globalThis.fetch;
  // Start each test from a clean form store.
  useFormStore.setState({ forms: {} });
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

// A registered form with one valid (un-erroring) field — the submit gate
// passes only when the form has no errors.
function seedValidForm(formId = "f1"): void {
  const store = useFormStore.getState();
  store.register(formId);
  store.setField(formId, "pan", "ABCDE1234F");
}

// Path-direct: the submit action carries the concrete request `path`, mirroring
// bff_call / reload — there is no client-side endpoint-id registry.
const submitAction = (overrides: Record<string, unknown> = {}): Action =>
  ({
    type: "submit",
    payload: {
      form_id: "f1",
      path: "/v1/creator/kyc/verify",
      ...overrides,
    },
  }) as Action;

test("submit — POSTs to bffBaseUrl + path (path-direct) and runs on_success", async () => {
  seedValidForm();
  let lastUrl: string | undefined;
  installFetch(async (input) => {
    lastUrl = String(input);
    return jsonResponse({});
  });
  const engine = makeSpyEngine();
  await handleSubmit(
    submitAction({ on_success: { type: "toast", payload: { tag: "ok" } } }),
    noopConfig,
    engine,
  );
  assert.equal(lastUrl, "https://bff.example.test/v1/creator/kyc/verify");
  assert.deepEqual(engine.log.map((e) => e.tag), ["ok"]);
});

test("submit — missing path is a no-op (no request, no chain)", async () => {
  seedValidForm();
  let fetched = false;
  installFetch(async () => {
    fetched = true;
    return jsonResponse({});
  });
  const engine = makeSpyEngine();
  await handleSubmit(
    { type: "submit", payload: { form_id: "f1" } } as Action,
    noopConfig,
    engine,
  );
  assert.equal(fetched, false, "must not fetch without a path");
  assert.deepEqual(engine.log, [], "must not chain without a path");
});

test("submit — body merges form values OVER request_body (form wins)", async () => {
  seedValidForm();
  let body: Record<string, unknown> | undefined;
  installFetch(async (_input, init) => {
    body = JSON.parse((init as { body: string }).body) as Record<string, unknown>;
    return jsonResponse({});
  });
  await handleSubmit(
    submitAction({ request_body: { source: "manual", pan: "SERVER-DEFAULT" } }),
    noopConfig,
    makeSpyEngine(),
  );
  assert.equal(body?.["source"], "manual", "server-known constant rides along");
  assert.equal(body?.["pan"], "ABCDE1234F", "form value wins over request_body");
});

test("submit — non-2xx writes server field errors and runs on_error", async () => {
  seedValidForm();
  installFetch(async () =>
    jsonResponse({ errors: { pan: "Invalid PAN" } }, 422),
  );
  const engine = makeSpyEngine();
  await handleSubmit(
    submitAction({ on_error: { type: "toast", payload: { tag: "err" } } }),
    noopConfig,
    engine,
  );
  assert.deepEqual(engine.log.map((e) => e.tag), ["err"]);
  assert.equal(
    useFormStore.getState().getForm("f1")?.errors["pan"],
    "Invalid PAN",
    "server field error is written into the form's error map",
  );
});
