import React from 'react';
import { cn } from '../../lib/cn';

export type StepPillStatus = 'pending' | 'active' | 'done';

export interface StepPillItem {
  label: string;
  status: StepPillStatus;
}

export interface StepPillProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: StepPillItem[];
  onStepClick?: (index: number) => void;
}

export const StepPill = React.forwardRef<HTMLDivElement, StepPillProps>(
  ({ steps, onStepClick, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="navigation"
        aria-label="Step progress"
        className={cn('flex items-center gap-2', className)}
        {...props}
      >
        {steps.map((step, index) => {
          const handleClick = onStepClick
            ? () => onStepClick(index)
            : undefined;

          return (
            <button
              key={index}
              type="button"
              onClick={handleClick}
              aria-current={step.status === 'active' ? 'step' : undefined}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-colors border',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--amp-semantic-accent,#6531FF)]/40',
                step.status === 'pending' &&
                  'border-[var(--amp-semantic-border-default,#e5e5e5)] text-[var(--amp-semantic-text-muted,#a3a3a3)] bg-transparent',
                step.status === 'active' &&
                  'border-[var(--amp-semantic-accent,#6531FF)] bg-[var(--amp-semantic-accent,#6531FF)] text-white font-semibold',
                step.status === 'done' &&
                  'border-green-600 bg-green-50 text-green-600'
              )}
            >
              {step.label}
            </button>
          );
        })}
      </div>
    );
  }
);

StepPill.displayName = 'StepPill';
