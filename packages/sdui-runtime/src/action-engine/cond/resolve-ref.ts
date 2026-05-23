/**
 * Reference-object resolution for `set_local.value` (and any future slot that
 * accepts ref-shape inputs).
 *
 * A ref-object has shape `{ ref: "$..." }`, optionally with `n: number` for
 * forms that take an argument. v1 forms:
 *
 *   { ref: "$.now" }                          -> current epoch ms (Date.now())
 *   { ref: "$.now_minus_seconds", n: number } -> epoch ms shifted into the past
 *   { ref: "$.response.<dotted.path>" }       -> value plucked from chaining
 *                                                bff_call's response object
 *   { ref: "$.payload.<dotted.path>" }        -> value plucked from triggering
 *                                                Action's own payload
 *
 * Unresolved refs (unknown form, path miss, or the runtime didn't pass the
 * `response` / `payload` context) evaluate to `null`. Static-determinable
 * misses are BLOCKed at the BFF layer by reviewer rule
 * `bff-set-local-ref-resolvable`; the runtime fails open with `null` on the
 * dynamic ones rather than throwing, matching the open-enum rule for
 * forward-compatible ref forms.
 */

export interface RefResolveContext {
  /** The chaining bff_call's response body, if any. */
  response?: unknown;
  /** The triggering Action's own payload, if any. */
  payload?: unknown;
  /** Clock injection point for testing; defaults to `Date.now`. */
  now?: () => number;
}

/**
 * Returns `true` if `v` looks like a ref-object (has a `ref` string property
 * that starts with "$.").
 */
export function isRefObject(v: unknown): v is { ref: string; n?: number } {
  return (
    typeof v === "object" &&
    v !== null &&
    "ref" in v &&
    typeof (v as { ref: unknown }).ref === "string" &&
    (v as { ref: string }).ref.startsWith("$.")
  );
}

/**
 * Resolves a value that may be a literal OR a ref-object. Literals pass
 * through unchanged. Ref-objects are dispatched per their `ref` prefix.
 */
export function resolveValue(
  value: unknown,
  ctx: RefResolveContext = {},
): unknown {
  if (!isRefObject(value)) return value;

  const { ref, n } = value;
  const now = ctx.now ?? Date.now;

  if (ref === "$.now") {
    return now();
  }

  if (ref === "$.now_minus_seconds") {
    if (typeof n !== "number" || !Number.isFinite(n)) return null;
    return now() - n * 1000;
  }

  if (ref.startsWith("$.response.")) {
    return pluck(ctx.response, ref.slice("$.response.".length));
  }

  if (ref.startsWith("$.payload.")) {
    return pluck(ctx.payload, ref.slice("$.payload.".length));
  }

  // Unknown ref form — fail open with null.
  return null;
}

/**
 * Plucks a dotted path from a value. Returns `null` if any intermediate
 * segment is missing or non-indexable. Numeric path segments index into
 * arrays.
 */
function pluck(source: unknown, dottedPath: string): unknown {
  if (source === undefined || source === null) return null;
  if (!dottedPath) return null;

  const segments = dottedPath.split(".");
  let cursor: unknown = source;

  for (const seg of segments) {
    if (cursor === undefined || cursor === null) return null;
    if (typeof cursor !== "object") return null;

    if (Array.isArray(cursor)) {
      const idx = Number(seg);
      if (!Number.isInteger(idx) || idx < 0 || idx >= cursor.length) return null;
      cursor = cursor[idx];
    } else {
      cursor = (cursor as Record<string, unknown>)[seg];
    }
  }

  return cursor === undefined ? null : cursor;
}
