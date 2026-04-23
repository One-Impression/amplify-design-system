import React from 'react';
import { cn } from '../../lib/cn';

export interface TrustItem {
  value: string;
  label: string;
}

export interface TrustBarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TrustItem[];
}

export const TrustBar = React.forwardRef<HTMLDivElement, TrustBarProps>(
  ({ items, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center gap-6',
          'rounded-xl border border-stone-100 bg-stone-50/50 px-6 py-4',
          className
        )}
        {...props}
      >
        {items.map((item, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <div className="h-8 w-px bg-stone-200" aria-hidden="true" />
            )}
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-sm font-semibold text-stone-900">{item.value}</span>
              <span className="text-xs text-stone-500">{item.label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  }
);

TrustBar.displayName = 'TrustBar';
