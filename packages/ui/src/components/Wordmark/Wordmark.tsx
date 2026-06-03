'use client';

import React from 'react';
import { cn } from '../../lib/cn';

/**
 * Wordmark — the Oportunities wordmark ("oportunities.") rendered as a
 * brand-grade typographic mark.
 *
 * - Geist 600 with -0.04em tracking (the locked Oportunities signature)
 * - The trailing period is always apricot — the brand's defining moment
 * - `animated` enables a slow gradient sweep across the letters using
 *   `-webkit-background-clip: text` + animated background-position. The
 *   apricot period remains solid (it's the focal point of the brand).
 * - `monochrome` collapses the sweep to solid text-primary — useful for
 *   small-screen / print / footer renders
 * - All motion is gated by `prefers-reduced-motion`
 *
 * Tokens consumed from `tokens-oportunities`:
 *   --amp-oportunities-font-display
 *   --amp-oportunities-letter-spacing-tight
 *   --amp-oportunities-weight-display
 *   --amp-oportunities-theme-color-accent          (apricot period)
 *   --amp-oportunities-theme-color-text-primary    (monochrome fill)
 *   --amp-oportunities-gradient-ai-sweep-anim      (sweep)
 */

export type WordmarkSize = 'sm' | 'md' | 'lg' | 'xl';

export interface WordmarkProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Visual size. Default `md`. */
  size?: WordmarkSize;
  /**
   * When true, animates a slow apricot→purple→apricot sweep across the
   * letters via `background-clip: text`. The apricot period remains
   * solid. Disabled automatically under `prefers-reduced-motion`.
   */
  animated?: boolean;
  /**
   * When true, render the letters in solid `text-primary` and drop the
   * gradient (the apricot period remains). Wins over `animated` if both
   * are set.
   */
  monochrome?: boolean;
  className?: string;
}

const sizeClasses: Record<WordmarkSize, string> = {
  sm: 'text-[18px] leading-none',
  md: 'text-[28px] leading-none',
  lg: 'text-[44px] leading-[1.05]',
  xl: 'text-[72px] leading-[1.02]',
};

const STYLE_ID = 'amp-wordmark-keyframes';
const styleSheet = `
@keyframes amp-wordmark-sweep {
  0%   { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
@media (prefers-reduced-motion: reduce) {
  .amp-wordmark-animated {
    animation: none !important;
    background-position: 0% 50% !important;
  }
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

export const Wordmark = React.forwardRef<HTMLSpanElement, WordmarkProps>(
  ({ size = 'md', animated = false, monochrome = false, className, ...rest }, ref) => {
    useInjectedKeyframes();

    const useGradient = animated && !monochrome;

    const lettersStyle: React.CSSProperties = useGradient
      ? {
          backgroundImage: 'var(--amp-oportunities-gradient-ai-sweep-anim)',
          backgroundSize: '200% 100%',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
        }
      : {
          color: 'var(--amp-oportunities-theme-color-text-primary)',
        };

    return (
      <span
        ref={ref}
        aria-label="oportunities"
        className={cn('op-wordmark inline-flex items-baseline', sizeClasses[size], className)}
        style={{
          fontFamily: 'var(--amp-oportunities-font-display)',
          fontWeight: 'var(--amp-oportunities-weight-display, 600)',
          letterSpacing: 'var(--amp-oportunities-letter-spacing-tight, -0.04em)',
        }}
        {...rest}
      >
        <span
          aria-hidden="true"
          data-testid="wordmark-letters"
          className={cn(useGradient && 'amp-wordmark-animated [animation:amp-wordmark-sweep_6s_linear_infinite]')}
          style={lettersStyle}
        >
          oportunities
        </span>
        <span
          aria-hidden="true"
          data-testid="wordmark-period"
          className="op-period"
          style={{ color: 'var(--amp-oportunities-theme-color-accent)' }}
        >
          .
        </span>
      </span>
    );
  },
);

Wordmark.displayName = 'Wordmark';
