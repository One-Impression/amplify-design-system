import React from 'react';
import { cn } from '../lib/cn';
import { MetricCard } from '../components/MetricCard';
import type { MetricCardProps } from '../components/MetricCard';

export interface MetricGridProps {
  metrics: MetricCardProps[];
  /** Number of columns at the desktop breakpoint. Default 4 (caps at metrics.length). */
  columns?: 2 | 3 | 4 | 5 | 6;
  /** Gap class between cards. Default 'gap-4'. */
  gapClassName?: string;
  className?: string;
}

const DESKTOP_COL: Record<2 | 3 | 4 | 5 | 6, string> = {
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
};

/**
 * MetricGrid — N-column responsive grid of MetricCards.
 * Mobile = 1 col, tablet = 2 cols, desktop = `columns`.
 */
export const MetricGrid: React.FC<MetricGridProps> = ({
  metrics,
  columns = 4,
  gapClassName = 'gap-4',
  className,
}) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2',
        DESKTOP_COL[columns],
        gapClassName,
        className
      )}
    >
      {metrics.map((m, i) => (
        <MetricCard key={`${m.label}-${i}`} {...m} />
      ))}
    </div>
  );
};
