import React from 'react';
import { cn } from '../../lib/cn';

export type EmptyStateVariant =
  | 'default'
  | 'noData'
  | 'noResults'
  | 'noPermission'
  | 'error-network'
  | 'error-server'
  | 'tip-card';

export interface EmptyStateProps {
  /**
   * Pre-defined variant that supplies a default icon, title, and description
   * if those props are not explicitly provided.
   */
  variant?: EmptyStateVariant;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

type VariantSpec = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const InboxIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" />
  </svg>
);

const SearchIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const LockIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const WifiOffIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20h.01" />
    <path d="M8.5 16.429a5 5 0 0 1 7 0" />
    <path d="M5 12.859a10 10 0 0 1 5.17-2.69" />
    <path d="M19 12.859a10 10 0 0 0-2.007-1.523" />
    <path d="M2 8.82a15 15 0 0 1 4.177-2.643" />
    <path d="M22 8.82a15 15 0 0 0-11.288-3.764" />
    <path d="m2 2 20 20" />
  </svg>
);

const ServerErrorIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
    <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
    <path d="m15 13 6 6" />
    <path d="m21 13-6 6" />
  </svg>
);

const VARIANTS: Record<Exclude<EmptyStateVariant, 'default' | 'tip-card'>, VariantSpec> = {
  noData: {
    icon: InboxIcon,
    title: 'Nothing here yet',
    description: 'When data arrives, it will show up here.',
  },
  noResults: {
    icon: SearchIcon,
    title: 'No results found',
    description: 'Try adjusting your search or filter criteria.',
  },
  noPermission: {
    icon: LockIcon,
    title: 'You don’t have access',
    description: 'Ask an admin to grant you permission to view this content.',
  },
  'error-network': {
    icon: WifiOffIcon,
    title: 'Network unavailable',
    description: 'We can’t reach our servers right now. Check your connection and retry.',
  },
  'error-server': {
    icon: ServerErrorIcon,
    title: 'Something went wrong',
    description: 'Our server hit an unexpected error. Our team has been notified.',
  },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  variant = 'default',
  icon,
  title,
  description,
  action,
  className,
}) => {
  // ─── Tip-card variant (Oportunities PAT-OPT-CR-03) ──────────────────────
  if (variant === 'tip-card') {
    // Detect eyebrow: title starts with a short uppercase phrase (<=40 chars, first word capitalised).
    // If the title contains a newline or `\n`, the first line is the eyebrow, rest is headline.
    let eyebrow: string | undefined;
    let headline = title ?? '';
    const nlIdx = headline.indexOf('\n');
    if (nlIdx !== -1) {
      eyebrow = headline.slice(0, nlIdx).trim();
      headline = headline.slice(nlIdx + 1).trim();
    }

    return (
      <div
        className={cn(
          'flex flex-col items-start text-left',
          className,
        )}
        style={{
          border: '1.5px dashed var(--amp-oportunities-border, #EFE4D4)',
          background: 'var(--amp-oportunities-accent-soft, #FFE9D2)',
          borderRadius: 16,
          padding: '20px 16px',
        }}
      >
        {eyebrow && (
          <span
            style={{
              fontSize: 9,
              fontFamily: 'JetBrains Mono, ui-monospace, monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--amp-oportunities-accent, #E68F47)',
              marginBottom: 6,
            }}
          >
            {eyebrow}
          </span>
        )}
        {headline && (
          <h3
            style={{
              fontSize: 14,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              color: 'var(--amp-semantic-text-primary)',
              margin: 0,
            }}
          >
            {headline}
          </h3>
        )}
        {description && (
          <p
            style={{
              fontSize: 11.5,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              color: 'var(--amp-semantic-text-secondary)',
              marginTop: 4,
              marginBottom: 0,
            }}
          >
            {description}
          </p>
        )}
        {action && (
          <div style={{ marginTop: 10 }}>
            {action}
          </div>
        )}
      </div>
    );
  }

  // ─── Standard variants ───────────────────────────────────────────────────
  const spec = variant !== 'default' ? VARIANTS[variant] : undefined;
  const resolvedIcon = icon ?? spec?.icon;
  const resolvedTitle = title ?? spec?.title ?? '';
  const resolvedDescription = description ?? spec?.description;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className
      )}
    >
      {resolvedIcon && (
        <div className="w-12 h-12 rounded-[16px] bg-[var(--amp-semantic-bg-raised)] flex items-center justify-center mb-4 text-[var(--amp-semantic-text-muted)]">
          {resolvedIcon}
        </div>
      )}
      {resolvedTitle && (
        <h3 className="text-[16px] font-semibold text-[var(--amp-semantic-text-primary)] mb-2">
          {resolvedTitle}
        </h3>
      )}
      {resolvedDescription && (
        <p className="text-[14px] text-[var(--amp-semantic-text-secondary)] max-w-sm mb-6">
          {resolvedDescription}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};
