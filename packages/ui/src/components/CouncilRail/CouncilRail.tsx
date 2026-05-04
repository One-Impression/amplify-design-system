import React from 'react';
import { cn } from '../../lib/cn';

/**
 * CouncilRail — right-rail showing per-agent verdicts on a variant.
 *
 * The rail is the visible-thinking surface of Studio v2: each agent (Pixel,
 * Zenith, etc) renders a card with their critique and a verdict (ok / warn /
 * flag). A summary card at the top condenses the council's mood; the bottom
 * exposes a slim affordance to ask the council a question.
 *
 * Layout is composed from three sub-pieces — `CouncilSummary`, `CouncilCard`,
 * and the rail container — but the public API is the single `<CouncilRail>`
 * component to keep call sites simple.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type CouncilVerdict = 'ok' | 'warn' | 'flag';

export interface AgentVerdict {
  agentId: string;
  agentName: string;
  agentRole: string;
  /** CSS color value used for the avatar bg. Token preferred, hex tolerated. */
  agentColor: string;
  initial: string;
  verdict: CouncilVerdict;
  body: string;
}

export interface CouncilRailProps extends React.HTMLAttributes<HTMLElement> {
  forVariantLabel?: string;
  verdicts: AgentVerdict[];
  summaryHeadline?: string;
  summaryDetail?: string;
  /** Collapse all-`ok` agents into a single line. */
  disagreementsOnly?: boolean;
  onAskQuestion?: (text: string) => void;
  className?: string;
}

// ─── Verdict styling ─────────────────────────────────────────────────────────

const verdictBadge: Record<CouncilVerdict, { label: string; className: string }> = {
  ok: {
    label: 'ok',
    className:
      'bg-[var(--amp-semantic-bg-success-subtle)] text-[var(--amp-semantic-status-success)]',
  },
  warn: {
    label: 'warn',
    className:
      'bg-[var(--amp-semantic-bg-warning-subtle)] text-[var(--amp-semantic-status-warning)]',
  },
  flag: {
    label: 'flag',
    className:
      'bg-[var(--amp-semantic-bg-error-subtle)] text-[var(--amp-semantic-status-error)]',
  },
};

// ─── Council summary sub-component ───────────────────────────────────────────

export interface CouncilSummaryProps {
  headline?: string;
  detail?: string;
  forVariantLabel?: string;
}

export const CouncilSummary: React.FC<CouncilSummaryProps> = ({
  headline,
  detail,
  forVariantLabel,
}) => {
  if (!headline && !detail) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'rounded-lg border border-[var(--amp-semantic-border-accent)] p-3',
        // Soft accent gradient — uses tokens only.
        'bg-[linear-gradient(135deg,var(--amp-semantic-bg-accent-subtle),var(--amp-semantic-bg-surface))]',
      )}
      data-testid="council-summary"
    >
      {headline && (
        <div className="text-sm font-semibold text-[var(--amp-semantic-text-default)]">
          {headline}
          {forVariantLabel && (
            <span className="ml-1 font-normal text-[var(--amp-semantic-text-tertiary)]">
              · {forVariantLabel}
            </span>
          )}
        </div>
      )}
      {detail && (
        <p className="mt-1 text-xs text-[var(--amp-semantic-text-secondary)]">{detail}</p>
      )}
    </div>
  );
};

CouncilSummary.displayName = 'CouncilSummary';

// ─── Council card sub-component ──────────────────────────────────────────────

export interface CouncilCardProps {
  verdict: AgentVerdict;
}

export const CouncilCard: React.FC<CouncilCardProps> = ({ verdict }) => {
  const v = verdictBadge[verdict.verdict];
  return (
    <article
      className={cn(
        'rounded-lg border border-[var(--amp-semantic-border-default)] bg-[var(--amp-semantic-bg-surface)] p-3',
      )}
      aria-label={`${verdict.agentName} (${verdict.agentRole}) — ${v.label}`}
      data-agent-id={verdict.agentId}
      data-verdict={verdict.verdict}
    >
      <header className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={cn(
            'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
            'text-xs font-semibold text-[var(--amp-semantic-text-inverse)]',
          )}
          style={{ backgroundColor: verdict.agentColor }}
        >
          {verdict.initial}
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-[var(--amp-semantic-text-default)]">
            {verdict.agentName}
          </div>
          <div className="truncate text-[11px] text-[var(--amp-semantic-text-tertiary)]">
            {verdict.agentRole}
          </div>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
            v.className,
          )}
        >
          {v.label}
        </span>
      </header>
      <p className="mt-2 text-xs leading-relaxed text-[var(--amp-semantic-text-secondary)]">
        {verdict.body}
      </p>
    </article>
  );
};

CouncilCard.displayName = 'CouncilCard';

// ─── Council rail ────────────────────────────────────────────────────────────

export const CouncilRail = React.forwardRef<HTMLElement, CouncilRailProps>(
  (
    {
      forVariantLabel,
      verdicts,
      summaryHeadline,
      summaryDetail,
      disagreementsOnly = false,
      onAskQuestion,
      className,
      ...rest
    },
    ref,
  ) => {
    const [draft, setDraft] = React.useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const value = draft.trim();
      if (!value) return;
      onAskQuestion?.(value);
      setDraft('');
    };

    // Collapse all-ok set when disagreementsOnly=true.
    const okVerdicts = verdicts.filter((v) => v.verdict === 'ok');
    const nonOkVerdicts = verdicts.filter((v) => v.verdict !== 'ok');
    const collapseOk = disagreementsOnly && okVerdicts.length > 0;

    return (
      <aside
        ref={ref}
        role="region"
        aria-label="Council critiques"
        className={cn(
          'flex h-full w-full flex-col gap-3 overflow-y-auto p-3',
          'bg-[var(--amp-semantic-bg-canvas,var(--amp-semantic-bg-base))]',
          'border-l border-[var(--amp-semantic-border-subtle)]',
          className,
        )}
        {...rest}
      >
        <header className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--amp-semantic-text-default)]">
            Council
          </h3>
          {forVariantLabel && (
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                'bg-[var(--amp-semantic-bg-accent-subtle)] text-[var(--amp-semantic-text-accent)]',
              )}
              data-testid="council-rail-variant-label"
            >
              on {forVariantLabel}
            </span>
          )}
        </header>

        <CouncilSummary
          headline={summaryHeadline}
          detail={summaryDetail}
          forVariantLabel={forVariantLabel}
        />

        <div className="flex flex-col gap-2">
          {collapseOk && (
            <div
              data-testid="council-rail-unanimous"
              className={cn(
                'rounded-lg border border-[var(--amp-semantic-border-success)] px-3 py-2',
                'bg-[var(--amp-semantic-bg-success-subtle)]',
              )}
            >
              <span className="text-xs font-medium text-[var(--amp-semantic-status-success)]">
                Council unanimous{forVariantLabel ? ` on ${forVariantLabel}` : ''} —{' '}
                {okVerdicts.length} agree
              </span>
            </div>
          )}

          {(collapseOk ? nonOkVerdicts : verdicts).map((v) => (
            <CouncilCard key={v.agentId} verdict={v} />
          ))}

          {!collapseOk && verdicts.length === 0 && (
            <div
              data-testid="council-rail-empty"
              className="rounded-lg border border-dashed border-[var(--amp-semantic-border-default)] p-3 text-xs text-[var(--amp-semantic-text-tertiary)]"
            >
              No verdicts yet. Generate a variant to see council reactions.
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-auto flex items-center gap-1.5 rounded-md border border-[var(--amp-semantic-border-default)] bg-[var(--amp-semantic-bg-surface)] px-2 py-1.5"
        >
          <span
            aria-hidden="true"
            className="text-[10px] font-semibold text-[var(--amp-semantic-text-tertiary)]"
          >
            &#8984;/
          </span>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="ask the council a question"
            aria-label="Ask the council a question"
            className={cn(
              'flex-1 bg-transparent text-xs',
              'text-[var(--amp-semantic-text-default)]',
              'placeholder:text-[var(--amp-semantic-text-tertiary)]',
              'focus-visible:outline-none',
            )}
          />
        </form>
      </aside>
    );
  },
);

CouncilRail.displayName = 'CouncilRail';
