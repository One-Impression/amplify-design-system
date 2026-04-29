'use client';

import React from 'react';
import { cn } from '../../lib/cn';

export type ErrorStateVariant = 'inline' | 'block' | 'page' | 'boundary';

export interface ErrorStateProps {
  /**
   * Visual size/treatment.
   * - `inline`  — single-line tone, embeddable in a sentence (e.g. inside a form)
   * - `block`   — bordered card-style block, suits a section that failed to load
   * - `page`    — full-bleed, large icon — top-level page failures
   * - `boundary` — React error boundary fallback, includes default reset action
   */
  variant?: ErrorStateVariant;
  title?: string;
  message?: string;
  /** Recovery button — typically "Retry" / "Reload" */
  action?: React.ReactNode;
  /** Additional optional secondary action (e.g. "Contact support") */
  secondaryAction?: React.ReactNode;
  /** Optional error object for `boundary` variant — inspect for digest/stack */
  error?: Error;
  /** Reset callback for the `boundary` variant. Used as default action. */
  onReset?: () => void;
  className?: string;
}

const AlertIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const BigAlertIcon = (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export const ErrorState: React.FC<ErrorStateProps> = ({
  variant = 'block',
  title,
  message,
  action,
  secondaryAction,
  error,
  onReset,
  className,
}) => {
  const resolvedTitle =
    title ??
    (variant === 'boundary'
      ? 'Something went wrong'
      : variant === 'page'
        ? 'We hit a snag'
        : 'Couldn’t load this');
  const resolvedMessage =
    message ??
    (variant === 'boundary'
      ? error?.message ?? 'An unexpected error occurred. You can try again or refresh the page.'
      : 'Something went wrong while fetching. Please retry.');

  const defaultBoundaryAction =
    variant === 'boundary' && onReset && !action ? (
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center justify-center h-9 px-4 rounded-[8px] text-[14px] font-medium bg-[var(--amp-semantic-bg-raised)] text-[var(--amp-semantic-text-primary)] border border-[var(--amp-semantic-border-default)] hover:bg-[var(--amp-semantic-bg-sunken)] transition-colors"
      >
        Try again
      </button>
    ) : null;

  if (variant === 'inline') {
    return (
      <div
        role="alert"
        className={cn(
          'inline-flex items-center gap-2 text-[13px] text-[var(--amp-semantic-status-error)]',
          className
        )}
      >
        <span className="text-[var(--amp-semantic-status-error)]">{AlertIcon}</span>
        <span className="text-[var(--amp-semantic-text-primary)]">
          {message ?? resolvedTitle}
        </span>
        {action && <span className="ml-1">{action}</span>}
      </div>
    );
  }

  if (variant === 'page' || variant === 'boundary') {
    return (
      <div
        role="alert"
        className={cn(
          'flex flex-col items-center justify-center py-20 px-6 text-center',
          className
        )}
      >
        <div className="w-16 h-16 rounded-[20px] bg-[var(--amp-semantic-bg-raised)] flex items-center justify-center mb-5 text-[var(--amp-semantic-status-error)]">
          {BigAlertIcon}
        </div>
        <h2 className="text-[20px] font-semibold text-[var(--amp-semantic-text-primary)] mb-2">
          {resolvedTitle}
        </h2>
        <p className="text-[14px] text-[var(--amp-semantic-text-secondary)] max-w-md mb-6">
          {resolvedMessage}
        </p>
        <div className="flex items-center gap-3">
          {action ?? defaultBoundaryAction}
          {secondaryAction}
        </div>
      </div>
    );
  }

  // block variant
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 p-4 rounded-[12px]',
        'bg-[var(--amp-semantic-bg-surface)] border border-[var(--amp-semantic-border-default)]',
        className
      )}
    >
      <span className="text-[var(--amp-semantic-status-error)] mt-0.5">{AlertIcon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-semibold text-[var(--amp-semantic-text-primary)] mb-0.5">
          {resolvedTitle}
        </div>
        <div className="text-[13px] text-[var(--amp-semantic-text-secondary)]">
          {resolvedMessage}
        </div>
        {(action || secondaryAction) && (
          <div className="mt-3 flex items-center gap-2">
            {action}
            {secondaryAction}
          </div>
        )}
      </div>
    </div>
  );
};
