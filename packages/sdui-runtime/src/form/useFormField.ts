import { useEffect } from "react";
import {
  useFormStore,
  type FormFieldValue,
} from "../state/useFormStore.js";
import { evaluateField, type ValidationRule } from "../validation/index.js";

/**
 * What a field component needs to participate in a form. Returned by
 * {@link useFormField}.
 */
export interface FormFieldBinding<T extends FormFieldValue> {
  /** Current value — from the store when form-bound, else the seeded default. */
  value: T;
  /** Write the value (store-backed when form-bound; no-op otherwise). */
  setValue: (next: T) => void;
  /** Current error message for this field, or null. */
  error: string | null;
  /** Whether the user has interacted with this field (gates error display). */
  touched: boolean;
  /** Mark the field touched — call on blur. */
  markTouched: () => void;
  /** True when this field is wired into a form store (has a resolved form id). */
  bound: boolean;
}

/**
 * Bind an input to a form's state in {@link useFormStore}, keyed by
 * `(formId, fieldName)`.
 *
 * - When `formId` and `fieldName` are present, the field reads/writes the store
 *   via **per-field selectors** — typing here re-renders only this field, never
 *   its siblings or the submit button.
 * - When either is absent (a standalone input not part of any form), it falls
 *   back to a no-op binding that just echoes the default; the renderer should
 *   keep its own local state in that case. (Hooks are still all called
 *   unconditionally — only the returned setters differ.)
 *
 * The default is seeded into the store once on mount **only if absent**, so a
 * re-render never clobbers what the user typed, and `getForm().values` is
 * honest before the user touches anything. Untouched scalars seed `""`, arrays
 * `[]` (design D5) — the caller passes the right empty default per input type.
 */
export function useFormField<T extends FormFieldValue>(
  formId: string | null,
  fieldName: string | undefined,
  defaultValue: T,
  validations?: ValidationRule[],
): FormFieldBinding<T> {
  const bound = !!formId && !!fieldName;

  // Per-field selector subscriptions (safe when unbound — keys just miss).
  const stored = useFormStore((s) =>
    bound ? s.forms[formId as string]?.values[fieldName as string] : undefined,
  );
  const error = useFormStore((s) =>
    bound ? (s.forms[formId as string]?.errors[fieldName as string] ?? null) : null,
  );
  const touched = useFormStore((s) =>
    bound ? !!s.forms[formId as string]?.touched[fieldName as string] : false,
  );
  const setField = useFormStore((s) => s.setField);
  const setTouched = useFormStore((s) => s.setTouched);

  // Seed the default once, only if this field has no value yet.
  useEffect(() => {
    if (!bound) return;
    const current = useFormStore.getState().forms[formId as string]?.values[fieldName as string];
    if (current === undefined) {
      setField(formId as string, fieldName as string, defaultValue);
    }
    // Seed is intentionally mount-only; subsequent default changes don't reseed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bound, formId, fieldName]);

  const value = (bound ? (stored ?? defaultValue) : defaultValue) as T;

  // Validate on every value change (and on mount, against the seeded default —
  // so a required-but-empty field is invalid from the start, gating submit).
  // Errors are always computed; whether they're *shown* is gated on `touched`
  // by the renderer (design D8). Cross-field rules read peers from the store.
  const setErrors = useFormStore((s) => s.setErrors);
  useEffect(() => {
    if (!bound || !validations || validations.length === 0) return;
    const error = evaluateField(validations, value, {
      getFieldValue: (name) =>
        useFormStore.getState().forms[formId as string]?.values[name],
    });
    setErrors(formId as string, { [fieldName as string]: error });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bound, formId, fieldName, value, validations]);

  return {
    value,
    setValue: (next: T) => {
      if (bound) setField(formId as string, fieldName as string, next);
    },
    error,
    touched,
    markTouched: () => {
      if (bound) setTouched(formId as string, fieldName as string);
    },
    bound,
  };
}
