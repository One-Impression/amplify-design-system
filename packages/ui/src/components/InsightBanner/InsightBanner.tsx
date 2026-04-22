import React from 'react';
import { cn } from '../../lib/cn';

export interface InsightBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: string;
  children: React.ReactNode;
}

export const InsightBanner = React.forwardRef<HTMLDivElement, InsightBannerProps>(
  ({ icon = '\u{1F4A1}', children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-row items-start gap-3 rounded-lg border border-violet-200 bg-violet-50 px-4 py-3',
          className
        )}
        {...props}
      >
        <span className="flex-shrink-0 text-base" aria-hidden="true">
          {icon}
        </span>
        <div className="text-sm text-violet-600">{children}</div>
      </div>
    );
  }
);

InsightBanner.displayName = 'InsightBanner';
