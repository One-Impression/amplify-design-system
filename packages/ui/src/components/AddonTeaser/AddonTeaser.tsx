import React from 'react';
import { cn } from '../../lib/cn';

export interface AddonItem {
  icon: string;
  label: string;
  badge?: string;
}

export interface AddonTeaserProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  items: AddonItem[];
}

export const AddonTeaser = React.forwardRef<HTMLDivElement, AddonTeaserProps>(
  ({ title, items, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-dashed border-stone-300 bg-stone-50 px-4 py-3',
          className
        )}
        {...props}
      >
        <p className="text-sm font-semibold text-stone-700 mb-2">{title}</p>
        <div className="flex flex-col gap-1.5">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-stone-600">
              <span className="shrink-0" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
              {item.badge && (
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);
AddonTeaser.displayName = 'AddonTeaser';
