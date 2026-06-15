import { isRefObject, resolveValue } from "./resolve-ref.js";

/**
 * Render-time binding resolution — the render-side dual of the request-context
 * binding used by network handlers. A node's `data` field that is a ref-object
 * (`{ ref: "$.local.<key>" }`, optionally with `contains`) is replaced with its
 * value read from the local store, so the node reflects local state reactively:
 * a filter chip's `selected`, a tab's `active`, a count, conditional flags —
 * all update the instant `set_local` runs, with no page/section reload.
 *
 * Top-level fields only (sufficient for the selected/active/visible style of
 * flag these power); nested binding can be added later if a case needs it.
 *
 * Critically: returns the SAME `data` reference when nothing is bound, and
 * otherwise a shallow clone that replaces ONLY the bound keys (unbound keys keep
 * their reference). This lets a shallow-equal subscriber re-render only when a
 * bound value actually changes — non-binding nodes never re-render on unrelated
 * local-store writes.
 */
export function resolveRenderBindings(
  data: Record<string, unknown> | undefined,
  local: Record<string, unknown>,
): Record<string, unknown> | undefined {
  if (!data || typeof data !== "object") return data;
  let cloned: Record<string, unknown> | undefined;
  for (const [key, value] of Object.entries(data)) {
    if (isRefObject(value)) {
      if (!cloned) cloned = { ...data };
      cloned[key] = resolveValue(value, { local });
    }
  }
  return cloned ?? data;
}

/** True if the data object has any top-level render binding (a `$.`-ref field). */
export function hasRenderBindings(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  return Object.values(data as Record<string, unknown>).some(isRefObject);
}
