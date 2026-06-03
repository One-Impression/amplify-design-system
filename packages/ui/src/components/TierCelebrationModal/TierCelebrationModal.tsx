'use client';

import React from 'react';
import { cn } from '../../lib/cn';

/**
 * TierCelebrationModal — full-screen celebration overlay for tier promotions.
 *
 * Shown when a creator advances to a new tier on the Oportunities platform.
 * Includes a bounce-in badge animation and staggered benefit list. Renders
 * as a fixed overlay (z-50) and calls `onDismiss` to close.
 *
 * This is a self-contained composed component. It does NOT introduce any
 * new visual primitives.
 *
 * Theme tokens consumed:
 *   --amp-oportunities-theme-color-accent       (badge border, CTA bg)
 *   --amp-oportunities-theme-color-accent-soft   (badge bg)
 */

export type CelebrationTier = 'silver' | 'gold' | 'platinum';

export interface TierCelebrationBenefit {
  emoji: string;
  text: string;
}

export interface TierCelebrationModalProps {
  tier: CelebrationTier;
  benefits: TierCelebrationBenefit[];
  onDismiss?: () => void;
  className?: string;
}

const TIER_EMOJI: Record<CelebrationTier, string> = {
  silver: '\u{1FA99}',  // coin
  gold: '\u{1F451}',    // crown
  platinum: '\u{1F48E}', // gem
};

const TIER_LABELS: Record<CelebrationTier, string> = {
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
};

/** Inline keyframes for badge bounce + benefit stagger. */
const CELEBRATION_STYLE_ID = 'amp-tier-celebration-keyframes';

function ensureCelebrationStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(CELEBRATION_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = CELEBRATION_STYLE_ID;
  style.textContent = `
@keyframes tierBadgeBounce {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes tierBenefitSlideUp {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}`;
  document.head.appendChild(style);
}

export const TierCelebrationModal = React.forwardRef<HTMLDivElement, TierCelebrationModalProps>(
  ({ tier, benefits, onDismiss, className }, ref) => {
    React.useEffect(() => {
      ensureCelebrationStyles();
    }, []);

    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={`${TIER_LABELS[tier]} tier unlocked`}
        className={cn('flex items-center justify-center', className)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 13, 11, 0.92)',
          zIndex: 50,
        }}
      >
        <div
          className="flex flex-col items-center"
          style={{ maxWidth: 320, width: '100%', padding: '0 24px' }}
        >
          {/* Badge */}
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              border: '3px solid var(--amp-oportunities-theme-color-accent, #E68F47)',
              background: 'var(--amp-oportunities-theme-color-accent-soft, #FFF3E8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'tierBadgeBounce 400ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            }}
          >
            <span style={{ fontSize: 40 }} aria-hidden="true">
              {TIER_EMOJI[tier]}
            </span>
          </div>

          {/* Tier name */}
          <span
            style={{
              marginTop: 16,
              fontSize: 22,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 800,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.05em',
              color: '#FFFFFF',
            }}
          >
            {TIER_LABELS[tier]}
          </span>

          {/* Subtitle */}
          <span
            style={{
              fontSize: 13,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              color: '#8A7F73',
              marginTop: 4,
            }}
          >
            Tier Unlocked
          </span>

          {/* Benefits list */}
          <div
            className="flex flex-col"
            style={{ marginTop: 24, gap: 12, width: '100%' }}
          >
            {benefits.map((benefit, i) => (
              <div
                key={i}
                className="flex items-center"
                style={{
                  gap: 8,
                  opacity: 0,
                  animation: `tierBenefitSlideUp 300ms ease-out ${200 * (i + 1)}ms forwards`,
                }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }} aria-hidden="true">
                  {benefit.emoji}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    color: '#FFFFFF',
                  }}
                >
                  {benefit.text}
                </span>
              </div>
            ))}
          </div>

          {/* Dismiss CTA */}
          <button
            type="button"
            onClick={onDismiss}
            className={cn(
              'inline-flex items-center justify-center',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            )}
            style={{
              marginTop: 32,
              width: '100%',
              padding: '12px 24px',
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              background: 'var(--amp-oportunities-theme-color-accent, #E68F47)',
              color: '#FFFFFF',
              fontSize: 14,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  },
);

TierCelebrationModal.displayName = 'TierCelebrationModal';
