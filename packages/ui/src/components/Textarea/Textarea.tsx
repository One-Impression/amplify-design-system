import React from 'react';
import { cn } from '../../lib/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, disabled, className, id, rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-[14px] font-medium text-[var(--amp-semantic-text-primary)]"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          className={cn(
            'px-3 py-2 rounded-[16px] text-[14px] w-full resize-y',
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
          <p id={`${textareaId}-error`} className="text-[12px] text-[var(--amp-semantic-status-error)]">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
