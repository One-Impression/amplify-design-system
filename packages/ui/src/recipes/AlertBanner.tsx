'use client';

import React from 'react';
import { cn } from '../lib/cn';

export type AlertBannerTone = 'info' | 'success' | 'warning' | 'error';

export interface AlertBannerProps {
  tone?: AlertBannerTone;
  title: string;
  description?: string;
  /** Primary action button label. */
  actionLabel?: string;
  onAction?: () => void;
  /** Show a dismiss "x" button. */
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

const toneClasses: Record<AlertBannerTone, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
  info: {
    bg: 'bg-[var(--amp-semantic-status-info-bg,_rgba(56,123,255,0.08))]',
    border: 'border-[var(--amp-semantic-status-info,_#387BFF)]/30',
    text: 'text-[var(--amp-semantic-status-info,_#387BFF)]',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    ),
  },
  success: {
    bg: 'bg-[var(--amp-semantic-status-success-bg,_rgba(34,197,94,0.08))]',
    border: 'border-[var(--amp-semantic-status-success,_#22C55E)]/30',
    text: 'text-[var(--amp-semantic-status-success,_#22C55E)]',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="m9 11 3 3L22 4" />
      </svg>
    ),
  },
  warning: {
    bg: 'bg-[var(--amp-semantic-status-warning-bg,_rgba(245,158,11,0.08))]',
    border: 'border-[var(--amp-semantic-status-warning,_#F59E0B)]/30',
    text: 'text-[var(--amp-semantic-status-warning,_#F59E0B)]',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  error: {
    bg: 'bg-[var(--amp-semantic-status-error-bg,_rgba(239,68,68,0.08))]',
    border: 'border-[var(--amp-semantic-status-error,_#EF4444)]/30',
    text: 'text-[var(--amp-semantic-status-error,_#EF4444)]',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  },
};

/**
 * AlertBanner — Banner + Icon + Title + Description + DismissButton + ActionButton recipe.
 * A horizontal alert strip suitable for top-of-page system notices.
 */
export const AlertBanner: React.FC<AlertBannerProps> = ({
  tone = 'info',
  title,
  description,
  actionLabel,
  onAction,
  dismissible = false,
  onDismiss,
  icon,
  className,
}) => {
  const t = toneClasses[tone];
  return (
    <div
      role="status"
      className={cn(
        'flex items-start gap-3 px-4 py-3 rounded-[12px] border',
        t.bg,
        t.border,
        className
      )}
    >
      <span className={cn('mt-0.5', t.text)}>{icon ?? t.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-semibold text-[var(--amp-semantic-text-primary)]">
          {title}
        </div>
        {description && (
          <div className="text-[13px] text-[var(--amp-semantic-text-secondary)] mt-0.5">
            {description}
          </div>
        )}
      </div>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className={cn(
            'inline-flex items-center h-7 px-3 rounded-[8px] text-[13px] font-medium border',
            'border-[var(--amp-semantic-border-default)] bg-[var(--amp-semantic-bg-surface)]',
            'text-[var(--amp-semantic-text-primary)]',
            'hover:bg-[var(--amp-semantic-bg-raised)] transition-colors'
          )}
        >
          {actionLabel}
        </button>
      )}
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="text-[var(--amp-semantic-text-muted)] hover:text-[var(--amp-semantic-text-primary)] transition-colors mt-0.5"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
};
