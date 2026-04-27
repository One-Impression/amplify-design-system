import React, { useState, useCallback } from 'react';
import { cn } from '../../lib/cn';

export interface ProductUrlInputProps {
  placeholder?: string;
  buttonLabel?: string;
  onSubmit?: (url: string) => void;
  className?: string;
}

export const ProductUrlInput = React.forwardRef<HTMLDivElement, ProductUrlInputProps>(
  (
    {
      placeholder = 'Paste product URL...',
      buttonLabel = 'Get Started',
      onSubmit,
      className,
    },
    ref
  ) => {
    const [value, setValue] = useState('');

    const handleSubmit = useCallback(() => {
      if (value.trim()) {
        onSubmit?.(value.trim());
      }
    }, [value, onSubmit]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          handleSubmit();
        }
      },
      [handleSubmit]
    );

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-2 shadow-lg',
          className
        )}
      >
        {/* Link icon */}
        <svg
          className="h-5 w-5 flex-shrink-0 text-stone-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>

        <input
          type="url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-w-0 flex-1 border-0 bg-transparent text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
        />

        <button
          type="button"
          onClick={handleSubmit}
          className={cn(
            'flex-shrink-0 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors',
            'hover:bg-violet-700',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600/40 focus-visible:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          disabled={!value.trim()}
        >
          {buttonLabel}
        </button>
      </div>
    );
  }
);

ProductUrlInput.displayName = 'ProductUrlInput';
