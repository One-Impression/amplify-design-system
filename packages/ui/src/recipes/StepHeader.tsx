import React from 'react';
import { cn } from '../lib/cn';
import { Stepper } from '../components/Stepper';
import type { StepItem } from '../components/Stepper';

export interface StepHeaderProps {
  steps: StepItem[];
  title: string;
  description?: string;
  /** Optional small "help" line under the title (shortcut hint, support link, etc.). */
  help?: React.ReactNode;
  /** Slot rendered to the right of the title (e.g., progress count, save status). */
  rightSlot?: React.ReactNode;
  /** Forwarded to Stepper.onStepClick — usually disabled in linear flows. */
  onStepClick?: (index: number) => void;
  className?: string;
}

/**
 * StepHeader — Stepper + Heading + Help recipe.
 * Wizard / multi-step form header. Renders the progress indicator above the
 * page title, with optional help text and right-aligned slot.
 */
export const StepHeader: React.FC<StepHeaderProps> = ({
  steps,
  title,
  description,
  help,
  rightSlot,
  onStepClick,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-4 pb-4', className)}>
      <Stepper steps={steps} onStepClick={onStepClick} />
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <h1 className="text-[22px] font-semibold text-[var(--amp-semantic-text-primary)] truncate">
            {title}
          </h1>
          {description && (
            <p className="text-[14px] text-[var(--amp-semantic-text-secondary)]">{description}</p>
          )}
          {help && (
            <div className="text-[12px] text-[var(--amp-semantic-text-muted)] mt-1">{help}</div>
          )}
        </div>
        {rightSlot && <div className="flex-shrink-0">{rightSlot}</div>}
      </div>
    </div>
  );
};
