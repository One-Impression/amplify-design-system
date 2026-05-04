'use client';

import React from 'react';
import { cn } from '../../lib/cn';

/**
 * VariantCard — canvas variant primitive for Studio v2.
 *
 * A single variant is the unit of generation: it owns a state machine
 * (empty / generating / ready / error), a header (name + lens tag + status),
 * a body (children slot, shimmer when generating, retry when error), and a
 * footer (score + actions). Selection is owned by the parent grid; the card
 * renders the visual selected affordance when `selected={true}`.
 *
 * Keyframes (shimmer + pulse) are scoped to this component and injected once
 * per page, id-guarded — no external CSS file is required.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type VariantCardState = 'empty' | 'generating' | 'ready' | 'error';

export interface VariantCardAction {
  id: string;
  label: string;
  onClick: () => void;
}

export type VariantCardScoreVariant = 'good' | 'neutral' | 'bad';

export interface VariantCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  state: VariantCardState;
  selected?: boolean;
  name: string;
  lensTag?: string;
  statusText?: string;
  scoreLabel?: string;
  scoreVariant?: VariantCardScoreVariant;
  actions?: VariantCardAction[];
  onClick?: () => void;
  errorMessage?: string;
  onRetry?: () => void;
  children?: React.ReactNode;
  className?: string;
}

// ─── Keyframes (shimmer + pulse) ─────────────────────────────────────────────

const STYLE_ID = 'amp-variant-card-keyframes';
const styleSheet = `
@keyframes amp-variant-shimmer {
  0%   { background-position: -120% 0; }
  100% { background-position: 220% 0; }
}
@keyframes amp-variant-pulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.65; }
}
@media (prefers-reduced-motion: reduce) {
  .amp-variant-shimmer { animation: none !important; background: var(--amp-semantic-bg-subtle) !important; }
  .amp-variant-pulse   { animation: none !important; opacity: 1 !important; }
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

// ─── Score styling ───────────────────────────────────────────────────────────

const scoreVariantClasses: Record<VariantCardScoreVariant, string> = {
  good: 'text-[var(--amp-semantic-status-success)]',
  neutral: 'text-[var(--amp-semantic-text-secondary)]',
  bad: 'text-[var(--amp-semantic-status-error)]',
};

// ─── Component ───────────────────────────────────────────────────────────────

export const VariantCard = React.forwardRef<HTMLDivElement, VariantCardProps>(
  (
    {
      state,
      selected = false,
      name,
      lensTag,
      statusText,
      scoreLabel,
      scoreVariant = 'neutral',
      actions,
      onClick,
      errorMessage,
      onRetry,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    useInjectedKeyframes();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!onClick) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    };

    const interactive = !!onClick;

    return (
      <div
        ref={ref}
        role={interactive ? 'button' : 'group'}
        tabIndex={interactive ? 0 : undefined}
        aria-pressed={interactive ? selected : undefined}
        aria-label={`Variant ${name}${lensTag ? ` — ${lensTag}` : ''}`}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        data-state={state}
        data-selected={selected}
        className={cn(
          'flex h-full w-full flex-col overflow-hidden rounded-lg border',
          'bg-[var(--amp-semantic-bg-surface)]',
          'transition-shadow duration-150',
          interactive && 'cursor-pointer hover:shadow-md',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'focus-visible:ring-[var(--amp-semantic-border-focus)]',
          selected
            ? 'border-[var(--amp-semantic-border-accent)] shadow-md'
            : 'border-[var(--amp-semantic-border-default)]',
          className,
        )}
        {...rest}
      >
        {/* ── Header ── */}
        <header
          className={cn(
            'flex shrink-0 items-center gap-2 border-b px-3 py-2',
            selected
              ? 'border-[var(--amp-semantic-border-accent)] bg-[var(--amp-semantic-bg-accent-subtle)]'
              : 'border-[var(--amp-semantic-border-subtle)] bg-[var(--amp-semantic-bg-surface)]',
          )}
        >
          <span
            className={cn(
              'text-sm font-semibold',
              selected
                ? 'text-[var(--amp-semantic-text-accent)]'
                : 'text-[var(--amp-semantic-text-default)]',
            )}
          >
            {name}
          </span>
          {lensTag && (
            <span
              className={cn(
                'rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                'bg-[var(--amp-semantic-bg-subtle)] text-[var(--amp-semantic-text-secondary)]',
              )}
              data-testid="variant-card-lens"
            >
              {lensTag}
            </span>
          )}
          {statusText && (
            <span
              className={cn(
                'ml-auto text-[11px]',
                state === 'generating'
                  ? 'amp-variant-pulse text-[var(--amp-semantic-text-secondary)] [animation:amp-variant-pulse_1.4s_ease-in-out_infinite]'
                  : 'text-[var(--amp-semantic-text-tertiary)]',
              )}
              data-testid="variant-card-status"
            >
              {statusText}
            </span>
          )}
        </header>

        {/* ── Body ── */}
        <div
          className={cn(
            'relative min-h-[120px] flex-1',
            'bg-[var(--amp-semantic-bg-canvas,var(--amp-semantic-bg-base))]',
          )}
          data-testid="variant-card-body"
        >
          {state === 'empty' && (
            <div
              data-testid="variant-card-body-empty"
              className="flex h-full w-full items-center justify-center p-4 text-xs text-[var(--amp-semantic-text-tertiary)]"
            >
              No variant yet
            </div>
          )}

          {state === 'generating' && (
            <div
              data-testid="variant-card-body-generating"
              role="status"
              aria-live="polite"
              aria-label={`Generating variant ${name}`}
              className={cn(
                'amp-variant-shimmer h-full w-full',
                'bg-[length:200%_100%]',
                'bg-[linear-gradient(90deg,var(--amp-semantic-bg-subtle)_0%,var(--amp-semantic-bg-raised)_50%,var(--amp-semantic-bg-subtle)_100%)]',
                '[animation:amp-variant-shimmer_1.6s_linear_infinite]',
              )}
            />
          )}

          {state === 'error' && (
            <div
              data-testid="variant-card-body-error"
              role="alert"
              className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center"
            >
              <span className="text-xs font-medium text-[var(--amp-semantic-status-error)]">
                {errorMessage ?? 'Generation failed'}
              </span>
              {onRetry && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRetry();
                  }}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium',
                    'bg-[var(--amp-semantic-bg-subtle)] text-[var(--amp-semantic-text-default)]',
                    'hover:bg-[var(--amp-semantic-bg-raised)]',
                    'focus-visible:outline-none focus-visible:ring-2',
                    'focus-visible:ring-[var(--amp-semantic-border-focus)]',
                  )}
                >
                  Retry
                </button>
              )}
            </div>
          )}

          {state === 'ready' && children}
        </div>

        {/* ── Footer ── */}
        {(scoreLabel || (actions && actions.length > 0)) && (
          <footer
            className={cn(
              'flex shrink-0 items-center gap-2 border-t px-3 py-2',
              'border-[var(--amp-semantic-border-subtle)]',
              'bg-[var(--amp-semantic-bg-surface)]',
            )}
          >
            {scoreLabel && (
              <span
                className={cn(
                  'text-[11px] font-medium',
                  scoreVariantClasses[scoreVariant],
                )}
                data-testid="variant-card-score"
                data-score-variant={scoreVariant}
              >
                {scoreLabel}
              </span>
            )}
            {actions && actions.length > 0 && (
              <div className="ml-auto flex items-center gap-1">
                {actions.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick();
                    }}
                    className={cn(
                      'rounded-md px-2 py-1 text-[11px] font-medium',
                      'text-[var(--amp-semantic-text-secondary)]',
                      'hover:bg-[var(--amp-semantic-bg-subtle)]',
                      'hover:text-[var(--amp-semantic-text-default)]',
                      'focus-visible:outline-none focus-visible:ring-2',
                      'focus-visible:ring-[var(--amp-semantic-border-focus)]',
                    )}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </footer>
        )}
      </div>
    );
  },
);

VariantCard.displayName = 'VariantCard';
