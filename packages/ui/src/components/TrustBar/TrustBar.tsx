import React from 'react';
import { cn } from '../../lib/cn';

export interface TrustItem {
  icon: string;
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
          'border-t border-[var(--amp-semantic-border-default,#e5e5e5)] pt-3',
          className
        )}
        {...props}
      >
        {items.map((item, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1.5 text-xs text-[var(--amp-semantic-text-muted,#a3a3a3)]"
          >
            <span aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </span>
        ))}
      </div>
    );
  }
);

TrustBar.displayName = 'TrustBar';
