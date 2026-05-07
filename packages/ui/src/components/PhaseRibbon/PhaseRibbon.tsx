import React from 'react';
import { cn } from '../../lib/cn';

/**
 * PhaseRibbon — numbered phase indicator above a workflow.
 *
 * Renders a horizontal sequence of numbered circles connected by thin
 * lines (1 → 2 → 3 → …). Each phase has a status (`pending`, `active`,
 * `done`, `error`) which drives the visual treatment:
 *
 * - `done`     — filled accent circle with a check glyph.
 * - `active`   — filled accent circle with the phase number; ring halo.
 * - `pending`  — outlined circle with the phase number in muted text.
 * - `error`    — filled error circle with the phase number.
 *
 * The currently-active phase is also flagged via `aria-current="step"`,
 * and the whole ribbon renders as a `role="list"` for assistive tech.
 *
 * If `current` is set but no phase has an explicit status, the
 * component derives status automatically:
 *   - phases before `current` → `done`
 *   - phase matching `current` → `active`
 *   - phases after `current` → `pending`
 *
 * Token-only colours (status-success / status-error / accent / border /
 * text via the brand-semantic palette). Reduced-motion honoured by
 * disabling the ring transition when the user prefers reduced motion.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type PhaseStatus = 'pending' | 'active' | 'done' | 'error';

export interface PhaseItem {
  /** Stable id — used for `current` matching and as a React key. */
  id: string | number;
  /** Phase label rendered under (or beside) the circle. */
  label: string;
  /** Optional tooltip / hint — surfaced as the circle's `title` attribute. */
  hint?: string;
  /**
   * Explicit status. If omitted, status is derived from the position
   * relative to `current`.
   */
  status?: PhaseStatus;
}

export interface PhaseRibbonProps extends React.HTMLAttributes<HTMLDivElement> {
  phases: PhaseItem[];
  /** Matches `phase.id` of the active phase. */
  current: string | number;
  className?: string;
}

// ─── Status → visual classes ────────────────────────────────────────────────

const circleBase = cn(
  'inline-flex items-center justify-center shrink-0',
  'h-7 w-7 rounded-full',
  'text-[12px] font-semibold leading-none',
  'transition-shadow duration-150',
  // honour reduced-motion — kill transitions
  'motion-reduce:transition-none',
);

function getCircleClasses(status: PhaseStatus): string {
  switch (status) {
    case 'done':
      return cn(
        'bg-[var(--amp-semantic-status-success)]',
        'text-[var(--amp-semantic-text-on-accent,var(--amp-semantic-bg-surface))]',
        'border border-[var(--amp-semantic-status-success)]',
      );
    case 'active':
      return cn(
        'bg-[var(--amp-semantic-bg-accent,var(--amp-semantic-accent))]',
        'text-[var(--amp-semantic-text-on-accent,var(--amp-semantic-bg-surface))]',
        'border border-[var(--amp-semantic-border-accent,var(--amp-semantic-accent))]',
        'ring-4 ring-[var(--amp-semantic-bg-accent-subtle)]',
      );
    case 'error':
      return cn(
        'bg-[var(--amp-semantic-status-error)]',
        'text-[var(--amp-semantic-text-on-accent,var(--amp-semantic-bg-surface))]',
        'border border-[var(--amp-semantic-status-error)]',
      );
    case 'pending':
    default:
      return cn(
        'bg-[var(--amp-semantic-bg-surface)]',
        'text-[var(--amp-semantic-text-tertiary)]',
        'border border-[var(--amp-semantic-border-default)]',
      );
  }
}

function getLabelClasses(status: PhaseStatus): string {
  switch (status) {
    case 'active':
      return 'text-[var(--amp-semantic-text-default)] font-semibold';
    case 'done':
      return 'text-[var(--amp-semantic-text-secondary)]';
    case 'error':
      return 'text-[var(--amp-semantic-status-error)] font-medium';
    case 'pending':
    default:
      return 'text-[var(--amp-semantic-text-tertiary)]';
  }
}

function getConnectorClasses(prevStatus: PhaseStatus): string {
  // Connector takes the colour of the phase to its left — once that's
  // done/active/error, the line "fills" up to the next circle.
  if (prevStatus === 'done' || prevStatus === 'active') {
    return 'bg-[var(--amp-semantic-border-accent,var(--amp-semantic-accent))]';
  }
  if (prevStatus === 'error') {
    return 'bg-[var(--amp-semantic-status-error)]';
  }
  return 'bg-[var(--amp-semantic-border-default)]';
}

// ─── Status derivation ──────────────────────────────────────────────────────

function deriveStatus(
  phases: PhaseItem[],
  current: string | number,
): PhaseStatus[] {
  const currentIdx = phases.findIndex((p) => p.id === current);
  return phases.map((phase, idx) => {
    if (phase.status) return phase.status;
    if (currentIdx === -1) return 'pending';
    if (idx < currentIdx) return 'done';
    if (idx === currentIdx) return 'active';
    return 'pending';
  });
}

// ─── Check glyph ────────────────────────────────────────────────────────────

const CheckGlyph: React.FC = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    className="h-3 w-3"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
  </svg>
);

// ─── Component ───────────────────────────────────────────────────────────────

export const PhaseRibbon = React.forwardRef<HTMLDivElement, PhaseRibbonProps>(
  ({ phases, current, className, ...rest }, ref) => {
    const statuses = React.useMemo(
      () => deriveStatus(phases, current),
      [phases, current],
    );

    return (
      <div
        ref={ref}
        role="list"
        aria-label={rest['aria-label'] ?? 'Workflow phases'}
        className={cn(
          'flex w-full items-start',
          'text-[var(--amp-semantic-text-default)]',
          className,
        )}
        {...rest}
      >
        {phases.map((phase, idx) => {
          const status = statuses[idx];
          const isLast = idx === phases.length - 1;
          const number = idx + 1;
          const ariaCurrent = status === 'active' ? 'step' : undefined;

          return (
            <div
              key={phase.id}
              role="listitem"
              aria-current={ariaCurrent}
              data-phase-id={phase.id}
              data-phase-status={status}
              data-testid={`phase-ribbon-item-${phase.id}`}
              className={cn(
                'flex min-w-0 items-start',
                isLast ? 'shrink-0' : 'flex-1',
              )}
            >
              <div className="flex min-w-0 flex-col items-center gap-1.5">
                <span
                  data-testid={`phase-ribbon-circle-${phase.id}`}
                  className={cn(circleBase, getCircleClasses(status))}
                  title={phase.hint}
                  aria-label={`Phase ${number}: ${phase.label} (${status})`}
                >
                  {status === 'done' ? <CheckGlyph /> : number}
                </span>
                <span
                  data-testid={`phase-ribbon-label-${phase.id}`}
                  className={cn(
                    'max-w-[10rem] truncate text-[12px] leading-tight',
                    getLabelClasses(status),
                  )}
                >
                  {phase.label}
                </span>
              </div>

              {!isLast && (
                <span
                  data-testid={`phase-ribbon-connector-${phase.id}`}
                  aria-hidden="true"
                  className={cn(
                    'mx-2 mt-3.5 h-px flex-1',
                    getConnectorClasses(status),
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  },
);

PhaseRibbon.displayName = 'PhaseRibbon';
