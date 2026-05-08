'use client';

import React from 'react';
import { cn } from '../../lib/cn';

/**
 * MapNode — variant-graph node primitive for Studio v2 Map mode.
 *
 * A `MapNode` renders one node on the Studio v2 Map canvas — a positioned card
 * that visualises a single variant in the generation graph. It owns its visual
 * state (live / ready / generating / error / locked / focus) but does NOT own
 * its position; the parent map view passes `x` / `y` and the node positions
 * itself absolutely. Selection and locking are derived from props so the
 * canvas can drive multi-select and pinning purely from state.
 *
 * Designed to compose with `MapEdge` — both render as siblings inside a
 * `position: relative` map container; edges live in the consumer's `<svg>`
 * sibling layer underneath.
 *
 * Shimmer keyframes are injected once per page (id-guarded) so the component
 * works without an external CSS file. Respects `prefers-reduced-motion`.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type MapNodeState =
  | 'live'
  | 'ready'
  | 'generating'
  | 'error'
  | 'locked'
  | 'focus';

export interface MapNodeProps {
  /** Stable unique id — used as DOM id and as a graph identity hint. */
  id: string;
  /** Visual state of the node. */
  state: MapNodeState;
  /** Optional small label rendered under the thumbnail (e.g. `'v1 · editorial'`). */
  label?: string;
  /** Optional thumbnail / preview rendered in the body slot. */
  thumbnail?: React.ReactNode;
  /** Optional score label (e.g. `'●● 91'`). */
  scoreLabel?: string;
  /** Variant tone for the score label. */
  scoreVariant?: 'good' | 'neutral' | 'bad';
  /** Optional lens tag chip rendered next to the label. */
  lensTag?: string;
  /** Absolute X position on the map canvas (in px). */
  x: number;
  /** Absolute Y position on the map canvas (in px). */
  y: number;
  /** Width of the node in px. Default 180. */
  width?: number;
  /** Whether this node is part of the current selection. */
  selected?: boolean;
  /** Whether the node is locked (renders the lock badge). */
  locked?: boolean;
  /** Click handler — when provided, the node becomes a button-roled target. */
  onClick?: () => void;
  className?: string;
}

// ─── Keyframes (shimmer) ─────────────────────────────────────────────────────

const STYLE_ID = 'amp-map-node-keyframes';
const styleSheet = `
@keyframes amp-map-node-shimmer {
  0%   { background-position: -120% 0; }
  100% { background-position: 220% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .amp-map-node-shimmer { animation: none !important; background: var(--amp-semantic-bg-subtle) !important; }
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

// ─── Score variant styling ───────────────────────────────────────────────────

const scoreVariantClasses: Record<NonNullable<MapNodeProps['scoreVariant']>, string> = {
  good: 'text-[var(--amp-semantic-status-success)]',
  neutral: 'text-[var(--amp-semantic-text-secondary)]',
  bad: 'text-[var(--amp-semantic-status-error)]',
};

// ─── State → border styling ──────────────────────────────────────────────────

function getStateClasses(state: MapNodeState, selected: boolean): string {
  // Selection always wins on outline; non-selected states get their own border.
  if (selected || state === 'focus') {
    // Selected / focus: 2px accent outline + soft accent glow ring + lifted
    // shadow. All colours come from semantic tokens — the ring uses the
    // accent-subtle bg as a soft halo and the elevation shadow uses the
    // Tailwind `shadow-lg` token rather than a raw rgba literal.
    return cn(
      'border-[2px] border-[var(--amp-semantic-border-accent)]',
      'shadow-lg',
      'ring-4 ring-[var(--amp-semantic-bg-accent-subtle)]',
    );
  }
  switch (state) {
    case 'live':
      // Dashed border, ghost surface — the "this is the active edit head" affordance.
      return cn(
        'border-[1.5px] border-dashed border-[var(--amp-semantic-border-accent)]',
        'bg-opacity-60',
      );
    case 'error':
      return 'border border-[var(--amp-semantic-status-error)]';
    case 'locked':
      return 'border border-[var(--amp-semantic-border-default)]';
    case 'generating':
      return 'border border-[var(--amp-semantic-border-subtle)]';
    case 'ready':
    default:
      return 'border border-[var(--amp-semantic-border-default)]';
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export const MapNode = React.forwardRef<HTMLDivElement, MapNodeProps>(
  (
    {
      id,
      state,
      label,
      thumbnail,
      scoreLabel,
      scoreVariant = 'neutral',
      lensTag,
      x,
      y,
      width = 180,
      selected = false,
      locked = false,
      onClick,
      className,
    },
    ref,
  ) => {
    useInjectedKeyframes();

    const interactive = !!onClick;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!onClick) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    };

    const ariaLabelParts: string[] = [];
    ariaLabelParts.push(`Map node ${label ?? id}`);
    ariaLabelParts.push(state);
    if (locked) ariaLabelParts.push('locked');
    if (selected) ariaLabelParts.push('selected');
    const ariaLabel = ariaLabelParts.join(', ');

    return (
      <div
        ref={ref}
        id={id}
        role={interactive ? 'button' : 'group'}
        tabIndex={interactive ? 0 : undefined}
        aria-pressed={interactive ? selected : undefined}
        aria-label={ariaLabel}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        data-state={state}
        data-selected={selected}
        data-locked={locked}
        data-node-id={id}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width,
        }}
        className={cn(
          'flex flex-col overflow-hidden rounded-[12px]',
          // Dark theme surface by default — Map mode is a dark canvas product.
          'bg-[var(--amp-semantic-bg-raised,var(--amp-semantic-bg-surface))]',
          'text-[var(--amp-semantic-text-default)]',
          'transition-shadow duration-150',
          interactive && 'cursor-pointer hover:shadow-lg',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'focus-visible:ring-[var(--amp-semantic-border-focus)]',
          getStateClasses(state, selected),
          className,
        )}
      >
        {/* ── Thumbnail / body ── */}
        <div
          data-testid="map-node-body"
          className={cn(
            'relative aspect-[4/3] w-full overflow-hidden',
            'bg-[var(--amp-semantic-bg-canvas,var(--amp-semantic-bg-base))]',
          )}
        >
          {state === 'generating' ? (
            <div
              data-testid="map-node-shimmer"
              role="status"
              aria-live="polite"
              aria-label={`Generating ${label ?? id}`}
              className={cn(
                'amp-map-node-shimmer h-full w-full',
                'bg-[length:200%_100%]',
                'bg-[linear-gradient(90deg,var(--amp-semantic-bg-subtle)_0%,var(--amp-semantic-bg-raised)_50%,var(--amp-semantic-bg-subtle)_100%)]',
                '[animation:amp-map-node-shimmer_1.6s_linear_infinite]',
              )}
            />
          ) : (
            thumbnail
          )}

          {/* Locked badge — top-right */}
          {locked && (
            <span
              data-testid="map-node-lock-badge"
              aria-hidden="true"
              className={cn(
                'absolute right-1.5 top-1.5 inline-flex items-center justify-center',
                'h-5 w-5 rounded-full text-[11px]',
                'bg-[var(--amp-semantic-bg-surface)] text-[var(--amp-semantic-text-secondary)]',
                'shadow-sm',
              )}
            >
              {/* lock glyph */}
              {'\u{1F512}'}
            </span>
          )}

          {/* Error corner — top-left red triangle */}
          {state === 'error' && (
            <span
              data-testid="map-node-error-corner"
              role="alert"
              aria-label={`${label ?? id} failed`}
              className={cn(
                'absolute left-0 top-0',
                'h-2.5 w-2.5',
                'bg-[var(--amp-semantic-status-error)]',
              )}
              style={{
                clipPath: 'polygon(0 0, 100% 0, 0 100%)',
              }}
            />
          )}
        </div>

        {/* ── Footer (label + lens + score) ── */}
        {(label || lensTag || scoreLabel) && (
          <div
            className={cn(
              'flex shrink-0 items-center gap-1.5 px-2 py-1.5',
              'border-t border-[var(--amp-semantic-border-subtle)]',
            )}
          >
            {label && (
              <span
                data-testid="map-node-label"
                className={cn(
                  'truncate text-[11px] font-medium',
                  'text-[var(--amp-semantic-text-default)]',
                )}
              >
                {label}
              </span>
            )}
            {lensTag && (
              <span
                data-testid="map-node-lens"
                className={cn(
                  'shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                  'bg-[var(--amp-semantic-bg-subtle)] text-[var(--amp-semantic-text-secondary)]',
                )}
              >
                {lensTag}
              </span>
            )}
            {scoreLabel && (
              <span
                data-testid="map-node-score"
                data-score-variant={scoreVariant}
                className={cn(
                  'ml-auto shrink-0 text-[11px] font-medium',
                  scoreVariantClasses[scoreVariant],
                )}
              >
                {scoreLabel}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);

MapNode.displayName = 'MapNode';
