'use client';

import React from 'react';
import { cn } from '../../lib/cn';
import { Card } from '../Card';
import { Badge } from '../Badge';

/**
 * BrandInterestCard — creator-side equivalent of CreatorIntentCard.
 *
 * Rendered inside the creator app inbox to surface a brand that has
 * expressed interest in partnering with the creator. Composes Card and
 * Badge from the design system; introduces no new visual primitives.
 *
 * Theme tokens consumed:
 *   --amp-oportunities-theme-color-accent       (Reply CTA)
 *   --amp-oportunities-theme-color-text-primary
 *   --amp-oportunities-theme-color-text-secondary
 *   --amp-oportunities-theme-color-ai-purple    (AI fit pill)
 *   --amp-oportunities-theme-color-ai-soft      (AI fit pill bg)
 *   --amp-oportunities-theme-color-border       (Decline outline)
 */

export interface BrandInterestCardBrand {
  name: string;
  /** Logo URL — when omitted, renders an initial-based square fallback. */
  logo?: string;
  category: string;
}

export interface BrandInterestCardInterest {
  /** Short headline (e.g. "Wants you for spring launch"). */
  headline: string;
  /** Personalised message from the brand. */
  message: string;
  /** 0–100 AI fit score for this interest. Optional. */
  aiFitScore?: number;
}

export interface BrandInterestCardProps {
  brand: BrandInterestCardBrand;
  interest: BrandInterestCardInterest;
  onReply?: () => void;
  onDecline?: () => void;
  /** Override the Reply CTA label. Default: 'Reply'. */
  replyLabel?: string;
  /** Override the Decline CTA label. Default: 'Decline'. */
  declineLabel?: string;
  className?: string;
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

export const BrandInterestCard = React.forwardRef<HTMLDivElement, BrandInterestCardProps>(
  (
    {
      brand,
      interest,
      onReply,
      onDecline,
      replyLabel = 'Reply',
      declineLabel = 'Decline',
      className,
    },
    ref,
  ) => {
    return (
      <Card
        ref={ref as React.Ref<HTMLElement>}
        variant="elevated"
        padding="comfortable"
        className={cn('flex flex-col gap-4', className)}
      >
        {/* Header — brand logo + name/category + AI fit pill */}
        <div className="flex items-start gap-3">
          <div
            data-testid="brand-logo"
            aria-hidden="true"
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-[10px] text-[14px] font-semibold"
            style={{
              background: 'var(--amp-oportunities-theme-color-bg-soft)',
              color: 'var(--amp-oportunities-theme-color-text-primary)',
              border: '1px solid var(--amp-oportunities-theme-color-border)',
            }}
          >
            {brand.logo ? (
              <img src={brand.logo} alt={brand.name} className="h-full w-full object-cover" />
            ) : (
              <span>{initialsFor(brand.name)}</span>
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span
              className="truncate text-[15px] font-semibold"
              style={{ color: 'var(--amp-oportunities-theme-color-text-primary)' }}
            >
              {brand.name}
            </span>
            <span
              className="truncate text-[13px]"
              style={{ color: 'var(--amp-oportunities-theme-color-text-secondary)' }}
            >
              {brand.category}
            </span>
          </div>

          {typeof interest.aiFitScore === 'number' && (
            <span
              data-testid="ai-fit-pill"
              className="flex-shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold"
              style={{
                background: 'var(--amp-oportunities-theme-color-ai-soft)',
                color: 'var(--amp-oportunities-theme-color-ai-purple)',
              }}
            >
              <span aria-hidden="true">●</span>
              AI fit {Math.round(interest.aiFitScore)}
            </span>
          )}
        </div>

        {/* Interest block */}
        <div className="flex flex-col gap-2">
          <Badge variant="brand" size="sm">
            {interest.headline}
          </Badge>
          <p
            className="text-[14px] leading-snug"
            style={{ color: 'var(--amp-oportunities-theme-color-text-primary)' }}
          >
            {interest.message}
          </p>
        </div>

        {/* Footer — Reply (primary apricot) + Decline (ghost) */}
        <div className="flex items-center justify-end gap-2 pt-1">
          {onDecline && (
            <button
              type="button"
              data-testid="decline-cta"
              onClick={onDecline}
              className={cn(
                'inline-flex items-center justify-center rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              )}
              style={{
                background: 'transparent',
                color: 'var(--amp-oportunities-theme-color-text-secondary)',
                border: '1px solid var(--amp-oportunities-theme-color-border)',
              }}
            >
              {declineLabel}
            </button>
          )}
          <button
            type="button"
            data-testid="reply-cta"
            onClick={onReply}
            className={cn(
              'inline-flex items-center justify-center rounded-full px-4 py-2 text-[13px] font-semibold transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            )}
            style={{
              background: 'var(--amp-oportunities-theme-color-accent)',
              color: '#FFFFFF',
            }}
          >
            {replyLabel}
          </button>
        </div>
      </Card>
    );
  },
);

BrandInterestCard.displayName = 'BrandInterestCard';
