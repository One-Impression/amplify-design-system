'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';

export interface SearchComboboxOption<T = unknown> {
  id: string;
  label: string;
  hint?: string;
  data?: T;
}

export interface SearchComboboxProps<T = unknown> {
  /** Async fetcher invoked with the (debounced) query. */
  onQuery: (query: string) => Promise<SearchComboboxOption<T>[]>;
  /** Called when the user selects an option (mouse or keyboard). */
  onSelect: (option: SearchComboboxOption<T>) => void;
  placeholder?: string;
  /** Debounce delay in ms. Default 250. */
  debounceMs?: number;
  /** Minimum chars before firing onQuery. Default 1. */
  minChars?: number;
  /** Initial input value. */
  initialQuery?: string;
  /** Optional empty-state message override. */
  emptyMessage?: string;
  className?: string;
}

/**
 * SearchCombobox — Input + Dropdown + Loading + EmptyState recipe.
 * Composes existing primitives with a tiny amount of debounce + result-list logic.
 */
export function SearchCombobox<T = unknown>({
  onQuery,
  onSelect,
  placeholder = 'Search…',
  debounceMs = 250,
  minChars = 1,
  initialQuery = '',
  emptyMessage = 'No matches.',
  className,
}: SearchComboboxProps<T>) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchComboboxOption<T>[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const reqRef = useRef(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < minChars) {
      setResults([]);
      setLoading(false);
      return;
    }
    const myReq = ++reqRef.current;
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const next = await onQuery(query);
        if (reqRef.current === myReq) {
          setResults(next);
          setActiveIdx(0);
        }
      } finally {
        if (reqRef.current === myReq) setLoading(false);
      }
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [query, minChars, debounceMs, onQuery]);

  useEffect(() => {
    const onClickAway = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickAway);
    return () => document.removeEventListener('mousedown', onClickAway);
  }, []);

  const showDropdown = open && (loading || results.length > 0 || query.length >= minChars);

  const handleSelect = (option: SearchComboboxOption<T>) => {
    onSelect(option);
    setOpen(false);
    setQuery(option.label);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[activeIdx]) {
      e.preventDefault();
      handleSelect(results[activeIdx]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const listboxId = useMemo(() => `combobox-${Math.random().toString(36).slice(2, 8)}`, []);

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      <input
        type="text"
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls={listboxId}
        aria-activedescendant={
          showDropdown && results[activeIdx] ? `${listboxId}-opt-${results[activeIdx].id}` : undefined
        }
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className={cn(
          'w-full h-10 px-3 rounded-[8px] text-[14px]',
          'bg-[var(--amp-semantic-bg-surface)] text-[var(--amp-semantic-text-primary)]',
          'border border-[var(--amp-semantic-border-default)]',
          'placeholder:text-[var(--amp-semantic-text-muted)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--amp-semantic-accent,_#6531FF)]/40'
        )}
      />
      {showDropdown && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-40 mt-1 w-full max-h-72 overflow-y-auto rounded-[8px] bg-[var(--amp-semantic-bg-surface)] border border-[var(--amp-semantic-border-default)] shadow-lg"
        >
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <LoadingState variant="spinner" size="sm" />
            </div>
          ) : results.length === 0 ? (
            <EmptyState variant="noResults" description={emptyMessage} />
          ) : (
            results.map((opt, i) => (
              <button
                key={opt.id}
                id={`${listboxId}-opt-${opt.id}`}
                role="option"
                aria-selected={i === activeIdx}
                onMouseEnter={() => setActiveIdx(i)}
                onClick={() => handleSelect(opt)}
                className={cn(
                  'w-full text-left px-3 py-2 text-[14px] flex items-center gap-2',
                  i === activeIdx
                    ? 'bg-[var(--amp-semantic-bg-raised)] text-[var(--amp-semantic-text-primary)]'
                    : 'text-[var(--amp-semantic-text-primary)]'
                )}
              >
                <span className="flex-1 truncate">{opt.label}</span>
                {opt.hint && (
                  <span className="text-[12px] text-[var(--amp-semantic-text-muted)]">{opt.hint}</span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
