import React from 'react';
import { cn } from '../../lib/cn';

export interface PackageCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  price: string;
  features: string[];
  selected?: boolean;
  onSelect?: () => void;
}

export const PackageCard = React.forwardRef<HTMLDivElement, PackageCardProps>(
  ({ name, price, features, selected = false, onSelect, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect?.();
          }
        }}
        className={cn(
          'flex flex-col gap-3 rounded-xl border p-5 cursor-pointer transition-all duration-200',
          selected
            ? 'border-violet-600 bg-violet-50'
            : 'border-stone-200 bg-white hover:shadow-lg',
          className
        )}
        {...props}
      >
        <h3 className="text-base font-semibold text-stone-900">{name}</h3>
        <p className="text-2xl font-semibold text-stone-900">{price}</p>
        <ul className="flex flex-col gap-1.5">
          {features.map((f, i) => (
            <li key={i} className="text-sm text-stone-600">{f}</li>
          ))}
        </ul>
      </div>
    );
  }
);

PackageCard.displayName = 'PackageCard';
