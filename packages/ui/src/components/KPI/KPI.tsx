'use client';

import React from 'react';
import { cn } from '../../lib/cn';
import { Sparkline } from '../Sparkline/Sparkline';

export type KPISize = 'md' | 'lg' | 'xl';
export type KPITrend = 'up' | 'down' | 'neutral';

export interface KPIProps {
  /** Short label, e.g. "Active Campaigns". */
  label: string;
  /** Hero value. Pre-formatted (₹1.2Cr / 12.4K / 87%). */
  value: string | number;
  /** Numeric trend percent. Sign determines direction unless `trend` is set. */
  delta?: number;
  /** Force trend direction even if delta is missing or zero. */
  trend?: KPITrend;
  /** Comparison label, e.g. "vs last week". */
  deltaLabel?: string;
  /** Optional secondary subtitle. */
  subtitle?: string;
  /** Optional sparkline data (numbers, ordered). */
  sparkline?: number[];
  /** Higher-is-better? Inverts colour for delta when false (e.g. churn rate). */
  higherIsBetter?: boolean;
  size?: KPISize;
  /** Optional icon shown next to the label. */
  icon?: React.ReactNode;
  /** Click handler — when set, KPI renders as a clickable surface. */
  onClick?: () => void;
  className?: string;
  /** Aria description for screen readers. */
  'aria-label'?: string;
}

const sizeStyles: Record<KPISize, { value: string; label: string; padding: string; spark: number }> = {
  md: { value: 'text-[28px]', label: 'text-[12px]', padding: 'p-5', spark: 24 },
  lg: { value: 'text-[36px]', label: 'text-[13px]', padding: 'p-6', spark: 32 },
  xl: { value: 'text-[48px]', label: 'text-[14px]', padding: 'p-7', spark: 40 },
};

function resolveTrend(delta: number | undefined, explicit: KPITrend | undefined): KPITrend {
  if (explicit) return explicit;
  if (delta === undefined || delta === null) return 'neutral';
  if (delta > 0) return 'up';
  if (delta < 0) return 'down';
  return 'neutral';
}

export const KPI: React.FC<KPIProps> = ({
  label,
  value,
  delta,
  trend,
  deltaLabel,
  subtitle,
  sparkline,
  higherIsBetter = true,
  size = 'lg',
  icon,
  onClick,
  className,
  'aria-label': ariaLabel,
}) => {
  const direction = resolveTrend(delta, trend);
  // colour reflects "good vs bad" not just "up vs down"
  const isGood =
    direction === 'neutral'
      ? null
      : (direction === 'up' && higherIsBetter) || (direction === 'down' && !higherIsBetter);

  const trendColor =
    isGood === true
      ? 'text-[var(--amp-semantic-status-success,#16a34a)]'
      : isGood === false
        ? 'text-[var(--amp-semantic-status-error,#dc2626)]'
        : 'text-[var(--amp-semantic-text-muted,#6b7280)]';

  const styles = sizeStyles[size];
  const isInteractive = !!onClick;
  const surfaceClass = cn(
    'block w-full text-left rounded-[16px] border border-[var(--amp-semantic-border-default,#e5e7eb)] bg-[var(--amp-semantic-bg-surface,#ffffff)]',
    styles.padding,
    isInteractive &&
      'cursor-pointer transition-colors hover:border-[var(--amp-semantic-accent,#7c3aed)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amp-semantic-accent,#7c3aed)]',
    className
  );
  const inner = (
    <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            {icon && <span className="text-[var(--amp-semantic-text-muted,#6b7280)]">{icon}</span>}
            <p
              className={cn(
                styles.label,
                'font-medium uppercase tracking-wide text-[var(--amp-semantic-text-secondary,#374151)]'
              )}
            >
              {label}
            </p>
          </div>
          <p
            className={cn(
              styles.value,
              'mt-1 font-bold leading-tight text-[var(--amp-semantic-text-primary,#111827)] tabular-nums'
            )}
          >
            {value}
          </p>
          {(delta !== undefined || subtitle) && (
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              {delta !== undefined && (
                <span className={cn('inline-flex items-center gap-0.5 text-[13px] font-medium', trendColor)}>
                  <TrendIcon direction={direction} />
                  {delta > 0 && '+'}
                  {delta.toFixed(Math.abs(delta) < 10 ? 1 : 0)}%
                </span>
              )}
              {deltaLabel && (
                <span className="text-[12px] text-[var(--amp-semantic-text-muted,#6b7280)]">
                  {deltaLabel}
                </span>
              )}
              {!deltaLabel && subtitle && (
                <span className="text-[12px] text-[var(--amp-semantic-text-muted,#6b7280)]">
                  {subtitle}
                </span>
              )}
            </div>
          )}
        </div>
      {sparkline && sparkline.length > 0 && (
        <div className="shrink-0 text-[var(--amp-semantic-accent,#7c3aed)]">
          <Sparkline
            data={sparkline}
            variant="area"
            width={80}
            height={styles.spark}
            ariaLabel={`${label} trend`}
          />
        </div>
      )}
    </div>
  );

  if (isInteractive) {
    return (
      <button type="button" onClick={onClick} aria-label={ariaLabel} className={surfaceClass}>
        {inner}
      </button>
    );
  }
  return (
    <div aria-label={ariaLabel} className={surfaceClass}>
      {inner}
    </div>
  );
};

KPI.displayName = 'KPI';

function TrendIcon({ direction }: { direction: KPITrend }) {
  if (direction === 'neutral') {
    return (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" d="M5 12h14" />
      </svg>
    );
  }
  return (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d={direction === 'up' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
      />
    </svg>
  );
}
