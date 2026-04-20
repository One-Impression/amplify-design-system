import React from 'react';
import { cn } from '../../lib/cn';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  variant?: ToastVariant;
  message: string;
  onClose?: () => void;
  className?: string;
}

const variantBorderColors: Record<ToastVariant, string> = {
  success: 'border-l-[var(--amp-semantic-status-success)]',
  error: 'border-l-[var(--amp-semantic-status-error)]',
  warning: 'border-l-[var(--amp-semantic-status-warning)]',
  info: 'border-l-[var(--amp-semantic-status-info)]',
};

const variantIcons: Record<ToastVariant, React.ReactNode> = {
  success: (
    <svg className="w-4 h-4 text-[var(--amp-semantic-status-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-4 h-4 text-[var(--amp-semantic-status-error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg className="w-4 h-4 text-[var(--amp-semantic-status-warning)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-4 h-4 text-[var(--amp-semantic-status-info)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export const Toast: React.FC<ToastProps> = ({
  variant = 'info',
  message,
  onClose,
  className,
}) => {
  return (
    <div
      role="alert"
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-[16px] border-l-4',
        'bg-[var(--amp-semantic-bg-surface)] border border-[var(--amp-semantic-border-default)]',
        'shadow-lg',
        variantBorderColors[variant],
        className
      )}
    >
      {variantIcons[variant]}
      <p className="flex-1 text-[14px] text-[var(--amp-semantic-text-primary)]">{message}</p>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="text-[var(--amp-semantic-text-muted)] hover:text-[var(--amp-semantic-text-primary)] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};
