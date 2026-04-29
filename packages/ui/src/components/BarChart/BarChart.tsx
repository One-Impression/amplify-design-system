'use client';

import React, { useMemo } from 'react';
import { cn } from '../../lib/cn';
import {
  formatCompact,
  linearScale,
  niceTicks,
  pickColor,
} from '../../lib/chart-utils';

export type BarChartLayout = 'vertical' | 'horizontal' | 'stacked' | 'grouped';

export interface BarChartSeries {
  name: string;
  values: number[];
  color?: string;
}

export interface BarChartProps {
  /** Category labels (one per group). */
  xAxis: string[];
  /** One or more series. */
  series: BarChartSeries[];
  /** Layout mode. Defaults to 'vertical' (single-series) or 'grouped' (multi-series). */
  layout?: BarChartLayout;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  yTickFormat?: (value: number) => string;
  /** Aria-label for screen readers. */
  ariaLabel: string;
  className?: string;
}

const DEFAULT_HEIGHT = 240;
const PADDING = { top: 16, right: 16, bottom: 28, left: 44 };

export const BarChart: React.FC<BarChartProps> = ({
  xAxis,
  series,
  layout,
  height = DEFAULT_HEIGHT,
  showGrid = true,
  showLegend,
  yTickFormat = formatCompact,
  ariaLabel,
  className,
}) => {
  const resolvedLayout: BarChartLayout = layout ?? (series.length > 1 ? 'grouped' : 'vertical');
  const isHorizontal = resolvedLayout === 'horizontal';
  const VB_WIDTH = 600;
  const VB_HEIGHT = height;

  const computed = useMemo(() => {
    let maxVal = 0;
    let minVal = 0;
    if (resolvedLayout === 'stacked') {
      for (let i = 0; i < xAxis.length; i++) {
        let stacked = 0;
        for (const s of series) stacked += Math.max(0, s.values[i] ?? 0);
        if (stacked > maxVal) maxVal = stacked;
      }
    } else {
      for (const s of series) {
        for (const v of s.values) {
          if (v > maxVal) maxVal = v;
          if (v < minVal) minVal = v;
        }
      }
    }
    if (maxVal === 0 && minVal === 0) maxVal = 1;
    const ticks = niceTicks(minVal, maxVal, 5);
    const valMin = ticks[0];
    const valMax = ticks[ticks.length - 1];

    const innerW = VB_WIDTH - PADDING.left - PADDING.right;
    const innerH = VB_HEIGHT - PADDING.top - PADDING.bottom;
    return { ticks, valMin, valMax, innerW, innerH };
  }, [series, xAxis, resolvedLayout, VB_HEIGHT]);

  const showLegendResolved = showLegend ?? series.length > 1;

  function renderVerticalOrGrouped() {
    const { innerW, innerH, valMin, valMax } = computed;
    const groupCount = xAxis.length;
    const groupW = groupCount > 0 ? innerW / groupCount : innerW;
    const groupPad = 0.2 * groupW;
    const usable = groupW - groupPad;
    const barCount = resolvedLayout === 'grouped' ? series.length : 1;
    const barW = usable / barCount;

    return xAxis.map((label, gi) => {
      const groupX = PADDING.left + gi * groupW + groupPad / 2;
      return (
        <g key={`${label}-${gi}`}>
          {(resolvedLayout === 'grouped' ? series : series.slice(0, 1)).map((s, si) => {
            const v = s.values[gi] ?? 0;
            const yTop = PADDING.top + linearScale(Math.max(v, 0), valMin, valMax, innerH, 0);
            const yBase = PADDING.top + linearScale(0, valMin, valMax, innerH, 0);
            const x = groupX + si * barW;
            const h = Math.abs(yBase - yTop);
            return (
              <rect
                key={s.name}
                x={x + 1}
                y={Math.min(yTop, yBase)}
                width={Math.max(0, barW - 2)}
                height={h}
                rx={3}
                fill={s.color ?? pickColor(si)}
              />
            );
          })}
        </g>
      );
    });
  }

  function renderStacked() {
    const { innerW, innerH, valMin, valMax } = computed;
    const groupCount = xAxis.length;
    const groupW = groupCount > 0 ? innerW / groupCount : innerW;
    const groupPad = 0.25 * groupW;
    const barW = groupW - groupPad;

    return xAxis.map((label, gi) => {
      const x = PADDING.left + gi * groupW + groupPad / 2;
      let cumulative = 0;
      return (
        <g key={`${label}-${gi}`}>
          {series.map((s, si) => {
            const v = Math.max(0, s.values[gi] ?? 0);
            const yTop = PADDING.top + linearScale(cumulative + v, valMin, valMax, innerH, 0);
            const yBottom = PADDING.top + linearScale(cumulative, valMin, valMax, innerH, 0);
            cumulative += v;
            return (
              <rect
                key={s.name}
                x={x}
                y={yTop}
                width={barW}
                height={Math.max(0, yBottom - yTop)}
                fill={s.color ?? pickColor(si)}
              />
            );
          })}
        </g>
      );
    });
  }

  function renderHorizontal() {
    const { innerW, innerH, valMin, valMax } = computed;
    const groupCount = xAxis.length;
    const rowH = groupCount > 0 ? innerH / groupCount : innerH;
    const rowPad = 0.2 * rowH;
    const usable = rowH - rowPad;
    const barCount = series.length > 1 ? series.length : 1;
    const barH = usable / barCount;

    return xAxis.map((label, gi) => {
      const rowY = PADDING.top + gi * rowH + rowPad / 2;
      return (
        <g key={`${label}-${gi}`}>
          {series.map((s, si) => {
            const v = s.values[gi] ?? 0;
            const xLeft = PADDING.left + linearScale(0, valMin, valMax, 0, innerW);
            const xRight = PADDING.left + linearScale(v, valMin, valMax, 0, innerW);
            const y = rowY + si * barH;
            return (
              <rect
                key={s.name}
                x={Math.min(xLeft, xRight)}
                y={y + 1}
                width={Math.abs(xRight - xLeft)}
                height={Math.max(0, barH - 2)}
                rx={3}
                fill={s.color ?? pickColor(si)}
              />
            );
          })}
        </g>
      );
    });
  }

  return (
    <div className={cn('w-full', className)}>
      <svg
        role="img"
        aria-label={ariaLabel}
        viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height }}
      >
        {/* gridlines */}
        {showGrid &&
          computed.ticks.map(tick => {
            if (isHorizontal) {
              const x = PADDING.left + linearScale(tick, computed.valMin, computed.valMax, 0, computed.innerW);
              return (
                <g key={tick}>
                  <line
                    x1={x}
                    x2={x}
                    y1={PADDING.top}
                    y2={PADDING.top + computed.innerH}
                    stroke="var(--amp-semantic-border-default, #e5e7eb)"
                    strokeWidth={1}
                    strokeDasharray="2 4"
                  />
                  <text
                    x={x}
                    y={VB_HEIGHT - 8}
                    fontSize={11}
                    textAnchor="middle"
                    fill="var(--amp-semantic-text-muted, #6b7280)"
                  >
                    {yTickFormat(tick)}
                  </text>
                </g>
              );
            }
            const y = PADDING.top + linearScale(tick, computed.valMin, computed.valMax, computed.innerH, 0);
            return (
              <g key={tick}>
                <line
                  x1={PADDING.left}
                  x2={VB_WIDTH - PADDING.right}
                  y1={y}
                  y2={y}
                  stroke="var(--amp-semantic-border-default, #e5e7eb)"
                  strokeWidth={1}
                  strokeDasharray="2 4"
                />
                <text
                  x={PADDING.left - 6}
                  y={y + 4}
                  fontSize={11}
                  textAnchor="end"
                  fill="var(--amp-semantic-text-muted, #6b7280)"
                >
                  {yTickFormat(tick)}
                </text>
              </g>
            );
          })}

        {/* category labels */}
        {!isHorizontal &&
          xAxis.map((label, i) => {
            const groupW = xAxis.length > 0 ? computed.innerW / xAxis.length : computed.innerW;
            const x = PADDING.left + i * groupW + groupW / 2;
            return (
              <text
                key={`${label}-${i}`}
                x={x}
                y={VB_HEIGHT - 8}
                fontSize={11}
                textAnchor="middle"
                fill="var(--amp-semantic-text-muted, #6b7280)"
              >
                {label}
              </text>
            );
          })}
        {isHorizontal &&
          xAxis.map((label, i) => {
            const rowH = xAxis.length > 0 ? computed.innerH / xAxis.length : computed.innerH;
            const y = PADDING.top + i * rowH + rowH / 2 + 4;
            return (
              <text
                key={`${label}-${i}`}
                x={PADDING.left - 6}
                y={y}
                fontSize={11}
                textAnchor="end"
                fill="var(--amp-semantic-text-muted, #6b7280)"
              >
                {label}
              </text>
            );
          })}

        {/* bars */}
        {resolvedLayout === 'stacked' && renderStacked()}
        {(resolvedLayout === 'vertical' || resolvedLayout === 'grouped') && renderVerticalOrGrouped()}
        {resolvedLayout === 'horizontal' && renderHorizontal()}
      </svg>

      {showLegendResolved && (
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px]">
          {series.map((s, i) => (
            <li key={s.name} className="flex items-center gap-1.5">
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{ backgroundColor: s.color ?? pickColor(i) }}
              />
              <span className="text-[var(--amp-semantic-text-secondary,#374151)]">{s.name}</span>
            </li>
          ))}
        </ul>
      )}

      <table className="sr-only">
        <caption>{ariaLabel}</caption>
        <thead>
          <tr>
            <th scope="col">Category</th>
            {series.map(s => (
              <th key={s.name} scope="col">
                {s.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {xAxis.map((label, i) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              {series.map(s => (
                <td key={s.name}>{s.values[i] ?? ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

BarChart.displayName = 'BarChart';
