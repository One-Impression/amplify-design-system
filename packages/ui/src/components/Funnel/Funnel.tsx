'use client';

import React, { useMemo } from 'react';
import { cn } from '../../lib/cn';
import { formatCompact, pickColor } from '../../lib/chart-utils';

export interface FunnelStage {
  name: string;
  value: number;
  color?: string;
  /** Optional helper line shown under the stage name. */
  description?: string;
}

export interface FunnelProps {
  stages: FunnelStage[];
  /** Show drop-off / conversion percentage between stages. */
  showConversion?: boolean;
  /** Show absolute value. */
  showValue?: boolean;
  height?: number;
  /** Format value labels (defaults to compact: 1.2K). */
  valueFormat?: (n: number) => string;
  ariaLabel: string;
  className?: string;
}

export const Funnel: React.FC<FunnelProps> = ({
  stages,
  showConversion = true,
  showValue = true,
  height = 280,
  valueFormat = formatCompact,
  ariaLabel,
  className,
}) => {
  const computed = useMemo(() => {
    const max = stages.reduce((m, s) => (s.value > m ? s.value : m), 0) || 1;
    return stages.map((stage, i) => {
      const widthPct = (stage.value / max) * 100;
      const fromPrev =
        i === 0
          ? 100
          : stages[i - 1].value === 0
            ? 0
            : (stage.value / stages[i - 1].value) * 100;
      const fromTop = stages[0].value === 0 ? 0 : (stage.value / stages[0].value) * 100;
      return {
        ...stage,
        widthPct,
        fromPrev,
        fromTop,
        color: stage.color ?? pickColor(i),
      };
    });
  }, [stages]);

  const stageH = stages.length > 0 ? Math.max(28, Math.floor(height / stages.length) - 8) : 0;

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn('w-full', className)}
    >
      <ul className="flex flex-col gap-2" style={{ minHeight: height }}>
        {computed.map((stage, i) => (
          <li key={`${stage.name}-${i}`} className="relative">
            <div className="flex items-center gap-3">
              {/* trapezoid bar (centered) */}
              <div className="flex-1 flex justify-center">
                <div
                  style={{
                    width: `${stage.widthPct}%`,
                    height: stageH,
                    backgroundColor: stage.color,
                    clipPath:
                      i < stages.length - 1
                        ? `polygon(0 0, 100% 0, 95% 100%, 5% 100%)`
                        : 'none',
                    minWidth: 60,
                  }}
                  className="flex items-center justify-center text-white text-[14px] font-semibold transition-all"
                >
                  {showValue && valueFormat(stage.value)}
                </div>
              </div>
              {/* meta column on the right */}
              <div className="w-32 shrink-0">
                <p className="text-[13px] font-medium text-[var(--amp-semantic-text-primary,#111827)]">
                  {stage.name}
                </p>
                {stage.description && (
                  <p className="text-[11px] text-[var(--amp-semantic-text-muted,#6b7280)]">
                    {stage.description}
                  </p>
                )}
                {showConversion && i > 0 && (
                  <p className="text-[11px] text-[var(--amp-semantic-text-secondary,#374151)] mt-0.5">
                    <span className={stage.fromPrev >= 50 ? 'text-[var(--amp-semantic-status-success,#16a34a)]' : 'text-[var(--amp-semantic-status-warning,#d97706)]'}>
                      {stage.fromPrev.toFixed(0)}%
                    </span>{' '}
                    from prev
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <table className="sr-only">
        <caption>{ariaLabel}</caption>
        <thead>
          <tr>
            <th scope="col">Stage</th>
            <th scope="col">Value</th>
            <th scope="col">% of top</th>
            <th scope="col">% of prev</th>
          </tr>
        </thead>
        <tbody>
          {computed.map(s => (
            <tr key={s.name}>
              <th scope="row">{s.name}</th>
              <td>{s.value}</td>
              <td>{s.fromTop.toFixed(1)}%</td>
              <td>{s.fromPrev.toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Funnel.displayName = 'Funnel';
