import React from 'react';
import { cn } from '../../lib/cn';

export type ScrapeStepStatus = 'pending' | 'loading' | 'done';

export interface ScrapeStep {
  label: string;
  status: ScrapeStepStatus;
}

export interface ScrapeAnimationProps extends React.HTMLAttributes<HTMLDivElement> {
  url: string;
  steps: ScrapeStep[];
}

const statusIcon: Record<ScrapeStepStatus, string> = {
  pending: '\u25CB',
  loading: '\u27F3',
  done: '\u2713',
};

export const ScrapeAnimation = React.forwardRef<HTMLDivElement, ScrapeAnimationProps>(
  ({ url, steps, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border border-stone-200 bg-white p-6',
          className
        )}
        {...props}
      >
        <div className="mb-4 flex items-center gap-2 text-xs text-stone-500">
          <svg
            className="h-3.5 w-3.5"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <span className="truncate">{url}</span>
        </div>
        <div className="flex flex-col gap-3">
          {steps.map((step, i) => (
            <div
              key={i}
              className={cn(
                'flex items-center gap-3 text-sm',
                step.status === 'done' && 'text-emerald-600',
                step.status === 'loading' && 'text-stone-900 font-medium',
                step.status === 'pending' && 'text-stone-400'
              )}
            >
              <span
                className={cn(
                  'w-4 text-center',
                  step.status === 'loading' && 'animate-spin'
                )}
                aria-hidden="true"
              >
                {statusIcon[step.status]}
              </span>
              <span>{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

ScrapeAnimation.displayName = 'ScrapeAnimation';
