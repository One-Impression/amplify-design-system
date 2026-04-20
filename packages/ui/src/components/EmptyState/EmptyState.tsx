import React from 'react';
import { cn } from '../../lib/cn';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className
      )}
    >
      {icon && (
        <div className="w-12 h-12 rounded-[16px] bg-[var(--amp-semantic-bg-raised)] flex items-center justify-center mb-4 text-[var(--amp-semantic-text-muted)]">
          {icon}
        </div>
      )}
      <h3 className="text-[16px] font-semibold text-[var(--amp-semantic-text-primary)] mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-[14px] text-[var(--amp-semantic-text-secondary)] max-w-sm mb-6">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};
