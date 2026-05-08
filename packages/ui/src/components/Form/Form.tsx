import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '../../lib/cn';

/**
 * Minimal structural type that matches the shape of `z.ZodSchema['safeParse']`.
 *
 * We intentionally do NOT import from `zod` so the UI package stays free of
 * a runtime dep — any object that exposes a `safeParse` method (zod, valibot
 * adapters, custom shims) will work. A real `z.ZodSchema` satisfies this
 * interface structurally.
 */
export interface FormSchemaIssue {
  path: ReadonlyArray<string | number>;
  message: string;
}

export interface FormSchemaError {
  issues: ReadonlyArray<FormSchemaIssue>;
}

export interface FormSchemaResult<T> {
  success: boolean;
  data?: T;
  error?: FormSchemaError;
}

export interface FormSchema<T = Record<string, unknown>> {
  safeParse: (input: unknown) => FormSchemaResult<T>;
}

export type FormValues = Record<string, unknown>;

export interface FormSubmitPayload<T extends FormValues = FormValues> {
  values: T;
  isValid: boolean;
}

interface RegisteredField {
  name: string;
  /** Read the field's current DOM value. Optional — fields may instead push
   *  via `setValue`. When both are present, `getValue` wins on submit. */
  getValue?: () => unknown;
}

export interface FormContextValue<T extends FormValues = FormValues> {
  values: T;
  errors: Readonly<Record<string, string | undefined>>;
  setValue: (name: string, value: unknown) => void;
  registerField: (field: RegisteredField) => () => void;
  /** Stable id used to namespace generated DOM ids. */
  formId: string;
  /** True if the form has been submitted at least once — controls whether
   *  errors are shown on first render. */
  hasSubmitted: boolean;
}

const FormContext = createContext<FormContextValue | null>(null);

export function useFormContext<T extends FormValues = FormValues>(): FormContextValue<T> | null {
  return useContext(FormContext) as FormContextValue<T> | null;
}

export interface FormProps<T extends FormValues = FormValues>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'defaultValue'> {
  /**
   * Optional schema (e.g. a zod schema) used to validate values on submit.
   * Any object exposing `safeParse(input) => { success, data?, error? }`
   * is accepted — see `FormSchema`.
   */
  schema?: FormSchema<T>;
  /** Initial field values. Fields may also seed themselves via `setValue`. */
  defaultValues?: Partial<T>;
  /**
   * Called after submit with the collected values and validity flag.
   * The form does NOT prevent submission on invalid — the consumer
   * decides how to handle `isValid: false`.
   */
  onSubmit?: (payload: FormSubmitPayload<T>) => void | Promise<void>;
  /**
   * If true (default), show field errors only after the first submit.
   * If false, errors are evaluated and shown on every value change.
   */
  validateOnSubmitOnly?: boolean;
  children: React.ReactNode;
}

/**
 * Form scaffolding primitive — owns submission lifecycle, optional schema
 * validation, and a context that `<Field>` instances register against.
 *
 * Stays React state + zod-shape only — does NOT bring in `react-hook-form`
 * or any heavy form library.
 */
export function Form<T extends FormValues = FormValues>({
  schema,
  defaultValues,
  onSubmit,
  validateOnSubmitOnly = true,
  children,
  className,
  noValidate = true,
  id,
  ...rest
}: FormProps<T>) {
  const reactId = React.useId();
  const formId = id ?? `form-${reactId}`;
  const [values, setValues] = useState<FormValues>(() => ({
    ...((defaultValues as FormValues | undefined) ?? {}),
  }));
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const fieldsRef = useRef<Map<string, RegisteredField>>(new Map());

  const setValue = useCallback(
    (name: string, value: unknown) => {
      setValues((prev) => {
        if (prev[name] === value) return prev;
        return { ...prev, [name]: value };
      });
      if (!validateOnSubmitOnly) {
        // Clear stale error for this field; full re-validate happens lazily
        // on submit to avoid running zod on every keystroke.
        setErrors((prev) => {
          if (!prev[name]) return prev;
          const next = { ...prev };
          delete next[name];
          return next;
        });
      }
    },
    [validateOnSubmitOnly]
  );

  const registerField = useCallback((field: RegisteredField) => {
    fieldsRef.current.set(field.name, field);
    return () => {
      fieldsRef.current.delete(field.name);
    };
  }, []);

  const collectValues = useCallback((): FormValues => {
    const collected: FormValues = { ...values };
    fieldsRef.current.forEach((field) => {
      if (field.getValue) {
        collected[field.name] = field.getValue();
      }
    });
    return collected;
  }, [values]);

  const validate = useCallback(
    (vals: FormValues): { isValid: boolean; errors: Record<string, string> } => {
      if (!schema) return { isValid: true, errors: {} };
      const result = schema.safeParse(vals);
      if (result.success) return { isValid: true, errors: {} };
      const errs: Record<string, string> = {};
      result.error?.issues.forEach((issue) => {
        const key = issue.path.length ? String(issue.path[0]) : '_form';
        if (!errs[key]) errs[key] = issue.message;
      });
      return { isValid: false, errors: errs };
    },
    [schema]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setHasSubmitted(true);
      const collected = collectValues();
      const { isValid, errors: nextErrors } = validate(collected);
      setErrors(nextErrors);
      if (onSubmit) {
        await onSubmit({ values: collected as T, isValid });
      }
    },
    [collectValues, onSubmit, validate]
  );

  const ctx = useMemo<FormContextValue<T>>(
    () => ({
      values: values as T,
      errors,
      setValue,
      registerField,
      formId,
      hasSubmitted,
    }),
    [values, errors, setValue, registerField, formId, hasSubmitted]
  );

  return (
    <FormContext.Provider value={ctx as unknown as FormContextValue}>
      <form
        id={formId}
        noValidate={noValidate}
        onSubmit={handleSubmit}
        className={cn('flex flex-col gap-4', className)}
        {...rest}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}
Form.displayName = 'Form';
