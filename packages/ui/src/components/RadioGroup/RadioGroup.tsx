import React, { createContext, useCallback, useContext, useId, useMemo, useRef } from 'react';
import { cn } from '../../lib/cn';

export type RadioGroupOrientation = 'horizontal' | 'vertical';

export interface RadioGroupContextValue {
  name: string;
  value: string | null;
  onValueChange: (value: string) => void;
  disabled: boolean;
  readOnly: boolean;
  orientation: RadioGroupOrientation;
  registerRadio: (value: string, el: HTMLButtonElement | null) => void;
  focusByOffset: (currentValue: string, offset: number) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function useRadioGroupContext(component: string): RadioGroupContextValue {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) {
    throw new Error(`<${component}> must be used within a <RadioGroup>`);
  }
  return ctx;
}

export interface RadioGroupProps {
  /** Form name for the radio group (required for native form behaviour). */
  name: string;
  /** Currently selected value (controlled). */
  value?: string | null;
  /** Initial selected value (uncontrolled). */
  defaultValue?: string | null;
  /** Called when the selected value changes. */
  onValueChange?: (value: string) => void;
  /** Layout orientation. Default `vertical`. */
  orientation?: RadioGroupOrientation;
  /** Disable the entire group. Individual `<Radio disabled>` also works. */
  disabled?: boolean;
  /** Read-only — focus + arrow nav still works, but selection cannot change. */
  readOnly?: boolean;
  /** Optional group label (renders as `<legend>`). Improves a11y. */
  label?: string;
  /** Optional error message (renders below the group, sets `aria-invalid`). */
  error?: string;
  /** Optional helper text (renders below the group when no error). */
  helperText?: string;
  /** Children — typically `<Radio>` elements. */
  children: React.ReactNode;
  className?: string;
  id?: string;
}

/**
 * RadioGroup — accessible radio button group with full keyboard navigation.
 *
 * Composition:
 * ```tsx
 * <RadioGroup name="color" value={color} onValueChange={setColor}>
 *   <Radio value="red">Red</Radio>
 *   <Radio value="blue">Blue</Radio>
 * </RadioGroup>
 * ```
 *
 * Keyboard:
 * - Arrow keys cycle through enabled radios (down/right = next, up/left = previous).
 * - Space selects the focused radio.
 * - Tab moves focus into/out of the group (only the selected radio is tabbable).
 */
export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value: controlledValue,
  defaultValue = null,
  onValueChange,
  orientation = 'vertical',
  disabled = false,
  readOnly = false,
  label,
  error,
  helperText,
  children,
  className,
  id,
}) => {
  const generatedId = useId();
  const groupId = id || `radiogroup-${generatedId}`;
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string | null>(defaultValue);
  const value = isControlled ? controlledValue ?? null : uncontrolledValue;

  // Track radio buttons in DOM order so arrow nav can hop between them.
  const radiosRef = useRef<Map<string, HTMLButtonElement>>(new Map());

  const registerRadio = useCallback((radioValue: string, el: HTMLButtonElement | null) => {
    if (el) {
      radiosRef.current.set(radioValue, el);
    } else {
      radiosRef.current.delete(radioValue);
    }
  }, []);

  const handleValueChange = useCallback(
    (next: string) => {
      if (disabled || readOnly) return;
      if (!isControlled) setUncontrolledValue(next);
      onValueChange?.(next);
    },
    [disabled, readOnly, isControlled, onValueChange]
  );

  const focusByOffset = useCallback(
    (currentValue: string, offset: number) => {
      // Walk DOM in registration order — filter out disabled radios.
      const entries = Array.from(radiosRef.current.entries()).filter(
        ([, el]) => !el.hasAttribute('disabled') && el.getAttribute('aria-disabled') !== 'true'
      );
      if (entries.length === 0) return;
      const idx = entries.findIndex(([v]) => v === currentValue);
      if (idx === -1) return;
      const nextIdx = (idx + offset + entries.length) % entries.length;
      const [nextValue, nextEl] = entries[nextIdx];
      nextEl.focus();
      // Roving focus: arrow nav also selects (standard radio behaviour).
      handleValueChange(nextValue);
    },
    [handleValueChange]
  );

  const ctxValue = useMemo<RadioGroupContextValue>(
    () => ({
      name,
      value,
      onValueChange: handleValueChange,
      disabled,
      readOnly,
      orientation,
      registerRadio,
      focusByOffset,
    }),
    [name, value, handleValueChange, disabled, readOnly, orientation, registerRadio, focusByOffset]
  );

  const describedBy = error ? `${groupId}-error` : helperText ? `${groupId}-helper` : undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <span
          id={`${groupId}-label`}
          className="text-[14px] font-medium text-[var(--amp-semantic-text-primary)]"
        >
          {label}
        </span>
      )}
      <div
        id={groupId}
        role="radiogroup"
        aria-labelledby={label ? `${groupId}-label` : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        aria-disabled={disabled || undefined}
        aria-readonly={readOnly || undefined}
        aria-orientation={orientation}
        className={cn(
          'flex',
          orientation === 'vertical' ? 'flex-col gap-2' : 'flex-row flex-wrap gap-4'
        )}
      >
        <RadioGroupContext.Provider value={ctxValue}>{children}</RadioGroupContext.Provider>
      </div>
      {error && (
        <p id={`${groupId}-error`} className="text-[12px] text-[var(--amp-semantic-status-error)]">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${groupId}-helper`} className="text-[12px] text-[var(--amp-semantic-text-muted)]">
          {helperText}
        </p>
      )}
    </div>
  );
};

export interface RadioProps {
  /** Value this radio represents. */
  value: string;
  /** Optional label (defaults to children). */
  label?: React.ReactNode;
  /** Disable just this radio. */
  disabled?: boolean;
  /** Children render to the right of the radio. If provided, used instead of `label`. */
  children?: React.ReactNode;
  className?: string;
  id?: string;
}

/**
 * Radio — single radio button. Must be a descendant of `<RadioGroup>`.
 */
export const Radio: React.FC<RadioProps> = ({
  value,
  label,
  disabled: disabledProp = false,
  children,
  className,
  id,
}) => {
  const ctx = useRadioGroupContext('Radio');
  const generatedId = useId();
  const radioId = id || `radio-${ctx.name}-${value}-${generatedId}`;
  const isSelected = ctx.value === value;
  const disabled = disabledProp || ctx.disabled;
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    ctx.registerRadio(value, buttonRef.current);
    return () => ctx.registerRadio(value, null);
  }, [ctx, value]);

  // Roving tabindex: only the selected radio (or the first if none selected) is tabbable.
  // We approximate "first" by making radios with no group selection tabbable when this is mounted first.
  // To stay correct under StrictMode + dynamic children, we also accept tabindex=0 when nothing is selected.
  const tabIndex = isSelected ? 0 : ctx.value === null ? 0 : -1;

  const handleClick = () => {
    if (disabled || ctx.readOnly) return;
    ctx.onValueChange(value);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const horizontal = ctx.orientation === 'horizontal';
    const nextKeys = horizontal ? ['ArrowRight', 'ArrowDown'] : ['ArrowDown', 'ArrowRight'];
    const prevKeys = horizontal ? ['ArrowLeft', 'ArrowUp'] : ['ArrowUp', 'ArrowLeft'];
    if (nextKeys.includes(e.key)) {
      e.preventDefault();
      ctx.focusByOffset(value, 1);
    } else if (prevKeys.includes(e.key)) {
      e.preventDefault();
      ctx.focusByOffset(value, -1);
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!ctx.readOnly) ctx.onValueChange(value);
    }
  };

  const labelContent = children ?? label;

  return (
    <label
      htmlFor={radioId}
      className={cn(
        'inline-flex items-center gap-2 select-none',
        disabled ? 'opacity-50 cursor-not-allowed' : ctx.readOnly ? 'cursor-default' : 'cursor-pointer',
        className
      )}
    >
      <button
        ref={buttonRef}
        type="button"
        role="radio"
        id={radioId}
        aria-checked={isSelected}
        aria-disabled={disabled || undefined}
        aria-readonly={ctx.readOnly || undefined}
        disabled={disabled}
        tabIndex={tabIndex}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-150',
          'border-[var(--amp-semantic-border-default)] bg-[var(--amp-semantic-bg-surface)]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amp-semantic-border-focus)]',
          isSelected && 'border-[var(--amp-semantic-accent)]',
          disabled && 'cursor-not-allowed'
        )}
      >
        {isSelected && (
          <span
            aria-hidden="true"
            className="w-2.5 h-2.5 rounded-full bg-[var(--amp-semantic-accent)]"
          />
        )}
      </button>
      {/* Hidden native input keeps form submission + autofill working. */}
      <input
        type="radio"
        name={ctx.name}
        value={value}
        checked={isSelected}
        onChange={() => {
          /* handled via the button; keep React happy. */
        }}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      />
      {labelContent !== undefined && labelContent !== null && (
        <span className="text-[14px] text-[var(--amp-semantic-text-primary)]">{labelContent}</span>
      )}
    </label>
  );
};
