'use client';

import React from 'react';
import { cn } from '../../lib/cn';

/**
 * StatTabs — horizontal scrollable stat tabs for the Oportunities
 * creator profile (A6 pattern).
 *
 * Each tab shows an emoji, a bold count, and a label in a vertical stack.
 * Active tab uses accent-soft bg; inactive tabs are transparent.
 *
 * Tokens consumed:
 *   --amp-oportunities-accent-soft    (active tab bg)
 *   --amp-oportunities-accent         (active tab text)
 *   --amp-oportunities-text-secondary (inactive tab text)
 */

export interface StatTab {
  /** Emoji displayed at the top of the tab. */
  emoji: string;
  /** Numeric count. */
  count: number;
  /** Label below the count, e.g. "Events". */
  label: string;
}

export interface StatTabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Array of stat tab items. */
  tabs: StatTab[];
  /** Index of the active tab. */
  activeIndex?: number;
  /** Called when a tab is selected. */
  onTabChange?: (index: number) => void;
  className?: string;
}

export const StatTabs = React.forwardRef<HTMLDivElement, StatTabsProps>(
  ({ tabs, activeIndex = 0, onTabChange, className, style, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        role="tablist"
        className={cn('flex', className)}
        style={{
          overflowX: 'auto',
          gap: 8,
          // Hide scrollbar
          scrollbarWidth: 'none' as const,
          msOverflowStyle: 'none' as const,
          ...style,
        }}
        {...rest}
      >
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`${tab.label}: ${tab.count}`}
              onClick={() => onTabChange?.(index)}
              style={{
                display: 'flex',
                flexDirection: 'column' as const,
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 16px',
                borderRadius: 12,
                border: 'none',
                background: isActive ? 'var(--amp-oportunities-accent-soft, #FFE9D2)' : 'transparent',
                color: isActive
                  ? 'var(--amp-oportunities-accent, #E68F47)'
                  : 'var(--amp-oportunities-text-secondary, #6B5C4D)',
                cursor: 'pointer',
                flexShrink: 0,
                gap: 2,
                transition: 'background 0.15s ease, color 0.15s ease',
              }}
            >
              {/* Emoji */}
              <span aria-hidden="true" style={{ fontSize: 14, lineHeight: 1 }}>
                {tab.emoji}
              </span>

              {/* Count */}
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: 1.2,
                }}
              >
                {tab.count}
              </span>

              {/* Label */}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 400,
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: 1.2,
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  },
);

StatTabs.displayName = 'StatTabs';
