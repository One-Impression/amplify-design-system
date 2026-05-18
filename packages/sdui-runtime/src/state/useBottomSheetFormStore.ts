/**
 * useBottomSheetFormStore — Zustand store for bottom sheet form data.
 *
 * Manages form values + validation state for forms rendered inside
 * bottom sheets. Separate from the sheet data store because form
 * state has different lifecycle (user edits vs server-provided data).
 *
 * Mirrors the legacy Redux bottomSheetForm slice.
 */
import { create } from 'zustand';

/** Validation error for a single form field. */
export interface FieldValidationError {
  field: string;
  message: string;
}

export interface BottomSheetFormState {
  /** Form values keyed by field name. */
  values: Record<string, unknown>;
  /** Fields that have been touched by the user. */
  touched: Record<string, boolean>;
  /** Validation errors per field. */
  errors: Record<string, string>;
  /** Whether the form is currently submitting. */
  submitting: boolean;
  /** Whether the form has been submitted at least once. */
  submitted: boolean;
}

export interface BottomSheetFormActions {
  /** Set a single field value. */
  setField: (field: string, value: unknown) => void;
  /** Set multiple field values at once. */
  setFields: (values: Record<string, unknown>) => void;
  /** Mark a field as touched. */
  touch: (field: string) => void;
  /** Set validation errors. */
  setErrors: (errors: FieldValidationError[]) => void;
  /** Clear a specific field's error. */
  clearError: (field: string) => void;
  /** Set submitting state. */
  setSubmitting: (submitting: boolean) => void;
  /** Mark form as submitted. */
  markSubmitted: () => void;
  /** Reset form to initial state. */
  reset: (initialValues?: Record<string, unknown>) => void;
}

const initialState: BottomSheetFormState = {
  values: {},
  touched: {},
  errors: {},
  submitting: false,
  submitted: false,
};

export const useBottomSheetFormStore = create<
  BottomSheetFormState & BottomSheetFormActions
>((set) => ({
  ...initialState,

  setField: (field, value) =>
    set((state) => ({
      values: { ...state.values, [field]: value },
    })),

  setFields: (values) =>
    set((state) => ({
      values: { ...state.values, ...values },
    })),

  touch: (field) =>
    set((state) => ({
      touched: { ...state.touched, [field]: true },
    })),

  setErrors: (errors) =>
    set({
      errors: Object.fromEntries(errors.map((e) => [e.field, e.message])),
    }),

  clearError: (field) =>
    set((state) => {
      const { [field]: _, ...rest } = state.errors;
      return { errors: rest };
    }),

  setSubmitting: (submitting) => set({ submitting }),

  markSubmitted: () => set({ submitted: true }),

  reset: (initialValues) =>
    set({
      ...initialState,
      values: initialValues ?? {},
    }),
}));
