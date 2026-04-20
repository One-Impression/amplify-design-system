import React from 'react';
import { cn } from '../../lib/cn';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | '...')[] = [1];

    if (currentPage > 3) pages.push('...');

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push('...');

    pages.push(totalPages);
    return pages;
  };

  return (
    <nav aria-label="Pagination" className={cn('flex items-center gap-1', className)}>
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        className={cn(
          'h-9 px-3 rounded-[8px] text-[14px] font-medium transition-colors',
          'text-[var(--amp-semantic-text-secondary)] hover:bg-[var(--amp-semantic-bg-raised)]',
          currentPage <= 1 && 'opacity-50 cursor-not-allowed hover:bg-transparent'
        )}
      >
        Previous
      </button>

      {getPageNumbers().map((page, idx) =>
        page === '...' ? (
          <span
            key={`ellipsis-${idx}`}
            className="w-9 h-9 flex items-center justify-center text-[14px] text-[var(--amp-semantic-text-muted)]"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={cn(
              'w-9 h-9 rounded-[8px] text-[14px] font-medium transition-colors',
              page === currentPage
                ? 'bg-[var(--amp-semantic-accent)] text-[var(--amp-semantic-text-inverse)]'
                : 'text-[var(--amp-semantic-text-secondary)] hover:bg-[var(--amp-semantic-bg-raised)]'
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
        className={cn(
          'h-9 px-3 rounded-[8px] text-[14px] font-medium transition-colors',
          'text-[var(--amp-semantic-text-secondary)] hover:bg-[var(--amp-semantic-bg-raised)]',
          currentPage >= totalPages && 'opacity-50 cursor-not-allowed hover:bg-transparent'
        )}
      >
        Next
      </button>
    </nav>
  );
};
