import type { Action } from "@one-impression/sdk-native-sdui";

/**
 * Returns a new Action with form values merged into the request_body
 * for `bff_call` actions; passes the action through unchanged
 * otherwise. Existing keys in `payload.request_body` are preserved,
 * with form values overlaying them (the latest user-entered value
 * wins).
 *
 * Pure function — extracted from Form.renderer.tsx so it can be
 * unit-tested without a React Native runtime.
 */
export function mergeFormValuesIntoAction(
  action: Action,
  values: Record<string, unknown>,
): Action {
  if (action.type !== "bff_call") {
    return action;
  }
  const payload = (action.payload ?? {}) as Record<string, unknown>;
  const existingBody = (payload.request_body ?? {}) as Record<string, unknown>;
  return {
    ...action,
    payload: {
      ...payload,
      request_body: { ...existingBody, ...values },
    },
  } as Action;
}

/**
 * Minimal FormState contract — mirrored by FormContext at runtime.
 * Exposed here for unit-testing FormContext-like behaviour without
 * mounting the renderer.
 */
export interface FormState {
  values: Record<string, unknown>;
  setValue: (key: string, value: unknown) => void;
  getValues: () => Record<string, unknown>;
}

/**
 * Ref-backed FormState factory — the same logic FormInner uses, but
 * decoupled from React hooks so we can unit-test the propagation
 * contract (setValue writes, getValues reads back the latest snapshot).
 */
export function createFormState(): FormState {
  const values: Record<string, unknown> = {};
  return {
    values,
    setValue: (key, value) => {
      values[key] = value;
    },
    getValues: () => values,
  };
}
