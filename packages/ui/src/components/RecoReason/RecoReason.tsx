import React from 'react';
import { cn } from '../../lib/cn';

export interface RecoReasonProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: string;
  children: React.ReactNode;
}

export const RecoReason = React.forwardRef<HTMLDivElement, RecoReasonProps>(
  ({ icon = '\uD83C\uDFAF', children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-row items-start gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2.5 text-sm text-green-600',
          className
        )}
        {...props}
      >
        <span className="shrink-0 leading-5" aria-hidden="true">
          {icon}
        </span>
        <div className="min-w-0">{children}</div>
      </div>
    );
  }
);
RecoReason.displayName = 'RecoReason';
