import React from 'react';
import { cn } from '../../lib/cn';
import { useDensity, type Density } from '../../lib/density';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /**
   * Override the ambient density set by `<DensityProvider>`. Default is
   * to inherit from context (`comfortable` if no provider).
   */
  density?: Density;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand text-white hover:bg-brand-dark active:bg-brand-dark focus-visible:ring-brand/40 shadow-sm',
  secondary: 'bg-brand-light text-brand hover:bg-brand-light/80 focus-visible:ring-brand/30',
  ghost: 'bg-transparent text-neutral-900 hover:bg-surface-overlay focus-visible:ring-neutral-200',
  destructive: 'bg-negative text-white hover:bg-negative/90 focus-visible:ring-negative/40',
  outline:
    'border border-border bg-transparent text-neutral-900 hover:bg-surface-overlay focus-visible:ring-neutral-200',
};

/**
 * Density × size sizing table. Each row is a density mode; each column is
 * a size. Density only affects height + horizontal padding — text size,
 * gap, and radius are preserved per size for visual consistency. Going
 * one density step up or down adjusts height by 1 step in the spacing
 * scale (h-7 → h-8 → h-10 etc).
 *
 * `comfortable` matches v1.0 sizing exactly — backwards compatible
 * default for any consumer not wrapped in a DensityProvider.
 *
 * `compact` restores h-7 for `sm` — addresses the 1px regression
 * flagged in atmosphere PR-AT2 dense data tables.
 */
const sizeClasses: Record<Density, Record<ButtonSize, string>> = {
  compact: {
    xs: 'h-5 px-1.5 text-xs gap-1 rounded',
    sm: 'h-7 px-2.5 text-sm gap-1.5 rounded-md',
    md: 'h-8 px-3 text-sm gap-2 rounded-md',
    lg: 'h-10 px-5 text-base gap-2 rounded-lg',
  },
  comfortable: {
    xs: 'h-6 px-2 text-xs gap-1 rounded',
    sm: 'h-8 px-3 text-sm gap-1.5 rounded-md',
    md: 'h-10 px-4 text-base gap-2 rounded-md',
    lg: 'h-12 px-6 text-base gap-2 rounded-lg',
  },
  spacious: {
    xs: 'h-7 px-2.5 text-xs gap-1 rounded',
    sm: 'h-9 px-3.5 text-sm gap-1.5 rounded-md',
    md: 'h-11 px-5 text-base gap-2 rounded-md',
    lg: 'h-14 px-7 text-base gap-2 rounded-lg',
  },
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      density: densityOverride,
      loading = false,
      icon,
      iconPosition = 'left',
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const ambientDensity = useDensity();
    const density = densityOverride ?? ambientDensity;
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[density][size],
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {!loading && icon && iconPosition === 'left' && icon}
        {children}
        {!loading && icon && iconPosition === 'right' && icon}
      </button>
    );
  }
);

Button.displayName = 'Button';
