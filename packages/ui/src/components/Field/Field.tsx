import React, { useEffect, useId } from 'react';
import { cn } from '../../lib/cn';
import { useFormContext } from '../Form/Form';
import { Label } from '../Label/Label';
import { FieldError } from '../FieldError/FieldError';

export type FieldLayout = 'stacked' | 'inline';

/**
 * Props injected into the input slot via the render-prop child. Spreading
 * them onto the underlying primitive (`<Input {...props} />`,
 * `<Select {...props} />`, etc.) wires up id, ARIA, and value plumbing.
 */
export interface FieldRenderProps {
  id: string;
  name: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
  required?: boolean;
}

export interface FieldProps {
  /** Form-state key. Required — used to wire into `<Form>` context. */
  name: string;
  /** Label text rendered above (or beside, for `inline`) the input. */
  label?: React.ReactNode;
  /** Help text rendered below the input when no error is present. */
  hint?: React.ReactNode;
  /** Override error message. Falls back to the form context error for `name`. */
  error?: string;
  /** Mark the field required (renders asterisk + sets aria-required). */
  required?: boolean;
  /** Layout: stacked (default) or inline (label beside input). */
  layout?: FieldLayout;
  /** Optional explicit DOM id. Auto-generated when omitted. */
  id?: string;
  className?: string;
  /**
   * Slot for the input primitive. Receives wired-up props — spread them
   * onto your input.
   *
   * @example
   * <Field name="email" label="Email">
   *   {(props) => <Input {...props} type="email" />}
   * </Field>
   */
  children: (props: FieldRenderProps) => React.ReactNode;
}

/**
 * Composition primitive that pairs a `<Label>`, an input slot, an optional
 * `hint`, and a `<FieldError>` — wiring up `htmlFor`, `id`, and
 * `aria-describedby` automatically. Registers with `<Form>` context (if
 * present) so it can participate in submission and schema validation.
 */
export const Field: React.FC<FieldProps> = ({
  name,
  label,
  hint,
  error: errorProp,
  required = false,
  layout = 'stacked',
  id: idProp,
  className,
  children,
}) => {
  const reactId = useId();
  const form = useFormContext();
  const id = idProp ?? `field-${name}-${reactId}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = `${id}-error`;

  // Resolve error: explicit prop wins, otherwise pull from form context.
  // Errors from the form only show after first submit (ux: don't error on
  // first render).
  const contextError = form?.errors[name];
  const showContextError = form?.hasSubmitted;
  const error = errorProp ?? (showContextError ? contextError : undefined);
  const hasError = Boolean(error);

  // Register with the parent form so it knows this field exists.
  useEffect(() => {
    if (!form) return undefined;
    return form.registerField({ name });
  }, [form, name]);

  // Prefer the error id when both an error and a hint exist — the hint is
  // hidden in that case so referencing its (un-rendered) id would dangle.
  const describedBy = hasError
    ? errorId
    : hint
      ? hintId
      : undefined;

  const renderProps: FieldRenderProps = {
    id,
    name,
    'aria-describedby': describedBy,
    'aria-invalid': hasError || undefined,
    'aria-required': required || undefined,
    required,
  };

  return (
    <div
      className={cn(
        layout === 'inline'
          ? 'flex items-center gap-3 flex-wrap'
          : 'flex flex-col gap-1.5',
        className
      )}
    >
      {label && (
        <Label
          htmlFor={id}
          required={required}
          className={cn(layout === 'inline' && 'shrink-0 min-w-[120px]')}
        >
          {label}
        </Label>
      )}
      <div className={cn(layout === 'inline' ? 'flex-1 min-w-[200px]' : 'w-full', 'flex flex-col gap-1')}>
        {children(renderProps)}
        {hint && !hasError && (
          <p
            id={hintId}
            className="text-[12px] leading-tight text-[var(--amp-semantic-text-muted)]"
          >
            {hint}
          </p>
        )}
        {hasError && <FieldError id={errorId}>{error}</FieldError>}
      </div>
    </div>
  );
};
Field.displayName = 'Field';
