'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';

export interface CommandItem {
  id: string;
  label: string;
  /** Optional secondary text shown after the label */
  hint?: string;
  /** Optional category section for grouping */
  group?: string;
  icon?: React.ReactNode;
  /** Keyboard shortcut display (e.g. ["⌘", "K"]) */
  shortcut?: string[];
  onSelect: () => void;
  /** Extra search keywords (not displayed) */
  keywords?: string[];
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
  /** Storage key for recently selected items (localStorage). Pass null to disable. */
  recentsKey?: string | null;
  /** Max recent items to remember. Default 5. */
  recentsLimit?: number;
  emptyMessage?: string;
  className?: string;
}

const isBrowser = typeof window !== 'undefined';

/** Lightweight fuzzy: returns a non-negative score (lower better) or -1 if no match. */
function fuzzyScore(query: string, target: string): number {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (t.includes(q)) return t.indexOf(q); // exact substring beats fuzzy match
  let qi = 0;
  let last = -1;
  let score = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      if (last >= 0) score += ti - last;
      last = ti;
      qi++;
    }
  }
  return qi === q.length ? score + 100 : -1;
}

function loadRecents(key: string | null | undefined): string[] {
  if (!isBrowser || !key) return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function saveRecents(key: string | null | undefined, ids: string[]) {
  if (!isBrowser || !key) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    /* ignore quota / privacy mode */
  }
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onClose,
  items,
  placeholder = 'Type a command or search…',
  recentsKey = 'amplify-ui:command-palette:recents',
  recentsLimit = 5,
  emptyMessage = 'No matching commands.',
  className,
}) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [recents, setRecents] = useState<string[]>(() => loadRecents(recentsKey));
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setRecents(loadRecents(recentsKey));
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open, recentsKey]);

  const handleSelect = useCallback(
    (item: CommandItem) => {
      if (recentsKey) {
        const next = [item.id, ...recents.filter((id) => id !== item.id)].slice(0, recentsLimit);
        setRecents(next);
        saveRecents(recentsKey, next);
      }
      onClose();
      // Defer to allow close animation/state to settle.
      setTimeout(() => item.onSelect(), 0);
    },
    [recents, recentsKey, recentsLimit, onClose]
  );

  const groups = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      // Recent items first, then all grouped by their group field.
      const byId = new Map(items.map((i) => [i.id, i]));
      const recentItems = recents.map((id) => byId.get(id)).filter((x): x is CommandItem => !!x);
      const rest = items.filter((i) => !recents.includes(i.id));
      const map = new Map<string, CommandItem[]>();
      if (recentItems.length) map.set('Recent', recentItems);
      rest.forEach((it) => {
        const g = it.group ?? 'Commands';
        if (!map.has(g)) map.set(g, []);
        map.get(g)!.push(it);
      });
      return Array.from(map, ([name, list]) => ({ name, items: list }));
    }
    // Score then group
    const scored: Array<{ item: CommandItem; score: number }> = [];
    items.forEach((it) => {
      const haystacks = [it.label, it.hint ?? '', ...(it.keywords ?? [])];
      let best = -1;
      for (const h of haystacks) {
        const s = fuzzyScore(trimmed, h);
        if (s >= 0 && (best < 0 || s < best)) best = s;
      }
      if (best >= 0) scored.push({ item: it, score: best });
    });
    scored.sort((a, b) => a.score - b.score);
    const map = new Map<string, CommandItem[]>();
    scored.forEach(({ item }) => {
      const g = item.group ?? 'Commands';
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(item);
    });
    return Array.from(map, ([name, list]) => ({ name, items: list }));
  }, [items, query, recents]);

  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  useEffect(() => {
    if (activeIndex >= flat.length) setActiveIndex(0);
  }, [flat.length, activeIndex]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, Math.max(flat.length - 1, 0)));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        const item = flat[activeIndex];
        if (item) {
          e.preventDefault();
          handleSelect(item);
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, flat, activeIndex, handleSelect, onClose]);

  if (!open || !isBrowser) return null;

  let runningIndex = -1;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          'relative w-full max-w-xl rounded-[16px] overflow-hidden',
          'bg-[var(--amp-semantic-bg-surface)] border border-[var(--amp-semantic-border-default)]',
          'shadow-2xl',
          className
        )}
      >
        <div className="flex items-center gap-2 px-4 border-b border-[var(--amp-semantic-border-default)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-[var(--amp-semantic-text-muted)]" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder={placeholder}
            className="flex-1 h-12 bg-transparent outline-none text-[14px] text-[var(--amp-semantic-text-primary)] placeholder:text-[var(--amp-semantic-text-muted)]"
            aria-label="Search commands"
            aria-controls="command-palette-list"
            aria-activedescendant={
              flat[activeIndex] ? `command-palette-item-${flat[activeIndex].id}` : undefined
            }
          />
          <kbd className="text-[11px] text-[var(--amp-semantic-text-muted)] border border-[var(--amp-semantic-border-default)] rounded px-1.5 py-0.5">
            Esc
          </kbd>
        </div>
        <div
          ref={listRef}
          id="command-palette-list"
          role="listbox"
          className="max-h-[60vh] overflow-y-auto py-2"
        >
          {flat.length === 0 ? (
            <div className="px-4 py-10 text-center text-[14px] text-[var(--amp-semantic-text-muted)]">
              {emptyMessage}
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.name}>
                <div className="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--amp-semantic-text-muted)]">
                  {group.name}
                </div>
                {group.items.map((item) => {
                  runningIndex++;
                  const isActive = runningIndex === activeIndex;
                  return (
                    <button
                      key={item.id}
                      id={`command-palette-item-${item.id}`}
                      role="option"
                      aria-selected={isActive}
                      onMouseEnter={() => setActiveIndex(runningIndex)}
                      onClick={() => handleSelect(item)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2 text-left text-[14px]',
                        'text-[var(--amp-semantic-text-primary)]',
                        isActive && 'bg-[var(--amp-semantic-bg-raised)]'
                      )}
                    >
                      {item.icon && (
                        <span className="text-[var(--amp-semantic-text-muted)]">{item.icon}</span>
                      )}
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.hint && (
                        <span className="text-[12px] text-[var(--amp-semantic-text-muted)] truncate">
                          {item.hint}
                        </span>
                      )}
                      {item.shortcut && (
                        <span className="flex items-center gap-1">
                          {item.shortcut.map((k, i) => (
                            <kbd
                              key={i}
                              className="text-[11px] text-[var(--amp-semantic-text-muted)] border border-[var(--amp-semantic-border-default)] rounded px-1.5 py-0.5"
                            >
                              {k}
                            </kbd>
                          ))}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
