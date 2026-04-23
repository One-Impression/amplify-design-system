import React from 'react';
import { cn } from '../../lib/cn';

export interface AddonTeaserProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  price: string;
}

export const AddonTeaser = React.forwardRef<HTMLDivElement, AddonTeaserProps>(
  ({ title, description, price, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between rounded-xl border border-dashed border-stone-200 bg-stone-50/50 p-4',
          className
        )}
        {...props}
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-stone-900">{title}</span>
          <span className="text-xs text-stone-500">{description}</span>
        </div>
        <span className="text-sm font-medium text-stone-700">{price}</span>
      </div>
    );
  }
);

AddonTeaser.displayName = 'AddonTeaser';
