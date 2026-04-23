import React from 'react';
import { cn } from '../../lib/cn';

export type StepPillStatus = 'done' | 'active' | 'pending';

export interface StepPillProps extends React.HTMLAttributes<HTMLButtonElement> {
  label: string;
  status: StepPillStatus;
  onNavigate?: () => void;
}

const statusClasses: Record<StepPillStatus, string> = {
  done: 'text-violet-700 opacity-80',
  active: 'bg-stone-900 text-white',
  pending: 'text-stone-400',
};

export const StepPill = React.forwardRef<HTMLButtonElement, StepPillProps>(
  ({ label, status, onNavigate, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onNavigate}
        disabled={status === 'pending'}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
          'transition-all duration-200',
          'disabled:cursor-not-allowed',
          statusClasses[status],
          className
        )}
        {...props}
      >
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            status === 'done' && 'bg-violet-600',
            status === 'active' && 'bg-white',
            status === 'pending' && 'bg-stone-300'
          )}
          aria-hidden="true"
        />
        {label}
      </button>
    );
  }
);

StepPill.displayName = 'StepPill';
