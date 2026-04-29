import React from 'react';
import { cn } from '../../lib/cn';

export interface PricingFeature {
  /** Feature label. */
  label: React.ReactNode;
  /** Optional inclusion flag — defaults to `true`. */
  included?: boolean;
  /** Optional override text instead of a check/dash. */
  value?: React.ReactNode;
}

export interface PricingTier {
  id?: string;
  /** Plan name, e.g. "Pro". */
  name: React.ReactNode;
  /** Display price, already formatted. */
  price: React.ReactNode;
  /** e.g. "/ month". */
  billingPeriod?: React.ReactNode;
  /** Short tagline shown under the price. */
  description?: React.ReactNode;
  /** Feature list. */
  features: PricingFeature[];
  /** CTA element — typically a Button. */
  cta?: React.ReactNode;
  /** Highlight as the "most popular" tier. */
  highlighted?: boolean;
  /** Optional badge (e.g. "Most popular"). Used when `highlighted`. */
  badge?: React.ReactNode;
}

export interface PricingTableProps extends React.HTMLAttributes<HTMLDivElement> {
  tiers: PricingTier[];
  /** Optional currency / cadence note rendered above the grid. */
  caption?: React.ReactNode;
}

export const PricingTable = React.forwardRef<HTMLDivElement, PricingTableProps>(
  ({ tiers, caption, className, ...props }, ref) => {
    const cols = tiers.length;
    const colsClass =
      cols === 1
        ? 'grid-cols-1'
        : cols === 2
        ? 'grid-cols-1 md:grid-cols-2'
        : cols === 3
        ? 'grid-cols-1 md:grid-cols-3'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {caption && (
          <p className="text-center text-[14px] text-[var(--amp-semantic-text-secondary)] mb-6">
            {caption}
          </p>
        )}
        <div className={cn('grid gap-6', colsClass)}>
          {tiers.map((tier, idx) => (
            <article
              key={tier.id ?? idx}
              className={cn(
                'relative flex flex-col rounded-[20px] border bg-[var(--amp-semantic-bg-surface)] p-6 md:p-8',
                tier.highlighted
                  ? 'border-[var(--amp-semantic-border-accent)] shadow-lg ring-2 ring-[var(--amp-semantic-border-accent)]'
                  : 'border-[var(--amp-semantic-border-default)]'
              )}
              aria-label={typeof tier.name === 'string' ? tier.name : undefined}
            >
              {tier.highlighted && tier.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold uppercase tracking-wide bg-[var(--amp-semantic-accent)] text-[var(--amp-semantic-text-inverse)]">
                  {tier.badge}
                </span>
              )}
              <h3 className="text-[18px] font-semibold text-[var(--amp-semantic-text-primary)]">
                {tier.name}
              </h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-[36px] md:text-[40px] font-bold text-[var(--amp-semantic-text-primary)] leading-none">
                  {tier.price}
                </span>
                {tier.billingPeriod && (
                  <span className="text-[14px] text-[var(--amp-semantic-text-secondary)]">
                    {tier.billingPeriod}
                  </span>
                )}
              </div>
              {tier.description && (
                <p className="mt-2 text-[14px] text-[var(--amp-semantic-text-secondary)]">
                  {tier.description}
                </p>
              )}
              <ul className="mt-6 flex flex-col gap-3">
                {tier.features.map((f, i) => {
                  const included = f.included !== false;
                  return (
                    <li key={i} className="flex items-start gap-2 text-[14px]">
                      <span
                        aria-hidden="true"
                        className={cn(
                          'mt-0.5 inline-flex w-4 h-4 items-center justify-center shrink-0',
                          included
                            ? 'text-[var(--amp-semantic-status-success)]'
                            : 'text-[var(--amp-semantic-text-muted)]'
                        )}
                      >
                        {included ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </span>
                      <span
                        className={cn(
                          included
                            ? 'text-[var(--amp-semantic-text-primary)]'
                            : 'text-[var(--amp-semantic-text-muted)] line-through'
                        )}
                      >
                        {f.value ?? f.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
              {tier.cta && <div className="mt-auto pt-6">{tier.cta}</div>}
            </article>
          ))}
        </div>
      </div>
    );
  }
);

PricingTable.displayName = 'PricingTable';
