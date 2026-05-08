import React from 'react';
import { cn } from '../../lib/cn';

/**
 * StatusBar — slim ~24px horizontal information strip.
 *
 * Studio v2 uses a `StatusBar` at the bottom of the cockpit to surface
 * thin contextual metadata (active model, last commit SHA, generation
 * count, current preset, etc). Other products may use it for thin
 * status footers under dashboards or alongside data-dense canvases.
 *
 * The bar renders as a `<dl>` with one `<dt>` / `<dd>` pair per item so
 * screen readers announce each cell as a label/value pair. Visual
 * treatment is single-row, hidden overflow, and a top border.
 *
 * Density-aware: `compact` and `comfortable` densities pick a tighter
 * row height; `spacious` adds a touch of vertical padding for
 * touch-friendly surfaces.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface StatusBarItem {
  /** Stable unique id — used as React key + DOM data attribute. */
  id: string;
  /** Small-caps label rendered before the value. */
  label: string;
  /** The displayed value. May be a string or any React node (icon + text, etc). */
  value: string | React.ReactNode;
  /**
   * `mono` renders the value in the system monospace stack — useful for
   * SHAs, version numbers, and other fixed-width identifiers.
   */
  variant?: 'default' | 'mono';
  /** When `true`, the value cell truncates with an ellipsis on overflow. */
  truncate?: boolean;
  /** Optional max width for the value cell, e.g. `'20rem'`. */
  maxWidth?: string;
}

export interface StatusBarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: StatusBarItem[];
  /**
   * `start` packs items left-aligned. `between` pushes the last item to
   * the right edge — useful for a primary identifier on the left and a
   * context cell (model / version) on the right.
   */
  align?: 'start' | 'between';
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

import { useDensity } from '../../lib/density';

export const StatusBar = React.forwardRef<HTMLDivElement, StatusBarProps>(
  ({ items, align = 'start', className, ...rest }, ref) => {
    const density = useDensity();

    // Density-aware vertical padding — keeps the ~24px target for compact
    // and comfortable, eases up to ~28px on spacious.
    const densityPadding =
      density === 'spacious'
        ? 'py-1.5'
        : density === 'compact'
          ? 'py-0.5'
          : 'py-1';

    return (
      <div
        ref={ref}
        role="region"
        aria-label={rest['aria-label'] ?? 'Status'}
        className={cn(
          'flex w-full items-center overflow-hidden',
          'border-t border-[var(--amp-semantic-border-subtle)]',
          'bg-[var(--amp-semantic-bg-surface)]',
          densityPadding,
          'px-3',
          'text-[var(--amp-semantic-text-secondary)]',
          'text-[11px]',
          className,
        )}
        {...rest}
      >
        <dl
          data-testid="status-bar-list"
          data-align={align}
          className={cn(
            'flex w-full min-w-0 items-center gap-3',
            align === 'between' && 'justify-start',
          )}
        >
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            const pushRight = align === 'between' && isLast && items.length > 1;

            return (
              <div
                key={item.id}
                data-testid={`status-bar-item-${item.id}`}
                data-item-id={item.id}
                data-variant={item.variant ?? 'default'}
                className={cn(
                  'flex min-w-0 shrink-0 items-baseline gap-1.5',
                  pushRight && 'ml-auto',
                )}
              >
                <dt
                  className={cn(
                    'shrink-0 text-[10px] font-semibold uppercase tracking-wider',
                    'text-[var(--amp-semantic-text-tertiary)]',
                  )}
                >
                  {item.label}
                </dt>
                <dd
                  className={cn(
                    'min-w-0 text-[11px] font-medium',
                    'text-[var(--amp-semantic-text-default)]',
                    item.variant === 'mono' &&
                      'font-mono [font-feature-settings:"tnum"_1] tabular-nums',
                    item.truncate && 'truncate',
                  )}
                  style={item.maxWidth ? { maxWidth: item.maxWidth } : undefined}
                  title={
                    item.truncate && typeof item.value === 'string'
                      ? item.value
                      : undefined
                  }
                >
                  {item.value}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    );
  },
);

StatusBar.displayName = 'StatusBar';
