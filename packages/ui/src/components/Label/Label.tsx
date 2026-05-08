import React from 'react';
import { cn } from '../../lib/cn';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * If true, append a visible asterisk after the label text. The asterisk
   * itself is `aria-hidden` — required state is communicated to assistive
   * tech via `aria-required` on the associated input.
   */
  required?: boolean;
  /** When false, render with `text-secondary` instead of `text-primary`. */
  emphasis?: 'primary' | 'secondary';
  children: React.ReactNode;
}

/**
 * Standalone, design-system-aligned `<label>`. Used by `<Field>` internally
 * and exported for ad-hoc cases (e.g. labelling a Checkbox group).
 */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ required = false, emphasis = 'primary', children, className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'text-[14px] font-medium leading-tight',
          emphasis === 'primary'
            ? 'text-[var(--amp-semantic-text-primary)]'
            : 'text-[var(--amp-semantic-text-secondary)]',
          className
        )}
        {...props}
      >
        {children}
        {required && (
          <span
            aria-hidden="true"
            className="ml-0.5 text-[var(--amp-semantic-status-error)]"
          >
            *
          </span>
        )}
      </label>
    );
  }
);
Label.displayName = 'Label';
