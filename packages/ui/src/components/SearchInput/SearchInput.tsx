import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  debounceMs?: number;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  onClear,
  debounceMs = 300,
  className,
}) => {
  const [internal, setInternal] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      prevValueRef.current = value;
      setInternal(value);
    }
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInternal(val);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onChange(val);
      }, debounceMs);
    },
    [onChange, debounceMs]
  );

  const handleClear = useCallback(() => {
    setInternal('');
    onChange('');
    onClear?.();
  }, [onChange, onClear]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className={cn('relative', className)}>
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--amp-semantic-text-muted)]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={internal}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={placeholder}
        className={cn(
          'h-10 pl-10 pr-10 rounded-[16px] text-[14px] w-full',
          'bg-[var(--amp-semantic-bg-surface)] text-[var(--amp-semantic-text-primary)]',
          'border border-[var(--amp-semantic-border-default)]',
          'placeholder:text-[var(--amp-semantic-text-muted)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--amp-semantic-border-focus)] focus:border-[var(--amp-semantic-border-focus)]',
          'transition-colors duration-150'
        )}
      />
      {internal && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--amp-semantic-text-muted)] hover:text-[var(--amp-semantic-text-primary)] transition-colors"
        >
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};
