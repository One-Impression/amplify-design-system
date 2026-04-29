'use client';

import React, { useMemo } from 'react';
import { cn } from '../../lib/cn';
import { arcPath, pickColor, sum } from '../../lib/chart-utils';

export type PieChartVariant = 'pie' | 'donut';

export interface PieChartSlice {
  name: string;
  value: number;
  color?: string;
}

export interface PieChartProps {
  data: PieChartSlice[];
  /** 'pie' (full slices) or 'donut' (with hole). Defaults to 'donut'. */
  variant?: PieChartVariant;
  /** Outer diameter in px. */
  size?: number;
  /** Donut hole ratio (0–1). Only applies when variant='donut'. Default 0.6. */
  innerRadiusRatio?: number;
  /** Slot rendered in the center (donut variant only). */
  centerSlot?: React.ReactNode;
  showLegend?: boolean;
  ariaLabel: string;
  className?: string;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  variant = 'donut',
  size = 200,
  innerRadiusRatio = 0.6,
  centerSlot,
  showLegend = true,
  ariaLabel,
  className,
}) => {
  const total = sum(data.map(d => d.value));
  const radius = size / 2;
  const innerR = variant === 'donut' ? radius * innerRadiusRatio : 0;

  const slices = useMemo(() => {
    if (total <= 0) return [];
    let angle = -Math.PI / 2; // start at 12 o'clock
    return data.map((slice, i) => {
      const portion = slice.value / total;
      const startAngle = angle;
      const endAngle = angle + portion * 2 * Math.PI;
      angle = endAngle;
      const path = arcPath(radius, radius, radius, innerR, startAngle, endAngle);
      return {
        ...slice,
        color: slice.color ?? pickColor(i),
        path,
        portion,
      };
    });
  }, [data, total, radius, innerR]);

  return (
    <div className={cn('inline-flex flex-col items-center', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          role="img"
          aria-label={ariaLabel}
          viewBox={`0 0 ${size} ${size}`}
          width={size}
          height={size}
        >
          {slices.length === 0 ? (
            <circle
              cx={radius}
              cy={radius}
              r={radius - 1}
              fill="none"
              stroke="var(--amp-semantic-border-default, #e5e7eb)"
              strokeWidth={2}
            />
          ) : (
            slices.map(s => (
              <path
                key={s.name}
                d={s.path}
                fill={s.color}
                stroke="var(--amp-semantic-bg-surface, #ffffff)"
                strokeWidth={1}
              />
            ))
          )}
        </svg>
        {variant === 'donut' && centerSlot && (
          <div
            className="absolute inset-0 flex items-center justify-center text-center pointer-events-none"
            style={{ padding: innerR * 0.4 }}
          >
            {centerSlot}
          </div>
        )}
      </div>

      {showLegend && (
        <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[12px]">
          {slices.map(s => (
            <li key={s.name} className="flex items-center gap-1.5">
              <span
                className="inline-block w-3 h-3 rounded-sm shrink-0"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-[var(--amp-semantic-text-secondary,#374151)] truncate">
                {s.name}
              </span>
              <span className="text-[var(--amp-semantic-text-muted,#6b7280)] ml-auto">
                {(s.portion * 100).toFixed(0)}%
              </span>
            </li>
          ))}
        </ul>
      )}

      <table className="sr-only">
        <caption>{ariaLabel}</caption>
        <thead>
          <tr>
            <th scope="col">Slice</th>
            <th scope="col">Value</th>
            <th scope="col">Share</th>
          </tr>
        </thead>
        <tbody>
          {slices.map(s => (
            <tr key={s.name}>
              <th scope="row">{s.name}</th>
              <td>{s.value}</td>
              <td>{(s.portion * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

PieChart.displayName = 'PieChart';
