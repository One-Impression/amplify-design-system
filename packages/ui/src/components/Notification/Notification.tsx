import React from 'react';
import { cn } from '../../lib/cn';

export interface NotificationProps {
  /** Stable id — used for marking read in lists. */
  id?: string;
  /** Whether this notification has been read. Unread shows an indicator dot. */
  read?: boolean;
  /** Optional avatar slot (typically `<Avatar>`). Mutually compatible with `icon`. */
  avatar?: React.ReactNode;
  /** Optional icon slot — small visual prefix. */
  icon?: React.ReactNode;
  /** Bold title/headline. */
  title: React.ReactNode;
  /** Body copy. */
  body?: React.ReactNode;
  /** Display timestamp — typically a pre-formatted relative string like "2h ago". */
  timestamp?: string;
  /** If set, the row becomes a link to this URL. */
  href?: string;
  /** Called when row is clicked / activated — fires before navigation. */
  onMarkRead?: (id?: string) => void;
  /** Optional click handler — fires alongside onMarkRead. */
  onClick?: () => void;
  className?: string;
}

/**
 * Persistent in-app notification row.
 *
 * Distinct from `Toast` (transient, floating). Designed to live inside a
 * notification panel/list. Unread notifications render an indicator dot;
 * clicking the row fires `onMarkRead` then navigates if `href` is set.
 */
export const Notification: React.FC<NotificationProps> = ({
  id,
  read = false,
  avatar,
  icon,
  title,
  body,
  timestamp,
  href,
  onMarkRead,
  onClick,
  className,
}) => {
  const handleActivate = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (!read) onMarkRead?.(id);
    onClick?.();
    // If no href, prevent default link traversal.
    if (!href && 'preventDefault' in e) e.preventDefault();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleActivate(e);
      // For non-link case, simulate click navigation.
      if (href) {
        window.location.href = href;
      }
    }
  };

  const content = (
    <>
      {!read && (
        <span
          aria-label="Unread"
          className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--amp-semantic-status-info)]"
        />
      )}
      {(avatar || icon) && (
        <div className="shrink-0 mt-0.5">
          {avatar ?? (
            <div className="w-8 h-8 rounded-full bg-[var(--amp-semantic-bg-raised)] text-[var(--amp-semantic-text-muted)] flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <p
            className={cn(
              'text-[14px] truncate',
              read
                ? 'font-medium text-[var(--amp-semantic-text-secondary)]'
                : 'font-semibold text-[var(--amp-semantic-text-primary)]'
            )}
          >
            {title}
          </p>
          {timestamp && (
            <span className="shrink-0 text-[12px] text-[var(--amp-semantic-text-muted)]">
              {timestamp}
            </span>
          )}
        </div>
        {body && (
          <p className="text-[13px] text-[var(--amp-semantic-text-secondary)] leading-snug mt-0.5">
            {body}
          </p>
        )}
      </div>
    </>
  );

  const sharedClasses = cn(
    'relative flex items-start gap-3 pl-7 pr-3 py-3 rounded-[10px]',
    'transition-colors cursor-pointer',
    'hover:bg-[var(--amp-semantic-bg-raised)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amp-semantic-border-focus)]',
    !read && 'bg-[var(--amp-semantic-bg-info-subtle,var(--amp-semantic-bg-raised))]',
    className
  );

  if (href) {
    return (
      <a
        href={href}
        onClick={handleActivate}
        aria-label={typeof title === 'string' ? title : undefined}
        className={cn(sharedClasses, 'block no-underline text-inherit')}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={typeof title === 'string' ? title : undefined}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
      className={sharedClasses}
    >
      {content}
    </div>
  );
};

export interface NotificationListProps {
  children: React.ReactNode;
  /** Optional accessible label for the list region. */
  label?: string;
  className?: string;
  /** Empty state slot — shown when children is empty. */
  empty?: React.ReactNode;
}

/**
 * Thin composition: renders a vertical stack of `<Notification>`s with a list role
 * for screen readers.
 */
export const NotificationList: React.FC<NotificationListProps> = ({
  children,
  label = 'Notifications',
  className,
  empty,
}) => {
  const childArray = React.Children.toArray(children);
  if (childArray.length === 0 && empty) {
    return <div className={className}>{empty}</div>;
  }
  return (
    <div
      role="list"
      aria-label={label}
      className={cn('flex flex-col gap-1', className)}
    >
      {childArray.map((child, i) => (
        <div role="listitem" key={i}>
          {child}
        </div>
      ))}
    </div>
  );
};
