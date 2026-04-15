import React from 'react';
import { cn } from '../../lib/cn';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'ghost';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  children: React.ReactNode;
  as?: 'div' | 'article' | 'section' | 'li';
  onClick?: () => void;
  'aria-label'?: string;
  className?: string;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-surface border border-border rounded-lg shadow-sm',
  elevated: 'bg-surface border border-border rounded-lg shadow-md',
  outlined: 'bg-transparent border-2 border-brand/20 rounded-lg',
  ghost: 'bg-surface-raised rounded-lg',
};

const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  children,
  as: Tag = 'div',
  onClick,
  'aria-label': ariaLabel,
  className,
}) => {
  return (
    <Tag
      className={cn(
        'transition-all duration-150',
        variantClasses[variant],
        paddingClasses[padding],
        onClick && 'cursor-pointer hover:shadow-md active:scale-[0.99]',
        className
      )}
      onClick={onClick}
      aria-label={ariaLabel}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {children}
    </Tag>
  );
};
