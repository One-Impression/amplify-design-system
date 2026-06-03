'use client';

import React from 'react';
import { cn } from '../../lib/cn';

/**
 * BrandStripTeaser — gradient teaser strip linking to brand interest or
 * peer feed in the Oportunities app.
 *
 * Two variants:
 *   - `brand`: accent-soft → ai-soft gradient, briefcase icon
 *   - `feed`: ai-soft solid bg, people icon
 *
 * Tokens consumed:
 *   --amp-oportunities-accent-soft    (#FFE9D2)
 *   --amp-oportunities-ai-soft        (#EFEAFF)
 *   --amp-oportunities-text-primary   (text color)
 *   --amp-oportunities-text-tertiary  (chevron color)
 */

export interface BrandStripTeaserProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Visual variant. */
  variant: 'brand' | 'feed';
  /** Teaser text, e.g. "See what brands are interested". */
  text: string;
  /** Click handler. */
  onClick?: () => void;
  className?: string;
}

const VARIANT_CONFIG = {
  brand: {
    background: 'linear-gradient(135deg, var(--amp-oportunities-accent-soft, #FFE9D2) 0%, var(--amp-oportunities-ai-soft, #EFEAFF) 100%)',
    icon: '💼', // 💼
  },
  feed: {
    background: 'var(--amp-oportunities-ai-soft, #EFEAFF)',
    icon: '👥', // 👥
  },
} as const;

export const BrandStripTeaser = React.forwardRef<HTMLButtonElement, BrandStripTeaserProps>(
  ({ variant, text, onClick, className, style, ...rest }, ref) => {
    const config = VARIANT_CONFIG[variant];

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={cn('flex items-center w-full', className)}
        style={{
          borderRadius: 14,
          padding: '12px 16px',
          background: config.background,
          border: 'none',
          cursor: 'pointer',
          gap: 8,
          textAlign: 'left' as const,
          ...style,
        }}
        {...rest}
      >
        {/* Icon */}
        <span aria-hidden="true" style={{ fontSize: 14, lineHeight: 1, flexShrink: 0 }}>
          {config.icon}
        </span>

        {/* Text */}
        <span
          style={{
            flex: 1,
            fontSize: 13,
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            color: 'var(--amp-oportunities-text-primary, #1A1207)',
            lineHeight: 1.3,
          }}
        >
          {text}
        </span>

        {/* Chevron */}
        <span
          aria-hidden="true"
          style={{
            fontSize: 14,
            color: 'var(--amp-oportunities-text-tertiary, #9C8B74)',
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          {'›'}
        </span>
      </button>
    );
  },
);

BrandStripTeaser.displayName = 'BrandStripTeaser';
