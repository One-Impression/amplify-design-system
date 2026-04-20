import React from 'react';
import { cn } from '../../lib/cn';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, disabled, className, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-[14px] font-medium text-[var(--amp-semantic-text-primary)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${selectId}-error` : undefined}
            className={cn(
              'h-10 px-3 pr-10 rounded-[16px] text-[14px] w-full appearance-none',
              'bg-[var(--amp-semantic-bg-surface)] text-[var(--amp-semantic-text-primary)]',
              'border border-[var(--amp-semantic-border-default)]',
              'focus:outline-none focus:ring-2 focus:ring-[var(--amp-semantic-border-focus)] focus:border-[var(--amp-semantic-border-focus)]',
              'transition-colors duration-150',
              error && 'border-[var(--amp-semantic-status-error)] focus:ring-[var(--amp-semantic-status-error)]',
              disabled && 'opacity-50 cursor-not-allowed bg-[var(--amp-semantic-bg-sunken)]',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--amp-semantic-text-muted)] pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {error && (
          <p id={`${selectId}-error`} className="text-[12px] text-[var(--amp-semantic-status-error)]">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';
