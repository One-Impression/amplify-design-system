import React from 'react';
import { cn } from '../../lib/cn';

export interface InsightBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: string;
  children: React.ReactNode;
}

export const InsightBanner = React.forwardRef<HTMLDivElement, InsightBannerProps>(
  ({ icon = '\uD83D\uDCA1', children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-start gap-3 rounded-xl border border-violet-100 bg-violet-50/50 p-4',
          className
        )}
        {...props}
      >
        <span className="text-base flex-shrink-0" aria-hidden="true">{icon}</span>
        <div className="text-sm text-stone-700 leading-relaxed">{children}</div>
      </div>
    );
  }
);

InsightBanner.displayName = 'InsightBanner';
