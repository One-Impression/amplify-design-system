'use client';

import React from 'react';
import { cn } from '../../lib/cn';

export type ProgressRingSize = 'sm' | 'md' | 'lg' | 'xl';
export type ProgressRingVariant = 'default' | 'success' | 'warning' | 'error' | 'accent';

export interface ProgressRingProps {
  /** Progress value, 0–100. Clamped. */
  value: number;
  size?: ProgressRingSize;
  variant?: ProgressRingVariant;
  /** Stroke width in px (overrides size default). */
  strokeWidth?: number;
  /** Slot rendered in the center (e.g. label, percentage, value). */
  children?: React.ReactNode;
  /** Hide the default centered percentage label (when no children). */
  hideLabel?: boolean;
  /** Aria-label. Defaults to "{value}% complete". */
  ariaLabel?: string;
  className?: string;
}

const sizePx: Record<ProgressRingSize, number> = {
  sm: 40,
  md: 64,
  lg: 96,
  xl: 144,
};
const sizeStrokeDefault: Record<ProgressRingSize, number> = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
};
const variantColor: Record<ProgressRingVariant, string> = {
  default: 'var(--amp-semantic-text-secondary, #374151)',
  accent: 'var(--amp-semantic-accent, #7c3aed)',
  success: 'var(--amp-semantic-status-success, #16a34a)',
  warning: 'var(--amp-semantic-status-warning, #d97706)',
  error: 'var(--amp-semantic-status-error, #dc2626)',
};
const labelTextSize: Record<ProgressRingSize, string> = {
  sm: 'text-[10px]',
  md: 'text-[12px]',
  lg: 'text-[16px]',
  xl: 'text-[22px]',
};

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = 'md',
  variant = 'accent',
  strokeWidth,
  children,
  hideLabel = false,
  ariaLabel,
  className,
}) => {
  const px = sizePx[size];
  const sw = strokeWidth ?? sizeStrokeDefault[size];
  const r = (px - sw) / 2;
  const cx = px / 2;
  const cy = px / 2;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const dashOffset = circumference * (1 - clamped / 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel ?? `${Math.round(clamped)}% complete`}
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: px, height: px }}
    >
      <svg width={px} height={px} viewBox={`0 0 ${px} ${px}`} className="-rotate-90">
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--amp-semantic-bg-subtle, #f3f4f6)"
          strokeWidth={sw}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={variantColor[variant]}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 320ms ease' }}
        />
      </svg>
      {children !== undefined ? (
        <div className={cn('absolute inset-0 flex items-center justify-center text-center', labelTextSize[size])}>
          {children}
        </div>
      ) : !hideLabel ? (
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center font-semibold tabular-nums text-[var(--amp-semantic-text-primary,#111827)]',
            labelTextSize[size]
          )}
        >
          {Math.round(clamped)}%
        </div>
      ) : null}
    </div>
  );
};

ProgressRing.displayName = 'ProgressRing';
