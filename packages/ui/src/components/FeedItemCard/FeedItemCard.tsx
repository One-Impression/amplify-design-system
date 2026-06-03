'use client';

import React from 'react';
import { cn } from '../../lib/cn';

/**
 * FeedItemCard — peer activity feed card with type-colored accent bar.
 *
 * Rendered inside the Oportunities "Community" feed. Each card shows
 * a peer creator's action (event RSVP, new wish, habit log) with a
 * coloured left accent bar to visually categorise the activity type.
 *
 * This is a self-contained composed component. It does NOT introduce any
 * new visual primitives.
 *
 * Theme tokens consumed:
 *   --amp-oportunities-theme-color-border
 *   --amp-oportunities-theme-color-text-primary
 *   --amp-oportunities-theme-color-text-secondary
 *   --amp-oportunities-theme-color-text-tertiary
 *   --amp-oportunities-theme-color-ai-purple     (event accent)
 *   --amp-oportunities-theme-color-accent         (wish accent)
 *   --amp-oportunities-theme-color-status-success (habit accent)
 */

export type FeedItemType = 'event' | 'wish' | 'habit';

export interface FeedItemCardAvatar {
  initials: string;
  color?: string;
}

export interface FeedItemCardProps {
  type: FeedItemType;
  avatar: FeedItemCardAvatar;
  creatorName: string;
  action: string;
  title: string;
  emoji: string;
  metadata?: string;
  onReact?: () => void;
  onClick?: () => void;
  className?: string;
}

const ACCENT_COLORS: Record<FeedItemType, string> = {
  event: 'var(--amp-oportunities-theme-color-ai-purple, #7B5BFF)',
  wish: 'var(--amp-oportunities-theme-color-accent, #E68F47)',
  habit: 'var(--amp-oportunities-theme-color-status-success, #5A8E4F)',
};

export const FeedItemCard = React.forwardRef<HTMLDivElement, FeedItemCardProps>(
  ({ type, avatar, creatorName, action, title, emoji, metadata, onReact, onClick, className }, ref) => {
    const accentColor = ACCENT_COLORS[type];

    return (
      <div
        ref={ref}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
        className={cn(
          'flex overflow-hidden',
          onClick && 'cursor-pointer',
          className,
        )}
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--amp-oportunities-theme-color-border, #E8E4DF)',
          borderRadius: 12,
        }}
      >
        {/* Left accent bar */}
        <div
          aria-hidden="true"
          style={{
            width: 4,
            flexShrink: 0,
            background: accentColor,
          }}
        />

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col gap-1.5" style={{ padding: 12 }}>
          {/* Top row — avatar + creator name + action */}
          <div className="flex items-center gap-2">
            <div
              className="flex flex-shrink-0 items-center justify-center"
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: avatar.color || accentColor,
                color: '#FFFFFF',
                fontSize: 11,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
              }}
            >
              {avatar.initials}
            </div>
            <span
              className="truncate"
              style={{
                fontSize: 13,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                color: 'var(--amp-oportunities-theme-color-text-primary, #1A1715)',
              }}
            >
              {creatorName}
            </span>
            <span
              className="truncate"
              style={{
                fontSize: 13,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                color: 'var(--amp-oportunities-theme-color-text-secondary, #6B6560)',
              }}
            >
              {action}
            </span>
          </div>

          {/* Bottom row — emoji + title + metadata */}
          <div className="flex items-center gap-1.5">
            <span style={{ fontSize: 16, flexShrink: 0 }} aria-hidden="true">
              {emoji}
            </span>
            <span
              className="truncate"
              style={{
                fontSize: 14,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                color: 'var(--amp-oportunities-theme-color-text-primary, #1A1715)',
              }}
            >
              {title}
            </span>
            {metadata && (
              <span
                className="flex-shrink-0"
                style={{
                  fontSize: 11,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  color: 'var(--amp-oportunities-theme-color-text-tertiary, #8A7F73)',
                  marginLeft: 4,
                }}
              >
                {metadata}
              </span>
            )}
          </div>
        </div>

        {/* Optional react button */}
        {onReact && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onReact();
            }}
            aria-label="React"
            className="flex flex-shrink-0 items-center justify-center self-center"
            style={{
              width: 32,
              height: 32,
              marginRight: 8,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 16,
              borderRadius: 8,
              transition: 'background 150ms ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                'var(--amp-oportunities-theme-color-accent-soft, #FFF3E8)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'none';
            }}
          >
            <span aria-hidden="true" role="img">
              ❤️
            </span>
          </button>
        )}
      </div>
    );
  },
);

FeedItemCard.displayName = 'FeedItemCard';
