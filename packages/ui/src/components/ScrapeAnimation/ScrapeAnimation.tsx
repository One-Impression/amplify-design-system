import React from 'react';
import { cn } from '../../lib/cn';

export type ScrapeStepStatus = 'pending' | 'active' | 'done';

export interface ScrapeStep {
  label: string;
  status: ScrapeStepStatus;
}

export interface ScrapeAnimationProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: ScrapeStep[];
}

const spinnerStyle: React.CSSProperties = {
  width: 16,
  height: 16,
  border: '2px solid #d6d3d1',
  borderTop: '2px solid #6531FF',
  borderRadius: '50%',
  animation: 'amp-scrape-spin 0.8s linear infinite',
};

const keyframesId = 'amp-scrape-spin-keyframes';

export const ScrapeAnimation = React.forwardRef<HTMLDivElement, ScrapeAnimationProps>(
  ({ steps, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('flex flex-col gap-2', className)} {...props}>
        {/* Inject keyframes once */}
        <style
          dangerouslySetInnerHTML={{
            __html: `@keyframes amp-scrape-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`,
          }}
          data-id={keyframesId}
        />
        {steps.map((step, idx) => (
          <div
            key={idx}
            className={cn(
              'flex items-center gap-2.5 text-sm',
              step.status === 'pending' && 'opacity-30 text-stone-400',
              step.status === 'active' && 'text-stone-700',
              step.status === 'done' && 'text-green-600'
            )}
          >
            {/* Status indicator */}
            {step.status === 'pending' && (
              <span className="inline-block w-4 h-4 rounded-full bg-stone-300" />
            )}
            {step.status === 'active' && <span style={spinnerStyle} />}
            {step.status === 'done' && (
              <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-green-600">
                &#x2713;
              </span>
            )}
            <span>{step.label}</span>
          </div>
        ))}
      </div>
    );
  }
);
ScrapeAnimation.displayName = 'ScrapeAnimation';
