import React from 'react';
import { cn } from '../../lib/cn';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = 'rectangular', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse bg-[var(--amp-semantic-bg-sunken)]',
          variant === 'text' && 'rounded h-4 w-full',
          variant === 'rectangular' && 'rounded-[16px]',
          variant === 'circular' && 'rounded-full',
          className
        )}
        aria-hidden="true"
        role="presentation"
        {...props}
      />
    );
  }
);
Skeleton.displayName = 'Skeleton';
