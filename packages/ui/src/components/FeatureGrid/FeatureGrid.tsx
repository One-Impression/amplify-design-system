import React from 'react';
import { cn } from '../../lib/cn';

export interface FeatureItem {
  /** Stable id used as React key. */
  id?: string;
  /** Optional icon node — typically a 24x24 SVG. */
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Optional link slot — caller renders an <a> or <Link>. */
  link?: React.ReactNode;
}

export type FeatureGridColumns = 1 | 2 | 3 | 4 | 'auto';

export interface FeatureGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Feature cards. */
  items: FeatureItem[];
  /**
   * Maximum columns at the largest breakpoint. Defaults to `auto` which
   * resolves to 1 (mobile) → 2 (sm) → 3 (md) → 4 (lg) based on item count.
   */
  columns?: FeatureGridColumns;
  /** Visual treatment for each cell. */
  variant?: 'plain' | 'card' | 'bordered';
}

const variantCellClasses: Record<NonNullable<FeatureGridProps['variant']>, string> = {
  plain: '',
  card: 'rounded-[16px] border border-[var(--amp-semantic-border-default)] bg-[var(--amp-semantic-bg-surface)] p-6',
  bordered: 'rounded-[12px] border border-[var(--amp-semantic-border-default)] p-6',
};

function resolveColumnsClass(columns: FeatureGridColumns, itemCount: number): string {
  if (columns === 'auto') {
    if (itemCount >= 4) return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    if (itemCount === 3) return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
    if (itemCount === 2) return 'grid-cols-1 sm:grid-cols-2';
    return 'grid-cols-1';
  }
  switch (columns) {
    case 1:
      return 'grid-cols-1';
    case 2:
      return 'grid-cols-1 sm:grid-cols-2';
    case 3:
      return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
    case 4:
      return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  }
}

export const FeatureGrid = React.forwardRef<HTMLDivElement, FeatureGridProps>(
  ({ items, columns = 'auto', variant = 'plain', className, ...props }, ref) => {
    const colsClass = resolveColumnsClass(columns, items.length);
    const cellClass = variantCellClasses[variant];

    return (
      <div
        ref={ref}
        className={cn('grid gap-6 md:gap-8', colsClass, className)}
        {...props}
      >
        {items.map((item, idx) => (
          <article key={item.id ?? idx} className={cn('flex flex-col gap-3', cellClass)}>
            {item.icon && (
              <div
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-[10px]',
                  'bg-[var(--amp-semantic-bg-accent-subtle)] text-[var(--amp-semantic-text-accent)]'
                )}
                aria-hidden="true"
              >
                {item.icon}
              </div>
            )}
            <h3 className="text-[18px] font-semibold text-[var(--amp-semantic-text-primary)]">
              {item.title}
            </h3>
            {item.description && (
              <p className="text-[14px] leading-relaxed text-[var(--amp-semantic-text-secondary)]">
                {item.description}
              </p>
            )}
            {item.link && <div className="mt-1 text-[14px]">{item.link}</div>}
          </article>
        ))}
      </div>
    );
  }
);

FeatureGrid.displayName = 'FeatureGrid';
