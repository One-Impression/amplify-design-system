'use client';

import React from 'react';
import { cn } from '../../lib/cn';

/**
 * TierCard — dark card showing creator tier progress with pulsing bar.
 *
 * Used on the Oportunities creator profile to visualise progress toward
 * the next tier. The progress bar pulses with a subtle glow animation
 * to draw attention to advancement.
 *
 * Composes no other primitives — this is a self-contained dark surface
 * card that sits outside the standard Card variant palette.
 *
 * Theme tokens consumed:
 *   --amp-oportunities-theme-color-accent  (progress bar fill + pulse glow)
 */

export type TierLevel = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface TierCardProgress {
  events: [number, number];
  wishes: [number, number];
  habits: [number, number];
}

export interface TierCardProps {
  currentTier: TierLevel;
  nextTier?: 'silver' | 'gold' | 'platinum';
  progress: TierCardProgress;
  onClick?: () => void;
  className?: string;
}

const TIER_LABELS: Record<TierLevel, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
};

function computeOverallProgress(progress: TierCardProgress): number {
  const pairs: [number, number][] = [progress.events, progress.wishes, progress.habits];
  let totalCurrent = 0;
  let totalTarget = 0;
  for (const [current, target] of pairs) {
    totalCurrent += current;
    totalTarget += target;
  }
  if (totalTarget === 0) return 0;
  return Math.min((totalCurrent / totalTarget) * 100, 100);
}

/** Inline keyframes injected once per mount via a <style> element. */
const PULSE_STYLE_ID = 'amp-tier-pulse-keyframes';

function ensurePulseKeyframes(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(PULSE_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = PULSE_STYLE_ID;
  style.textContent = `
@keyframes tierPulse {
  0%, 100% { box-shadow: none; }
  50% { box-shadow: 0 0 8px rgba(230,143,71,0.4); }
}`;
  document.head.appendChild(style);
}

export const TierCard = React.forwardRef<HTMLDivElement, TierCardProps>(
  ({ currentTier, nextTier, progress, onClick, className }, ref) => {
    React.useEffect(() => {
      ensurePulseKeyframes();
    }, []);

    const pct = computeOverallProgress(progress);
    const [evCur, evMax] = progress.events;
    const [wiCur, wiMax] = progress.wishes;
    const [haCur, haMax] = progress.habits;

    const progressText = nextTier
      ? `${evCur} of ${evMax} events · ${wiCur} of ${wiMax} wishes · ${haCur} of ${haMax} habits to ${TIER_LABELS[nextTier]}`
      : `${evCur} of ${evMax} events · ${wiCur} of ${wiMax} wishes · ${haCur} of ${haMax} habits`;

    return (
      <div
        ref={ref}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
        className={cn(
          'flex items-center gap-3',
          onClick && 'cursor-pointer',
          className,
        )}
        style={{
          background: '#1C1611',
          color: '#FFFFFF',
          borderRadius: 16,
          padding: 16,
        }}
      >
        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {/* Tier name */}
          <span
            style={{
              fontSize: 16,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.05em',
            }}
          >
            {TIER_LABELS[currentTier]}
          </span>

          {/* Progress bar */}
          <div
            style={{
              width: '100%',
              height: 4,
              borderRadius: 2,
              background: '#2D2723',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: '100%',
                borderRadius: 2,
                background: 'var(--amp-oportunities-theme-color-accent, #E68F47)',
                animation: 'tierPulse 2s infinite',
                transition: 'width 300ms ease-out',
              }}
            />
          </div>

          {/* Progress text */}
          <span
            style={{
              fontSize: 11,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              color: '#8A7F73',
            }}
          >
            {progressText}
          </span>
        </div>

        {/* Chevron */}
        {onClick && (
          <span
            aria-hidden="true"
            style={{
              fontSize: 14,
              color: '#FFFFFF',
              flexShrink: 0,
            }}
          >
            ›
          </span>
        )}
      </div>
    );
  },
);

TierCard.displayName = 'TierCard';
