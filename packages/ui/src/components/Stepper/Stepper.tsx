import React from 'react';
import { cn } from '../../lib/cn';

export type StepperVariant = 'circles' | 'bars' | 'minimal';
export type StepStatus = 'upcoming' | 'active' | 'completed';

export interface StepItem {
  label: string;
  status: StepStatus;
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: StepItem[];
  variant?: StepperVariant;
  onStepClick?: (index: number) => void;
}

const CircleStep: React.FC<{
  step: StepItem;
  index: number;
  isLast: boolean;
  onClick?: () => void;
}> = ({ step, index, isLast, onClick }) => {
  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-600/40',
          step.status === 'active' && 'bg-violet-600 text-white',
          step.status === 'completed' && 'bg-green-600 text-white',
          step.status === 'upcoming' && 'border-2 border-stone-300 text-stone-400 bg-transparent'
        )}
        aria-current={step.status === 'active' ? 'step' : undefined}
      >
        {step.status === 'completed' ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          index + 1
        )}
      </button>
      <span
        className={cn(
          'ml-2 text-sm font-medium hidden sm:inline',
          step.status === 'active' && 'text-violet-600',
          step.status === 'completed' && 'text-green-600',
          step.status === 'upcoming' && 'text-stone-400'
        )}
      >
        {step.label}
      </span>
      {/* On mobile, show only the active label */}
      {step.status === 'active' && (
        <span className="ml-2 text-sm font-medium text-violet-600 sm:hidden">
          {step.label}
        </span>
      )}
      {!isLast && (
        <div
          className={cn(
            'mx-3 h-px w-8 sm:w-12',
            step.status === 'completed' ? 'bg-green-600' : 'bg-stone-200'
          )}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

const BarStep: React.FC<{
  step: StepItem;
  onClick?: () => void;
}> = ({ step, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex-1 flex flex-col items-center gap-1.5',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-600/40 rounded'
      )}
    >
      <div
        className={cn(
          'w-full h-[3px] rounded-full transition-colors',
          step.status === 'active' && 'bg-violet-600',
          step.status === 'completed' && 'bg-green-600',
          step.status === 'upcoming' && 'bg-stone-200'
        )}
        aria-hidden="true"
      />
      <span
        className={cn(
          'text-xs font-medium',
          step.status === 'active' && 'text-violet-600',
          step.status === 'completed' && 'text-green-600',
          step.status === 'upcoming' && 'text-stone-400'
        )}
      >
        {step.label}
      </span>
    </button>
  );
};

const MinimalStep: React.FC<{
  step: StepItem;
  isLast: boolean;
  onClick?: () => void;
}> = ({ step, isLast, onClick }) => {
  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'text-sm font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-600/40 rounded px-1',
          step.status === 'active' && 'text-violet-600',
          step.status === 'completed' && 'text-green-600',
          step.status === 'upcoming' && 'text-stone-400'
        )}
        aria-current={step.status === 'active' ? 'step' : undefined}
      >
        {step.label}
      </button>
      {!isLast && (
        <svg
          className="mx-1.5 w-4 h-4 text-stone-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      )}
    </div>
  );
};

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ steps, variant = 'circles', onStepClick, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="navigation"
        aria-label="Progress"
        className={cn(
          'flex items-center',
          variant === 'bars' && 'gap-2',
          className
        )}
        {...props}
      >
        {steps.map((step, index) => {
          const handleClick = onStepClick ? () => onStepClick(index) : undefined;
          const isLast = index === steps.length - 1;

          if (variant === 'circles') {
            return (
              <CircleStep
                key={index}
                step={step}
                index={index}
                isLast={isLast}
                onClick={handleClick}
              />
            );
          }

          if (variant === 'bars') {
            return (
              <BarStep
                key={index}
                step={step}
                onClick={handleClick}
              />
            );
          }

          return (
            <MinimalStep
              key={index}
              step={step}
              isLast={isLast}
              onClick={handleClick}
            />
          );
        })}
      </div>
    );
  }
);

Stepper.displayName = 'Stepper';
