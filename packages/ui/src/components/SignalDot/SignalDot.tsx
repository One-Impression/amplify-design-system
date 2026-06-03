'use client';

import React from 'react';
import { cn } from '../../lib/cn';

/**
 * SignalDot — the Oportunities apricot period as a standalone animated mark.
 *
 * This is the "moment" of the brand: the wordmark's period lifted out as
 * a reusable signal. Use it as:
 *   - a brand bullet/avatar accent
 *   - a "live" indicator (with pulse rings)
 *   - a section divider mark
 *
 * Props:
 *   - `size`     — pixel diameter (default 16)
 *   - `pulse`    — subtle scale-pulse animation
 *   - `gradient` — apricot→purple conic fill instead of solid apricot
 *   - `live`     — emit two expanding pulse rings (presence indicator)
 *
 * Tokens consumed:
 *   --amp-oportunities-theme-color-accent     (apricot fill)
 *   --amp-oportunities-theme-color-ai-purple  (gradient endpoint)
 *
 * All motion (pulse + live rings) is gated by `prefers-reduced-motion`.
 */

export interface SignalDotProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Pixel diameter of the dot. Default 16. */
  size?: number;
  /** Apply a subtle scale pulse to the dot itself. */
  pulse?: boolean;
  /** Use an apricot→purple conic gradient instead of solid apricot fill. */
  gradient?: boolean;
  /** Render two expanding pulse rings around the dot (live/presence indicator). */
  live?: boolean;
  /** Accessible label. Default 'signal'. Live mode forces 'live' suffix. */
  label?: string;
  className?: string;
}

const STYLE_ID = 'amp-signal-dot-keyframes';
const styleSheet = `
@keyframes amp-signal-dot-pulse {
  0%   { transform: scale(1);    opacity: 1; }
  50%  { transform: scale(1.12); opacity: 0.85; }
  100% { transform: scale(1);    opacity: 1; }
}
@keyframes amp-signal-dot-ring {
  0%   { transform: scale(0.6); opacity: 0.55; }
  100% { transform: scale(2.4); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .amp-signal-dot-pulse,
  .amp-signal-dot-ring { animation: none !important; }
  .amp-signal-dot-ring { opacity: 0 !important; }
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

export const SignalDot = React.forwardRef<HTMLSpanElement, SignalDotProps>(
  ({ size = 16, pulse = false, gradient = false, live = false, label, className, style, ...rest }, ref) => {
    useInjectedKeyframes();

    const fillStyle: React.CSSProperties = gradient
      ? {
          background:
            'conic-gradient(from 210deg, var(--amp-oportunities-theme-color-accent) 0%, var(--amp-oportunities-theme-color-ai-purple) 60%, var(--amp-oportunities-theme-color-accent) 100%)',
        }
      : { background: 'var(--amp-oportunities-theme-color-accent)' };

    const ariaLabel = label ?? (live ? 'live signal' : 'signal');

    return (
      <span
        ref={ref}
        role="img"
        aria-label={ariaLabel}
        className={cn('relative inline-flex items-center justify-center', className)}
        style={{
          width: size,
          height: size,
          ...style,
        }}
        {...rest}
      >
        {live && (
          <>
            <span
              aria-hidden="true"
              data-testid="signal-dot-ring-1"
              className="amp-signal-dot-ring absolute inset-0 rounded-full [animation:amp-signal-dot-ring_1.8s_ease-out_infinite]"
              style={{ background: 'var(--amp-oportunities-theme-color-accent)' }}
            />
            <span
              aria-hidden="true"
              data-testid="signal-dot-ring-2"
              className="amp-signal-dot-ring absolute inset-0 rounded-full [animation:amp-signal-dot-ring_1.8s_ease-out_0.9s_infinite]"
              style={{ background: 'var(--amp-oportunities-theme-color-accent)' }}
            />
          </>
        )}
        <span
          aria-hidden="true"
          data-testid="signal-dot-core"
          className={cn(
            'relative inline-block rounded-full',
            pulse && 'amp-signal-dot-pulse [animation:amp-signal-dot-pulse_1.6s_ease-in-out_infinite]',
          )}
          style={{
            width: size,
            height: size,
            ...fillStyle,
          }}
        />
      </span>
    );
  },
);

SignalDot.displayName = 'SignalDot';
