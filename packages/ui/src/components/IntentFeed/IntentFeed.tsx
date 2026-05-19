'use client';

import React from 'react';
import { cn } from '../../lib/cn';
import { CreatorIntentCard, type CreatorIntentCardProps } from '../CreatorIntentCard';

/**
 * IntentFeed — container that renders a filter strip + a responsive grid
 * of CreatorIntentCards. The brand-side discovery surface for
 * Oportunities.
 *
 * Composition only — no new visual primitives are introduced. The filter
 * strip is rendered as a row of pill buttons; selection state is
 * controlled via `activeFilters`.
 *
 * Theme tokens consumed:
 *   --amp-oportunities-theme-color-text-primary
 *   --amp-oportunities-theme-color-text-secondary
 *   --amp-oportunities-theme-color-accent       (active filter chip)
 *   --amp-oportunities-theme-color-accent-soft  (active filter bg)
 *   --amp-oportunities-theme-color-border
 *   --amp-oportunities-theme-color-bg-elev
 */

export interface IntentFeedFilters {
  category?: string[];
  effort?: string[];
  freshness?: string[];
}

export interface IntentFeedFilterChange {
  group: keyof IntentFeedFilters;
  value: string;
  /** True if newly selected, false if deselected. */
  selected: boolean;
}

export interface IntentFeedProps {
  cards: CreatorIntentCardProps[];
  /** Filter options surfaced as pill rows. Each group is rendered as a labelled row. */
  filters?: IntentFeedFilters;
  /** Currently active filter selections per group. */
  activeFilters?: IntentFeedFilters;
  /** Called whenever the user toggles a filter chip. */
  onFilter?: (change: IntentFeedFilterChange) => void;
  /** Forwarded to every card's `onUnlock`. The card index is passed so consumers can route. */
  onUnlock?: (cardIndex: number) => void;
  /** Optional heading rendered above the filter strip. */
  heading?: React.ReactNode;
  /** Empty-state node rendered when `cards.length === 0`. */
  emptyState?: React.ReactNode;
  className?: string;
}

const FILTER_GROUP_LABELS: Record<keyof IntentFeedFilters, string> = {
  category: 'Category',
  effort: 'Effort',
  freshness: 'Freshness',
};

function isActive(active: IntentFeedFilters | undefined, group: keyof IntentFeedFilters, value: string): boolean {
  return Boolean(active?.[group]?.includes(value));
}

export const IntentFeed = React.forwardRef<HTMLDivElement, IntentFeedProps>(
  ({ cards, filters, activeFilters, onFilter, onUnlock, heading, emptyState, className }, ref) => {
    const filterGroups = (Object.keys(FILTER_GROUP_LABELS) as Array<keyof IntentFeedFilters>).filter(
      (group) => (filters?.[group]?.length ?? 0) > 0,
    );

    return (
      <div ref={ref} className={cn('flex flex-col gap-6', className)}>
        {heading && (
          <div
            className="text-[20px] font-semibold"
            style={{
              color: 'var(--amp-oportunities-theme-color-text-primary)',
              fontFamily: 'var(--amp-oportunities-font-display)',
              letterSpacing: 'var(--amp-oportunities-letter-spacing-tight, -0.04em)',
            }}
          >
            {heading}
          </div>
        )}

        {/* Filter strip */}
        {filterGroups.length > 0 && (
          <div
            data-testid="intent-feed-filters"
            className="flex flex-col gap-2 rounded-[12px] p-3"
            style={{
              background: 'var(--amp-oportunities-theme-color-bg-elev)',
              border: '1px solid var(--amp-oportunities-theme-color-border)',
            }}
          >
            {filterGroups.map((group) => (
              <div key={group} className="flex flex-wrap items-center gap-2">
                <span
                  className="text-[12px] font-semibold uppercase tracking-wide"
                  style={{ color: 'var(--amp-oportunities-theme-color-text-secondary)' }}
                >
                  {FILTER_GROUP_LABELS[group]}
                </span>
                {filters?.[group]?.map((value) => {
                  const active = isActive(activeFilters, group, value);
                  return (
                    <button
                      key={value}
                      type="button"
                      data-testid={`filter-${group}-${value}`}
                      data-active={active}
                      onClick={() => onFilter?.({ group, value, selected: !active })}
                      className={cn(
                        'inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium transition-colors duration-150',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                      )}
                      style={
                        active
                          ? {
                              background: 'var(--amp-oportunities-theme-color-accent-soft)',
                              color: 'var(--amp-oportunities-theme-color-accent)',
                              border: '1px solid var(--amp-oportunities-theme-color-accent)',
                            }
                          : {
                              background: 'transparent',
                              color: 'var(--amp-oportunities-theme-color-text-secondary)',
                              border: '1px solid var(--amp-oportunities-theme-color-border)',
                            }
                      }
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* Card grid */}
        {cards.length === 0 ? (
          <div data-testid="intent-feed-empty">{emptyState}</div>
        ) : (
          <div
            data-testid="intent-feed-grid"
            className="grid gap-4"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}
          >
            {cards.map((card, idx) => (
              <CreatorIntentCard
                key={`${card.creator.handle}-${idx}`}
                {...card}
                onUnlock={() => {
                  card.onUnlock?.();
                  onUnlock?.(idx);
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);

IntentFeed.displayName = 'IntentFeed';
