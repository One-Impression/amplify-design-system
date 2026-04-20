import React, { useState, useMemo } from 'react';
import { cn } from '../../lib/cn';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey?: keyof T | ((item: T) => string);
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

type SortDir = 'asc' | 'desc';

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  loading = false,
  emptyMessage = 'No data available',
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortDir]);

  if (loading) {
    return (
      <div className={cn('rounded-[16px] border border-[var(--amp-semantic-border-default)] overflow-hidden', className)}>
        <div className="p-8 text-center text-[14px] text-[var(--amp-semantic-text-muted)]">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-[16px] border border-[var(--amp-semantic-border-default)] overflow-hidden', className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[var(--amp-semantic-bg-sunken)]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wide text-[var(--amp-semantic-text-secondary)]',
                  col.sortable && 'cursor-pointer select-none hover:text-[var(--amp-semantic-text-primary)]'
                )}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
                aria-sort={sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
              >
                <span className="inline-flex items-center gap-1">
                  {col.header}
                  {col.sortable && sortKey === col.key && (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={sortDir === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
                      />
                    </svg>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-[14px] text-[var(--amp-semantic-text-muted)]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, idx) => {
              const key = rowKey
                ? typeof rowKey === 'function'
                  ? rowKey(row)
                  : String(row[rowKey])
                : idx;
              return (
              <tr
                key={key}
                className={cn(
                  'border-t border-[var(--amp-semantic-border-default)]',
                  'hover:bg-[var(--amp-semantic-bg-raised)] transition-colors duration-100',
                  idx % 2 === 1 && 'bg-[var(--amp-semantic-bg-sunken)]/30'
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3 text-[14px] text-[var(--amp-semantic-text-primary)]"
                  >
                    {col.render ? col.render(row) : (row[col.key] as React.ReactNode)}
                  </td>
                ))}
              </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
