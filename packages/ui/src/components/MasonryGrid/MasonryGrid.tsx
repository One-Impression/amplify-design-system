'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/cn';

export interface MasonryBreakpointConfig {
  /** Column count at this breakpoint. */
  columns: number;
  /** Min width in px at which this column count applies. */
  minWidth: number;
}

export interface MasonryGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Static column count (overrides breakpoints). */
  columns?: number;
  /** Responsive column counts, sorted by minWidth ascending or descending. */
  breakpoints?: MasonryBreakpointConfig[];
  /** Gap between items in px. Default 16. */
  gap?: number;
  children?: React.ReactNode;
}

const defaultBreakpoints: MasonryBreakpointConfig[] = [
  { columns: 1, minWidth: 0 },
  { columns: 2, minWidth: 480 },
  { columns: 3, minWidth: 768 },
  { columns: 4, minWidth: 1200 },
];

const useColumnCount = (
  columns: number | undefined,
  breakpoints: MasonryBreakpointConfig[],
  ref: React.RefObject<HTMLElement | null>
) => {
  const [count, setCount] = useState<number>(() => columns ?? 1);

  useEffect(() => {
    if (typeof columns === 'number') {
      setCount(columns);
      return;
    }
    const node = ref.current;
    if (!node || typeof ResizeObserver === 'undefined') return;
    const sorted = [...breakpoints].sort((a, b) => a.minWidth - b.minWidth);
    const compute = (w: number) => {
      let result = sorted[0]?.columns ?? 1;
      for (const bp of sorted) if (w >= bp.minWidth) result = bp.columns;
      return result;
    };
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? node.clientWidth;
      setCount(compute(w));
    });
    ro.observe(node);
    setCount(compute(node.clientWidth));
    return () => ro.disconnect();
  }, [columns, breakpoints, ref]);

  return count;
};

export const MasonryGrid = React.forwardRef<HTMLDivElement, MasonryGridProps>(
  (
    {
      columns,
      breakpoints = defaultBreakpoints,
      gap = 16,
      className,
      style,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const innerRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(forwardedRef, () => innerRef.current as HTMLDivElement);

    const colCount = useColumnCount(columns, breakpoints, innerRef);
    const items = React.Children.toArray(children);

    // Distribute items into columns by index modulo (cheap, no measurement).
    const cols: React.ReactNode[][] = Array.from({ length: colCount }, () => []);
    items.forEach((child, idx) => {
      cols[idx % colCount].push(child);
    });

    return (
      <div
        ref={innerRef}
        role="list"
        className={cn('flex w-full', className)}
        style={{ gap, ...style }}
        {...props}
      >
        {cols.map((col, i) => (
          <div
            key={i}
            className="flex-1 min-w-0 flex flex-col"
            style={{ gap }}
            role="presentation"
          >
            {col.map((child, j) => (
              <div key={j} role="listitem">
                {child}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
);
MasonryGrid.displayName = 'MasonryGrid';
