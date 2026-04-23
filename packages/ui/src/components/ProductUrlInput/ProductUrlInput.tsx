import React from 'react';
import { cn } from '../../lib/cn';

export interface ProductUrlInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  onAnalyse: () => void;
  placeholder?: string;
  loading?: boolean;
}

export const ProductUrlInput = React.forwardRef<HTMLDivElement, ProductUrlInputProps>(
  (
    {
      value,
      onChange,
      onAnalyse,
      placeholder = 'https://example.com/products/...',
      loading = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3',
          'transition-all duration-200',
          'focus-within:border-violet-400 focus-within:shadow-[0_0_0_3px_rgba(101,49,255,0.08)]',
          className
        )}
        {...props}
      >
        <svg
          className="h-4 w-4 flex-shrink-0 text-stone-400"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-stone-900 placeholder:text-stone-400 outline-none"
          aria-label="Product URL"
        />
        <button
          type="button"
          onClick={onAnalyse}
          disabled={loading || !value}
          className={cn(
            'rounded-lg bg-stone-900 px-4 py-1.5 text-xs font-medium text-white',
            'transition-colors hover:bg-stone-800',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {loading ? 'Analysing...' : 'Analyse \u2192'}
        </button>
      </div>
    );
  }
);

ProductUrlInput.displayName = 'ProductUrlInput';
