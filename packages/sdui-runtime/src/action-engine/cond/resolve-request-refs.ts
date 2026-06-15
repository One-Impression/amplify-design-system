import { isRefObject, resolveValue, type RefResolveContext } from "./resolve-ref.js";

/**
 * Deep-resolves `{ ref: "$..." }` ref-objects anywhere inside a request value
 * (query_params / request_body / path_params), leaving literals untouched.
 *
 * This is what lets a wire payload bind request fields to request context, e.g.
 *
 *   query_params: { tab: { ref: "$.local.selected_tab" },
 *                   filter: { ref: "$.local.selected_filters" } }
 *
 * Network handlers (bff_call / reload / reload_section) call this on the
 * raw payload fields BEFORE schema-parsing, so the ref-objects become concrete
 * values that the strict `query_params` / `request_body` schemas accept (a
 * `{ ref }` object would otherwise be stripped/rejected by `z.record(z.string())`).
 *
 * Scope is intentionally limited to the request fields — nested on_success /
 * on_error action chains are left intact to resolve at their own dispatch.
 */
export function resolveRequestRefs(value: unknown, ctx: RefResolveContext): unknown {
  if (isRefObject(value)) {
    return resolveValue(value, ctx);
  }
  if (Array.isArray(value)) {
    return value.map((v) => resolveRequestRefs(v, ctx));
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = resolveRequestRefs(v, ctx);
    }
    return out;
  }
  return value;
}

/**
 * Coerces a resolved `query_params` record into the `Record<string, string>`
 * the wire schema requires: array values become comma-separated (`a,b,c`),
 * everything else is `String()`-ed. Keys whose resolved value is null/undefined
 * are dropped (an unbound filter shouldn't send an empty param).
 *
 * CSV (not repeated keys) because the schema is `Record<string, string>` — one
 * string per key. The BFF splits on comma.
 */
export function normalizeQueryParams(
  params: Record<string, unknown> | undefined,
): Record<string, string> | undefined {
  if (!params) return undefined;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === null || v === undefined) continue;
    if (Array.isArray(v)) {
      const items = v.filter((x) => x !== null && x !== undefined).map((x) => String(x));
      // Omit a fully-empty multi-select rather than sending `?filter=`.
      if (items.length > 0) out[k] = items.join(",");
    } else {
      out[k] = String(v);
    }
  }
  return out;
}

/**
 * Binds the request fields of a network action's payload against local request
 * context: deep-resolves `{ ref: "$.local.*" }` (and any other ref form) in
 * `query_params` / `request_body` / `path_params`, then string-coerces the
 * URL-bound records (`query_params` / `path_params`) so they satisfy the wire
 * schemas. Returns a shallow clone — the original payload is not mutated.
 *
 * Pure: callers pass the local store snapshot so this module stays free of
 * store imports. Used by bff_call, reload, and reload_section.
 */
export function bindRequestPayload(
  payload: unknown,
  local: Record<string, unknown>,
): Record<string, unknown> {
  const raw =
    payload && typeof payload === "object" && !Array.isArray(payload)
      ? { ...(payload as Record<string, unknown>) }
      : {};
  const ctx: RefResolveContext = { local };

  if ("query_params" in raw) {
    raw.query_params = normalizeQueryParams(
      resolveRequestRefs(raw.query_params, ctx) as Record<string, unknown> | undefined,
    );
  }
  if ("path_params" in raw) {
    raw.path_params = normalizeQueryParams(
      resolveRequestRefs(raw.path_params, ctx) as Record<string, unknown> | undefined,
    );
  }
  if ("request_body" in raw) {
    raw.request_body = resolveRequestRefs(raw.request_body, ctx);
  }
  return raw;
}
