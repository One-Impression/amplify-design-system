/**
 * Pure, declarative field-validation evaluator.
 *
 * Runs the server-declared rule list against a field value and returns the
 * FIRST failing rule's error message (or `null` when valid) — so the wire
 * controls both what is checked and the exact copy shown.
 *
 * DESIGN NOTE (D7): this evaluator is intentionally pure and dependency-free so
 * it can be promoted into `@one-impression/sdk-native-sdui` and imported by BOTH
 * the client (this runtime) and the server — one implementation, zero drift
 * between what the form checks on-device and what the BFF enforces. It lives in
 * the runtime for now (D11: build in the playground, promote the contract later).
 *
 * Convention: only `required` enforces presence. Every format/range rule PASSES
 * on an empty value, so an optional field with a regex doesn't error while blank
 * — emptiness is `required`'s job alone.
 */

/** A single declarative validation rule (wire shape). */
export interface ValidationRule {
  type:
    | "required"
    | "regex"
    | "min_length"
    | "max_length"
    | "min"
    | "max"
    | "min_selected"
    | "max_selected"
    | "match_field";
  /** Message shown when this rule fails. */
  error: string;
  /** `regex`: the JS RegExp source (server provides anchors). */
  pattern?: string;
  /** `regex`: RegExp flags, e.g. "i". */
  flags?: string;
  /** `min`/`max`/`min_length`/`max_length`/`min_selected`/`max_selected`: the bound. */
  value?: number;
  /** `match_field`: the other field name whose value must equal this one. */
  field?: string;
}

/** Field value shapes the evaluator understands. */
export type EvaluableValue =
  | string
  | number
  | boolean
  | string[]
  | Record<string, unknown>
  | null
  | undefined;

/** Optional context for cross-field rules (`match_field`). */
export interface EvaluateContext {
  /** Resolve another field's current value (for `match_field`). */
  getFieldValue?: (fieldName: string) => EvaluableValue;
}

/** Longest string we'll run a regex against (ReDoS guard for untrusted input). */
const MAX_REGEX_INPUT = 2048;

/** True when a value counts as "empty" for presence checks. */
function isEmpty(value: EvaluableValue): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.length === 0;
  if (Array.isArray(value)) return value.length === 0;
  // numbers and booleans are always "present".
  return false;
}

/** Evaluate one rule; returns true when it passes. */
function passes(
  rule: ValidationRule,
  value: EvaluableValue,
  ctx?: EvaluateContext,
): boolean {
  switch (rule.type) {
    case "required":
      return !isEmpty(value);

    case "regex": {
      if (isEmpty(value) || typeof value !== "string" || !rule.pattern) return true;
      if (value.length > MAX_REGEX_INPUT) return false;
      try {
        return new RegExp(rule.pattern, rule.flags).test(value);
      } catch {
        // A malformed server pattern should not block the user — treat as pass
        // and let the server's authoritative validation catch it.
        return true;
      }
    }

    case "min_length":
      if (isEmpty(value) || typeof value !== "string" || rule.value == null) return true;
      return value.length >= rule.value;

    case "max_length":
      if (typeof value !== "string" || rule.value == null) return true;
      return value.length <= rule.value;

    case "min": {
      if (isEmpty(value) || rule.value == null) return true;
      const n = Number(value);
      return Number.isNaN(n) ? true : n >= rule.value;
    }

    case "max": {
      if (isEmpty(value) || rule.value == null) return true;
      const n = Number(value);
      return Number.isNaN(n) ? true : n <= rule.value;
    }

    case "min_selected":
      if (!Array.isArray(value) || rule.value == null) return true;
      return value.length >= rule.value;

    case "max_selected":
      if (!Array.isArray(value) || rule.value == null) return true;
      return value.length <= rule.value;

    case "match_field": {
      if (!rule.field || !ctx?.getFieldValue) return true;
      return value === ctx.getFieldValue(rule.field);
    }

    default:
      // Unknown rule type: don't block the user; the server stays authoritative.
      return true;
  }
}

/**
 * Evaluate a field against its rules. Returns the first failing rule's error,
 * or `null` when every rule passes (or there are no rules).
 */
export function evaluateField(
  rules: ValidationRule[] | undefined,
  value: EvaluableValue,
  ctx?: EvaluateContext,
): string | null {
  if (!rules || rules.length === 0) return null;
  for (const rule of rules) {
    if (!passes(rule, value, ctx)) return rule.error;
  }
  return null;
}
