import React from 'react';
import { cn } from '../../lib/cn';

export type CTABandVariant = 'default' | 'accent' | 'inverted';
export type CTABandAlign = 'start' | 'center' | 'between';

export interface CTABandProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  heading: React.ReactNode;
  description?: React.ReactNode;
  primaryCta?: React.ReactNode;
  secondaryCta?: React.ReactNode;
  variant?: CTABandVariant;
  /** Layout — `between` puts copy and CTAs on opposite ends at md+. */
  align?: CTABandAlign;
}

const variantClasses: Record<CTABandVariant, string> = {
  default:
    'bg-[var(--amp-semantic-bg-sunken)] text-[var(--amp-semantic-text-primary)] border-y border-[var(--amp-semantic-border-default)]',
  accent:
    'bg-[var(--amp-semantic-bg-accent-subtle)] text-[var(--amp-semantic-text-primary)]',
  // TODO(phase-a): swap to amplify-surface tokens once phase A merges
  inverted: 'bg-neutral-900 text-white',
};

export const CTABand = React.forwardRef<HTMLElement, CTABandProps>(
  (
    {
      heading,
      description,
      primaryCta,
      secondaryCta,
      variant = 'default',
      align = 'between',
      className,
      ...props
    },
    ref
  ) => {
    const isInverted = variant === 'inverted';
    const isCenter = align === 'center';
    const isBetween = align === 'between';

    return (
      <section
        ref={ref}
        className={cn(
          'w-full px-4 md:px-8 lg:px-12 py-10 md:py-14',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'mx-auto max-w-7xl flex flex-col gap-6',
            isBetween && 'md:flex-row md:items-center md:justify-between md:gap-12',
            isCenter && 'items-center text-center'
          )}
        >
          <div className={cn('flex flex-col gap-2', isCenter && 'items-center')}>
            <h2
              className={cn(
                'text-[24px] md:text-[32px] font-bold tracking-tight',
                isInverted ? 'text-white' : 'text-[var(--amp-semantic-text-primary)]',
                isCenter && 'max-w-2xl'
              )}
            >
              {heading}
            </h2>
            {description && (
              <p
                className={cn(
                  'text-[16px] leading-relaxed',
                  isInverted
                    ? 'text-white/70'
                    : 'text-[var(--amp-semantic-text-secondary)]',
                  isCenter && 'max-w-xl'
                )}
              >
                {description}
              </p>
            )}
          </div>
          {(primaryCta || secondaryCta) && (
            <div className={cn('flex flex-wrap items-center gap-3', isCenter && 'justify-center')}>
              {primaryCta}
              {secondaryCta}
            </div>
          )}
        </div>
      </section>
    );
  }
);

CTABand.displayName = 'CTABand';
