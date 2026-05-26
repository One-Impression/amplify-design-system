import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mergeFormValuesIntoAction,
  createFormState,
} from "../form-values.ts";
import type { Action } from "@one-impression/sdk-native-sdui";

// ---- FormState propagation (the contract InputInner relies on) -------------

test("Input inside Form — setValue writes into FormState, getValues snapshots latest", () => {
  // This is the contract InputInner relies on: on every keystroke it
  // calls formCtx.setValue(fieldName, value). FormSubmitWrapper later
  // reads formCtx.getValues() at click time.
  const form = createFormState();
  form.setValue("phone", "98");
  form.setValue("phone", "987");
  form.setValue("phone", "9876543210");
  form.setValue("country_code", "+91");

  assert.deepEqual(form.getValues(), {
    phone: "9876543210",
    country_code: "+91",
  });
});

test("Input outside Form (no fieldName) — InputInner skips setValue, FormState stays empty", () => {
  // Simulates the InputInner behaviour: when fieldName is undefined,
  // the input never calls formCtx.setValue, so the default FormContext
  // (or any provided one) is never written.
  const form = createFormState();
  const fieldName: string | undefined = undefined;
  const userTyped = ["a", "ab", "abc"];

  for (const next of userTyped) {
    if (fieldName) {
      form.setValue(fieldName, next);
    }
    // Otherwise: stand-alone controlled input — value lives only in
    // local useState. Nothing leaks into FormState.
  }

  assert.deepEqual(form.getValues(), {});
});

// ---- mergeFormValuesIntoAction (FormSubmitWrapper click-time contract) -----

const bffSubmit = (overrides: Record<string, unknown> = {}): Action =>
  ({
    type: "bff_call",
    payload: {
      method: "POST",
      endpoint: "creator.auth.otpVerify",
      ...overrides,
    },
  }) as Action;

test("Form submit — merges current values into bff_call request_body", () => {
  const form = createFormState();
  form.setValue("phone", "9876543210");
  form.setValue("otp", "123456");

  const merged = mergeFormValuesIntoAction(bffSubmit(), form.getValues());

  assert.equal(merged.type, "bff_call");
  assert.deepEqual(merged.payload?.request_body, {
    phone: "9876543210",
    otp: "123456",
  });
});

test("Form submit — preserves existing request_body keys, form values overlay", () => {
  // The builder may seed `request_body` with non-user fields like
  // device_id or app_version. Form values should overlay, not replace.
  const merged = mergeFormValuesIntoAction(
    bffSubmit({
      request_body: { device_id: "abc", phone: "old" },
    }),
    { phone: "new", otp: "999" },
  );

  assert.deepEqual(merged.payload?.request_body, {
    device_id: "abc",
    phone: "new",
    otp: "999",
  });
});

test("Form submit — empty values object leaves request_body untouched", () => {
  const merged = mergeFormValuesIntoAction(
    bffSubmit({ request_body: { device_id: "abc" } }),
    {},
  );

  assert.deepEqual(merged.payload?.request_body, { device_id: "abc" });
});

test("Form submit — non-bff_call action passes through unchanged", () => {
  const navigate: Action = {
    type: "navigate",
    payload: { to: "/home" },
  } as Action;

  const merged = mergeFormValuesIntoAction(navigate, { phone: "999" });

  assert.equal(merged, navigate, "non-bff_call returns the same reference");
});

test("Form submit — bff_call with no payload at all is tolerated", () => {
  const action = { type: "bff_call" } as Action;
  const merged = mergeFormValuesIntoAction(action, { phone: "1" });

  assert.deepEqual(merged.payload?.request_body, { phone: "1" });
});

test("Form submit — latest setValue wins (snapshot is read at click time)", () => {
  // Pin: getValues() returns the LATEST snapshot at the moment of
  // dispatch, not a stale snapshot captured at render time.
  const form = createFormState();
  form.setValue("phone", "first");
  // ... time passes, user keeps typing ...
  form.setValue("phone", "final");

  const merged = mergeFormValuesIntoAction(bffSubmit(), form.getValues());

  assert.equal(
    (merged.payload?.request_body as Record<string, unknown>).phone,
    "final",
  );
});
