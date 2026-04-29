'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { cn } from '../../lib/cn';
import { Stepper, type StepStatus } from '../Stepper/Stepper';

export type WizardVariant = 'linear' | 'non-linear';
export type WizardOrientation = 'horizontal' | 'vertical';

export interface WizardStep {
  /** Stable identifier for the step. */
  id: string;
  /** Visible step label. */
  label: string;
  /** Optional sub-heading shown above the body. */
  heading?: React.ReactNode;
  /** Optional description shown under the heading. */
  description?: React.ReactNode;
  /** Step body content. */
  body: React.ReactNode;
  /** Optional override for footer actions for this step. */
  actions?: React.ReactNode;
  /**
   * Optional validator. Return true (or a Promise resolving to true) to allow
   * advancing past this step. Return false to block.
   */
  validate?: () => boolean | Promise<boolean>;
  /** Whether this step can be skipped. Default false. */
  skippable?: boolean;
  /** Whether this step is optional (renders an "optional" badge). */
  optional?: boolean;
}

export interface WizardProps {
  steps: WizardStep[];
  /** Controlled active step index. */
  activeStep?: number;
  /** Called when the active step changes. */
  onStepChange?: (index: number) => void;
  /** Called when the user finishes the last step. */
  onComplete?: () => void;
  /** Called when the user cancels. */
  onCancel?: () => void;
  /** linear (default) requires steps to be done in order; non-linear lets users jump. */
  variant?: WizardVariant;
  /** horizontal (default) or vertical step layout. */
  orientation?: WizardOrientation;
  /** Show a "Skip" button when the current step is `skippable`. */
  showSkip?: boolean;
  /** Custom labels for the action buttons. */
  labels?: {
    next?: string;
    previous?: string;
    skip?: string;
    finish?: string;
    cancel?: string;
  };
  className?: string;
}

const defaultLabels = {
  next: 'Next',
  previous: 'Back',
  skip: 'Skip',
  finish: 'Finish',
  cancel: 'Cancel',
};

const baseButton =
  'inline-flex items-center justify-center h-10 px-4 rounded-[12px] text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amp-semantic-border-focus)] disabled:opacity-50 disabled:cursor-not-allowed';
const primaryBtn =
  'bg-[var(--amp-semantic-bg-accent,#6531FF)] text-white hover:opacity-90';
const secondaryBtn =
  'bg-[var(--amp-semantic-bg-surface)] text-[var(--amp-semantic-text-primary)] border border-[var(--amp-semantic-border-default)] hover:bg-[var(--amp-semantic-bg-sunken)]';
const ghostBtn =
  'text-[var(--amp-semantic-text-secondary)] hover:bg-[var(--amp-semantic-bg-sunken)]';

export const Wizard: React.FC<WizardProps> = ({
  steps,
  activeStep,
  onStepChange,
  onComplete,
  onCancel,
  variant = 'linear',
  orientation = 'horizontal',
  showSkip = true,
  labels,
  className,
}) => {
  const [internal, setInternal] = useState(0);
  const [validating, setValidating] = useState(false);
  const isControlled = typeof activeStep === 'number';
  const current = isControlled ? activeStep! : internal;
  const lbl = { ...defaultLabels, ...labels };

  const setStep = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= steps.length) return;
      if (!isControlled) setInternal(idx);
      onStepChange?.(idx);
    },
    [isControlled, onStepChange, steps.length]
  );

  const stepperItems = useMemo(
    () =>
      steps.map((step, i) => {
        let status: StepStatus = 'upcoming';
        if (i < current) status = 'completed';
        else if (i === current) status = 'active';
        return { label: step.label, status };
      }),
    [steps, current]
  );

  const handleNext = useCallback(async () => {
    const step = steps[current];
    if (step.validate) {
      try {
        setValidating(true);
        const ok = await step.validate();
        if (!ok) return;
      } finally {
        setValidating(false);
      }
    }
    if (current === steps.length - 1) {
      onComplete?.();
      return;
    }
    setStep(current + 1);
  }, [current, onComplete, setStep, steps]);

  const handlePrev = useCallback(() => {
    if (current === 0) return;
    setStep(current - 1);
  }, [current, setStep]);

  const handleSkip = useCallback(() => {
    if (current === steps.length - 1) {
      onComplete?.();
      return;
    }
    setStep(current + 1);
  }, [current, onComplete, setStep, steps.length]);

  const handleStepClick = useCallback(
    (idx: number) => {
      if (variant === 'linear' && idx > current) return;
      setStep(idx);
    },
    [current, setStep, variant]
  );

  const step = steps[current];
  if (!step) return null;
  const isLast = current === steps.length - 1;

  return (
    <div
      className={cn(
        'w-full flex',
        orientation === 'vertical' ? 'flex-row gap-8' : 'flex-col gap-6',
        className
      )}
      role="region"
      aria-label="Wizard"
    >
      <div
        className={cn(
          orientation === 'vertical' ? 'w-56 shrink-0' : 'w-full'
        )}
      >
        <Stepper
          steps={stepperItems}
          variant={orientation === 'vertical' ? 'minimal' : 'circles'}
          onStepClick={handleStepClick}
          className={cn(orientation === 'vertical' && 'flex-col items-start gap-3')}
        />
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <div>
          {step.heading && (
            <h3 className="text-[18px] font-semibold text-[var(--amp-semantic-text-primary)]">
              {step.heading}
              {step.optional && (
                <span className="ml-2 align-middle text-[12px] font-normal text-[var(--amp-semantic-text-muted)]">
                  (optional)
                </span>
              )}
            </h3>
          )}
          {step.description && (
            <p className="mt-1 text-[14px] text-[var(--amp-semantic-text-secondary)]">
              {step.description}
            </p>
          )}
        </div>

        <div
          role="group"
          aria-labelledby={undefined}
          className="flex-1"
        >
          {step.body}
        </div>

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--amp-semantic-border-default)]">
          <div>
            {onCancel && (
              <button type="button" className={cn(baseButton, ghostBtn)} onClick={onCancel}>
                {lbl.cancel}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {step.actions ?? (
              <>
                <button
                  type="button"
                  className={cn(baseButton, secondaryBtn)}
                  onClick={handlePrev}
                  disabled={current === 0}
                >
                  {lbl.previous}
                </button>
                {showSkip && step.skippable && !isLast && (
                  <button
                    type="button"
                    className={cn(baseButton, ghostBtn)}
                    onClick={handleSkip}
                  >
                    {lbl.skip}
                  </button>
                )}
                <button
                  type="button"
                  className={cn(baseButton, primaryBtn)}
                  onClick={handleNext}
                  disabled={validating}
                  aria-busy={validating || undefined}
                >
                  {isLast ? lbl.finish : lbl.next}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Wizard.displayName = 'Wizard';
