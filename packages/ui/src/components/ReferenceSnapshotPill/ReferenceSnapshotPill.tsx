'use client';

import React from 'react';
import { cn } from '../../lib/cn';

/**
 * ReferenceSnapshotPill — "Reference snapshot taken at 3:42 PM" pill from
 * the Magic Studio Option-D cockpit (`magic-studio/docs/mockups/option-d.html`,
 * region R2). Click opens a modal of the original screenshot.
 *
 * Renders as a `<button>` so it is naturally keyboard-activatable. The
 * component formats `capturedAt` with `Intl.DateTimeFormat` using the
 * consumer's locale; consumers can override via `formatTime` if a
 * non-default time format is required.
 *
 * The pill stores `screenshotUrl` on `data-screenshot-url` for analytics /
 * dev-tools introspection, but rendering the modal itself is the
 * consumer's responsibility (Studio mounts a `<Dialog>` on click). This
 * primitive is the affordance only.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ReferenceSnapshotPillProps {
  /** Timestamp the reference screenshot was captured. */
  capturedAt: Date;
  /** URL of the captured screenshot — passed through as `data-screenshot-url`. */
  screenshotUrl: string;
  /** Click handler — typically opens a modal previewing `screenshotUrl`. */
  onClick?: () => void;
  /**
   * Optional time formatter. Defaults to `h:mm a` style via
   * `Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' })`.
   */
  formatTime?: (date: Date) => string;
  /** Optional label prefix. Defaults to `"Reference snapshot"`. */
  label?: string;
  /** Optional className passthrough. */
  className?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const defaultFormatTime = (d: Date): string =>
  new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(d);

// ─── Component ───────────────────────────────────────────────────────────────

export const ReferenceSnapshotPill = React.forwardRef<
  HTMLButtonElement,
  ReferenceSnapshotPillProps
>(function ReferenceSnapshotPill(
  {
    capturedAt,
    screenshotUrl,
    onClick,
    formatTime = defaultFormatTime,
    label = 'Reference snapshot',
    className,
  },
  ref,
) {
  const timeText = formatTime(capturedAt);
  const fullText = `${label} · ${timeText}`;
  const ariaLabel = `${label} taken at ${timeText} — click to view the original screenshot`;

  return (
    <button
      ref={ref}
      type="button"
      data-screenshot-url={screenshotUrl}
      data-captured-at={capturedAt.toISOString()}
      data-testid="reference-snapshot-pill"
      aria-label={ariaLabel}
      title="Click to view the original screenshot"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1',
        'rounded-full border-0 cursor-pointer',
        'px-3 py-1',
        'text-[var(--amp-font-size-xs)]',
        'bg-[var(--amp-semantic-color-info-soft)]',
        'text-[var(--amp-studio-theme-color-fg)]',
        'transition-shadow duration-[var(--amp-motion-duration-fast)]',
        'motion-reduce:transition-none',
        'hover:shadow-[var(--amp-shadow-xs)]',
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-[var(--amp-semantic-border-focus)]',
        'focus-visible:ring-offset-1',
        className,
      )}
    >
      {fullText}
    </button>
  );
});

ReferenceSnapshotPill.displayName = 'ReferenceSnapshotPill';
