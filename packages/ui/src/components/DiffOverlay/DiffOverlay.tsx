'use client';

import React from 'react';
import { cn } from '../../lib/cn';

/**
 * DiffOverlay — red/green pixel-diff layer rendered on top of the Magic
 * Studio Live pane (`magic-studio/docs/mockups/option-d.html`, region R15).
 *
 * The overlay surfaces three modes:
 *
 * - `highlight` — translucent red (removed) / green (added) bands layered
 *   on the live page (`mix-blend-mode: multiply`); a small legend pill is
 *   rendered top-right so users can decode the colours. Matches the
 *   `.diff-overlay` + `.diff-legend` blocks in the canonical mockup.
 * - `swipe`     — a vertical curtain at `swipePercent` (0–100) divides
 *   the variant (left) from the live page (right). Drag handles live in
 *   the consumer.
 * - `side-by-side` — renders both screenshots in a 1fr / 1fr grid.
 *
 * The component is presentational. It takes the URLs of pre-captured
 * screenshots; the consumer wires loading states and the live iframe.
 * Rendering the legend can be disabled with `showLegend={false}`.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type DiffOverlayMode = 'highlight' | 'swipe' | 'side-by-side';

export interface DiffOverlayProps {
  /** URL of the live (current) page screenshot. */
  liveScreenshot: string;
  /** URL of the candidate variant screenshot. */
  variantScreenshot: string;
  /** Diff visualisation mode. */
  mode: DiffOverlayMode;
  /**
   * Curtain position 0–100 for `mode='swipe'`. Default 50. Ignored when
   * mode is not `'swipe'`.
   */
  swipePercent?: number;
  /** When `true`, renders the colour-key pill (default true for `highlight`). */
  showLegend?: boolean;
  /** Optional accessible label override. */
  ariaLabel?: string;
  /** Optional className passthrough on the outer element. */
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const DiffOverlay = React.forwardRef<HTMLDivElement, DiffOverlayProps>(
  function DiffOverlay(
    {
      liveScreenshot,
      variantScreenshot,
      mode,
      swipePercent = 50,
      showLegend,
      ariaLabel = 'Live vs variant diff',
      className,
    },
    ref,
  ) {
    const clampedSwipe = Math.max(0, Math.min(100, swipePercent));
    const legendVisible = showLegend ?? mode === 'highlight';

    return (
      <div
        ref={ref}
        role="img"
        aria-label={ariaLabel}
        data-mode={mode}
        data-testid="diff-overlay"
        className={cn(
          'relative h-full w-full overflow-hidden',
          'rounded-[var(--amp-radius-md)]',
          className,
        )}
      >
        {/* Live screenshot — the base layer */}
        <img
          src={liveScreenshot}
          alt=""
          aria-hidden="true"
          data-testid="diff-overlay-live"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* mode === 'highlight' — translucent red/green bands */}
        {mode === 'highlight' && (
          <div
            data-testid="diff-overlay-highlight"
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute inset-0',
              'mix-blend-multiply',
              'bg-[linear-gradient(180deg,var(--amp-semantic-color-success-soft)_0%,var(--amp-semantic-color-success-soft)_18%,transparent_18%,transparent_42%,var(--amp-semantic-color-danger-soft)_42%,var(--amp-semantic-color-danger-soft)_60%,transparent_60%)]',
            )}
          />
        )}

        {/* mode === 'swipe' — vertical curtain. The variant image is
         * absolutely positioned at the wrapper's full size; the curtain
         * div clips it via overflow + clip-path so the visible slice
         * sits flush with the underlying live image. */}
        {mode === 'swipe' && (
          <>
            <div
              data-testid="diff-overlay-swipe"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
              style={{
                clipPath: `inset(0 ${100 - clampedSwipe}% 0 0)`,
              }}
            >
              <img
                src={variantScreenshot}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div
              data-testid="diff-overlay-swipe-divider"
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute inset-y-0',
                'w-px bg-[var(--amp-studio-theme-color-fg)]',
              )}
              style={{ left: `${clampedSwipe}%` }}
            />
          </>
        )}

        {/* mode === 'side-by-side' — 1fr / 1fr grid above the base */}
        {mode === 'side-by-side' && (
          <div
            data-testid="diff-overlay-side"
            aria-hidden="true"
            className={cn(
              'absolute inset-0 grid grid-cols-2',
              'gap-[var(--amp-spacing-2)]',
              'bg-[var(--amp-studio-theme-color-bg-elev)]',
            )}
          >
            <img
              src={liveScreenshot}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover"
            />
            <img
              src={variantScreenshot}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {legendVisible && (
          <div
            data-testid="diff-overlay-legend"
            className={cn(
              'absolute right-[var(--amp-spacing-4)] top-[var(--amp-spacing-4)]',
              'flex flex-col gap-[var(--amp-spacing-1)]',
              'rounded-[var(--amp-radius-md)] border',
              'border-[var(--amp-studio-theme-color-border)]',
              'bg-[var(--amp-studio-theme-color-bg-elev)]',
              'px-[var(--amp-spacing-3)] py-[var(--amp-spacing-2)]',
              'text-[var(--amp-font-size-xs)] text-[var(--amp-studio-theme-color-fg)]',
              'shadow-[var(--amp-shadow-sm)]',
            )}
          >
            <div className="flex items-center gap-[var(--amp-spacing-2)]">
              <span
                aria-hidden="true"
                className="inline-block size-3 rounded-[var(--amp-radius-xs)] bg-[var(--amp-semantic-color-success-soft)]"
              />
              <span>Added</span>
            </div>
            <div className="flex items-center gap-[var(--amp-spacing-2)]">
              <span
                aria-hidden="true"
                className="inline-block size-3 rounded-[var(--amp-radius-xs)] bg-[var(--amp-semantic-color-danger-soft)]"
              />
              <span>Removed</span>
            </div>
          </div>
        )}
      </div>
    );
  },
);

DiffOverlay.displayName = 'DiffOverlay';
