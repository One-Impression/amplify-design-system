import React from 'react';
import { cn } from '../../lib/cn';

export interface RecoReasonProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: string;
  children: React.ReactNode;
}

export const RecoReason = React.forwardRef<HTMLDivElement, RecoReasonProps>(
  ({ icon = '\u2726', children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-start gap-2 rounded-lg bg-violet-50 px-3 py-2 text-sm text-violet-800',
          className
        )}
        {...props}
      >
        <span className="flex-shrink-0" aria-hidden="true">{icon}</span>
        <span>{children}</span>
      </div>
    );
  }
);

RecoReason.displayName = 'RecoReason';
