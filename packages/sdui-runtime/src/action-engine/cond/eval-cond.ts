/**
 * Cond primitive evaluator.
 *
 * Cond primitives are pure predicates over runtime state — they read keys from
 * the local store and compare against a literal or referenced value. They are
 * embedded in guard slots (`action:branch`'s `if`) and may be embedded in
 * future condition slots without schema changes.
 *
 * v1 supports `cond:local` only. New `cond:*` discriminator values extend the
 * `Cond` union additively; renderers that don't recognise the discriminator
 * return `false` per the open-enum rule.
 */
import type { Cond } from "@one-impression/sdk-native-sdui/actions";

/**
 * Reads a key from whatever local-state surface the caller provides.
 *
 * The runtime supplies the live Zustand selector; tests supply a plain map.
 */
export type LocalReader = (key: string) => unknown;

/**
 * Evaluates a `Cond` primitive against the given local-state reader.
 *
 * Unknown discriminator values resolve to `false` so a renderer can ship
 * before its companion primitive — old runtimes simply fail-closed on an
 * unrecognised cond.
 */
export function evaluateCond(cond: Cond, read: LocalReader): boolean {
  switch (cond.type) {
    case "cond:local":
      return evaluateCondLocal(cond, read);
    default:
      return false;
  }
}

function evaluateCondLocal(
  cond: Extract<Cond, { type: "cond:local" }>,
  read: LocalReader,
): boolean {
  const actual = read(cond.key);

  switch (cond.op) {
    case "exists":
      return actual !== undefined && actual !== null;
    case "not_exists":
      return actual === undefined || actual === null;
    case "eq":
      return strictEquals(actual, cond.value);
    case "ne":
      return !strictEquals(actual, cond.value);
    case "gt":
      return compareNumeric(actual, cond.value, (a, b) => a > b);
    case "lt":
      return compareNumeric(actual, cond.value, (a, b) => a < b);
    case "gte":
      return compareNumeric(actual, cond.value, (a, b) => a >= b);
    case "lte":
      return compareNumeric(actual, cond.value, (a, b) => a <= b);
    default:
      return false;
  }
}

/**
 * Strict equality across primitives and shallow structural equality across
 * plain JSON values (arrays, objects). Reference types beyond plain JSON
 * (Map, Set, class instances) fall back to reference equality.
 */
function strictEquals(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object") return false;
  // Plain structural equality via JSON serialisation. Adequate for the
  // primitive values that flow through local state (numbers, strings,
  // booleans, plain records). Tries to fail-closed on circular refs.
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

/**
 * Numeric comparison with explicit type coercion. Returns `false` if either
 * side cannot be parsed as a finite number — gt/lt/gte/lte over non-numerics
 * are meaningless, not implicitly truthy.
 */
function compareNumeric(
  a: unknown,
  b: unknown,
  cmp: (x: number, y: number) => boolean,
): boolean {
  const na = toNumber(a);
  const nb = toNumber(b);
  if (na === null || nb === null) return false;
  return cmp(na, nb);
}

function toNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return null;
}
