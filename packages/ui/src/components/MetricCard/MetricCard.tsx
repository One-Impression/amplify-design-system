import React from 'react';
import { cn } from '../../lib/cn';

export interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  trend,
  trendLabel,
  subtitle,
  icon,
  className,
}) => {
  const isPositive = trend !== undefined && trend >= 0;
  const isNegative = trend !== undefined && trend < 0;

  return (
    <div
      className={cn(
        'rounded-[16px] border border-[var(--amp-semantic-border-default)] bg-[var(--amp-semantic-bg-surface)] p-5',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--amp-semantic-text-secondary)] mb-1">
            {label}
          </p>
          <p className="text-[28px] font-bold text-[var(--amp-semantic-text-primary)] leading-tight">
            {value}
          </p>
          {(trend !== undefined || subtitle) && (
            <div className="mt-2 flex items-center gap-2">
              {trend !== undefined && (
                <span
                  className={cn(
                    'inline-flex items-center gap-0.5 text-[12px] font-medium',
                    isPositive && 'text-[var(--amp-semantic-status-success)]',
                    isNegative && 'text-[var(--amp-semantic-status-error)]'
                  )}
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={isPositive ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
                    />
                  </svg>
                  {Math.abs(trend)}%
                </span>
              )}
              {trendLabel && (
                <span className="text-[12px] text-[var(--amp-semantic-text-muted)]">
                  {trendLabel}
                </span>
              )}
              {!trendLabel && subtitle && (
                <span className="text-[12px] text-[var(--amp-semantic-text-muted)]">
                  {subtitle}
                </span>
              )}
            </div>
          )}
          {trendLabel && subtitle && (
            <p className="mt-1 text-[12px] text-[var(--amp-semantic-text-muted)]">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-[12px] bg-[var(--amp-semantic-accent-light)] flex items-center justify-center text-[var(--amp-semantic-accent)]">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
