import React from 'react';
import { cn } from '../../lib/cn';
import { Card } from '../Card';

/**
 * PackageCard — opinionated preset wrapper around `<Card>` for the horizontal
 * "name + description ←→ price" pattern used in package pickers.
 *
 * Backward-compatible: existing public props are preserved exactly.
 * Migration hint: see `component-status.json` (`replacedBy: "Card"`).
 */

export interface PackageCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  description: string;
  price: string;
  selected?: boolean;
  onSelect?: () => void;
}

export const PackageCard = React.forwardRef<HTMLDivElement, PackageCardProps>(
  ({ name, description, price, selected = false, onSelect, className, ...props }, ref) => {
    const selectionClasses = selected
      ? 'border-2 border-[var(--amp-semantic-border-accent,#6531FF)] bg-[var(--amp-semantic-bg-accent-subtle,#F3EEFF)] shadow-md'
      : 'border border-stone-200 bg-white hover:shadow-md';

    return (
      <Card
        ref={ref as React.Ref<HTMLElement>}
        variant="default"
        padding="none"
        onClick={onSelect}
        aria-pressed={selected}
        className={cn(
          'flex flex-row items-center justify-between rounded-xl px-4 py-3 transition-all duration-150',
          selectionClasses,
          className,
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
              : 'text-stone-900',
          )}
        >
          {price}
        </span>
      </Card>
    );
  },
);
PackageCard.displayName = 'PackageCard';
