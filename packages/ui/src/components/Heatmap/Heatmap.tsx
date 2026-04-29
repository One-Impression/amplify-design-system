'use client';

import React, { useMemo } from 'react';
import { cn } from '../../lib/cn';

export type HeatmapVariant = 'calendar' | 'matrix';

export interface HeatmapCell {
  /** ISO date (calendar) or any unique id (matrix). */
  id: string;
  /** Numeric intensity (used to choose colour bucket). */
  value: number;
  /** Optional explicit row/col index for matrix; ignored for calendar. */
  row?: number;
  col?: number;
  /** Hover label; falls back to `${id}: ${value}`. */
  label?: string;
}

export interface HeatmapProps {
  variant?: HeatmapVariant;
  data: HeatmapCell[];
  /** For matrix variant: row labels in display order (top→bottom). */
  rowLabels?: string[];
  /** For matrix variant: column labels in display order (left→right). */
  colLabels?: string[];
  /** Number of intensity buckets (5 → quintiles like GitHub). */
  buckets?: number;
  /** Cell size in px. */
  cellSize?: number;
  cellGap?: number;
  /** CSS color used at full intensity; lower buckets are alpha-mixed. */
  color?: string;
  ariaLabel: string;
  className?: string;
}

export const Heatmap: React.FC<HeatmapProps> = ({
  variant = 'matrix',
  data,
  rowLabels,
  colLabels,
  buckets = 5,
  cellSize = 14,
  cellGap = 3,
  color = 'var(--amp-semantic-accent, #7c3aed)',
  ariaLabel,
  className,
}) => {
  const computed = useMemo(() => {
    const max = data.reduce((m, c) => (c.value > m ? c.value : m), 0);
    const min = data.reduce((m, c) => (c.value < m ? c.value : m), Infinity);
    const safeMin = min === Infinity ? 0 : min;
    return { max: max || 1, min: safeMin };
  }, [data]);

  function bucketFor(value: number): number {
    if (value <= 0) return 0;
    const t = (value - computed.min) / (computed.max - computed.min || 1);
    return Math.min(buckets - 1, Math.max(0, Math.floor(t * buckets)));
  }

  function bucketColor(bucket: number): string {
    if (bucket === 0) return 'var(--amp-semantic-bg-subtle, #f3f4f6)';
    const alpha = 0.15 + (bucket / (buckets - 1)) * 0.85;
    return `color-mix(in srgb, ${color} ${(alpha * 100).toFixed(0)}%, transparent)`;
  }

  if (variant === 'calendar') {
    // Calendar heatmap: GitHub-style — 7 rows (Sun-Sat) × N weeks
    const sorted = [...data].sort((a, b) => a.id.localeCompare(b.id));
    const cells = sorted.map(c => {
      const date = new Date(c.id);
      return { ...c, date };
    });
    if (cells.length === 0) {
      return <div className={cn('text-[12px] text-[var(--amp-semantic-text-muted)]', className)}>No data</div>;
    }
    const start = cells[0].date;
    const startWeek = new Date(start);
    startWeek.setDate(start.getDate() - start.getDay()); // align to Sunday
    const cols: HeatmapCell[][] = [];
    let currentWeek: HeatmapCell[] = new Array(7).fill(null);
    let weekIdx = 0;
    for (const cell of cells) {
      const diffDays = Math.floor((cell.date.getTime() - startWeek.getTime()) / (1000 * 60 * 60 * 24));
      const w = Math.floor(diffDays / 7);
      const d = diffDays % 7;
      while (cols.length <= w) {
        cols.push(new Array(7).fill(null));
      }
      cols[w][d] = cell;
      weekIdx = w;
    }
    void weekIdx;

    const totalW = cols.length * (cellSize + cellGap);
    const totalH = 7 * (cellSize + cellGap);

    return (
      <div className={cn('inline-block', className)}>
        <svg
          role="img"
          aria-label={ariaLabel}
          width={totalW}
          height={totalH}
          viewBox={`0 0 ${totalW} ${totalH}`}
        >
          {cols.map((week, wi) =>
            week.map((cell, di) => {
              const x = wi * (cellSize + cellGap);
              const y = di * (cellSize + cellGap);
              if (!cell) {
                return (
                  <rect
                    key={`${wi}-${di}`}
                    x={x}
                    y={y}
                    width={cellSize}
                    height={cellSize}
                    rx={2}
                    fill="transparent"
                  />
                );
              }
              const b = bucketFor(cell.value);
              return (
                <rect
                  key={cell.id}
                  x={x}
                  y={y}
                  width={cellSize}
                  height={cellSize}
                  rx={2}
                  fill={bucketColor(b)}
                >
                  <title>{cell.label ?? `${cell.id}: ${cell.value}`}</title>
                </rect>
              );
            })
          )}
        </svg>
        <table className="sr-only">
          <caption>{ariaLabel}</caption>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(c => (
              <tr key={c.id}>
                <th scope="row">{c.id}</th>
                <td>{c.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Matrix heatmap
  const rows = rowLabels ?? Array.from(new Set(data.map(d => String(d.row ?? 0)))).sort();
  const cols = colLabels ?? Array.from(new Set(data.map(d => String(d.col ?? 0)))).sort();
  const cellMap = new Map<string, HeatmapCell>();
  for (const d of data) {
    const r = d.row ?? 0;
    const c = d.col ?? 0;
    cellMap.set(`${r}-${c}`, d);
  }
  const labelW = 80;
  const labelH = 20;
  const matrixW = labelW + cols.length * (cellSize + cellGap);
  const matrixH = labelH + rows.length * (cellSize + cellGap);

  return (
    <div className={cn('inline-block', className)}>
      <svg
        role="img"
        aria-label={ariaLabel}
        width={matrixW}
        height={matrixH}
        viewBox={`0 0 ${matrixW} ${matrixH}`}
      >
        {/* col headers */}
        {cols.map((label, ci) => (
          <text
            key={`col-${label}-${ci}`}
            x={labelW + ci * (cellSize + cellGap) + cellSize / 2}
            y={labelH - 4}
            fontSize={10}
            textAnchor="middle"
            fill="var(--amp-semantic-text-muted, #6b7280)"
          >
            {label}
          </text>
        ))}
        {/* row headers + cells */}
        {rows.map((rowLabel, ri) => (
          <g key={`row-${rowLabel}-${ri}`}>
            <text
              x={labelW - 6}
              y={labelH + ri * (cellSize + cellGap) + cellSize / 2 + 3}
              fontSize={10}
              textAnchor="end"
              fill="var(--amp-semantic-text-muted, #6b7280)"
            >
              {rowLabel}
            </text>
            {cols.map((_, ci) => {
              const cell = cellMap.get(`${ri}-${ci}`);
              const v = cell?.value ?? 0;
              const b = bucketFor(v);
              return (
                <rect
                  key={`cell-${ri}-${ci}`}
                  x={labelW + ci * (cellSize + cellGap)}
                  y={labelH + ri * (cellSize + cellGap)}
                  width={cellSize}
                  height={cellSize}
                  rx={2}
                  fill={bucketColor(b)}
                >
                  <title>{cell?.label ?? `${rowLabel} × ${cols[ci]}: ${v}`}</title>
                </rect>
              );
            })}
          </g>
        ))}
      </svg>
      <table className="sr-only">
        <caption>{ariaLabel}</caption>
        <thead>
          <tr>
            <th scope="col"></th>
            {cols.map(c => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((rl, ri) => (
            <tr key={rl}>
              <th scope="row">{rl}</th>
              {cols.map((_, ci) => (
                <td key={`${ri}-${ci}`}>{cellMap.get(`${ri}-${ci}`)?.value ?? ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Heatmap.displayName = 'Heatmap';
