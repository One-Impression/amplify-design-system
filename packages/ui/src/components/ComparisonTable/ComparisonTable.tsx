import React from 'react';
import { cn } from '../../lib/cn';

export type ComparisonCellValue = boolean | string | number | React.ReactNode;

export interface ComparisonPlan {
  id?: string;
  name: React.ReactNode;
  /** Optional sub-label rendered under the plan name. */
  subLabel?: React.ReactNode;
  /** Highlight this column. */
  highlighted?: boolean;
}

export interface ComparisonRow {
  /** Feature name in the first column. */
  feature: React.ReactNode;
  /** Optional category — used to render a section heading row before this. */
  category?: string;
  /** One value per plan, in the same order as `plans`. */
  values: ComparisonCellValue[];
}

export interface ComparisonTableProps extends React.HTMLAttributes<HTMLDivElement> {
  plans: ComparisonPlan[];
  rows: ComparisonRow[];
  /** Caption rendered above the table for screen readers and visually. */
  caption?: React.ReactNode;
}

function renderCell(value: ComparisonCellValue): React.ReactNode {
  if (value === true) {
    return (
      <span className="inline-flex items-center justify-center text-[var(--amp-semantic-status-success)]" aria-label="Included">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  }
  if (value === false || value === null || value === undefined) {
    return (
      <span className="inline-flex items-center justify-center text-[var(--amp-semantic-text-muted)]" aria-label="Not included">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
        </svg>
      </span>
    );
  }
  return <span className="text-[14px] text-[var(--amp-semantic-text-primary)]">{value}</span>;
}

export const ComparisonTable = React.forwardRef<HTMLDivElement, ComparisonTableProps>(
  ({ plans, rows, caption, className, ...props }, ref) => {
    // Group rows by category preserving order.
    const grouped: Array<{ category?: string; rows: ComparisonRow[] }> = [];
    for (const row of rows) {
      const last = grouped[grouped.length - 1];
      if (last && last.category === row.category) {
        last.rows.push(row);
      } else {
        grouped.push({ category: row.category, rows: [row] });
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          'w-full overflow-x-auto rounded-[16px] border border-[var(--amp-semantic-border-default)] bg-[var(--amp-semantic-bg-surface)]',
          className
        )}
        {...props}
      >
        <table className="w-full border-collapse text-left">
          {caption && (
            <caption className="px-6 py-4 text-[14px] text-[var(--amp-semantic-text-secondary)] text-left">
              {caption}
            </caption>
          )}
          <thead>
            <tr className="border-b border-[var(--amp-semantic-border-default)]">
              <th
                scope="col"
                className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wide text-[var(--amp-semantic-text-secondary)]"
              >
                Feature
              </th>
              {plans.map((plan, idx) => (
                <th
                  key={plan.id ?? idx}
                  scope="col"
                  className={cn(
                    'px-6 py-4 text-center align-bottom',
                    plan.highlighted && 'bg-[var(--amp-semantic-bg-accent-subtle)]'
                  )}
                >
                  <div className="text-[16px] font-semibold text-[var(--amp-semantic-text-primary)]">
                    {plan.name}
                  </div>
                  {plan.subLabel && (
                    <div className="text-[12px] font-normal text-[var(--amp-semantic-text-secondary)] mt-1">
                      {plan.subLabel}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grouped.map((group, gi) => (
              <React.Fragment key={gi}>
                {group.category && (
                  <tr className="bg-[var(--amp-semantic-bg-sunken)]">
                    <th
                      scope="rowgroup"
                      colSpan={plans.length + 1}
                      className="px-6 py-2 text-[12px] font-semibold uppercase tracking-wide text-[var(--amp-semantic-text-secondary)] text-left"
                    >
                      {group.category}
                    </th>
                  </tr>
                )}
                {group.rows.map((row, ri) => (
                  <tr
                    key={`${gi}-${ri}`}
                    className="border-t border-[var(--amp-semantic-border-default)]"
                  >
                    <th
                      scope="row"
                      className="px-6 py-3 text-[14px] font-medium text-[var(--amp-semantic-text-primary)] text-left"
                    >
                      {row.feature}
                    </th>
                    {plans.map((plan, pi) => (
                      <td
                        key={plan.id ?? pi}
                        className={cn(
                          'px-6 py-3 text-center',
                          plan.highlighted && 'bg-[var(--amp-semantic-bg-accent-subtle)]'
                        )}
                      >
                        {renderCell(row.values[pi])}
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

ComparisonTable.displayName = 'ComparisonTable';
