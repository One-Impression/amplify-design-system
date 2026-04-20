import React from 'react';
import { cn } from '../../lib/cn';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = 'rectangular', width, height, className, style, ...props }, ref) => {
    const sizeStyle: React.CSSProperties = {
      ...style,
      ...(width != null ? { width: typeof width === 'number' ? `${width}px` : width } : {}),
      ...(height != null ? { height: typeof height === 'number' ? `${height}px` : height } : {}),
    };

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
        style={sizeStyle}
        aria-hidden="true"
        role="presentation"
        {...props}
      />
    );
  }
);
Skeleton.displayName = 'Skeleton';
