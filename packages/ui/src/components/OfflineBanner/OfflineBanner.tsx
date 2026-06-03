'use client';

import React from 'react';
import { cn } from '../../lib/cn';

/**
 * OfflineBanner — sticky banner shown when offline with cached content
 * in the Oportunities app.
 *
 * Layout: flex row, space-between. Left shows status text, right shows
 * a retry chip button.
 *
 * Tokens consumed:
 *   --amp-oportunities-accent-soft  (banner bg)
 *   --amp-oportunities-accent       (border, text, button bg)
 */

export interface OfflineBannerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Called when the retry button is clicked. */
  onRetry?: () => void;
  className?: string;
}

export const OfflineBanner = React.forwardRef<HTMLDivElement, OfflineBannerProps>(
  ({ onRetry, className, style, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn('flex items-center justify-between', className)}
        style={{
          background: 'var(--amp-oportunities-accent-soft, #FFE9D2)',
          border: '1px solid var(--amp-oportunities-accent, #E68F47)',
          borderRadius: 12,
          padding: '8px 16px',
          ...style,
        }}
        {...rest}
      >
        {/* Status text */}
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
            color: 'var(--amp-oportunities-accent, #E68F47)',
            lineHeight: 1.3,
          }}
        >
          {'📡'} Offline — using cached data
        </span>

        {/* Retry button */}
        <button
          type="button"
          aria-label="Retry connection"
          onClick={onRetry}
          style={{
            background: 'var(--amp-oportunities-accent, #E68F47)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 8,
            padding: '6px 12px',
            fontSize: 11,
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            lineHeight: 1.2,
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    );
  },
);

OfflineBanner.displayName = 'OfflineBanner';
