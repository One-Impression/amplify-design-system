import React from 'react';
import { cn } from '../../lib/cn';

export type IconGridColumns = 2 | 3 | 4;
export type IconGridGap = 'default' | 'comfortable';

export interface IconGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns at md+ breakpoint. Mobile is always 1 column. */
  columns?: IconGridColumns;
  /** Spacing between blocks. */
  gap?: IconGridGap;
  /** IconCallout children (or any equivalent feature blocks). */
  children: React.ReactNode;
}

const columnsClass: Record<IconGridColumns, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

const gapClass: Record<IconGridGap, string> = {
  default: 'gap-6',
  comfortable: 'gap-8 md:gap-10',
};

export const IconGrid = React.forwardRef<HTMLDivElement, IconGridProps>(
  ({ columns = 3, gap = 'default', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('grid w-full', columnsClass[columns], gapClass[gap], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

IconGrid.displayName = 'IconGrid';
