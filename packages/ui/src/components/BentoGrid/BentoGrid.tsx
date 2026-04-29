'use client';

import React from 'react';
import { cn } from '../../lib/cn';

export type BentoSize = '1x1' | '1x2' | '2x1' | '2x2';

export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Total columns at the largest breakpoint. Default 4. */
  columns?: number;
  /** Row height in CSS units (number → px). Default `minmax(120px, auto)`. */
  rowHeight?: string | number;
  /** Gap between cells in px. Default 16. */
  gap?: number;
  /**
   * Below this width (in px), the grid collapses to a single column and all
   * items render at 1x1. Default 640.
   */
  collapseBelow?: number;
  children?: React.ReactNode;
}

export interface BentoItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Cell size (cols x rows). */
  size?: BentoSize;
  children?: React.ReactNode;
}

const sizeMap: Record<BentoSize, { col: number; row: number }> = {
  '1x1': { col: 1, row: 1 },
  '1x2': { col: 1, row: 2 },
  '2x1': { col: 2, row: 1 },
  '2x2': { col: 2, row: 2 },
};

export const BentoItem = React.forwardRef<HTMLDivElement, BentoItemProps>(
  ({ size = '1x1', className, style, children, ...props }, ref) => {
    const { col, row } = sizeMap[size];
    return (
      <div
        ref={ref}
        data-bento-cols={col}
        data-bento-rows={row}
        className={cn(
          'rounded-[20px] bg-[var(--amp-semantic-bg-surface)] border border-[var(--amp-semantic-border-default)] p-5',
          'transition-shadow hover:shadow-md',
          className
        )}
        style={{
          gridColumn: `span ${col}`,
          gridRow: `span ${row}`,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
BentoItem.displayName = 'BentoItem';

export const BentoGrid = React.forwardRef<HTMLDivElement, BentoGridProps>(
  (
    {
      columns = 4,
      rowHeight,
      gap = 16,
      collapseBelow = 640,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const rh =
      typeof rowHeight === 'number'
        ? `${rowHeight}px`
        : rowHeight ?? 'minmax(120px, auto)';

    // Use container queries if supported; otherwise rely on a media-query rule
    // that flips the grid to one column below `collapseBelow` via inline CSS.
    const responsiveClass = `amp-bento-${React.useId().replace(/[:]/g, '')}`;

    return (
      <>
        <style>
          {`@media (max-width: ${collapseBelow}px){.${responsiveClass}{grid-template-columns: repeat(1, minmax(0, 1fr)) !important;}.${responsiveClass} > [data-bento-cols]{grid-column: span 1 !important;grid-row: span 1 !important;}}`}
        </style>
        <div
          ref={ref}
          role="list"
          className={cn(responsiveClass, 'grid w-full', className)}
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            gridAutoRows: rh,
            gap,
            ...style,
          }}
          {...props}
        >
          {children}
        </div>
      </>
    );
  }
);
BentoGrid.displayName = 'BentoGrid';
