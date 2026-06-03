'use client';

import React from 'react';
import { cn } from '../../lib/cn';

/**
 * PullToRefreshRing — 3-state animated ring for pull-to-refresh interactions
 * on scrollable surfaces in the Oportunities app.
 *
 * States:
 *   idle      — hidden
 *   pulling   — arc fills clockwise from 12 o'clock, proportional to `progress`
 *   refreshing — full ring spins continuously (~75% arc visible)
 *   done      — green checkmark scales in, holds, then fades out
 *
 * Tokens consumed:
 *   --amp-oportunities-accent              (ring stroke)
 *   --amp-oportunities-border-soft         (track stroke)
 *   --amp-oportunities-status-success      (done checkmark bg)
 *   --amp-oportunities-motion-refresh-spin (spin duration)
 *   --amp-oportunities-motion-refresh-done-display (done hold time)
 *   --amp-oportunities-motion-refresh-done-fade    (done fade duration)
 */

export type PullToRefreshState = 'idle' | 'pulling' | 'refreshing' | 'done';

export interface PullToRefreshRingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Current state of the pull-to-refresh interaction. */
  state: PullToRefreshState;
  /** Progress 0–1, used in 'pulling' state to fill the ring arc. */
  progress?: number;
  /** Pixel diameter of the ring. Default 32. */
  size?: number;
  /** Stroke width of the ring. Default 3. */
  strokeWidth?: number;
  className?: string;
}

/* ---------- Singleton keyframe injection ---------- */

const STYLE_ID = 'amp-pull-to-refresh-ring-keyframes';
const styleSheet = `
@keyframes amp-refresh-spin {
  to { transform: rotate(360deg); }
}
@keyframes amp-refresh-check-in {
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}
@keyframes amp-refresh-check-fade {
  from { opacity: 1; }
  to   { opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .amp-refresh-spin-group { animation: none !important; }
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

/* ---------- Done-state timer hook ---------- */

type DonePhase = 'enter' | 'hold' | 'fade' | 'hidden';

function useDonePhase(state: PullToRefreshState): DonePhase {
  const [phase, setPhase] = React.useState<DonePhase>('hidden');

  React.useEffect(() => {
    if (state !== 'done') {
      setPhase('hidden');
      return;
    }

    // enter → hold → fade → hidden
    setPhase('enter');

    // After scale-in (300ms), move to hold
    const t1 = window.setTimeout(() => setPhase('hold'), 300);

    // After hold period (600ms default, read from CSS var at render time),
    // move to fade. Total = 300 + 600 = 900ms.
    const t2 = window.setTimeout(() => setPhase('fade'), 300 + 600);

    // After fade (200ms default), move to hidden. Total = 300 + 600 + 200 = 1100ms.
    const t3 = window.setTimeout(() => setPhase('hidden'), 300 + 600 + 200);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [state]);

  return phase;
}

/* ---------- Component ---------- */

export const PullToRefreshRing = React.forwardRef<HTMLDivElement, PullToRefreshRingProps>(
  (
    { state, progress = 0, size = 32, strokeWidth = 3, className, style, ...rest },
    ref,
  ) => {
    useInjectedKeyframes();
    const donePhase = useDonePhase(state);

    // Hide completely when idle, or when done animation has finished
    if (state === 'idle' || (state === 'done' && donePhase === 'hidden')) {
      return null;
    }

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    // Clamp progress
    const clampedProgress = Math.max(0, Math.min(1, progress));

    /* ---- Done state: green checkmark ---- */
    if (state === 'done') {
      const checkFontSize = size * 0.5;
      const isEnter = donePhase === 'enter';
      const isFade = donePhase === 'fade';

      return (
        <div
          ref={ref}
          role="status"
          aria-label="Refresh complete"
          className={cn('inline-flex items-center justify-center', className)}
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: 'var(--amp-oportunities-status-success, #5A8E4F)',
            color: '#fff',
            fontSize: checkFontSize,
            lineHeight: 1,
            animation: isEnter
              ? 'amp-refresh-check-in 300ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
              : isFade
                ? `amp-refresh-check-fade var(--amp-oportunities-motion-refresh-done-fade, 200ms) ease-out forwards`
                : undefined,
            ...style,
          }}
          {...rest}
        >
          <span aria-hidden="true" style={{ lineHeight: 1 }}>✓</span>
        </div>
      );
    }

    /* ---- Pulling / Refreshing state: SVG ring ---- */
    const isPulling = state === 'pulling';
    const dashoffset = isPulling
      ? circumference * (1 - clampedProgress)
      : circumference * 0.25; // 75% arc for refreshing

    return (
      <div
        ref={ref}
        role="status"
        aria-label={isPulling ? 'Pull to refresh' : 'Refreshing'}
        className={cn('inline-flex items-center justify-center', className)}
        style={{
          width: size,
          height: size,
          ...style,
        }}
        {...rest}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          fill="none"
          className={
            state === 'refreshing' ? 'amp-refresh-spin-group' : undefined
          }
          style={
            state === 'refreshing'
              ? {
                  animation: `amp-refresh-spin var(--amp-oportunities-motion-refresh-spin, 0.9s) linear infinite`,
                }
              : undefined
          }
        >
          {/* Background track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="var(--amp-oportunities-border-soft, #F5ECDE)"
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Foreground arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="var(--amp-oportunities-accent, #E68F47)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
              transition: isPulling ? 'stroke-dashoffset 0.1s ease-out' : undefined,
            }}
          />
        </svg>
      </div>
    );
  },
);

PullToRefreshRing.displayName = 'PullToRefreshRing';
