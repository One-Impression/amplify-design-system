import React from 'react';
import { cn } from '../../lib/cn';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, disabled, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[14px] font-medium text-[var(--amp-semantic-text-primary)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={cn(
            'h-10 px-3 rounded-[16px] text-[14px] w-full',
            'bg-[var(--amp-semantic-bg-surface)] text-[var(--amp-semantic-text-primary)]',
            'border border-[var(--amp-semantic-border-default)]',
            'placeholder:text-[var(--amp-semantic-text-muted)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--amp-semantic-border-focus)] focus:border-[var(--amp-semantic-border-focus)]',
            'transition-colors duration-150',
            error && 'border-[var(--amp-semantic-status-error)] focus:ring-[var(--amp-semantic-status-error)]',
            disabled && 'opacity-50 cursor-not-allowed bg-[var(--amp-semantic-bg-sunken)]',
            className
          )}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-[12px] text-[var(--amp-semantic-status-error)]">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="text-[12px] text-[var(--amp-semantic-text-muted)]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
