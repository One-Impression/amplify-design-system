'use client';

import React from 'react';
import { cn } from '../../lib/cn';

/**
 * RecentChangesPanel — right-side slide-in panel listing the last N git
 * commits touching a file. Used by Magic Studio's Option-D cockpit
 * (`magic-studio/docs/mockups/option-d.html`, region R4 + state
 * `#changes`).
 *
 * Width is driven by the existing
 * `--amp-studio-theme-layout-history-panel-w` token (default 360px). The
 * panel is purely presentational — the consumer fetches commits from
 * `/api/files/{path}/commits?limit=N` and feeds them in.
 *
 * Renders as `<aside aria-label>` with role="complementary" so screen
 * readers announce it as a side region. The close button sits in the
 * sticky top-right of the panel head.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface GitCommit {
  /** Short SHA, e.g. "920696b". */
  sha: string;
  /** First-line commit message. */
  message: string;
  /** Author display name. */
  author: string;
  /** Commit timestamp. Rendered with `formatTime` (default `Intl.RelativeTimeFormat`). */
  timestamp: Date;
  /** Lines added in this commit. */
  added: number;
  /** Lines removed in this commit. */
  removed: number;
  /** Optional URL to the commit page (GitHub etc.). When set, the message is rendered as `<a>`. */
  url?: string;
}

export interface RecentChangesPanelProps {
  /** Path of the file the commits are filtered to, e.g. "src/components/Order.tsx". */
  filePath: string;
  /** Ordered commits — most recent first. */
  commits: GitCommit[];
  /** Fired when the user closes the panel (× button or Esc). */
  onClose: () => void;
  /** Custom timestamp formatter. Defaults to relative ("3h ago"). */
  formatTime?: (date: Date) => string;
  /** Optional className passthrough on the outer `<aside>`. */
  className?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const RTF =
  typeof Intl !== 'undefined' && 'RelativeTimeFormat' in Intl
    ? new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
    : null;

const defaultFormatTime = (d: Date): string => {
  if (!RTF) return d.toLocaleString();
  const diffMs = d.getTime() - Date.now();
  const sec = Math.round(diffMs / 1000);
  const abs = Math.abs(sec);
  if (abs < 60) return RTF.format(sec, 'second');
  if (abs < 3600) return RTF.format(Math.round(sec / 60), 'minute');
  if (abs < 86400) return RTF.format(Math.round(sec / 3600), 'hour');
  if (abs < 86400 * 30) return RTF.format(Math.round(sec / 86400), 'day');
  if (abs < 86400 * 365) return RTF.format(Math.round(sec / (86400 * 30)), 'month');
  return RTF.format(Math.round(sec / (86400 * 365)), 'year');
};

// ─── Component ───────────────────────────────────────────────────────────────

export function RecentChangesPanel({
  filePath,
  commits,
  onClose,
  formatTime = defaultFormatTime,
  className,
}: RecentChangesPanelProps) {
  const headingId = React.useId();

  // Esc closes — only when the panel is in the DOM. Listener is on the
  // window; we attach/detach in an effect.
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <aside
      role="complementary"
      aria-labelledby={headingId}
      data-testid="recent-changes-panel"
      className={cn(
        'flex h-full flex-col overflow-hidden',
        'border-l border-[var(--amp-studio-theme-color-border)]',
        'bg-[var(--amp-studio-theme-color-bg-elev)]',
        className,
      )}
      style={{
        width:
          'var(--amp-studio-theme-layout-history-panel-w, 360px)',
      }}
    >
      <header
        className={cn(
          'sticky top-0 flex shrink-0 items-center justify-between',
          'gap-[var(--amp-spacing-2)]',
          'border-b border-[var(--amp-studio-theme-color-border)]',
          'bg-[var(--amp-studio-theme-color-bg-elev)]',
          'px-[var(--amp-spacing-4)] py-[var(--amp-spacing-3)]',
        )}
      >
        <div className="min-w-0 flex-1">
          <h3
            id={headingId}
            data-testid="recent-changes-panel-heading"
            className={cn(
              'truncate',
              'text-[var(--amp-font-size-md)]',
              'font-[var(--amp-font-weight-semibold)]',
              'leading-[var(--amp-line-height-tight)]',
              'text-[var(--amp-studio-theme-color-fg)]',
            )}
          >
            Recent changes
          </h3>
          <div
            className={cn(
              'truncate font-[var(--amp-font-mono)]',
              'text-[var(--amp-font-size-xs)]',
              'text-[var(--amp-studio-theme-color-muted)]',
            )}
            data-testid="recent-changes-panel-filepath"
          >
            {filePath}
          </div>
        </div>
        <button
          type="button"
          aria-label="Close recent changes"
          data-testid="recent-changes-panel-close"
          onClick={onClose}
          className={cn(
            'inline-flex h-7 w-7 shrink-0 items-center justify-center',
            'rounded-[var(--amp-radius-sm)] border-0 bg-transparent',
            'cursor-pointer',
            'text-[var(--amp-studio-theme-color-muted)]',
            'hover:bg-[var(--amp-studio-theme-color-bg-subtle)]',
            'hover:text-[var(--amp-studio-theme-color-fg)]',
            'focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-[var(--amp-semantic-border-focus)]',
            'focus-visible:ring-offset-1',
          )}
        >
          <CloseIcon />
        </button>
      </header>

      <div
        className={cn(
          'flex-1 overflow-y-auto',
          'px-[var(--amp-spacing-4)] py-[var(--amp-spacing-3)]',
        )}
      >
        {commits.length === 0 ? (
          <div
            data-testid="recent-changes-panel-empty"
            className={cn(
              'py-[var(--amp-spacing-6)] text-center',
              'text-[var(--amp-font-size-sm)]',
              'text-[var(--amp-studio-theme-color-muted)]',
            )}
          >
            No recent changes for this file.
          </div>
        ) : (
          <ol
            role="list"
            data-testid="recent-changes-panel-list"
            className="m-0 flex list-none flex-col p-0"
          >
            {commits.map((commit) => (
              <li
                key={commit.sha}
                data-testid={`recent-changes-panel-commit-${commit.sha}`}
                className={cn(
                  'border-b border-[var(--amp-studio-theme-color-border)]',
                  'py-[var(--amp-spacing-3)]',
                  'last:border-b-0',
                )}
              >
                <Commit commit={commit} formatTime={formatTime} />
              </li>
            ))}
          </ol>
        )}
      </div>
    </aside>
  );
}

RecentChangesPanel.displayName = 'RecentChangesPanel';

// ─── Sub-components ──────────────────────────────────────────────────────────

const Commit: React.FC<{ commit: GitCommit; formatTime: (d: Date) => string }> = ({
  commit,
  formatTime,
}) => {
  const Wrapper: React.FC<React.PropsWithChildren<{ className: string }>> = ({
    children,
    className,
  }) =>
    commit.url ? (
      <a
        href={commit.url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        data-testid={`recent-changes-panel-commit-link-${commit.sha}`}
      >
        {children}
      </a>
    ) : (
      <span className={className}>{children}</span>
    );

  return (
    <div className="flex flex-col gap-[var(--amp-spacing-1)]">
      <Wrapper
        className={cn(
          'block truncate',
          'text-[var(--amp-font-size-sm)]',
          'text-[var(--amp-studio-theme-color-fg)]',
          commit.url && cn(
            'hover:underline focus-visible:outline-none',
            'focus-visible:ring-2 focus-visible:ring-offset-1',
            'focus-visible:ring-[var(--amp-semantic-border-focus)]',
            'rounded-[var(--amp-radius-xs)]',
          ),
        )}
      >
        {commit.message}
      </Wrapper>
      <div
        className={cn(
          'flex items-center gap-[var(--amp-spacing-2)]',
          'text-[var(--amp-font-size-xs)]',
          'text-[var(--amp-studio-theme-color-muted)]',
        )}
      >
        <span data-testid={`recent-changes-panel-commit-author-${commit.sha}`}>
          {commit.author}
        </span>
        <span aria-hidden="true">·</span>
        <span data-testid={`recent-changes-panel-commit-time-${commit.sha}`}>
          {formatTime(commit.timestamp)}
        </span>
        <span aria-hidden="true">·</span>
        <span
          className="text-[var(--amp-semantic-color-success)]"
          data-testid={`recent-changes-panel-commit-added-${commit.sha}`}
        >
          +{commit.added}
        </span>
        <span
          className="text-[var(--amp-semantic-color-danger)]"
          data-testid={`recent-changes-panel-commit-removed-${commit.sha}`}
        >
          −{commit.removed}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            'ml-auto font-[var(--amp-font-mono)]',
            'text-[var(--amp-studio-theme-color-muted)]',
          )}
        >
          {commit.sha.slice(0, 7)}
        </span>
      </div>
    </div>
  );
};

const CloseIcon: React.FC = () => (
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
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
