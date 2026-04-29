'use client';

import React from 'react';
import { cn } from '../../lib/cn';

export type MessageBubbleVariant = 'incoming' | 'outgoing' | 'system';
export type MessageBubbleStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface MessageBubbleReaction {
  emoji: string;
  count: number;
  reacted?: boolean;
}

export interface MessageBubbleProps {
  variant?: MessageBubbleVariant;
  /** Message content. Can be a string or rich React node. */
  children: React.ReactNode;
  /** Optional avatar slot — typically an <Avatar /> instance. */
  avatar?: React.ReactNode;
  /** Author name (rendered above content, optional). */
  author?: string;
  /** Timestamp string (e.g. "10:42 AM"). */
  timestamp?: string;
  /** Delivery status (only meaningful for outgoing variant). */
  status?: MessageBubbleStatus;
  /** Reactions to display below the bubble. */
  reactions?: MessageBubbleReaction[];
  /** Show a directional tail on the bubble. Default true. */
  tail?: boolean;
  /** Click handler for reaction pill. */
  onReactionClick?: (reaction: MessageBubbleReaction) => void;
  className?: string;
}

const statusGlyph: Record<MessageBubbleStatus, string> = {
  sending: '○',
  sent: '✓',
  delivered: '✓✓',
  read: '✓✓',
  failed: '!',
};

const statusLabel: Record<MessageBubbleStatus, string> = {
  sending: 'Sending',
  sent: 'Sent',
  delivered: 'Delivered',
  read: 'Read',
  failed: 'Failed to send',
};

const variantContainer: Record<MessageBubbleVariant, string> = {
  incoming: 'items-start',
  outgoing: 'items-end flex-row-reverse',
  system: 'items-center justify-center',
};

const bubbleStyles: Record<MessageBubbleVariant, string> = {
  incoming:
    'bg-[var(--amp-semantic-bg-raised)] text-[var(--amp-semantic-text-primary)] rounded-[16px] rounded-bl-[4px] border border-[var(--amp-semantic-border-default)]',
  outgoing:
    'bg-[var(--amp-semantic-accent)] text-[var(--amp-semantic-text-inverse)] rounded-[16px] rounded-br-[4px]',
  system:
    'bg-[var(--amp-semantic-bg-sunken)] text-[var(--amp-semantic-text-muted)] rounded-full text-[12px] px-3 py-1',
};

const tailStyles: Record<MessageBubbleVariant, string> = {
  incoming:
    "before:content-[''] before:absolute before:bottom-0 before:left-[-6px] before:w-3 before:h-3 before:bg-[var(--amp-semantic-bg-raised)] before:border-l before:border-b before:border-[var(--amp-semantic-border-default)] before:[clip-path:polygon(100%_0,100%_100%,0_100%)]",
  outgoing:
    "before:content-[''] before:absolute before:bottom-0 before:right-[-6px] before:w-3 before:h-3 before:bg-[var(--amp-semantic-accent)] before:[clip-path:polygon(0_0,100%_100%,0_100%)]",
  system: '',
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  variant = 'incoming',
  children,
  avatar,
  author,
  timestamp,
  status,
  reactions,
  tail = true,
  onReactionClick,
  className,
}) => {
  if (variant === 'system') {
    return (
      <div
        role="status"
        className={cn('flex w-full justify-center my-2', className)}
      >
        <div className={bubbleStyles.system}>{children}</div>
      </div>
    );
  }

  return (
    <div className={cn('flex gap-2 w-full', variantContainer[variant], className)}>
      {avatar && <div className="flex-shrink-0 mt-1">{avatar}</div>}
      <div className={cn('flex flex-col max-w-[75%] gap-1', variant === 'outgoing' ? 'items-end' : 'items-start')}>
        {author && (
          <span className="text-[12px] font-medium text-[var(--amp-semantic-text-muted)] px-1">
            {author}
          </span>
        )}
        <div
          // TODO(phase-a): swap to amplify-motion-* for transition durations
          className={cn(
            'relative px-3 py-2 text-[14px] leading-[20px] break-words',
            'transition-opacity duration-200 ease-out',
            bubbleStyles[variant],
            tail && tailStyles[variant]
          )}
        >
          {children}
        </div>
        {reactions && reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 px-1">
            {reactions.map((r, i) => (
              <button
                key={`${r.emoji}-${i}`}
                type="button"
                onClick={() => onReactionClick?.(r)}
                className={cn(
                  'flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[11px]',
                  'bg-[var(--amp-semantic-bg-surface)] border border-[var(--amp-semantic-border-default)]',
                  'hover:bg-[var(--amp-semantic-bg-raised)] transition-colors',
                  r.reacted && 'border-[var(--amp-semantic-accent)] bg-[var(--amp-semantic-accent-soft,transparent)]'
                )}
              >
                <span>{r.emoji}</span>
                <span className="text-[var(--amp-semantic-text-muted)]">{r.count}</span>
              </button>
            ))}
          </div>
        )}
        {(timestamp || (variant === 'outgoing' && status)) && (
          <div className="flex items-center gap-1 px-1 text-[11px] text-[var(--amp-semantic-text-muted)]">
            {timestamp && <time>{timestamp}</time>}
            {variant === 'outgoing' && status && (
              <span
                aria-label={statusLabel[status]}
                title={statusLabel[status]}
                className={cn(
                  status === 'read' && 'text-[var(--amp-semantic-status-info)]',
                  status === 'failed' && 'text-[var(--amp-semantic-status-error)]'
                )}
              >
                {statusGlyph[status]}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
