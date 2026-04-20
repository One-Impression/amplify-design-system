import React from 'react';
import { cn } from '../../lib/cn';

export interface TimelineEvent {
  title: string;
  description?: string;
  timestamp: string;
  status?: 'success' | 'error' | 'warning' | 'info' | 'default';
}

export interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const dotColors: Record<NonNullable<TimelineEvent['status']>, string> = {
  success: 'bg-[var(--amp-semantic-status-success)]',
  error: 'bg-[var(--amp-semantic-status-error)]',
  warning: 'bg-[var(--amp-semantic-status-warning)]',
  info: 'bg-[var(--amp-semantic-status-info)]',
  default: 'bg-[var(--amp-semantic-accent)]',
};

export const Timeline: React.FC<TimelineProps> = ({ events, className }) => {
  return (
    <div className={cn('relative', className)}>
      {events.map((event, idx) => {
        const isLast = idx === events.length - 1;
        const status = event.status || 'default';

        return (
          <div key={idx} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Vertical line */}
            {!isLast && (
              <div className="absolute left-[7px] top-4 bottom-0 w-px bg-[var(--amp-semantic-border-default)]" />
            )}

            {/* Dot */}
            <div
              className={cn(
                'relative z-10 w-[15px] h-[15px] rounded-full flex-shrink-0 mt-0.5 border-2 border-[var(--amp-semantic-bg-surface)]',
                dotColors[status]
              )}
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[14px] font-medium text-[var(--amp-semantic-text-primary)]">
                  {event.title}
                </p>
                <time className="text-[12px] text-[var(--amp-semantic-text-muted)] whitespace-nowrap flex-shrink-0">
                  {event.timestamp}
                </time>
              </div>
              {event.description && (
                <p className="mt-0.5 text-[13px] text-[var(--amp-semantic-text-secondary)]">
                  {event.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
