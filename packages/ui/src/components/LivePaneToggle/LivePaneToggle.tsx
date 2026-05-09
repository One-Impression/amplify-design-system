'use client';

import React from 'react';
import { cn } from '../../lib/cn';

/**
 * LivePaneToggle — 3-state pane-mode control for Magic Studio Option-D cockpit.
 *
 * Distinct from the generic `SegmentedControl` because it owns pane-state
 * semantics: switching to `"live"` or `"split"` mounts a live iframe of
 * `liveUrl`; switching to `"variants"` unmounts it. Consumers wire the
 * iframe themselves; this primitive is the control surface only.
 *
 * Renders as a pill-shaped 3-button group matching the `.seg` block in
 * `magic-studio/docs/mockups/option-d.html`. The active button uses an
 * inverted fill (foreground bg, elevated-bg fg) to read as a "selected"
 * state. Standard ARIA radiogroup semantics with roving tabindex and
 * arrow-key navigation.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type LivePaneMode = 'live' | 'variants' | 'split';

export interface LivePaneToggleProps {
  /** Currently selected pane mode (controlled). */
  value: LivePaneMode;
  /** Fired on activation (click, Enter, Space, Arrow). */
  onChange: (value: LivePaneMode) => void;
  /**
   * Live URL the consumer mounts in its iframe when value !== 'variants'.
   * Stored on a `data-live-url` attribute on the wrapper for analytics /
   * dev-tools introspection. The toggle itself does NOT render the iframe.
   */
  liveUrl?: string;
  /** Optional label for the radiogroup. Defaults to `"Pane mode"`. */
  ariaLabel?: string;
  /** Disable the entire control. */
  disabled?: boolean;
  className?: string;
}

interface ModeOption {
  value: LivePaneMode;
  label: string;
}

const MODES: readonly ModeOption[] = Object.freeze([
  { value: 'live', label: 'Live' },
  { value: 'variants', label: 'Variants' },
  { value: 'split', label: 'Split' },
]);

// ─── Component ───────────────────────────────────────────────────────────────

export const LivePaneToggle = React.forwardRef<HTMLDivElement, LivePaneToggleProps>(
  function LivePaneToggle(
    { value, onChange, liveUrl, ariaLabel = 'Pane mode', disabled = false, className },
    ref,
  ) {
    const buttonRefs = React.useRef<Map<LivePaneMode, HTMLButtonElement>>(new Map());

    const setRef = (mode: LivePaneMode) => (el: HTMLButtonElement | null) => {
      const map = buttonRefs.current;
      if (el) map.set(mode, el);
      else map.delete(mode);
    };

    const focusByOffset = (current: LivePaneMode, offset: number) => {
      if (disabled) return;
      const idx = MODES.findIndex((m) => m.value === current);
      if (idx === -1) return;
      const next = MODES[(idx + offset + MODES.length) % MODES.length];
      buttonRefs.current.get(next.value)?.focus();
      onChange(next.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, mode: LivePaneMode) => {
      if (disabled) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        focusByOffset(mode, 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        focusByOffset(mode, -1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        const first = MODES[0];
        buttonRefs.current.get(first.value)?.focus();
        onChange(first.value);
      } else if (e.key === 'End') {
        e.preventDefault();
        const last = MODES[MODES.length - 1];
        buttonRefs.current.get(last.value)?.focus();
        onChange(last.value);
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        onChange(mode);
      }
    };

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        data-live-url={liveUrl || undefined}
        data-value={value}
        className={cn(
          'inline-flex items-center gap-0.5 p-0.5',
          'rounded-full border',
          'border-[var(--amp-studio-theme-color-border)]',
          'bg-[var(--amp-studio-theme-color-bg)]',
          disabled && 'opacity-50',
          className,
        )}
      >
        {MODES.map((mode) => {
          const isActive = mode.value === value;
          return (
            <button
              key={mode.value}
              ref={setRef(mode.value)}
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-label={mode.label}
              data-value={mode.value}
              data-active={isActive}
              data-testid={`live-pane-toggle-${mode.value}`}
              disabled={disabled}
              tabIndex={isActive ? 0 : -1}
              onClick={() => {
                if (!disabled) onChange(mode.value);
              }}
              onKeyDown={(e) => handleKeyDown(e, mode.value)}
              className={cn(
                'inline-flex items-center justify-center',
                'rounded-full border-0',
                'px-3 py-1 text-[var(--amp-font-size-sm)] font-[var(--amp-font-weight-medium)]',
                'transition-colors duration-[var(--amp-motion-duration-fast)]',
                'motion-reduce:transition-none',
                'focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-[var(--amp-semantic-border-focus)]',
                'focus-visible:ring-offset-1',
                'cursor-pointer',
                disabled && 'cursor-not-allowed',
                isActive
                  ? 'bg-[var(--amp-studio-theme-color-fg)] text-[var(--amp-studio-theme-color-bg-elev)]'
                  : 'bg-transparent text-[var(--amp-studio-theme-color-muted)] hover:text-[var(--amp-studio-theme-color-fg)]',
              )}
            >
              {mode.label}
            </button>
          );
        })}
      </div>
    );
  },
);

LivePaneToggle.displayName = 'LivePaneToggle';
