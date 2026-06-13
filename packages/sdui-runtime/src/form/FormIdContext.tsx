import React, { createContext, useContext } from "react";

/**
 * Carries ONLY the active `form_id` string down the tree — not form state.
 *
 * The `form` snippet provides it so nested input snippets inherit which form
 * they belong to without each declaring it. A field rendered OUTSIDE a form
 * (e.g. an input in a pinned footer or a bottom sheet) can still join a form by
 * carrying `form_id` explicitly in its wire data. Form membership is therefore
 * **logical (by id)**, not positional — which is exactly what lets a submit
 * button outside the form reach the same form state via `useFormStore`.
 *
 * Deliberately id-only: state lives in `useFormStore` (route-agnostic), so this
 * context never causes form-wide re-renders and never needs to reach across
 * routes (a sheet route can't read it — it reads the store by id instead).
 */
export const FormIdContext = createContext<string | null>(null);

/**
 * Resolve the form id for a field: an explicit wire `form_id` wins, else the
 * enclosing form's id from context, else `null` (a standalone, non-form input).
 */
export function useFormId(explicit?: string | null): string | null {
  const fromContext = useContext(FormIdContext);
  return explicit ?? fromContext ?? null;
}
