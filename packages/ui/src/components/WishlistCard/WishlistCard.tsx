'use client';

import React from 'react';
import { cn } from '../../lib/cn';

/**
 * WishlistCard — individual wish item card with inline edit capability.
 *
 * Rendered inside the Oportunities creator wishlist surface. Each card
 * represents a single declared wish with an expiry countdown badge and
 * hover-revealed edit affordance.
 *
 * This is a self-contained composed component. It does NOT introduce any
 * new visual primitives.
 *
 * Theme tokens consumed:
 *   --amp-oportunities-theme-color-border
 *   --amp-oportunities-theme-color-text-primary
 *   --amp-oportunities-theme-color-text-secondary
 *   --amp-oportunities-theme-color-text-tertiary
 *   --amp-oportunities-theme-color-danger
 */

export interface WishlistCardProps {
  emoji: string;
  name: string;
  note?: string;
  expiresInDays: number;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

/** Inline keyframes for hover reveal. */
const HOVER_STYLE_ID = 'amp-wishlist-hover-keyframes';

function ensureHoverStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(HOVER_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = HOVER_STYLE_ID;
  style.textContent = `
.amp-wishlist-card .amp-wishlist-edit { opacity: 0; transition: opacity 150ms ease; }
.amp-wishlist-card:hover .amp-wishlist-edit { opacity: 1; }`;
  document.head.appendChild(style);
}

function expiryBadgeColor(days: number): string {
  return days > 30 ? '#2F8A4F' : '#C6892C';
}

export const WishlistCard = React.forwardRef<HTMLDivElement, WishlistCardProps>(
  ({ emoji, name, note, expiresInDays, onEdit, onDelete, className }, ref) => {
    React.useEffect(() => {
      ensureHoverStyles();
    }, []);

    return (
      <div
        ref={ref}
        className={cn('amp-wishlist-card flex items-center justify-between', className)}
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--amp-oportunities-theme-color-border, #E8E4DF)',
          borderRadius: 12,
          padding: '12px 16px',
        }}
      >
        {/* Left — emoji + name + note + edit pencil */}
        <div className="flex min-w-0 items-center gap-2">
          <span style={{ fontSize: 20, flexShrink: 0 }} aria-hidden="true">
            {emoji}
          </span>
          <div className="flex min-w-0 flex-col">
            <div className="flex items-center gap-1">
              <span
                className="truncate"
                style={{
                  fontSize: 14,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  color: 'var(--amp-oportunities-theme-color-text-primary, #1A1715)',
                }}
              >
                {name}
              </span>
              {onEdit && (
                <button
                  type="button"
                  className="amp-wishlist-edit"
                  onClick={onEdit}
                  aria-label={`Edit ${name}`}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    fontSize: 12,
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  ✏️
                </button>
              )}
            </div>
            {note && (
              <span
                className="truncate"
                style={{
                  fontSize: 12,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  fontStyle: 'italic',
                  color: 'var(--amp-oportunities-theme-color-text-tertiary, #8A7F73)',
                }}
              >
                {note}
              </span>
            )}
          </div>
        </div>

        {/* Right — expiry badge + delete */}
        <div className="flex flex-shrink-0 items-center gap-2">
          <span
            style={{
              background: expiryBadgeColor(expiresInDays),
              color: '#FFFFFF',
              padding: '6px 8px',
              borderRadius: 8,
              fontSize: 10,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            {expiresInDays}d left
          </span>

          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              aria-label={`Delete ${name}`}
              className="inline-flex items-center justify-center"
              style={{
                width: 24,
                height: 24,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                lineHeight: 1,
                color: 'var(--amp-oportunities-theme-color-text-tertiary, #8A7F73)',
                borderRadius: 4,
                transition: 'color 150ms ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  'var(--amp-oportunities-theme-color-danger, #D14343)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  'var(--amp-oportunities-theme-color-text-tertiary, #8A7F73)';
              }}
            >
              ×
            </button>
          )}
        </div>
      </div>
    );
  },
);

WishlistCard.displayName = 'WishlistCard';
