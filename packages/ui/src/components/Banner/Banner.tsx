import React from 'react';
import { cn } from '../../lib/cn';

export type BannerVariant = 'info' | 'warning' | 'error' | 'success';

export interface BannerProps {
  /** Visual + semantic tone. `warning` and `error` set role="alert" for assertive a11y. */
  variant?: BannerVariant;
  /** Short headline. */
  title?: string;
  /** Body copy — supports rich content. */
  message: React.ReactNode;
  /** Show a dismiss (×) affordance. */
  dismissible?: boolean;
  /** Fired when the user dismisses the banner. */
  onDismiss?: () => void;
  /** Right-aligned action slot — typically Buttons or links. */
  actions?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<
  BannerVariant,
  { container: string; iconColor: string; icon: React.ReactNode }
> = {
  info: {
    container:
      'bg-[var(--amp-semantic-bg-info-subtle,var(--amp-semantic-bg-raised))] border-[var(--amp-semantic-border-info,var(--amp-semantic-status-info))]',
    iconColor: 'text-[var(--amp-semantic-status-info)]',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
  warning: {
    container:
      'bg-[var(--amp-semantic-bg-warning-subtle,var(--amp-semantic-bg-raised))] border-[var(--amp-semantic-border-warning,var(--amp-semantic-status-warning))]',
    iconColor: 'text-[var(--amp-semantic-status-warning)]',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    ),
  },
  error: {
    container:
      'bg-[var(--amp-semantic-bg-error-subtle,var(--amp-semantic-bg-raised))] border-[var(--amp-semantic-border-error,var(--amp-semantic-status-error))]',
    iconColor: 'text-[var(--amp-semantic-status-error)]',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" />
    ),
  },
  success: {
    container:
      'bg-[var(--amp-semantic-bg-success-subtle,var(--amp-semantic-bg-raised))] border-[var(--amp-semantic-border-success,var(--amp-semantic-status-success))]',
    iconColor: 'text-[var(--amp-semantic-status-success)]',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
};

/**
 * Sticky page-level banner. Renders inline at the top of a page or section
 * and persists until dismissed. Use for deploy notices, system status, or
 * "action required" messages.
 *
 * Distinct from:
 * - `Toast`: transient, floating, auto-dismiss.
 * - `AnnouncementBar`: top-of-app marketing/announcement strip.
 */
export const Banner: React.FC<BannerProps> = ({
  variant = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
  actions,
  className,
}) => {
  const v = variantStyles[variant];
  const isAssertive = variant === 'warning' || variant === 'error';

  return (
    <div
      role={isAssertive ? 'alert' : 'status'}
      aria-live={isAssertive ? 'assertive' : 'polite'}
      className={cn(
        'w-full flex items-start gap-3 px-4 py-3 rounded-[12px] border',
        v.container,
        className
      )}
    >
      <svg
        className={cn('w-5 h-5 mt-0.5 shrink-0', v.iconColor)}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        {v.icon}
      </svg>
      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-[14px] font-semibold text-[var(--amp-semantic-text-primary)] mb-0.5">
            {title}
          </p>
        )}
        <div className="text-[14px] text-[var(--amp-semantic-text-secondary)] leading-snug">
          {message}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0 ml-2">{actions}</div>
      )}
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className={cn(
            'shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-md',
            'text-[var(--amp-semantic-text-muted)] hover:text-[var(--amp-semantic-text-primary)]',
            'hover:bg-[var(--amp-semantic-bg-surface)] transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amp-semantic-border-focus)]'
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
  );
};
