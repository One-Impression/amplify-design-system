import React from 'react';
import { cn } from '../../lib/cn';

export type StatLargeAlign = 'start' | 'center';
export type StatLargeTrend = 'up' | 'down' | 'flat';

export interface StatLargeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The headline number / value. */
  value: React.ReactNode;
  /** Descriptive label rendered under the value. */
  label: React.ReactNode;
  /** Optional supporting text (longer than the label). */
  description?: React.ReactNode;
  /** Direction of trend. */
  trend?: StatLargeTrend;
  /** Trend value e.g. "+12.4%" or numeric percentage. */
  trendValue?: React.ReactNode;
  /** Trend caption e.g. "vs last quarter". */
  trendLabel?: React.ReactNode;
  /** Alignment. */
  align?: StatLargeAlign;
}

const trendColor: Record<StatLargeTrend, string> = {
  up: 'text-[var(--amp-semantic-status-success)]',
  down: 'text-[var(--amp-semantic-status-error)]',
  flat: 'text-[var(--amp-semantic-text-muted)]',
};

function TrendArrow({ trend }: { trend: StatLargeTrend }) {
  const path =
    trend === 'up'
      ? 'M5 15l7-7 7 7'
      : trend === 'down'
      ? 'M19 9l-7 7-7-7'
      : 'M5 12h14';
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

export const StatLarge = React.forwardRef<HTMLDivElement, StatLargeProps>(
  (
    {
      value,
      label,
      description,
      trend,
      trendValue,
      trendLabel,
      align = 'start',
      className,
      ...props
    },
    ref
  ) => {
    const isCenter = align === 'center';
    return (
      <div
        ref={ref}
        className={cn('flex flex-col gap-1', isCenter && 'items-center text-center', className)}
        {...props}
      >
        <div className="text-[48px] md:text-[64px] font-bold leading-none tracking-tight text-[var(--amp-semantic-text-primary)]">
          {value}
        </div>
        <div className="text-[14px] font-medium uppercase tracking-wide text-[var(--amp-semantic-text-secondary)] mt-2">
          {label}
        </div>
        {description && (
          <p className="text-[14px] text-[var(--amp-semantic-text-secondary)] mt-1 max-w-md">
            {description}
          </p>
        )}
        {(trend || trendValue || trendLabel) && (
          <div className="mt-2 inline-flex items-center gap-2 text-[13px] font-medium">
            {trend && (
              <span className={cn('inline-flex items-center gap-1', trendColor[trend])}>
                <TrendArrow trend={trend} />
                {trendValue}
              </span>
            )}
            {!trend && trendValue && (
              <span className="text-[var(--amp-semantic-text-primary)]">{trendValue}</span>
            )}
            {trendLabel && (
              <span className="text-[var(--amp-semantic-text-muted)]">{trendLabel}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

StatLarge.displayName = 'StatLarge';
