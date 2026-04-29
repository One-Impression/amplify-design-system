'use client';

import React, { useMemo, useState } from 'react';
import { cn } from '../../lib/cn';
import {
  DEFAULT_CHART_COLORS,
  buildLinePath,
  extentMulti,
  formatCompact,
  linearScale,
  niceTicks,
  pickColor,
} from '../../lib/chart-utils';

export interface LineChartSeries {
  name: string;
  /** Per-x-axis-index numeric values. Length must equal `xAxis.length`. */
  values: Array<number | null>;
  color?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}

export interface LineChartProps {
  /** X-axis category labels. */
  xAxis: string[];
  /** One or more data series. */
  series: LineChartSeries[];
  /** Chart height in px. Width is always responsive (100%). */
  height?: number;
  /** Optional explicit y-axis [min, max]. Defaults to data extent. */
  yDomain?: [number, number];
  /** Show legend below chart. Defaults true if >1 series. */
  showLegend?: boolean;
  /** Show grid lines. */
  showGrid?: boolean;
  /** Custom y-axis tick formatter. */
  yTickFormat?: (value: number) => string;
  /** Hover tooltip renderer. Receives the active x-axis index. */
  tooltip?: (xIndex: number, xLabel: string, series: LineChartSeries[]) => React.ReactNode;
  /** Accessible label for screen readers. */
  ariaLabel: string;
  className?: string;
}

const DEFAULT_HEIGHT = 240;
const PADDING = { top: 16, right: 16, bottom: 28, left: 44 };

export const LineChart: React.FC<LineChartProps> = ({
  xAxis,
  series,
  height = DEFAULT_HEIGHT,
  yDomain,
  showLegend,
  showGrid = true,
  yTickFormat = formatCompact,
  tooltip,
  ariaLabel,
  className,
}) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  // Use a fixed viewBox; scale via SVG preserveAspectRatio for responsiveness.
  const VB_WIDTH = 600;
  const VB_HEIGHT = height;

  const computed = useMemo(() => {
    const allValues = series.map(s => s.values.filter((v): v is number => v != null));
    const [dataMin, dataMax] = yDomain ?? extentMulti(allValues);
    const yMin = Math.min(0, dataMin);
    const yMax = dataMax === yMin ? yMin + 1 : dataMax;
    const ticks = niceTicks(yMin, yMax, 5);
    const yScaleMin = ticks[0];
    const yScaleMax = ticks[ticks.length - 1];

    const innerW = VB_WIDTH - PADDING.left - PADDING.right;
    const innerH = VB_HEIGHT - PADDING.top - PADDING.bottom;
    const stepX = xAxis.length > 1 ? innerW / (xAxis.length - 1) : innerW;

    const seriesPaths = series.map((s, sIdx) => {
      const points = s.values
        .map((v, i) =>
          v == null
            ? null
            : {
                x: PADDING.left + i * stepX,
                y: PADDING.top + linearScale(v, yScaleMin, yScaleMax, innerH, 0),
              }
        )
        .filter((p): p is { x: number; y: number } => p !== null);
      return {
        path: buildLinePath(points),
        color: s.color ?? pickColor(sIdx),
        strokeWidth: s.strokeWidth ?? 2,
        strokeDasharray: s.strokeDasharray,
        points,
      };
    });

    return { ticks, yScaleMin, yScaleMax, innerW, innerH, stepX, seriesPaths };
  }, [series, xAxis, yDomain, VB_HEIGHT]);

  const showLegendResolved = showLegend ?? series.length > 1;

  function onMove(e: React.MouseEvent<SVGRectElement>) {
    if (xAxis.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const localX = ratio * VB_WIDTH - PADDING.left;
    const idx = Math.max(0, Math.min(xAxis.length - 1, Math.round(localX / computed.stepX)));
    setHoverIdx(idx);
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
        {/* gridlines + y-axis ticks */}
        {computed.ticks.map(tick => {
          const y = PADDING.top + linearScale(tick, computed.yScaleMin, computed.yScaleMax, computed.innerH, 0);
          return (
            <g key={tick}>
              {showGrid && (
                <line
                  x1={PADDING.left}
                  x2={VB_WIDTH - PADDING.right}
                  y1={y}
                  y2={y}
                  stroke="var(--amp-semantic-border-default, #e5e7eb)"
                  strokeWidth={1}
                  strokeDasharray="2 4"
                />
              )}
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

        {/* x-axis labels */}
        {xAxis.map((label, i) => {
          if (xAxis.length > 12 && i % Math.ceil(xAxis.length / 8) !== 0) return null;
          const x = PADDING.left + i * computed.stepX;
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

        {/* series lines */}
        {computed.seriesPaths.map((sp, i) => (
          <path
            key={i}
            d={sp.path}
            fill="none"
            stroke={sp.color}
            strokeWidth={sp.strokeWidth}
            strokeDasharray={sp.strokeDasharray}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* hover marker */}
        {hoverIdx !== null && (
          <line
            x1={PADDING.left + hoverIdx * computed.stepX}
            x2={PADDING.left + hoverIdx * computed.stepX}
            y1={PADDING.top}
            y2={PADDING.top + computed.innerH}
            stroke="var(--amp-semantic-text-muted, #9ca3af)"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        )}
        {hoverIdx !== null &&
          computed.seriesPaths.map((sp, i) => {
            const v = series[i].values[hoverIdx];
            if (v == null) return null;
            const cx = PADDING.left + hoverIdx * computed.stepX;
            const cy = PADDING.top + linearScale(v, computed.yScaleMin, computed.yScaleMax, computed.innerH, 0);
            return <circle key={i} cx={cx} cy={cy} r={4} fill={sp.color} stroke="white" strokeWidth={2} />;
          })}

        {/* invisible hover layer */}
        <rect
          x={PADDING.left}
          y={PADDING.top}
          width={computed.innerW}
          height={computed.innerH}
          fill="transparent"
          onMouseMove={onMove}
          onMouseLeave={() => setHoverIdx(null)}
        />
      </svg>

      {/* tooltip */}
      {hoverIdx !== null && tooltip && (
        <div className="mt-2 text-[12px]">{tooltip(hoverIdx, xAxis[hoverIdx], series)}</div>
      )}

      {/* legend */}
      {showLegendResolved && (
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px]">
          {series.map((s, i) => (
            <li key={s.name} className="flex items-center gap-1.5">
              <span
                className="inline-block w-3 h-1 rounded"
                style={{ backgroundColor: s.color ?? pickColor(i) }}
              />
              <span className="text-[var(--amp-semantic-text-secondary,#374151)]">{s.name}</span>
            </li>
          ))}
        </ul>
      )}

      {/* SR-only data table fallback */}
      <table className="sr-only">
        <caption>{ariaLabel}</caption>
        <thead>
          <tr>
            <th scope="col">X</th>
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

LineChart.displayName = 'LineChart';
