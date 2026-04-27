import React from 'react';
import { cn } from '../../lib/cn';

export interface PricePillProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  amount: string;
  visible?: boolean;
}

export const PricePill = React.forwardRef<HTMLDivElement, PricePillProps>(
  ({ label = 'Est.', amount, visible = true, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'fixed bottom-[60px] left-1/2 -translate-x-1/2 z-50',
          'inline-flex items-center gap-1.5 px-4 py-2',
          'rounded-full border border-[var(--amp-semantic-border-default,#e5e5e5)]',
          'bg-white shadow-lg',
          'transition-all duration-300 ease-in-out',
          visible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-2 pointer-events-none',
          className
        )}
        aria-live="polite"
        {...props}
      >
        <span className="text-sm text-[var(--amp-semantic-text-muted,#a3a3a3)]">
          {label}
        </span>
        <span className="text-sm font-semibold text-[var(--amp-semantic-accent,#6531FF)]">
          {amount}
        </span>
      </div>
    );
  }
);

PricePill.displayName = 'PricePill';
