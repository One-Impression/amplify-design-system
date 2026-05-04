import React from 'react';
import { cn } from '../../lib/cn';

/**
 * BriefStrip — horizontal chip strip representing the user's brief.
 *
 * Composes the existing <Chip> primitive — but uses a slimmer, brief-tuned
 * visual treatment so the strip can sit above a dense canvas without competing
 * with primary content. Each chip is a compact, editable token of the brief
 * (goal, audience, lock, etc). Studio v2 uses this as the persistent header
 * row driving variant generation.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type BriefChipKind =
  | 'goal'
  | 'audience'
  | 'lock'
  | 'avoid'
  | 'ref'
  | 'density'
  | 'custom';

export interface BriefChipItem {
  id: string;
  kind: BriefChipKind;
  /** Optional faded prefix shown before the value, e.g. "goal:". */
  key?: string;
  /** Primary label text. */
  value: string;
  /** Locked chips render with the lock glyph and accent-soft background. */
  locked?: boolean;
}

export interface BriefStripProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  chips: BriefChipItem[];
  onChipClick?: (id: string) => void;
  onChipRemove?: (id: string) => void;
  /** Fired when the user clicks the "+ add" affordance. */
  onAddRequest?: () => void;
  /** Fired when the user types into the inline input and presses Enter. */
  onParseInput?: (rawText: string) => void;
  /** When true, shows an "Expand brief" affordance on the right. */
  expandable?: boolean;
  onExpand?: () => void;
  className?: string;
}

// ─── Visual tokens ───────────────────────────────────────────────────────────

const baseChipClasses = cn(
  'inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
  'transition-colors duration-150',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
  'focus-visible:ring-[var(--amp-semantic-border-focus)]'
);

const kindToneClasses: Record<BriefChipKind, string> = {
  goal: 'bg-[var(--amp-semantic-bg-accent-subtle)] text-[var(--amp-semantic-text-accent)]',
  audience: 'bg-[var(--amp-semantic-bg-info-subtle)] text-[var(--amp-semantic-status-info)]',
  lock: 'bg-[var(--amp-semantic-bg-accent-subtle)] text-[var(--amp-semantic-text-accent)]',
  avoid: 'bg-[var(--amp-semantic-bg-error-subtle)] text-[var(--amp-semantic-status-error)]',
  ref: 'bg-[var(--amp-semantic-bg-subtle)] text-[var(--amp-semantic-text-secondary)]',
  density: 'bg-[var(--amp-semantic-bg-subtle)] text-[var(--amp-semantic-text-secondary)]',
  custom: 'bg-[var(--amp-semantic-bg-subtle)] text-[var(--amp-semantic-text-secondary)]',
};

const lockedToneOverride =
  'bg-[var(--amp-semantic-bg-accent-subtle)] text-[var(--amp-semantic-text-accent)] ring-1 ring-inset ring-[var(--amp-semantic-border-accent)]';

// ─── Component ───────────────────────────────────────────────────────────────

export const BriefStrip = React.forwardRef<HTMLDivElement, BriefStripProps>(
  (
    {
      chips,
      onChipClick,
      onChipRemove,
      onAddRequest,
      onParseInput,
      expandable = false,
      onExpand,
      className,
      ...rest
    },
    ref,
  ) => {
    const [draft, setDraft] = React.useState('');
    const [editing, setEditing] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      if (editing) inputRef.current?.focus();
    }, [editing]);

    const handleAddClick = () => {
      onAddRequest?.();
      setEditing(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const value = draft.trim();
        if (value) onParseInput?.(value);
        setDraft('');
        setEditing(false);
      } else if (e.key === 'Escape') {
        setDraft('');
        setEditing(false);
      }
    };

    const handleBlur = () => {
      const value = draft.trim();
      if (value) onParseInput?.(value);
      setDraft('');
      setEditing(false);
    };

    const isEmpty = chips.length === 0;

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Brief"
        className={cn(
          'flex w-full items-center gap-2 overflow-x-auto whitespace-nowrap',
          'border-b border-[var(--amp-semantic-border-subtle)]',
          'bg-[var(--amp-semantic-bg-surface)]',
          'px-3 py-2',
          'scrollbar-thin',
          className,
        )}
        {...rest}
      >
        <div
          className="flex min-w-0 flex-1 items-center gap-1.5"
          data-testid="brief-strip-chips"
          role="list"
        >
          {chips.map((chip) => {
            const removable = !!onChipRemove && !chip.locked;
            const tone = chip.locked ? lockedToneOverride : kindToneClasses[chip.kind];
            return (
              <span
                key={chip.id}
                role="listitem"
                className="group/brief-chip relative inline-flex shrink-0 items-center"
              >
                <button
                  type="button"
                  className={cn(baseChipClasses, tone, 'pr-2')}
                  onClick={() => onChipClick?.(chip.id)}
                  aria-label={`Edit ${chip.kind}: ${chip.value}`}
                  data-chip-kind={chip.kind}
                  data-chip-id={chip.id}
                >
                  {chip.locked && (
                    <span aria-hidden="true" className="text-[10px] leading-none">
                      &#128274;
                    </span>
                  )}
                  {chip.key && (
                    <span className="text-[var(--amp-semantic-text-tertiary)]">{chip.key}</span>
                  )}
                  <span>{chip.value}</span>
                </button>
                {removable && (
                  <button
                    type="button"
                    aria-label={`Remove ${chip.kind}: ${chip.value}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onChipRemove?.(chip.id);
                    }}
                    className={cn(
                      'ml-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full',
                      'text-[var(--amp-semantic-text-tertiary)] opacity-0 transition-opacity duration-150',
                      'hover:bg-[var(--amp-semantic-bg-subtle)] hover:text-[var(--amp-semantic-text-default)]',
                      'group-hover/brief-chip:opacity-100 focus-visible:opacity-100',
                      'focus-visible:outline-none focus-visible:ring-2',
                      'focus-visible:ring-[var(--amp-semantic-border-focus)]',
                    )}
                  >
                    <svg
                      className="h-2.5 w-2.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </span>
            );
          })}

          {editing ? (
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              placeholder="Type a goal, audience, or constraint…"
              aria-label="Add to brief"
              className={cn(
                'inline-flex min-w-[14rem] shrink-0 items-center rounded-full',
                'border border-dashed border-[var(--amp-semantic-border-default)]',
                'bg-transparent px-2.5 py-1 text-xs',
                'text-[var(--amp-semantic-text-default)]',
                'placeholder:text-[var(--amp-semantic-text-tertiary)]',
                'focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-[var(--amp-semantic-border-focus)]',
              )}
            />
          ) : (
            <button
              type="button"
              onClick={handleAddClick}
              className={cn(
                baseChipClasses,
                'border border-dashed border-[var(--amp-semantic-border-default)] bg-transparent',
                'text-[var(--amp-semantic-text-tertiary)]',
                'hover:bg-[var(--amp-semantic-bg-subtle)]',
                'hover:text-[var(--amp-semantic-text-default)]',
              )}
              aria-label={
                isEmpty
                  ? 'Add to brief — type a goal, audience, or constraint'
                  : 'Add to brief'
              }
            >
              <span aria-hidden="true">+</span>
              <span>{isEmpty ? 'Type a goal, audience, or constraint…' : 'add'}</span>
            </button>
          )}
        </div>

        {expandable && (
          <button
            type="button"
            onClick={onExpand}
            aria-label="Expand brief"
            className={cn(
              'inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs',
              'text-[var(--amp-semantic-text-secondary)]',
              'hover:bg-[var(--amp-semantic-bg-subtle)]',
              'hover:text-[var(--amp-semantic-text-default)]',
              'focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-[var(--amp-semantic-border-focus)]',
            )}
          >
            <span aria-hidden="true">&#10530;</span>
            <span>Expand brief</span>
          </button>
        )}
      </div>
    );
  },
);

BriefStrip.displayName = 'BriefStrip';
