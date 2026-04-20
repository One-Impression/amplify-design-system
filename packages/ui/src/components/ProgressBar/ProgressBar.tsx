import React from 'react';
import { cn } from '../../lib/cn';

export type ProgressBarVariant = 'default' | 'success' | 'error';

export interface ProgressBarProps {
  value: number;
  variant?: ProgressBarVariant;
  className?: string;
}

const fillColors: Record<ProgressBarVariant, string> = {
  default: 'bg-[var(--amp-semantic-accent)]',
  success: 'bg-[var(--amp-semantic-status-success)]',
  error: 'bg-[var(--amp-semantic-status-error)]',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  variant = 'default',
  className,
}) => {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('w-full h-2 rounded-full bg-[var(--amp-semantic-bg-sunken)] overflow-hidden', className)}
    >
      <div
        className={cn('h-full rounded-full transition-all duration-300', fillColors[variant])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};
