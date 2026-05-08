'use client';

import React from 'react';
import { cn } from '../../lib/cn';
import { useDensity } from '../../lib/density';

/**
 * SegmentedControl — two-or-more-button segmented control.
 *
 * Generalises Studio's Grid|Map toggle. Renders a pill-shaped wrapper
 * with one button per option; the active segment slides over via a
 * positioned highlight layer. Standard ARIA radiogroup semantics:
 *
 * - Wrapper: `role="radiogroup"` + `aria-label`.
 * - Each option: `role="radio"` + `aria-checked`.
 * - Roving tabindex — only the active segment is in the tab order.
 * - Arrow keys cycle through options (and select on focus, mirroring
 *   the W3C native radio-group pattern). Enter / Space also select the
 *   focused segment.
 *
 * The active-segment slide animation honours `prefers-reduced-motion:
 * reduce` (transition disabled when the user prefers reduced motion).
 *
 * Density-aware: `compact` honours `size="sm"`-ish padding; `spacious`
 * eases up vertically for touch.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SegmentedControlOption<V extends string = string> {
  value: V;
  label: string;
  /** Optional leading icon. Rendered before the label. */
  icon?: React.ReactNode;
  /** Override the segment's accessible label (defaults to `label`). */
  ariaLabel?: string;
}

export interface SegmentedControlProps<V extends string = string> {
  /** Currently selected value (controlled). */
  value: V;
  options: SegmentedControlOption<V>[];
  onChange: (value: V) => void;
  /** Visual size — `sm` matches Studio's ~28px control; `md` is ~36px. */
  size?: 'sm' | 'md';
  /** Required for a11y — the radiogroup needs a label. */
  ariaLabel?: string;
  className?: string;
  /** Disable the entire control. */
  disabled?: boolean;
}

// ─── Density-aware sizing ───────────────────────────────────────────────────

const sizeClasses: Record<'sm' | 'md', { wrap: string; segment: string; gap: string }> = {
  sm: {
    wrap: 'p-0.5',
    segment: 'h-6 px-2.5 text-[12px]',
    gap: 'gap-1',
  },
  md: {
    wrap: 'p-1',
    segment: 'h-8 px-3 text-[13px]',
    gap: 'gap-1.5',
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export function SegmentedControl<V extends string = string>({
  value,
  options,
  onChange,
  size = 'md',
  ariaLabel,
  className,
  disabled = false,
}: SegmentedControlProps<V>) {
  const density = useDensity();

  // Density nudges segment height down/up by one tick.
  const effectiveSize: 'sm' | 'md' = density === 'compact' ? 'sm' : size;
  const sizing = sizeClasses[effectiveSize];

  const wrapRef = React.useRef<HTMLDivElement>(null);
  const segmentRefs = React.useRef<Map<V, HTMLButtonElement>>(new Map());

  const setSegmentRef = React.useCallback(
    (val: V) => (el: HTMLButtonElement | null) => {
      const map = segmentRefs.current;
      if (el) map.set(val, el);
      else map.delete(val);
    },
    [],
  );

  const focusByOffset = React.useCallback(
    (currentValue: V, offset: number) => {
      const enabled = options.filter((o) => !disabled);
      if (enabled.length === 0) return;
      const idx = enabled.findIndex((o) => o.value === currentValue);
      if (idx === -1) return;
      const nextIdx = (idx + offset + enabled.length) % enabled.length;
      const nextOpt = enabled[nextIdx];
      const el = segmentRefs.current.get(nextOpt.value);
      el?.focus();
      // Roving focus also selects, matching W3C radiogroup pattern.
      onChange(nextOpt.value);
    },
    [options, disabled, onChange],
  );

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    optionValue: V,
  ) => {
    if (disabled) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      focusByOffset(optionValue, 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      focusByOffset(optionValue, -1);
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(optionValue);
    } else if (e.key === 'Home') {
      e.preventDefault();
      const first = options[0];
      if (first) {
        segmentRefs.current.get(first.value)?.focus();
        onChange(first.value);
      }
    } else if (e.key === 'End') {
      e.preventDefault();
      const last = options[options.length - 1];
      if (last) {
        segmentRefs.current.get(last.value)?.focus();
        onChange(last.value);
      }
    }
  };

  // Compute highlight position from the active segment's offset.
  const [highlight, setHighlight] = React.useState<{
    left: number;
    width: number;
  } | null>(null);

  const recomputeHighlight = React.useCallback(() => {
    const wrap = wrapRef.current;
    const active = segmentRefs.current.get(value);
    if (!wrap || !active) {
      setHighlight(null);
      return;
    }
    const wrapRect = wrap.getBoundingClientRect();
    const segRect = active.getBoundingClientRect();
    setHighlight({
      left: segRect.left - wrapRect.left,
      width: segRect.width,
    });
  }, [value]);

  // Recompute highlight on value change, mount, and resize.
  React.useEffect(() => {
    recomputeHighlight();
  }, [recomputeHighlight, options.length, effectiveSize]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => recomputeHighlight();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [recomputeHighlight]);

  return (
    <div
      ref={wrapRef}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      data-size={effectiveSize}
      data-density={density}
      className={cn(
        'relative inline-flex items-center',
        'rounded-full border border-[var(--amp-semantic-border-default)]',
        'bg-[var(--amp-semantic-bg-subtle)]',
        sizing.wrap,
        sizing.gap,
        disabled && 'opacity-50',
        className,
      )}
    >
      {/* Sliding highlight layer */}
      {highlight && (
        <span
          aria-hidden="true"
          data-testid="segmented-control-highlight"
          className={cn(
            'pointer-events-none absolute top-1/2 -translate-y-1/2',
            'rounded-full',
            'bg-[var(--amp-semantic-bg-surface)]',
            'shadow-sm',
            'ring-1 ring-[var(--amp-semantic-border-subtle)]',
            'transition-[left,width] duration-150 ease-out',
            // honour reduced motion — no slide
            'motion-reduce:transition-none',
          )}
          style={{
            left: highlight.left,
            width: highlight.width,
            // Match segment height so the pill aligns vertically.
            height:
              effectiveSize === 'sm'
                ? 'calc(1.5rem)' // h-6
                : 'calc(2rem)', // h-8
          }}
        />
      )}

      {options.map((opt) => {
        const isActive = opt.value === value;
        const tabIndex = isActive ? 0 : -1;

        return (
          <button
            key={opt.value}
            ref={setSegmentRef(opt.value)}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={opt.ariaLabel ?? opt.label}
            data-value={opt.value}
            data-active={isActive}
            data-testid={`segmented-control-option-${opt.value}`}
            disabled={disabled}
            tabIndex={tabIndex}
            onClick={() => {
              if (!disabled) onChange(opt.value);
            }}
            onKeyDown={(e) => handleKeyDown(e, opt.value)}
            className={cn(
              'relative z-[1] inline-flex items-center justify-center gap-1.5',
              'rounded-full font-medium',
              'transition-colors duration-150',
              'motion-reduce:transition-none',
              'focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-[var(--amp-semantic-border-focus)]',
              'focus-visible:ring-offset-1',
              sizing.segment,
              isActive
                ? 'text-[var(--amp-semantic-text-default)]'
                : 'text-[var(--amp-semantic-text-secondary)] hover:text-[var(--amp-semantic-text-default)]',
              disabled && 'cursor-not-allowed',
            )}
          >
            {opt.icon && (
              <span aria-hidden="true" className="inline-flex shrink-0 items-center">
                {opt.icon}
              </span>
            )}
            <span className="truncate">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

SegmentedControl.displayName = 'SegmentedControl';
