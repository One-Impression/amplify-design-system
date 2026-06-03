'use client';

import React from 'react';
import { cn } from '../../lib/cn';

/**
 * HabitCategoryCard — collapsible category card for habits/wishlist selection.
 *
 * Used on the Oportunities onboarding and profile-edit flows to let
 * creators pick habits and wishes grouped by category. The body slot
 * accepts chip children for the individual selectable items.
 *
 * This is a self-contained composed component. It does NOT introduce any
 * new visual primitives.
 *
 * Theme tokens consumed:
 *   --amp-oportunities-theme-color-border
 *   --amp-oportunities-theme-color-text-primary
 *   --amp-oportunities-theme-color-accent
 *   --amp-oportunities-theme-color-accent-soft
 */

export interface HabitCategoryCardProps {
  emoji: string;
  name: string;
  selectedCount: number;
  maxCount: number;
  expanded?: boolean;
  onToggle?: () => void;
  children?: React.ReactNode;
  className?: string;
}

/** Inline keyframes for collapse animation. */
const COLLAPSE_STYLE_ID = 'amp-habit-category-collapse';

function ensureCollapseStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(COLLAPSE_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = COLLAPSE_STYLE_ID;
  style.textContent = `
.amp-habit-body-collapsed { max-height: 0; overflow: hidden; transition: max-height 200ms ease-out; }
.amp-habit-body-expanded { max-height: 500px; overflow: hidden; transition: max-height 200ms ease-out; }
.amp-habit-chevron { transition: transform 200ms ease; }
.amp-habit-chevron-open { transform: rotate(90deg); }`;
  document.head.appendChild(style);
}

export const HabitCategoryCard = React.forwardRef<HTMLDivElement, HabitCategoryCardProps>(
  ({ emoji, name, selectedCount, maxCount, expanded = false, onToggle, children, className }, ref) => {
    React.useEffect(() => {
      ensureCollapseStyles();
    }, []);

    return (
      <div
        ref={ref}
        className={cn(className)}
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--amp-oportunities-theme-color-border, #E8E4DF)',
          borderRadius: 12,
        }}
      >
        {/* Header */}
        <div
          role="button"
          tabIndex={0}
          onClick={onToggle}
          onKeyDown={onToggle ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } } : undefined}
          className="flex items-center justify-between"
          style={{
            padding: '12px 16px',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 18 }} aria-hidden="true">
              {emoji}
            </span>
            <span
              style={{
                fontSize: 14,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                color: 'var(--amp-oportunities-theme-color-text-primary, #1A1715)',
              }}
            >
              {name}
            </span>
            <span
              style={{
                background: 'var(--amp-oportunities-theme-color-accent-soft, #FFF3E8)',
                color: 'var(--amp-oportunities-theme-color-accent, #E68F47)',
                padding: '6px 8px',
                borderRadius: 8,
                fontSize: 11,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
              }}
            >
              {selectedCount}/{maxCount}
            </span>
          </div>

          {/* Chevron */}
          <span
            aria-hidden="true"
            className={cn('amp-habit-chevron', expanded && 'amp-habit-chevron-open')}
            style={{
              fontSize: 14,
              color: 'var(--amp-oportunities-theme-color-text-primary, #1A1715)',
            }}
          >
            ›
          </span>
        </div>

        {/* Body — children (chips) */}
        <div className={expanded ? 'amp-habit-body-expanded' : 'amp-habit-body-collapsed'}>
          <div
            className="flex flex-wrap gap-2"
            style={{ padding: '0 16px 12px 16px' }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);

HabitCategoryCard.displayName = 'HabitCategoryCard';
