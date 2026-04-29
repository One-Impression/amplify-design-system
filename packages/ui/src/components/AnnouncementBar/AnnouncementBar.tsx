'use client';
import React from 'react';
import { cn } from '../../lib/cn';

export type AnnouncementBarVariant = 'default' | 'accent' | 'inverted';

export interface AnnouncementBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Message body. */
  message: React.ReactNode;
  /** Optional inline CTA — e.g. a link or Button. */
  cta?: React.ReactNode;
  /** Show a dismiss button. */
  dismissible?: boolean;
  /** Controlled visibility. If omitted the component manages its own state. */
  open?: boolean;
  /** Called when the user dismisses the bar. */
  onDismiss?: () => void;
  /** Visual treatment. */
  variant?: AnnouncementBarVariant;
}

const variantClasses: Record<AnnouncementBarVariant, string> = {
  default:
    'bg-[var(--amp-semantic-bg-sunken)] text-[var(--amp-semantic-text-primary)] border-b border-[var(--amp-semantic-border-default)]',
  accent:
    'bg-[var(--amp-semantic-bg-accent-subtle)] text-[var(--amp-semantic-text-primary)] border-b border-[var(--amp-semantic-border-accent)]',
  // TODO(phase-a): swap to amplify-surface tokens once phase A merges
  inverted: 'bg-neutral-900 text-white',
};

export const AnnouncementBar = React.forwardRef<HTMLDivElement, AnnouncementBarProps>(
  (
    {
      message,
      cta,
      dismissible = false,
      open,
      onDismiss,
      variant = 'default',
      className,
      ...props
    },
    ref
  ) => {
    const isControlled = open !== undefined;
    const [internalOpen, setInternalOpen] = React.useState(true);
    const visible = isControlled ? open : internalOpen;

    if (!visible) return null;

    const handleDismiss = () => {
      if (!isControlled) setInternalOpen(false);
      onDismiss?.();
    };

    const isInverted = variant === 'inverted';

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn('w-full', variantClasses[variant], className)}
        {...props}
      >
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-2.5 flex items-center gap-3">
          <p className="flex-1 text-[14px] leading-snug">
            {message}
            {cta && <span className="ml-2 inline-flex items-center">{cta}</span>}
          </p>
          {dismissible && (
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss announcement"
              className={cn(
                'shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-md',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
                isInverted
                  ? 'hover:bg-white/10 focus-visible:ring-white/40'
                  : 'hover:bg-[var(--amp-semantic-bg-surface)] focus-visible:ring-[var(--amp-semantic-border-focus)]'
              )}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }
);

AnnouncementBar.displayName = 'AnnouncementBar';
