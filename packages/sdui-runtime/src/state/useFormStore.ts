/**
 * useFormStore — Zustand store for SDUI form state, keyed by `form_id`.
 *
 * The single source of truth for every server-driven form on a screen. Unlike a
 * React-context-per-form (which can't reach a submit button rendered in a
 * sibling bottom-sheet route, and forces one form per provider), this is a
 * module-level store keyed by `form_id`, so:
 *   - a submit button **anywhere** (pinned footer, header, a sheet route) reads
 *     the form's values by id — position in the tree is irrelevant;
 *   - **N independent forms** can coexist on one screen under distinct ids.
 *
 * Mirrors the grain of `useBottomSheetStore` / `useNavigationStackStore`
 * (register on mount, unregister on page unmount). Supersedes the unwired
 * single-form `useBottomSheetFormStore`.
 *
 * Lifecycle:
 *   - `register(formId)` — the `form` snippet (or any field) on mount; idempotent,
 *     never clobbers an existing entry (so a re-render doesn't wipe user edits).
 *   - `setField` / `setTouched` — field components as the user edits.
 *   - `setErrors` — the validation orchestration (client rules) AND the submit
 *     `on_error` path (server 4xx field errors) — one error map, two sources.
 *   - `getForm(formId)` — imperative read for the `submit` action when it
 *     assembles the request body.
 *   - `reset(formId)` — on submit success.
 *   - `unregister(formId)` — page unmount.
 */
import { create } from 'zustand';

/**
 * A single field's value. Scalars for text/number/toggle, `string[]` for
 * multiselect, a nested record for composite fields (address, date-range).
 * Untouched fields submit as `""` / `[]` (never omitted) — see design D5.
 */
export type FormFieldValue =
  | string
  | number
  | boolean
  | string[]
  | Record<string, unknown>
  | null;

/** Per-form record held in the registry, keyed by field name. */
export interface FormEntry {
  /** Current field values keyed by `field_name`. */
  values: Record<string, FormFieldValue>;
  /** Fields the user has interacted with — gates whether an error is shown. */
  touched: Record<string, boolean>;
  /**
   * Current per-field error message (or `null`/absent when valid). Written by
   * both client-side validation and server 4xx responses, so the field renderer
   * has one place to read from.
   */
  errors: Record<string, string | null>;
}

export interface FormStoreState {
  /** All forms on the current screen, keyed by `form_id`. */
  forms: Record<string, FormEntry>;
}

export interface FormStoreActions {
  /**
   * Create an empty entry for `formId` if absent. Idempotent and
   * non-destructive — re-registering an already-populated form is a no-op, so a
   * page/section re-render never wipes what the user has typed.
   */
  register: (formId: string) => void;
  /** Remove a form entirely (values, touched, errors). Called on page unmount. */
  unregister: (formId: string) => void;
  /** Set one field's value (auto-creates the form entry if it doesn't exist). */
  setField: (formId: string, field: string, value: FormFieldValue) => void;
  /** Mark a field touched (auto-creates the form entry). */
  setTouched: (formId: string, field: string) => void;
  /**
   * Mark every known field of a form touched at once. Used by the submit
   * action's validate-on-submit gate to reveal all errors before aborting.
   */
  touchAll: (formId: string) => void;
  /**
   * Replace the form's error map. A `null` value clears that field's error.
   * Used by client validation (per-field, as the user edits) and by the submit
   * `on_error` path (bulk, from a server 4xx).
   */
  setErrors: (formId: string, errors: Record<string, string | null>) => void;
  /** Imperative read of a form's current entry (fresh; used by the submit action). */
  getForm: (formId: string) => FormEntry | undefined;
  /** Reset a form to empty (values/touched/errors). Called on submit success. */
  reset: (formId: string) => void;
}

const EMPTY_ENTRY: FormEntry = { values: {}, touched: {}, errors: {} };

/** Return the existing entry or a fresh empty one (never mutates state). */
function entryOf(
  forms: Record<string, FormEntry>,
  formId: string,
): FormEntry {
  return forms[formId] ?? EMPTY_ENTRY;
}

export const useFormStore = create<FormStoreState & FormStoreActions>(
  (set, get) => ({
    forms: {},

    register: (formId) =>
      set((state) =>
        // Non-destructive: only seed an empty entry when none exists.
        state.forms[formId]
          ? state
          : { forms: { ...state.forms, [formId]: { values: {}, touched: {}, errors: {} } } },
      ),

    unregister: (formId) =>
      set((state) => {
        if (!state.forms[formId]) return state;
        const { [formId]: _removed, ...rest } = state.forms;
        return { forms: rest };
      }),

    setField: (formId, field, value) =>
      set((state) => {
        const prev = entryOf(state.forms, formId);
        return {
          forms: {
            ...state.forms,
            [formId]: { ...prev, values: { ...prev.values, [field]: value } },
          },
        };
      }),

    setTouched: (formId, field) =>
      set((state) => {
        const prev = entryOf(state.forms, formId);
        if (prev.touched[field]) return state;
        return {
          forms: {
            ...state.forms,
            [formId]: { ...prev, touched: { ...prev.touched, [field]: true } },
          },
        };
      }),

    setErrors: (formId, errors) =>
      set((state) => {
        const prev = entryOf(state.forms, formId);
        return {
          forms: {
            ...state.forms,
            [formId]: { ...prev, errors: { ...prev.errors, ...errors } },
          },
        };
      }),

    touchAll: (formId) =>
      set((state) => {
        const prev = state.forms[formId];
        if (!prev) return state;
        const touched = { ...prev.touched };
        for (const key of Object.keys(prev.values)) touched[key] = true;
        return {
          forms: { ...state.forms, [formId]: { ...prev, touched } },
        };
      }),

    getForm: (formId) => get().forms[formId],

    reset: (formId) =>
      set((state) => ({
        forms: { ...state.forms, [formId]: { values: {}, touched: {}, errors: {} } },
      })),
  }),
);

/**
 * Derived validity for a form: valid when every tracked error is falsy.
 *
 * NOT stored — computed from the error map so it can't drift. The submit button
 * subscribes via `useFormStore(s => selectFormIsValid(s, formId))`, so it
 * re-renders only when validity actually flips, not on every keystroke.
 *
 * Note: validity is only meaningful once the validation orchestration has run
 * rules for all fields and populated `errors` (a field whose rules haven't run
 * has no error entry and is treated as valid). That orchestration lands with the
 * validation phase; the store just exposes the derivation.
 */
export function selectFormIsValid(
  state: FormStoreState,
  formId: string,
): boolean {
  const entry = state.forms[formId];
  if (!entry) return true;
  return Object.values(entry.errors).every((e) => !e);
}
