import React from 'react';
import { cn } from '../../lib/cn';

export type QuoteSize = 'small' | 'medium' | 'large';
export type QuoteAlign = 'start' | 'center';

export interface QuoteProps extends React.HTMLAttributes<HTMLElement> {
  /** Quote body. */
  children: React.ReactNode;
  /** Person being quoted. */
  attribution?: React.ReactNode;
  /** Optional source / role under the attribution. */
  source?: React.ReactNode;
  /** Size variant. */
  size?: QuoteSize;
  /** Alignment. */
  align?: QuoteAlign;
}

const sizeClasses: Record<QuoteSize, string> = {
  small: 'text-[16px] leading-relaxed',
  medium: 'text-[20px] leading-snug',
  large: 'text-[28px] md:text-[32px] leading-snug font-medium',
};

const markSizeClasses: Record<QuoteSize, string> = {
  small: 'text-[24px]',
  medium: 'text-[36px]',
  large: 'text-[56px] md:text-[64px]',
};

export const Quote = React.forwardRef<HTMLElement, QuoteProps>(
  (
    { children, attribution, source, size = 'medium', align = 'start', className, ...props },
    ref
  ) => {
    const isCenter = align === 'center';
    return (
      <figure
        ref={ref}
        className={cn(
          'flex flex-col gap-3',
          isCenter && 'items-center text-center',
          className
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            'leading-none font-serif text-[var(--amp-semantic-text-accent)]',
            markSizeClasses[size]
          )}
        >
          &ldquo;
        </span>
        <blockquote
          className={cn(
            sizeClasses[size],
            'text-[var(--amp-semantic-text-primary)]',
            isCenter && 'max-w-2xl'
          )}
        >
          {children}
        </blockquote>
        {(attribution || source) && (
          <figcaption className="mt-1 flex flex-col gap-0.5">
            {attribution && (
              <span className="text-[14px] font-semibold text-[var(--amp-semantic-text-primary)]">
                — {attribution}
              </span>
            )}
            {source && (
              <span className="text-[13px] text-[var(--amp-semantic-text-secondary)]">
                {source}
              </span>
            )}
          </figcaption>
        )}
      </figure>
    );
  }
);

Quote.displayName = 'Quote';
