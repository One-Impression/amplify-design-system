'use client';

import React, {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '../../lib/cn';

export interface ComboboxItemData {
  value: string;
  label: string;
  hint?: string;
  disabled?: boolean;
}

interface ComboboxContextValue {
  registerItem: (item: ComboboxItemData) => void;
  unregisterItem: (value: string) => void;
}

const ComboboxContext = createContext<ComboboxContextValue | null>(null);

export interface ComboboxProps {
  /** Currently selected value (controlled). */
  value?: string | null;
  /** Initial value (uncontrolled). */
  defaultValue?: string | null;
  /** Called when selection changes. */
  onValueChange?: (value: string | null) => void;
  /** Static list of items. Mutually exclusive with `loadItems` and `<Combobox.Item>` children. */
  items?: ComboboxItemData[];
  /**
   * Async loader called with the (debounced) search query.
   * If provided, items returned here replace the static list.
   */
  loadItems?: (query: string) => Promise<ComboboxItemData[]>;
  /** Debounce delay in ms for `loadItems`. Default 250. */
  debounceMs?: number;
  /** Optional label. */
  label?: string;
  /** Placeholder text shown in the input when empty. */
  placeholder?: string;
  /** Error message — sets `aria-invalid` and shows below the input. */
  error?: string;
  /** Helper text — shown below when no error. */
  helperText?: string;
  /** Empty-state message override. Default `'No matches.'` */
  emptyMessage?: string;
  /** Disable the combobox. */
  disabled?: boolean;
  /** Read-only — opens listbox but doesn't allow selection changes. */
  readOnly?: boolean;
  /** Children — `<Combobox.Item>` elements (alternative to `items` prop). */
  children?: React.ReactNode;
  className?: string;
  id?: string;
  /** Form name (for native form submission). */
  name?: string;
}

interface ComboboxComponent extends React.FC<ComboboxProps> {
  Item: React.FC<ComboboxItemProps>;
}

export interface ComboboxItemProps {
  value: string;
  /** Display label (defaults to children if string). */
  label?: string;
  hint?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * Combobox.Item — declarative item used as a child of `<Combobox>`.
 *
 * This component does not render anything on its own; `<Combobox>` reads its
 * props via `Children.toArray` and renders the listbox itself. This keeps
 * keyboard nav, async filtering, and ARIA wiring centralised.
 */
const ComboboxItem: React.FC<ComboboxItemProps> = () => null;
ComboboxItem.displayName = 'Combobox.Item';

function extractItemsFromChildren(children: React.ReactNode): ComboboxItemData[] {
  return Children.toArray(children).flatMap((child): ComboboxItemData[] => {
    if (!isValidElement<ComboboxItemProps>(child)) return [];
    if (child.type !== ComboboxItem) return [];
    const { value, label, hint, disabled, children: inner } = child.props;
    const resolvedLabel = label ?? (typeof inner === 'string' ? inner : value);
    return [{ value, label: resolvedLabel, hint, disabled }];
  });
}

function defaultFilter(query: string, items: ComboboxItemData[]): ComboboxItemData[] {
  if (!query) return items;
  const q = query.toLowerCase();
  return items.filter(
    (it) => it.label.toLowerCase().includes(q) || it.value.toLowerCase().includes(q)
  );
}

const ComboboxBase: React.FC<ComboboxProps> = ({
  value: controlledValue,
  defaultValue = null,
  onValueChange,
  items: itemsProp,
  loadItems,
  debounceMs = 250,
  label,
  placeholder = 'Search…',
  error,
  helperText,
  emptyMessage = 'No matches.',
  disabled = false,
  readOnly = false,
  children,
  className,
  id,
  name,
}) => {
  const generatedId = useId();
  const fieldId = id || `combobox-${generatedId}`;
  const listboxId = `${fieldId}-listbox`;
  const errorId = `${fieldId}-error`;
  const helperId = `${fieldId}-helper`;

  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(defaultValue);
  const value = isControlled ? controlledValue ?? null : uncontrolledValue;

  const childItems = useMemo(() => extractItemsFromChildren(children), [children]);
  const staticItems = itemsProp ?? childItems;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightIdx, setHighlightIdx] = useState(0);
  const [asyncItems, setAsyncItems] = useState<ComboboxItemData[] | null>(null);
  const [loading, setLoading] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const reqRef = useRef(0);

  // Debounced async loading.
  useEffect(() => {
    if (!loadItems || !open) return;
    const myReq = ++reqRef.current;
    setLoading(true);
    const timer = window.setTimeout(async () => {
      try {
        const next = await loadItems(query);
        if (reqRef.current === myReq) {
          setAsyncItems(next);
          setHighlightIdx(0);
        }
      } finally {
        if (reqRef.current === myReq) setLoading(false);
      }
    }, debounceMs);
    return () => window.clearTimeout(timer);
  }, [query, loadItems, debounceMs, open]);

  // Click-away closes the listbox.
  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [open]);

  const selectedItem = useMemo<ComboboxItemData | undefined>(() => {
    const pool = asyncItems ?? staticItems;
    return pool.find((it) => it.value === value);
  }, [asyncItems, staticItems, value]);

  // Visible items: async results take priority; otherwise filter static items by query.
  const visibleItems = useMemo<ComboboxItemData[]>(() => {
    if (loadItems) return asyncItems ?? [];
    return defaultFilter(query, staticItems);
  }, [loadItems, asyncItems, query, staticItems]);

  // Show selected label in the input when not actively searching.
  const inputValue = open ? query : selectedItem?.label ?? '';

  const commitValue = useCallback(
    (next: string | null) => {
      if (disabled || readOnly) return;
      if (!isControlled) setUncontrolledValue(next);
      onValueChange?.(next);
    },
    [disabled, readOnly, isControlled, onValueChange]
  );

  const openAndPreparQuery = () => {
    if (disabled) return;
    setQuery('');
    setOpen(true);
    setHighlightIdx(0);
  };

  const closeListbox = () => {
    setOpen(false);
    setQuery('');
  };

  const onItemPick = (item: ComboboxItemData) => {
    if (item.disabled) return;
    commitValue(item.value);
    closeListbox();
    inputRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) {
        openAndPreparQuery();
        return;
      }
      setHighlightIdx((i) => Math.min(i + 1, Math.max(0, visibleItems.length - 1)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) {
        openAndPreparQuery();
        return;
      }
      setHighlightIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      if (open) {
        e.preventDefault();
        const target = visibleItems[highlightIdx];
        if (target) onItemPick(target);
      }
    } else if (e.key === 'Escape') {
      if (open) {
        e.preventDefault();
        closeListbox();
      }
    } else if (e.key === 'Tab') {
      if (open) closeListbox();
    } else if (e.key === 'Home' && open) {
      e.preventDefault();
      setHighlightIdx(0);
    } else if (e.key === 'End' && open) {
      e.preventDefault();
      setHighlightIdx(Math.max(0, visibleItems.length - 1));
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    setQuery(e.target.value);
    if (!open) setOpen(true);
    setHighlightIdx(0);
  };

  const onClear = () => {
    if (disabled || readOnly) return;
    commitValue(null);
    setQuery('');
    inputRef.current?.focus();
  };

  const describedBy = error ? errorId : helperText ? helperId : undefined;
  const activeId =
    open && visibleItems[highlightIdx]
      ? `${listboxId}-opt-${visibleItems[highlightIdx].value}`
      : undefined;

  // No-op context — only present so `<Combobox.Item>` can be rendered safely
  // without warning, but we read items via Children.toArray above.
  const ctx = useMemo<ComboboxContextValue>(
    () => ({
      registerItem: () => undefined,
      unregisterItem: () => undefined,
    }),
    []
  );

  const showEmpty = open && !loading && visibleItems.length === 0;

  return (
    <ComboboxContext.Provider value={ctx}>
      <div className={cn('flex flex-col gap-1.5', className)} ref={wrapperRef}>
        {label && (
          <label
            htmlFor={fieldId}
            className="text-[14px] font-medium text-[var(--amp-semantic-text-primary)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={inputRef}
            id={fieldId}
            name={name}
            type="text"
            role="combobox"
            autoComplete="off"
            spellCheck={false}
            value={inputValue}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-activedescendant={activeId}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            onChange={onInputChange}
            onFocus={() => {
              if (!disabled) setOpen(true);
            }}
            onClick={() => {
              if (!disabled) setOpen(true);
            }}
            onKeyDown={onKeyDown}
            className={cn(
              'h-10 px-3 pr-10 rounded-[16px] text-[14px] w-full',
              'bg-[var(--amp-semantic-bg-surface)] text-[var(--amp-semantic-text-primary)]',
              'border border-[var(--amp-semantic-border-default)]',
              'placeholder:text-[var(--amp-semantic-text-muted)]',
              'focus:outline-none focus:ring-2 focus:ring-[var(--amp-semantic-border-focus)] focus:border-[var(--amp-semantic-border-focus)]',
              'transition-colors duration-150',
              error &&
                'border-[var(--amp-semantic-status-error)] focus:ring-[var(--amp-semantic-status-error)]',
              disabled && 'opacity-50 cursor-not-allowed bg-[var(--amp-semantic-bg-sunken)]',
              readOnly && 'cursor-default'
            )}
          />
          {value && !disabled && !readOnly ? (
            <button
              type="button"
              aria-label="Clear selection"
              onClick={onClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--amp-semantic-text-muted)] hover:text-[var(--amp-semantic-text-primary)] transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <svg
              aria-hidden="true"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--amp-semantic-text-muted)] pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          )}
          {open && (
            <ul
              id={listboxId}
              role="listbox"
              aria-label={label || 'Suggestions'}
              className={cn(
                'absolute z-40 mt-1 w-full max-h-72 overflow-y-auto rounded-[8px] py-1',
                'bg-[var(--amp-semantic-bg-surface)] border border-[var(--amp-semantic-border-default)] shadow-lg'
              )}
            >
              {loading && (
                <li
                  role="status"
                  aria-live="polite"
                  className="px-3 py-2 text-[13px] text-[var(--amp-semantic-text-muted)]"
                >
                  Loading…
                </li>
              )}
              {showEmpty && (
                <li
                  role="status"
                  aria-live="polite"
                  className="px-3 py-2 text-[13px] text-[var(--amp-semantic-text-muted)]"
                >
                  {emptyMessage}
                </li>
              )}
              {!loading &&
                visibleItems.map((item, i) => {
                  const isHighlighted = i === highlightIdx;
                  const isSelected = item.value === value;
                  return (
                    <li
                      key={item.value}
                      id={`${listboxId}-opt-${item.value}`}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={item.disabled || undefined}
                      onMouseEnter={() => setHighlightIdx(i)}
                      onMouseDown={(e) => {
                        // Prevent input blur which would close the listbox before click fires.
                        e.preventDefault();
                      }}
                      onClick={() => onItemPick(item)}
                      className={cn(
                        'px-3 py-2 text-[14px] flex items-center gap-2 cursor-pointer select-none',
                        item.disabled && 'opacity-50 cursor-not-allowed',
                        isHighlighted && !item.disabled
                          ? 'bg-[var(--amp-semantic-bg-raised)]'
                          : '',
                        'text-[var(--amp-semantic-text-primary)]'
                      )}
                    >
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.hint && (
                        <span className="text-[12px] text-[var(--amp-semantic-text-muted)]">
                          {item.hint}
                        </span>
                      )}
                      {isSelected && (
                        <svg
                          aria-hidden="true"
                          className="w-3.5 h-3.5 text-[var(--amp-semantic-accent)]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
        {error && (
          <p id={errorId} className="text-[12px] text-[var(--amp-semantic-status-error)]">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-[12px] text-[var(--amp-semantic-text-muted)]">
            {helperText}
          </p>
        )}
      </div>
    </ComboboxContext.Provider>
  );
};

ComboboxBase.displayName = 'Combobox';

export const Combobox = ComboboxBase as ComboboxComponent;
Combobox.Item = ComboboxItem;

// Touch the context export so it isn't tree-shaken to a confusing error.
export { ComboboxContext };
