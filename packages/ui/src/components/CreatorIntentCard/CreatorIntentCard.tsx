'use client';

import React from 'react';
import { cn } from '../../lib/cn';
import { Card } from '../Card';
import { Avatar } from '../Avatar';
import { Badge } from '../Badge';

/**
 * CreatorIntentCard — the signature Oportunities product card.
 *
 * Surfaces a creator's *declared intent* to a brand: who they are, what
 * they want to partner on, the AI fit score, and an unlock CTA. Used in
 * the brand-side "Intent Feed" (the core Oportunities discovery surface).
 *
 * This is a composed primitive — it stacks Card + Avatar + Badge from
 * the design system. It does NOT introduce any new visual primitive.
 *
 * Theme tokens consumed:
 *   --amp-oportunities-theme-color-accent       (apricot — unlock CTA)
 *   --amp-oportunities-theme-color-ai-purple    (AI fit pill)
 *   --amp-oportunities-theme-color-ai-soft      (AI fit pill bg)
 *   --amp-oportunities-theme-color-text-primary
 *   --amp-oportunities-theme-color-text-secondary
 */

export interface CreatorIntentCardCreator {
  name: string;
  handle: string;
  niche: string;
  /** Follower count — either a formatted string ("128K") or a raw number. */
  followers: string | number;
  /**
   * Optional CSS gradient applied to the Avatar background when no `src`
   * is supplied (e.g. `'linear-gradient(135deg, #E68F47, #7B5BFF)'`).
   */
  avatarGradient?: string;
  /** Optional avatar image URL (wins over `avatarGradient`). */
  avatarSrc?: string;
}

export interface CreatorIntentCardIntent {
  /** Short summary line — the "I want to…" phrase. */
  headline: string;
  /** Human-readable date range. */
  dateRange: string;
  /** Tone descriptor (e.g. 'editorial · slow-luxe · brand-led'). */
  vibe: string;
  /** Optional list of partnership shapes the creator is open to. */
  openTo?: string[];
}

export interface CreatorIntentCardProps {
  creator: CreatorIntentCardCreator;
  intent: CreatorIntentCardIntent;
  /** 0–100 AI fit score. When set, shows the purple AI fit pill. */
  aiFitScore?: number;
  /** Click handler for the apricot "Unlock" CTA. */
  onUnlock?: () => void;
  /** Override the CTA label. Default: 'Unlock intent'. */
  unlockLabel?: string;
  /** Disable the CTA. */
  disabled?: boolean;
  className?: string;
}

function formatFollowers(value: string | number): string {
  if (typeof value === 'string') return value;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value % 1000 === 0 ? 0 : 1)}K`;
  return String(value);
}

function initialsFor(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0))
    .join('')
    .toUpperCase();
}

export const CreatorIntentCard = React.forwardRef<HTMLDivElement, CreatorIntentCardProps>(
  ({ creator, intent, aiFitScore, onUnlock, unlockLabel = 'Unlock intent', disabled = false, className }, ref) => {
    const initials = initialsFor(creator.name);
    const followers = formatFollowers(creator.followers);

    return (
      <Card
        ref={ref as React.Ref<HTMLElement>}
        variant="elevated"
        padding="comfortable"
        className={cn('flex flex-col gap-4', className)}
      >
        {/* Header — avatar + creator info + AI fit pill */}
        <div className="flex items-start gap-3">
          <div
            className="flex-shrink-0"
            style={
              !creator.avatarSrc && creator.avatarGradient
                ? ({
                    // Inline-style wrapper lets us paint the gradient behind Avatar's initials
                    borderRadius: '9999px',
                    background: creator.avatarGradient,
                    padding: 0,
                    display: 'inline-flex',
                  } as React.CSSProperties)
                : undefined
            }
          >
            <Avatar
              src={creator.avatarSrc}
              initials={initials}
              size="lg"
              alt={creator.name}
              className={!creator.avatarSrc && creator.avatarGradient ? 'bg-transparent' : undefined}
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span
              className="truncate text-[15px] font-semibold"
              style={{ color: 'var(--amp-oportunities-theme-color-text-primary)' }}
            >
              {creator.name}
            </span>
            <span
              className="truncate text-[13px]"
              style={{ color: 'var(--amp-oportunities-theme-color-text-secondary)' }}
            >
              {creator.handle} · {creator.niche} · {followers}
            </span>
          </div>

          {typeof aiFitScore === 'number' && (
            <span
              data-testid="ai-fit-pill"
              className="flex-shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold"
              style={{
                background: 'var(--amp-oportunities-theme-color-ai-soft)',
                color: 'var(--amp-oportunities-theme-color-ai-purple)',
              }}
            >
              <span aria-hidden="true">●</span>
              AI fit {Math.round(aiFitScore)}
            </span>
          )}
        </div>

        {/* Intent block */}
        <div className="flex flex-col gap-2">
          <p
            className="text-[15px] leading-snug"
            style={{ color: 'var(--amp-oportunities-theme-color-text-primary)' }}
          >
            {intent.headline}
          </p>
          <div
            className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px]"
            style={{ color: 'var(--amp-oportunities-theme-color-text-secondary)' }}
          >
            <span>{intent.dateRange}</span>
            <span aria-hidden="true">·</span>
            <span>{intent.vibe}</span>
          </div>
          {intent.openTo && intent.openTo.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {intent.openTo.map((tag) => (
                <Badge key={tag} variant="neutral" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Footer — unlock CTA */}
        <div className="flex items-center justify-end pt-1">
          <button
            type="button"
            data-testid="unlock-cta"
            onClick={onUnlock}
            disabled={disabled}
            className={cn(
              'inline-flex items-center justify-center rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
            style={{
              background: 'var(--amp-oportunities-theme-color-accent)',
              color: '#FFFFFF',
            }}
          >
            {unlockLabel}
          </button>
        </div>
      </Card>
    );
  },
);

CreatorIntentCard.displayName = 'CreatorIntentCard';
