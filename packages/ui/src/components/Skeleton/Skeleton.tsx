import React from 'react';
import { cn } from '../../lib/cn';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rectangular' | 'circular';
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  variant = 'rectangular',
  className,
}) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-neutral-100',
        variant === 'text' && 'rounded h-4',
        variant === 'rectangular' && 'rounded-md',
        variant === 'circular' && 'rounded-full',
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
      aria-hidden="true"
      role="presentation"
    />
  );
};
