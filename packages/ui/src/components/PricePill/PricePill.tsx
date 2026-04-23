import React from 'react';
import { cn } from '../../lib/cn';

export interface PricePillProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  value: string;
  visible?: boolean;
}

export const PricePill = React.forwardRef<HTMLDivElement, PricePillProps>(
  ({ label = 'Total', value, visible = true, className, ...props }, ref) => {
    if (!visible) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'fixed bottom-16 right-6 z-50',
          'flex items-center gap-2 rounded-full',
          'border border-stone-200 bg-white px-4 py-2 shadow-lg',
          className
        )}
        {...props}
      >
        <span className="text-xs text-stone-500">{label}</span>
        <span className="text-sm font-medium text-stone-900">{value}</span>
      </div>
    );
  }
);

PricePill.displayName = 'PricePill';
