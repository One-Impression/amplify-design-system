'use client';

import React from 'react';
import { cn } from '../../lib/cn';

/**
 * FlowContextSidebar — left-rail multi-step flow navigator for Magic
 * Studio's Option-D cockpit (`magic-studio/docs/mockups/option-d.html`,
 * region R5). Implements the `FlowSidebar` v0 contract from
 * `packages/ui/src/components/FlowSidebar/SPEC.md` (PR #101).
 *
 * The component is purely presentational. `activeStepId`, `collapsed`,
 * and `steps` are all controlled by the parent — matching `PhaseRibbon`
 * and `HistoryStrip`. v0 supports navigation only; drag-reorder /
 * insert-remove / conditional-flow are deferred to v0.2.
 *
 * Layout uses three Studio-scoped layout tokens:
 *   --amp-studio-theme-layout-flow-sidebar-w           260px
 *   --amp-studio-theme-layout-flow-sidebar-rail-w       44px
 *   --amp-studio-theme-layout-flow-step-chip-h          64px
 *
 * Width transition is 180ms cubic-bezier(0.4,0,0.2,1) — disabled under
 * `prefers-reduced-motion: reduce` via `motion-reduce:transition-none`.
 */

// ─── Types (mirror FlowSidebar/SPEC.md §2) ───────────────────────────────────

export type FlowStepStatus = 'default' | 'in-progress' | 'complete' | 'skipped';

export interface FlowStepBadge {
  count: number;
  tone?: 'default' | 'accent';
}

export interface FlowStep {
  /** Stable id — used for `activeStepId` matching, React keys, and click events. */
  id: string;
  /** Visible label, e.g. "Step 2 · Package". */
  label: string;
  /**
   * Optional href. When provided, the chip renders as `<a href>` instead
   * of `<button>`. `onStepClick` still fires for analytics.
   */
  href?: string;
  /**
   * Image URL, or `null` / `undefined` for a token-driven placeholder
   * block (1.6:1 aspect, dashed border).
   */
  thumbnail?: string | null;
  /** Visual status. Defaults to `'default'`. */
  status?: FlowStepStatus;
  /** Optional badge, e.g. iteration count. */
  badge?: FlowStepBadge;
}

export interface FlowContextSidebarProps {
  /** Header label, e.g. "Brand Order — 7 steps". Hidden when collapsed. */
  flowName: string;
  /** Ordered list of steps. Empty array → component returns null. */
  steps: FlowStep[];
  /** Id of the currently active step. */
  activeStepId: string;
  /** Default `false`. When `true`, sidebar collapses to icon-only rail. */
  collapsed?: boolean;
  /** Fired on chip activation (click, Enter, Space). */
  onStepClick?: (id: string) => void;
  /** Fired when the collapse toggle is activated. */
  onCollapse?: (collapsed: boolean) => void;
  /** Optional bottom-of-rail action button. */
  onApplyToAll?: () => void;
  /** Default `"Apply brief to all steps"`. */
  applyToAllLabel?: string;
  /** Optional className passthrough on the outer `<nav>`. */
  className?: string;
}

// ─── Pulse keyframes (id-guarded, injected once) ────────────────────────────

const STYLE_ID = 'amp-flow-sidebar-keyframes';
const styleSheet = `
@keyframes amp-flow-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.55; transform: scale(0.85); }
}
@media (prefers-reduced-motion: reduce) {
  .amp-flow-pulse { animation: none !important; }
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

// ─── Status helpers ─────────────────────────────────────────────────────────

const statusToAriaSuffix = (status: FlowStepStatus): string => {
  switch (status) {
    case 'complete':
      return ', complete';
    case 'in-progress':
      return ', in progress';
    case 'skipped':
      return ', skipped';
    default:
      return '';
  }
};

// ─── Component ───────────────────────────────────────────────────────────────

export function FlowContextSidebar({
  flowName,
  steps,
  activeStepId,
  collapsed = false,
  onStepClick,
  onCollapse,
  onApplyToAll,
  applyToAllLabel = 'Apply brief to all steps',
  className,
}: FlowContextSidebarProps) {
  useInjectedKeyframes();

  const listId = React.useId();
  const stepRefs = React.useRef<Map<string, HTMLElement>>(new Map());

  // Empty steps → render nothing. Hooks above this guard so call order
  // stays stable across renders.
  if (steps.length === 0) return null;

  const setStepRef = (id: string) => (el: HTMLElement | null) => {
    const map = stepRefs.current;
    if (el) map.set(id, el);
    else map.delete(id);
  };

  const focusStep = (id: string) => {
    stepRefs.current.get(id)?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLElement>,
    stepId: string,
  ) => {
    const idx = steps.findIndex((s) => s.id === stepId);
    if (idx === -1) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusStep(steps[(idx + 1) % steps.length].id);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusStep(steps[(idx - 1 + steps.length) % steps.length].id);
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusStep(steps[0].id);
    } else if (e.key === 'End') {
      e.preventDefault();
      focusStep(steps[steps.length - 1].id);
    } else if (e.key === 'Enter' || e.key === ' ') {
      // Native <button> already handles this; explicit handler keeps
      // <a> chips consistent.
      e.preventDefault();
      onStepClick?.(stepId);
    }
  };

  const handleCollapseToggle = () => {
    onCollapse?.(!collapsed);
  };

  return (
    <nav
      role="navigation"
      aria-label="Flow steps"
      data-collapsed={collapsed}
      data-testid="flow-context-sidebar"
      className={cn(
        'flex h-full flex-col overflow-hidden',
        'border-r border-[var(--amp-studio-theme-color-border)]',
        'bg-[var(--amp-studio-theme-color-bg-elev)]',
        'transition-[width] duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
        'motion-reduce:transition-none',
        className,
      )}
      style={{
        width: collapsed
          ? 'var(--amp-studio-theme-layout-flow-sidebar-rail-w, 44px)'
          : 'var(--amp-studio-theme-layout-flow-sidebar-w, 260px)',
      }}
    >
      {/* Sticky header */}
      <div
        className={cn(
          'sticky top-0 flex shrink-0 items-center justify-between gap-[var(--amp-spacing-2)]',
          'border-b border-[var(--amp-studio-theme-color-border)]',
          'bg-[var(--amp-studio-theme-color-bg-elev)]',
          'px-[var(--amp-spacing-3)] py-[var(--amp-spacing-3)]',
        )}
      >
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <div
              className={cn(
                'truncate text-[var(--amp-font-size-md)]',
                'font-[var(--amp-font-weight-semibold)]',
                'leading-[var(--amp-line-height-tight)]',
                'text-[var(--amp-studio-theme-color-fg)]',
              )}
              data-testid="flow-context-sidebar-title"
            >
              {flowName}
            </div>
          </div>
        )}
        <button
          type="button"
          aria-expanded={!collapsed}
          aria-controls={listId}
          aria-label={collapsed ? 'Expand flow steps' : 'Collapse flow steps'}
          data-testid="flow-context-sidebar-collapse"
          onClick={handleCollapseToggle}
          className={cn(
            'inline-flex h-7 w-7 shrink-0 items-center justify-center',
            'rounded-[var(--amp-radius-sm)] border-0 bg-transparent',
            'text-[var(--amp-studio-theme-color-muted)]',
            'cursor-pointer',
            'hover:bg-[var(--amp-studio-theme-color-bg-subtle)]',
            'hover:text-[var(--amp-studio-theme-color-fg)]',
            'focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-[var(--amp-semantic-border-focus)]',
            'focus-visible:ring-offset-1',
          )}
        >
          <CollapseIcon collapsed={collapsed} />
        </button>
      </div>

      {/* Step list */}
      <ul
        id={listId}
        role="list"
        data-testid="flow-context-sidebar-list"
        className={cn(
          'flex flex-1 flex-col gap-[var(--amp-spacing-2)] overflow-y-auto',
          'p-[var(--amp-spacing-3)]',
        )}
      >
        {steps.map((step, idx) => (
          <li key={step.id} role="listitem">
            <StepChip
              step={step}
              index={idx}
              isActive={step.id === activeStepId}
              collapsed={collapsed}
              onClick={() => onStepClick?.(step.id)}
              onKeyDown={(e) => handleKeyDown(e, step.id)}
              setRef={setStepRef(step.id)}
            />
          </li>
        ))}
      </ul>

      {/* Sticky bottom action */}
      {onApplyToAll && !collapsed && (
        <div
          className={cn(
            'sticky bottom-0 mt-auto shrink-0',
            'border-t border-[var(--amp-studio-theme-color-border)]',
            'bg-[var(--amp-studio-theme-color-bg-elev)]',
            'px-[var(--amp-spacing-4)] py-[var(--amp-spacing-3)]',
          )}
        >
          <button
            type="button"
            data-testid="flow-context-sidebar-apply-to-all"
            aria-label={applyToAllLabel}
            onClick={onApplyToAll}
            className={cn(
              'block w-full cursor-pointer',
              'rounded-full border',
              'border-[var(--amp-studio-theme-color-border-strong)]',
              'bg-[var(--amp-studio-theme-color-bg)]',
              'px-[var(--amp-spacing-3)] py-[var(--amp-spacing-2)]',
              'text-[var(--amp-font-size-sm)]',
              'font-[var(--amp-font-weight-medium)]',
              'text-[var(--amp-studio-theme-color-fg)]',
              'transition-colors duration-[var(--amp-motion-duration-fast)]',
              'motion-reduce:transition-none',
              'hover:bg-[var(--amp-studio-theme-color-bg-elev)]',
              'hover:border-[var(--amp-semantic-border-accent)]',
              'focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-[var(--amp-semantic-border-focus)]',
              'focus-visible:ring-offset-1',
            )}
          >
            {applyToAllLabel}
          </button>
        </div>
      )}
    </nav>
  );
}

FlowContextSidebar.displayName = 'FlowContextSidebar';

// ─── StepChip sub-component ─────────────────────────────────────────────────

interface StepChipProps {
  step: FlowStep;
  index: number;
  isActive: boolean;
  collapsed: boolean;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
  setRef: (el: HTMLElement | null) => void;
}

const StepChip: React.FC<StepChipProps> = ({
  step,
  index,
  isActive,
  collapsed,
  onClick,
  onKeyDown,
  setRef,
}) => {
  const status: FlowStepStatus = step.status ?? 'default';
  const ariaLabel = `${step.label}${statusToAriaSuffix(status)}`;
  const ariaCurrent = isActive ? 'step' : undefined;
  // Roving tabindex — only the active chip is in the tab order.
  const tabIndex = isActive ? 0 : -1;

  const commonClasses = cn(
    'group relative flex w-full cursor-pointer flex-col',
    'gap-[var(--amp-spacing-2)] p-[var(--amp-spacing-2)]',
    'rounded-[var(--amp-radius-md)] border text-left',
    'transition-[border-color,background-color,box-shadow] duration-[var(--amp-motion-duration-fast)]',
    'motion-reduce:transition-none',
    // height token so click target ≥ 44px
    'min-h-[var(--amp-studio-theme-layout-flow-step-chip-h,64px)]',
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-offset-2',
    'focus-visible:ring-[var(--amp-semantic-border-focus)]',
    isActive
      ? cn(
          'bg-[var(--amp-studio-theme-color-bg-elev)]',
          'border-[var(--amp-semantic-border-accent)]',
          'shadow-[var(--amp-shadow-ring-accent)]',
        )
      : cn(
          'bg-[var(--amp-studio-theme-color-bg-subtle)]',
          'border-[var(--amp-studio-theme-color-border)]',
          'hover:border-[var(--amp-studio-theme-color-border-strong)]',
        ),
    status === 'skipped' && 'opacity-50',
    collapsed && 'min-h-[28px] flex-row items-center justify-center border-0 bg-transparent p-0 hover:bg-transparent',
  );

  const content = collapsed ? (
    <CollapsedPip
      index={index}
      isActive={isActive}
      status={status}
      label={step.label}
    />
  ) : (
    <>
      {/* Thumbnail */}
      <Thumbnail thumbnail={step.thumbnail} />
      {/* Label row */}
      <div
        className={cn(
          'flex items-center justify-between',
          'text-[var(--amp-font-size-xs)]',
          'font-[var(--amp-font-mono)] text-[var(--amp-studio-theme-color-muted)]',
          isActive && 'text-[var(--amp-studio-theme-color-accent)]',
        )}
      >
        <span className="truncate">
          <span
            className={cn(
              'ml-1 font-[var(--amp-font-weight-medium)]',
              'text-[var(--amp-studio-theme-color-fg)]',
            )}
          >
            {step.label}
          </span>
        </span>
        <StatusGlyph status={status} />
      </div>
      {step.badge && <BadgeDot badge={step.badge} />}
    </>
  );

  if (step.href) {
    return (
      <a
        ref={setRef as (el: HTMLAnchorElement | null) => void}
        href={step.href}
        aria-label={ariaLabel}
        aria-current={ariaCurrent}
        data-status={status}
        data-active={isActive}
        data-testid={`flow-context-sidebar-step-${step.id}`}
        tabIndex={tabIndex}
        onClick={onClick}
        onKeyDown={onKeyDown}
        className={commonClasses}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={setRef as (el: HTMLButtonElement | null) => void}
      type="button"
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      data-status={status}
      data-active={isActive}
      data-testid={`flow-context-sidebar-step-${step.id}`}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={commonClasses}
    >
      {content}
    </button>
  );
};

// ─── Sub-bits ────────────────────────────────────────────────────────────────

const Thumbnail: React.FC<{ thumbnail?: string | null }> = ({ thumbnail }) => {
  if (thumbnail) {
    return (
      <div
        className={cn(
          'relative w-full overflow-hidden',
          'rounded-[var(--amp-radius-sm)]',
          'border border-[var(--amp-studio-theme-color-border)]',
          'bg-[var(--amp-studio-theme-color-bg-elev)]',
          'aspect-[1.6/1]',
        )}
      >
        <img
          src={thumbnail}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }
  return (
    <div
      data-testid="flow-context-sidebar-thumb-placeholder"
      className={cn(
        'w-full',
        'rounded-[var(--amp-radius-sm)]',
        'border border-dashed border-[var(--amp-studio-theme-color-border)]',
        'bg-[var(--amp-semantic-bg-subtle)]',
        'aspect-[1.6/1]',
      )}
    />
  );
};

const CollapsedPip: React.FC<{
  index: number;
  isActive: boolean;
  status: FlowStepStatus;
  label: string;
}> = ({ index, isActive, status, label }) => (
  <span
    aria-hidden="true"
    title={label}
    data-status={status}
    className={cn(
      'inline-flex h-7 w-7 items-center justify-center',
      'rounded-full',
      'font-[var(--amp-font-mono)] text-[var(--amp-font-size-xs)]',
      isActive
        ? 'bg-[var(--amp-studio-theme-color-accent)] text-[var(--amp-studio-theme-color-fg-on-accent)]'
        : 'bg-[var(--amp-studio-theme-color-bg-subtle)] text-[var(--amp-studio-theme-color-muted)]',
    )}
  >
    {index + 1}
  </span>
);

const StatusGlyph: React.FC<{ status: FlowStepStatus }> = ({ status }) => {
  if (status === 'complete') {
    return (
      <span
        aria-hidden="true"
        data-testid="flow-context-sidebar-status-complete"
        className={cn(
          'inline-flex h-4 w-4 items-center justify-center',
          'rounded-full',
          'bg-[var(--amp-semantic-color-success)]',
          'text-[var(--amp-studio-theme-color-fg-on-accent)]',
          'text-[10px]',
        )}
      >
        ✓
      </span>
    );
  }
  if (status === 'in-progress') {
    return (
      <span
        aria-hidden="true"
        data-testid="flow-context-sidebar-status-in-progress"
        className={cn(
          'amp-flow-pulse inline-block size-2 rounded-full',
          'bg-[var(--amp-semantic-color-info,var(--amp-studio-theme-color-accent))]',
        )}
        style={{ animation: 'amp-flow-pulse 1.4s ease-in-out infinite' }}
      />
    );
  }
  if (status === 'skipped') {
    return (
      <span
        aria-hidden="true"
        data-testid="flow-context-sidebar-status-skipped"
        className={cn(
          'inline-block h-3 w-3 rounded-[var(--amp-radius-xs)]',
          'bg-[linear-gradient(135deg,transparent_47%,var(--amp-studio-theme-color-border)_48%,var(--amp-studio-theme-color-border)_52%,transparent_53%)]',
        )}
      />
    );
  }
  return null;
};

const BadgeDot: React.FC<{ badge: { count: number; tone?: 'default' | 'accent' } }> = ({
  badge,
}) => (
  <span
    data-testid="flow-context-sidebar-badge"
    className={cn(
      'absolute right-[var(--amp-spacing-2)] top-[var(--amp-spacing-2)]',
      'inline-flex h-4 min-w-[16px] items-center justify-center',
      'rounded-full px-1',
      'text-[var(--amp-font-size-2xs)]',
      'font-[var(--amp-font-weight-medium)]',
      badge.tone === 'accent'
        ? 'bg-[var(--amp-studio-theme-color-accent)] text-[var(--amp-studio-theme-color-fg-on-accent)]'
        : 'bg-[var(--amp-studio-theme-color-bg-subtle)] text-[var(--amp-studio-theme-color-muted)]',
    )}
  >
    {badge.count}
  </span>
);

const CollapseIcon: React.FC<{ collapsed: boolean }> = ({ collapsed }) => (
  <svg
    width={14}
    height={14}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{
      transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 180ms cubic-bezier(0.4,0,0.2,1)',
    }}
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
