import type { FormFieldValue } from "../state/useFormStore.js";

/**
 * `show_when` — a base-node visibility rule evaluated against another field's
 * value in the SAME form. Lets the wire hide/show a node based on form state
 * (e.g. hide the WhatsApp-number field while the "same as my phone" toggle is
 * on) without a server round-trip. Read raw off the node (a wire extension, like
 * `full_bleed`); the gateway emits it, the interpreter honours it.
 *
 * Exactly one predicate is expected; checked in priority order. An empty/unknown
 * rule resolves to visible (fail-open — never hide a field on a malformed rule).
 */
export interface ShowWhen {
  /** Controlling field's `field_name` (same form). */
  field: string;
  /** Form id; falls back to the node's / enclosing form's id when omitted. */
  form_id?: string;
  /** Visible when the controlling value strictly equals this. */
  equals?: FormFieldValue;
  /** Visible when the controlling value does NOT equal this. */
  not_equals?: FormFieldValue;
  /** Visible when the controlling value is one of these. */
  in?: FormFieldValue[];
  /** Visible when the controlling value is truthy (`true`) / falsy (`false`). */
  truthy?: boolean;
}

export function evaluateShowWhen(
  rule: ShowWhen,
  value: FormFieldValue | undefined,
): boolean {
  // `hasOwnProperty` (not a truthiness check) so `equals: false` / `equals: 0`
  // are honoured as real predicates rather than skipped.
  if (Object.prototype.hasOwnProperty.call(rule, "equals")) {
    return value === rule.equals;
  }
  if (Object.prototype.hasOwnProperty.call(rule, "not_equals")) {
    return value !== rule.not_equals;
  }
  if (rule.in) return rule.in.includes(value as FormFieldValue);
  if (rule.truthy !== undefined) return rule.truthy ? !!value : !value;
  return true;
}
