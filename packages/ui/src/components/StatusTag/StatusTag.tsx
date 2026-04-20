import React from 'react';
import { cn } from '../../lib/cn';

export type StatusTagStatus = 'healthy' | 'warning' | 'error' | 'offline' | 'active' | 'pending';
export type StatusTagSize = 'sm' | 'md';

export interface StatusTagProps {
  status: StatusTagStatus;
  size?: StatusTagSize;
  pulse?: boolean;
  className?: string;
}

const statusConfig: Record<StatusTagStatus, { label: string; dotColor: string; bgColor: string; textColor: string }> = {
  healthy: {
    label: 'Healthy',
    dotColor: 'bg-[var(--amp-semantic-status-success)]',
    bgColor: 'bg-[var(--amp-semantic-status-success-bg)]',
    textColor: 'text-[var(--amp-semantic-status-success)]',
  },
  warning: {
    label: 'Warning',
    dotColor: 'bg-[var(--amp-semantic-status-warning)]',
    bgColor: 'bg-[var(--amp-semantic-status-warning-bg)]',
    textColor: 'text-[var(--amp-semantic-status-warning)]',
  },
  error: {
    label: 'Error',
    dotColor: 'bg-[var(--amp-semantic-status-error)]',
    bgColor: 'bg-[var(--amp-semantic-status-error-bg)]',
    textColor: 'text-[var(--amp-semantic-status-error)]',
  },
  offline: {
    label: 'Offline',
    dotColor: 'bg-[var(--amp-semantic-text-muted)]',
    bgColor: 'bg-[var(--amp-semantic-bg-sunken)]',
    textColor: 'text-[var(--amp-semantic-text-muted)]',
  },
  active: {
    label: 'Active',
    dotColor: 'bg-[var(--amp-semantic-status-success)]',
    bgColor: 'bg-[var(--amp-semantic-status-success-bg)]',
    textColor: 'text-[var(--amp-semantic-status-success)]',
  },
  pending: {
    label: 'Pending',
    dotColor: 'bg-[var(--amp-semantic-status-info)]',
    bgColor: 'bg-[var(--amp-semantic-status-info-bg)]',
    textColor: 'text-[var(--amp-semantic-status-info)]',
  },
};

const sizeClasses: Record<StatusTagSize, string> = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-2.5 py-1 text-[12px]',
};

export const StatusTag: React.FC<StatusTagProps> = ({
  status,
  size = 'md',
  pulse = false,
  className,
}) => {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        config.bgColor,
        config.textColor,
        sizeClasses[size],
        className
      )}
    >
      <span
        className={cn(
          'w-2 h-2 rounded-full',
          config.dotColor,
          pulse && 'animate-pulse'
        )}
      />
      {config.label}
    </span>
  );
};
