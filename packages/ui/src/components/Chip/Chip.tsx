import React from 'react';
import { cn } from '../../lib/cn';

export type ChipVariant = 'default' | 'selected' | 'outline';
export type ChipSize = 'sm' | 'md';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ChipVariant;
  size?: ChipSize;
  removable?: boolean;
  onRemove?: () => void;
  icon?: React.ReactNode;
}

const variantClasses: Record<ChipVariant, string> = {
  default:
    'border border-stone-200 bg-white text-stone-600 hover:bg-stone-50',
  selected:
    'border border-violet-600 bg-violet-600 text-white hover:bg-violet-700',
  outline:
    'border border-violet-200 bg-transparent text-violet-600 hover:bg-violet-50',
};

const sizeClasses: Record<ChipSize, string> = {
  sm: 'text-xs px-2.5 py-0.5 gap-1',
  md: 'text-sm px-3 py-1 gap-1.5',
};

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      variant = 'default',
      size = 'md',
      removable = false,
      onRemove,
      icon,
      children,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        onClick(e);
      }
    };

    const handleRemove = (e: React.MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation();
      onRemove?.();
    };

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        className={cn(
          'inline-flex items-center rounded-full font-medium transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-600/40',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {icon && <span className="flex-shrink-0" aria-hidden="true">{icon}</span>}
        {children}
        {removable && (
          <span
            role="button"
            tabIndex={-1}
            onClick={handleRemove}
            className={cn(
              'flex-shrink-0 ml-0.5 rounded-full p-0.5 transition-colors',
              'hover:bg-black/10',
              variant === 'selected' && 'hover:bg-white/20'
            )}
            aria-label="Remove"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        )}
      </button>
    );
  }
);

Chip.displayName = 'Chip';
