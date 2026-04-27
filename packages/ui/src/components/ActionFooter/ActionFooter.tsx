import React from 'react';
import { cn } from '../../lib/cn';

export interface ActionFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  onBack?: () => void;
  onNext?: () => void;
  backLabel?: string;
  nextLabel?: string;
  showBack?: boolean;
  showKeyboardHints?: boolean;
  nextDisabled?: boolean;
}

export const ActionFooter = React.forwardRef<HTMLDivElement, ActionFooterProps>(
  (
    {
      onBack,
      onNext,
      backLabel = '\u2190 Back',
      nextLabel = 'Save & Continue \u2192',
      showBack = true,
      showKeyboardHints = true,
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
          'fixed bottom-0 left-0 right-0 z-50',
          'flex items-center justify-between px-6 py-3',
          'bg-white/[0.92] backdrop-blur-sm border-t border-[var(--amp-semantic-border-default,#e5e5e5)]',
          className
        )}
        {...props}
      >
        {/* Keyboard hints */}
        <div className="flex items-center gap-2">
          {showKeyboardHints && (
            <span className="text-xs text-[var(--amp-semantic-text-muted,#a3a3a3)] hidden sm:flex items-center gap-1.5">
              <kbd className="inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1.5 rounded border border-[var(--amp-semantic-border-default,#e5e5e5)] bg-[var(--amp-semantic-bg-sunken,#f5f5f5)] text-[10px] font-mono">
                Enter
              </kbd>
              <span>Continue</span>
              <span className="mx-1">&middot;</span>
              <kbd className="inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1.5 rounded border border-[var(--amp-semantic-border-default,#e5e5e5)] bg-[var(--amp-semantic-bg-sunken,#f5f5f5)] text-[10px] font-mono">
                &uarr;
              </kbd>
              <kbd className="inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1.5 rounded border border-[var(--amp-semantic-border-default,#e5e5e5)] bg-[var(--amp-semantic-bg-sunken,#f5f5f5)] text-[10px] font-mono">
                &darr;
              </kbd>
              <span>Navigate</span>
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          {showBack && onBack && (
            <button
              type="button"
              onClick={onBack}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                'text-[var(--amp-semantic-text-default,#171717)] bg-transparent',
                'hover:bg-[var(--amp-semantic-bg-sunken,#f5f5f5)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--amp-semantic-accent,#6531FF)]/40'
              )}
            >
              {backLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled}
            className={cn(
              'px-6 py-2.5 rounded-lg text-sm font-medium transition-colors',
              'bg-[var(--amp-semantic-accent,#6531FF)] text-white',
              'hover:opacity-90',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--amp-semantic-accent,#6531FF)]/40',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {nextLabel}
          </button>
        </div>
      </div>
    );
  }
);

ActionFooter.displayName = 'ActionFooter';
