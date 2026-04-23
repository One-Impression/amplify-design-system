import React from 'react';
import { cn } from '../../lib/cn';

export interface ActionFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  onBack?: () => void;
  onNext?: () => void;
  backLabel?: string;
  nextLabel?: string;
  showBack?: boolean;
  nextDisabled?: boolean;
}

export const ActionFooter = React.forwardRef<HTMLDivElement, ActionFooterProps>(
  (
    {
      onBack,
      onNext,
      backLabel = 'Back',
      nextLabel = 'Continue',
      showBack = true,
      nextDisabled = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'fixed bottom-0 left-0 right-0 z-40',
          'flex items-center justify-between',
          'border-t border-stone-200 bg-white/95 backdrop-blur-sm',
          'px-6 py-3',
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-3 text-xs text-stone-400">
          <span className="inline-flex items-center gap-1">
            <kbd className="rounded border border-stone-200 bg-stone-50 px-1 py-0.5 font-mono text-[10px]">&larr;</kbd>
            <kbd className="rounded border border-stone-200 bg-stone-50 px-1 py-0.5 font-mono text-[10px]">&rarr;</kbd>
            Navigate
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="rounded border border-stone-200 bg-stone-50 px-1 py-0.5 font-mono text-[10px]">&crarr;</kbd>
            Continue
          </span>
        </div>
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              type="button"
              onClick={onBack}
              className={cn(
                'rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700',
                'transition-colors hover:bg-stone-50'
              )}
            >
              &larr; {backLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled}
            className={cn(
              'rounded-lg bg-stone-900 px-5 py-2 text-sm font-medium text-white',
              'transition-colors hover:bg-stone-800',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {nextLabel} &rarr;
          </button>
        </div>
      </div>
    );
  }
);

ActionFooter.displayName = 'ActionFooter';
