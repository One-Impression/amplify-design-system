import React from 'react';
import { cn } from '../../lib/cn';

export interface FieldErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Error message to display. When falsy, the component renders nothing. */
  children?: React.ReactNode;
  /** DOM id — wired up by `<Field>` so `aria-describedby` can reference it. */
  id?: string;
}

/**
 * Inline, accessible error display. Rendered with `role="alert"` so AT
 * announces the error when it appears. Hidden entirely when no message is
 * provided. Uses the Canvas error semantic token for color.
 *
 * Iconography: inline SVG (AlertCircle). Avoids adding a `lucide-react`
 * dependency since no other component in the package uses it yet.
 */
export const FieldError = React.forwardRef<HTMLParagraphElement, FieldErrorProps>(
  ({ children, id, className, ...props }, ref) => {
    if (!children) return null;
    return (
      <p
        ref={ref}
        id={id}
        role="alert"
        aria-live="polite"
        className={cn(
          'flex items-start gap-1.5 text-[12px] leading-tight',
          'text-[var(--amp-semantic-status-error)]',
          'transition-opacity duration-150 ease-out',
          className
        )}
        {...props}
      >
        <svg
          className="h-3.5 w-3.5 mt-0.5 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>{children}</span>
      </p>
    );
  }
);
FieldError.displayName = 'FieldError';
