import React from 'react';
import { cn } from '../../lib/cn';

export type IconButtonVariant = 'default' | 'ghost' | 'outline';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  label: string;
}

const variantClasses: Record<IconButtonVariant, string> = {
  default:
    'bg-[var(--amp-semantic-bg-raised)] text-[var(--amp-semantic-text-primary)] hover:bg-[var(--amp-semantic-bg-sunken)] border border-[var(--amp-semantic-border-default)]',
  ghost:
    'bg-transparent text-[var(--amp-semantic-text-secondary)] hover:bg-[var(--amp-semantic-bg-raised)] hover:text-[var(--amp-semantic-text-primary)]',
  outline:
    'bg-transparent border border-[var(--amp-semantic-border-default)] text-[var(--amp-semantic-text-primary)] hover:bg-[var(--amp-semantic-bg-raised)]',
};

const sizeClasses: Record<IconButtonSize, string> = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, variant = 'default', size = 'md', label, disabled, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center rounded-[12px] transition-colors duration-150',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amp-semantic-border-focus)]',
          variantClasses[variant],
          sizeClasses[size],
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {icon}
      </button>
    );
  }
);
IconButton.displayName = 'IconButton';
