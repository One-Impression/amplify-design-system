'use client';

import React from 'react';
import { cn } from '../../lib/cn';

/**
 * GentlePausePill — apricot-colored rate-limit indicator with countdown
 * for the Oportunities app.
 *
 * Shows a spinning border-spinner, a message, and an optional countdown.
 * All motion is gated by `prefers-reduced-motion`.
 *
 * Tokens consumed:
 *   --amp-oportunities-accent-soft  (pill bg)
 *   --amp-oportunities-accent       (text, spinner stroke)
 */

export interface GentlePausePillProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Message displayed in the pill. Default "Just a moment". */
  message?: string;
  /** Countdown seconds remaining. Omit to hide countdown. */
  secondsLeft?: number;
  className?: string;
}

const STYLE_ID = 'amp-gentle-pause-pill-keyframes';
const styleSheet = `
@keyframes amp-gentle-pause-spin {
  to { transform: rotate(360deg); }
}
@media (prefers-reduced-motion: reduce) {
  .amp-gentle-pause-spinner { animation: none !important; }
}
`;

function useInjectedKeyframes() {
  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement('style');
    el.id = STYLE_ID;
    el.textContent = styleSheet;
    document.head.appendChild(el);
  }, []);
}

export const GentlePausePill = React.forwardRef<HTMLDivElement, GentlePausePillProps>(
  ({ message = 'Just a moment', secondsLeft, className, style, ...rest }, ref) => {
    useInjectedKeyframes();

    return (
      <div
        ref={ref}
        role="status"
        aria-label={`${message}${secondsLeft != null ? `, ${secondsLeft} seconds remaining` : ''}`}
        className={cn('inline-flex items-center', className)}
        style={{
          borderRadius: 999,
          background: 'var(--amp-oportunities-accent-soft, #FFE9D2)',
          color: 'var(--amp-oportunities-accent, #E68F47)',
          padding: '8px 16px',
          gap: 10,
          ...style,
        }}
        {...rest}
      >
        {/* Spinning border-spinner */}
        <span
          aria-hidden="true"
          className="amp-gentle-pause-spinner"
          style={{
            display: 'inline-block',
            width: 16,
            height: 16,
            borderRadius: '50%',
            border: '2px solid var(--amp-oportunities-accent, #E68F47)',
            borderTopColor: 'transparent',
            animation: 'amp-gentle-pause-spin 0.9s linear infinite',
            flexShrink: 0,
          }}
        />

        {/* Message */}
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
            lineHeight: 1.2,
          }}
        >
          {message}
        </span>

        {/* Countdown */}
        {secondsLeft != null && (
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'ui-monospace, "SF Mono", "Cascadia Mono", monospace',
              lineHeight: 1.2,
            }}
          >
            {secondsLeft}s
          </span>
        )}
      </div>
    );
  },
);

GentlePausePill.displayName = 'GentlePausePill';
