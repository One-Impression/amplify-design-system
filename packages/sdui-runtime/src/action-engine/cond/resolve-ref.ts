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
 *   { ref: "$.local.<dotted.path>" }          -> value read from the local store
 *                                                (request context: selected tab,
 *                                                filters, search, cursor, …)
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
  /**
   * Snapshot of the local store's flat data map. Supplied by network handlers
   * (bff_call / reload / reload_section) so request fields can bind to
   * request context (`{ ref: "$.local.selected_filters" }`) at dispatch.
   */
  local?: Record<string, unknown>;
  /** Clock injection point for testing; defaults to `Date.now`. */
  now?: () => number;
}

/**
 * Returns `true` if `v` looks like a ref-object (has a `ref` string property
 * that starts with "$.").
 */
export function isRefObject(
  v: unknown,
): v is { ref: string; n?: number; contains?: unknown } {
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

  const base = resolveRefBase(value, ctx);

  // Predicate modifiers turn the resolved value into a boolean — the basis for
  // reactive selection state:
  //   contains — array membership: { ref:"$.local.selected_filters", contains:"beauty" }
  //              -> selected_filters.includes("beauty"). Multi-select chips.
  //   equals   — scalar equality:  { ref:"$.local.selected_tab", equals:"for_you" }
  //              -> selected_tab === "for_you". Single-select tabs.
  if ("contains" in value) {
    return Array.isArray(base) ? base.includes(value.contains) : false;
  }
  if ("equals" in value) {
    return base === (value as { equals?: unknown }).equals;
  }

  return base;
}

/** Resolves the raw value a ref points at (before any modifier like `contains`). */
function resolveRefBase(
  value: { ref: string; n?: number },
  ctx: RefResolveContext,
): unknown {
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

  if (ref.startsWith("$.local.")) {
    // The local store is keyed by literal (flat) dot-path strings — mirror
    // its `get(key)` semantics with a flat lookup, not pluck-traversal, so
    // `$.local.form.submitted` reads the key "form.submitted" exactly as
    // set_local wrote it.
    const key = ref.slice("$.local.".length);
    if (!ctx.local || !key) return null;
    const v = ctx.local[key];
    return v === undefined ? null : v;
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
