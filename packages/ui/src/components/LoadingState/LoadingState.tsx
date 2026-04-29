'use client';

import React from 'react';
import { cn } from '../../lib/cn';

export type LoadingStateVariant =
  | 'spinner'
  | 'dots'
  | 'bar'
  | 'skeleton-page'
  | 'skeleton-table'
  | 'skeleton-card';

export type LoadingStateSize = 'sm' | 'md' | 'lg';

export interface LoadingStateProps {
  variant?: LoadingStateVariant;
  size?: LoadingStateSize;
  /** Accessible label announced to screen readers. Defaults to "Loading". */
  label?: string;
  /** For skeleton-table: number of placeholder rows. Default 5. */
  rows?: number;
  className?: string;
}

const SPINNER_SIZE: Record<LoadingStateSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
};

const DOT_SIZE: Record<LoadingStateSize, string> = {
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
  lg: 'h-3 w-3',
};

const BAR_SIZE: Record<LoadingStateSize, string> = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2',
};

export const LoadingState: React.FC<LoadingStateProps> = ({
  variant = 'spinner',
  size = 'md',
  label = 'Loading',
  rows = 5,
  className,
}) => {
  const a11y = { role: 'status', 'aria-live': 'polite' as const, 'aria-label': label };

  if (variant === 'spinner') {
    return (
      <div className={cn('inline-flex items-center justify-center', className)} {...a11y}>
        <svg
          className={cn('animate-spin text-[var(--amp-semantic-text-muted)]', SPINNER_SIZE[size])}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn('inline-flex items-center gap-1', className)} {...a11y}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              'inline-block rounded-full bg-[var(--amp-semantic-text-muted)] animate-pulse',
              DOT_SIZE[size]
            )}
            style={{ animationDelay: `${i * 150}ms` }}
            aria-hidden="true"
          />
        ))}
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  if (variant === 'bar') {
    return (
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-full bg-[var(--amp-semantic-bg-sunken)]',
          BAR_SIZE[size],
          className
        )}
        {...a11y}
      >
        <span
          className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-[var(--amp-semantic-accent-primary,_#6531FF)] animate-[loadingBar_1.4s_ease-in-out_infinite]"
          style={{
            animationName: 'loadingBar',
            animationDuration: '1.4s',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out',
          }}
          aria-hidden="true"
        />
        <style>{`@keyframes loadingBar { 0% { transform: translateX(-100%); } 50% { transform: translateX(100%); } 100% { transform: translateX(300%); } }`}</style>
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  if (variant === 'skeleton-page') {
    return (
      <div className={cn('w-full space-y-4', className)} {...a11y}>
        <div className="h-8 w-1/3 rounded bg-[var(--amp-semantic-bg-sunken)] animate-pulse" />
        <div className="h-4 w-2/3 rounded bg-[var(--amp-semantic-bg-sunken)] animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-32 rounded-[16px] bg-[var(--amp-semantic-bg-sunken)] animate-pulse" />
          ))}
        </div>
        <div className="h-64 rounded-[16px] bg-[var(--amp-semantic-bg-sunken)] animate-pulse" />
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  if (variant === 'skeleton-table') {
    return (
      <div className={cn('w-full', className)} {...a11y}>
        <div className="h-10 rounded-t-[12px] bg-[var(--amp-semantic-bg-sunken)] animate-pulse mb-1" />
        <div className="space-y-1">
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className="h-12 rounded bg-[var(--amp-semantic-bg-sunken)] animate-pulse"
              style={{ opacity: 1 - i * 0.05 }}
            />
          ))}
        </div>
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  if (variant === 'skeleton-card') {
    return (
      <div
        className={cn(
          'w-full p-4 rounded-[16px] border border-[var(--amp-semantic-border-default)] bg-[var(--amp-semantic-bg-surface)]',
          className
        )}
        {...a11y}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-[var(--amp-semantic-bg-sunken)] animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/2 rounded bg-[var(--amp-semantic-bg-sunken)] animate-pulse" />
            <div className="h-3 w-1/3 rounded bg-[var(--amp-semantic-bg-sunken)] animate-pulse" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-[var(--amp-semantic-bg-sunken)] animate-pulse" />
          <div className="h-3 w-5/6 rounded bg-[var(--amp-semantic-bg-sunken)] animate-pulse" />
          <div className="h-3 w-2/3 rounded bg-[var(--amp-semantic-bg-sunken)] animate-pulse" />
        </div>
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  return null;
};
