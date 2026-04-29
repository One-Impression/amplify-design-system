'use client';

import React, { useMemo } from 'react';
import { cn } from '../../lib/cn';
import { buildAreaPath, buildLinePath, linearScale } from '../../lib/chart-utils';

export type SparklineVariant = 'line' | 'bar' | 'area';

export interface SparklineProps {
  data: number[];
  variant?: SparklineVariant;
  width?: number;
  height?: number;
  /** Stroke / bar fill color. Defaults to currentColor. */
  color?: string;
  /** Highlight last data point with a dot (line/area variants). */
  showLastPoint?: boolean;
  ariaLabel: string;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  variant = 'line',
  width = 80,
  height = 24,
  color = 'currentColor',
  showLastPoint = true,
  ariaLabel,
  className,
}) => {
  const computed = useMemo(() => {
    if (data.length === 0) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const safeMin = min === max ? min - 1 : min;
    const safeMax = min === max ? max + 1 : max;
    const stepX = data.length > 1 ? (width - 2) / (data.length - 1) : 0;
    const points = data.map((v, i) => ({
      x: 1 + i * stepX,
      y: 1 + linearScale(v, safeMin, safeMax, height - 2, 0),
    }));
    return { points, min: safeMin, max: safeMax, stepX };
  }, [data, width, height]);

  return (
    <span
      role="img"
      aria-label={ariaLabel}
      className={cn('inline-block align-middle', className)}
      style={{ width, height, color }}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {computed && variant === 'line' && (
          <>
            <path
              d={buildLinePath(computed.points)}
              fill="none"
              stroke={color}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {showLastPoint && computed.points.length > 0 && (
              <circle
                cx={computed.points[computed.points.length - 1].x}
                cy={computed.points[computed.points.length - 1].y}
                r={2}
                fill={color}
              />
            )}
          </>
        )}

        {computed && variant === 'area' && (
          <>
            <path
              d={buildAreaPath(computed.points, height - 1)}
              fill={color}
              fillOpacity={0.18}
              stroke="none"
            />
            <path
              d={buildLinePath(computed.points)}
              fill="none"
              stroke={color}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {showLastPoint && computed.points.length > 0 && (
              <circle
                cx={computed.points[computed.points.length - 1].x}
                cy={computed.points[computed.points.length - 1].y}
                r={2}
                fill={color}
              />
            )}
          </>
        )}

        {computed && variant === 'bar' && (
          <g>
            {(() => {
              const barW = computed.stepX > 0 ? Math.max(1, computed.stepX - 1) : Math.max(1, width - 2);
              return data.map((v, i) => {
                const yTop = 1 + linearScale(v, computed.min, computed.max, height - 2, 0);
                const yBase = height - 1;
                const x = 1 + i * (computed.stepX || 0);
                return (
                  <rect
                    key={i}
                    x={x}
                    y={yTop}
                    width={barW}
                    height={Math.max(1, yBase - yTop)}
                    fill={color}
                  />
                );
              });
            })()}
          </g>
        )}
      </svg>
    </span>
  );
};

Sparkline.displayName = 'Sparkline';
