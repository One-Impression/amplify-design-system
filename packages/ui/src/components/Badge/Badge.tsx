import React from 'react';
import { cn } from '../../lib/cn';

export type BadgeVariant = 'default' | 'brand' | 'positive' | 'negative' | 'warning' | 'neutral';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-surface-overlay text-neutral-900 border border-border',
  brand: 'bg-brand-light text-brand border border-brand/20',
  positive: 'bg-positive-light text-positive border border-positive/20',
  negative: 'bg-negative-light text-negative border border-negative/20',
  warning: 'bg-warning-light text-warning border border-warning/20',
  neutral: 'bg-neutral-100 text-neutral-700 border border-border',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-0.5 rounded',
  md: 'text-sm px-2.5 py-1 rounded-md',
};

const dotColorMap: Partial<Record<BadgeVariant, string>> = {
  positive: 'bg-positive',
  negative: 'bg-negative',
  warning: 'bg-warning',
  brand: 'bg-brand',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  className,
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium whitespace-nowrap',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            dotColorMap[variant] || 'bg-neutral-700'
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};
