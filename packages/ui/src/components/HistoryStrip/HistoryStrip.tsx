'use client';

import React from 'react';
import { cn } from '../../lib/cn';

/**
 * HistoryStrip — horizontal timeline of generation cycles in Studio v2.
 *
 * Each generation chip shows up to four mini-thumbnails representing the
 * variants produced in that cycle. The current generation is visually
 * highlighted; consecutive generations are joined by a tiny branch arrow so
 * the user can read the timeline left-to-right. The strip is purely
 * presentational — selection state is owned by the parent.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type VariantThumbStatus = 'ready' | 'generating' | 'error' | 'locked' | 'win';

export interface VariantThumb {
  id: string;
  status: VariantThumbStatus;
}

export interface GenerationItem {
  id: string;
  /** Human label, e.g. "Gen 1" or "Gen 2 · now". */
  label: string;
  /** Up to 4 thumbnails. Anything beyond is truncated visually. */
  thumbs: VariantThumb[];
  /** Optional summary line, e.g. "8.2s · V1 selected". */
  summary?: string;
  /** Marks this generation as the current selection. */
  current?: boolean;
}

export interface HistoryStripProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  generations: GenerationItem[];
  onSelect?: (genId: string) => void;
  onThumbSelect?: (genId: string, variantId: string) => void;
  className?: string;
}

// ─── Shimmer keyframes (id-guarded, injected once) ──────────────────────────

const STYLE_ID = 'amp-history-strip-keyframes';
const styleSheet = `
@keyframes amp-history-shimmer {
  0%   { background-position: -120% 0; }
  100% { background-position: 220% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .amp-history-thumb--generating { animation: none !important; background: var(--amp-semantic-bg-subtle) !important; }
}
`;

function useInjectedKeyframes() {
  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement('style');
    el.id = STYLE_ID;
    el.textContent = styleSheet;
    document.head.appendChild(el);
  }, []);
}

// ─── Thumb sub-component ─────────────────────────────────────────────────────

const baseThumb = cn(
  'relative h-4 w-[22px] shrink-0 overflow-hidden rounded-[3px]',
  'border border-[var(--amp-semantic-border-subtle)]',
);

const thumbStatusClasses: Record<VariantThumbStatus, string> = {
  ready: 'bg-[var(--amp-semantic-bg-subtle)]',
  generating:
    'amp-history-thumb--generating bg-[length:200%_100%] bg-[linear-gradient(90deg,var(--amp-semantic-bg-subtle)_0%,var(--amp-semantic-bg-raised)_50%,var(--amp-semantic-bg-subtle)_100%)]',
  error: 'bg-[var(--amp-semantic-bg-error-subtle)]',
  locked:
    'bg-[linear-gradient(135deg,var(--amp-semantic-bg-accent-subtle),var(--amp-semantic-accent-soft,var(--amp-semantic-bg-accent-subtle)))]',
  win: 'bg-[var(--amp-semantic-bg-success-subtle)]',
};

interface GenerationChipProps {
  generation: GenerationItem;
  onSelect?: (genId: string) => void;
  onThumbSelect?: (genId: string, variantId: string) => void;
}

const GenerationChip: React.FC<GenerationChipProps> = ({
  generation,
  onSelect,
  onThumbSelect,
}) => {
  const visibleThumbs = generation.thumbs.slice(0, 4);
  const overflow = generation.thumbs.length - visibleThumbs.length;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(generation.id)}
      aria-label={`Select ${generation.label}`}
      aria-current={generation.current ? 'true' : undefined}
      className={cn(
        'group flex shrink-0 flex-col gap-1 rounded-md border px-2.5 py-1.5 text-left',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
        'focus-visible:ring-[var(--amp-semantic-border-focus)]',
        generation.current
          ? 'border-[var(--amp-semantic-border-accent)] bg-[var(--amp-semantic-bg-accent-subtle)]'
          : 'border-[var(--amp-semantic-border-default)] bg-[var(--amp-semantic-bg-surface)] hover:bg-[var(--amp-semantic-bg-subtle)]',
      )}
    >
      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            'text-xs font-semibold',
            generation.current
              ? 'text-[var(--amp-semantic-text-accent)]'
              : 'text-[var(--amp-semantic-text-default)]',
          )}
        >
          {generation.label}
        </span>
      </div>

      <div className="flex items-center gap-1" aria-hidden="false">
        {visibleThumbs.map((thumb) => (
          <span
            key={thumb.id}
            role={onThumbSelect ? 'button' : undefined}
            tabIndex={onThumbSelect ? 0 : undefined}
            aria-label={onThumbSelect ? `Variant ${thumb.id} (${thumb.status})` : undefined}
            onClick={(e) => {
              if (!onThumbSelect) return;
              e.stopPropagation();
              onThumbSelect(generation.id, thumb.id);
            }}
            onKeyDown={(e) => {
              if (!onThumbSelect) return;
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                onThumbSelect(generation.id, thumb.id);
              }
            }}
            className={cn(
              baseThumb,
              thumbStatusClasses[thumb.status],
              onThumbSelect &&
                'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amp-semantic-border-focus)]',
              thumb.status === 'generating' && '[animation:amp-history-shimmer_1.4s_linear_infinite]',
            )}
            data-status={thumb.status}
          >
            {thumb.status === 'win' && (
              <span
                aria-hidden="true"
                className="absolute right-0.5 top-0.5 h-1 w-1 rounded-full bg-[var(--amp-semantic-status-success)]"
              />
            )}
            {thumb.status === 'error' && (
              <span
                aria-hidden="true"
                className="absolute right-0 top-0 h-1.5 w-1.5 rounded-bl-[3px] bg-[var(--amp-semantic-status-error)]"
              />
            )}
          </span>
        ))}
        {overflow > 0 && (
          <span
            aria-label={`${overflow} more variants`}
            className="text-[10px] text-[var(--amp-semantic-text-tertiary)]"
          >
            +{overflow}
          </span>
        )}
      </div>

      {generation.summary && (
        <span className="text-[10px] text-[var(--amp-semantic-text-tertiary)]">
          {generation.summary}
        </span>
      )}
    </button>
  );
};

// ─── Component ───────────────────────────────────────────────────────────────

export const HistoryStrip = React.forwardRef<HTMLDivElement, HistoryStripProps>(
  ({ generations, onSelect, onThumbSelect, className, ...rest }, ref) => {
    useInjectedKeyframes();
    const isEmpty = generations.length === 0;

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Variant history"
        className={cn(
          'flex w-full items-center gap-2 overflow-x-auto whitespace-nowrap',
          'border-b border-[var(--amp-semantic-border-subtle)]',
          'bg-[var(--amp-semantic-bg-surface)]',
          'px-3 py-2',
          className,
        )}
        {...rest}
      >
        <span
          className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-[var(--amp-semantic-text-tertiary)]"
          aria-hidden="true"
        >
          Variants
        </span>

        {isEmpty ? (
          <span
            data-testid="history-strip-empty"
            className="shrink-0 rounded-md border border-dashed border-[var(--amp-semantic-border-default)] px-2 py-1 text-xs text-[var(--amp-semantic-text-tertiary)]"
          >
            No generations yet
          </span>
        ) : (
          generations.map((gen, i) => (
            <React.Fragment key={gen.id}>
              <GenerationChip
                generation={gen}
                onSelect={onSelect}
                onThumbSelect={onThumbSelect}
              />
              {i < generations.length - 1 && (
                <span
                  aria-hidden="true"
                  className="shrink-0 text-xs text-[var(--amp-semantic-text-tertiary)]"
                >
                  &rarr;
                </span>
              )}
            </React.Fragment>
          ))
        )}
      </div>
    );
  },
);

HistoryStrip.displayName = 'HistoryStrip';
