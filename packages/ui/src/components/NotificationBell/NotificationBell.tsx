'use client';

import React from 'react';
import { cn } from '../../lib/cn';

/**
 * NotificationBell — bell icon button with badge states for the Oportunities app header.
 *
 * Three states:
 *   - No badge (count === 0, showDot === false)
 *   - Red dot (showDot === true, unread indicator)
 *   - Count pill (count >= 1, shows numeric badge)
 *
 * Tokens consumed:
 *   --amp-oportunities-accent-soft  (circle bg)
 *   --amp-oportunities-accent       (ring stroke)
 */

export interface NotificationBellProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Number of notifications. 0 = no badge, 1+ = show count pill. */
  count?: number;
  /** Show a red dot (unread indicator) instead of a count. */
  showDot?: boolean;
  /** Click handler. */
  onClick?: () => void;
  className?: string;
}

export const NotificationBell = React.forwardRef<HTMLButtonElement, NotificationBellProps>(
  ({ count = 0, showDot = false, onClick, className, style, ...rest }, ref) => {
    const showCountBadge = count > 0 && !showDot;

    return (
      <button
        ref={ref}
        type="button"
        aria-label={`Notifications${count > 0 ? `, ${count} unread` : ''}`}
        onClick={onClick}
        className={cn('relative inline-flex items-center justify-center', className)}
        style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: 'var(--amp-oportunities-accent-soft, #FFE9D2)',
          border: 'none',
          boxShadow: 'inset 0 0 0 1.5px var(--amp-oportunities-accent, #E68F47)',
          cursor: 'pointer',
          padding: 0,
          ...style,
        }}
        {...rest}
      >
        {/* Bell emoji */}
        <span aria-hidden="true" style={{ fontSize: 16, lineHeight: 1 }}>
          {'🔔'}
        </span>

        {/* Red dot (unread) */}
        {showDot && !showCountBadge && (
          <span
            aria-hidden="true"
            data-testid="notification-bell-dot"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#EF4444',
            }}
          />
        )}

        {/* Count pill */}
        {showCountBadge && (
          <span
            aria-hidden="true"
            data-testid="notification-bell-count"
            style={{
              position: 'absolute',
              top: -2,
              right: -4,
              minWidth: 16,
              height: 16,
              borderRadius: 999,
              background: '#EF4444',
              color: '#FFFFFF',
              fontSize: 10,
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
              lineHeight: '16px',
              textAlign: 'center' as const,
              padding: '0 4px',
            }}
          >
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>
    );
  },
);

NotificationBell.displayName = 'NotificationBell';
