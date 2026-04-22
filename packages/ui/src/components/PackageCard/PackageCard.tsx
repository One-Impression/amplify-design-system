import React from 'react';
import { cn } from '../../lib/cn';

export interface PackageCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  description: string;
  price: string;
  selected?: boolean;
  onSelect?: () => void;
}

export const PackageCard = React.forwardRef<HTMLDivElement, PackageCardProps>(
  ({ name, description, price, selected = false, onSelect, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        aria-pressed={selected}
        onClick={onSelect}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && onSelect) {
            e.preventDefault();
            onSelect();
          }
        }}
        className={cn(
          'flex flex-row items-center justify-between rounded-xl px-4 py-3 cursor-pointer transition-all duration-150',
          selected
            ? 'border-2 border-[var(--amp-semantic-border-accent,#6531FF)] bg-[var(--amp-semantic-bg-accent-subtle,#F3EEFF)] shadow-md'
            : 'border border-stone-200 bg-white hover:shadow-md',
          className
        )}
        {...props}
      >
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-semibold text-stone-900">{name}</span>
          <span className="text-xs text-stone-500">{description}</span>
        </div>
        <span
          className={cn(
            'text-sm font-bold shrink-0 ml-4',
            selected
              ? 'text-[var(--amp-semantic-text-accent,#6531FF)]'
              : 'text-stone-900'
          )}
        >
          {price}
        </span>
      </div>
    );
  }
);
PackageCard.displayName = 'PackageCard';
