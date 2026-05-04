import React from 'react';
import { cn } from '../../lib/cn';

export type IconCalloutAlign = 'start' | 'center';

export interface IconCalloutProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Icon node — typically an inline SVG (~24-32px). */
  icon?: React.ReactNode;
  /** Block title. */
  title: React.ReactNode;
  /** Supporting copy. */
  description?: React.ReactNode;
  /** Optional CTA / link element rendered under the description. */
  cta?: React.ReactNode;
  /** Alignment of icon and copy — `start` (left-aligned) or `center`. */
  align?: IconCalloutAlign;
}

export const IconCallout = React.forwardRef<HTMLElement, IconCalloutProps>(
  ({ icon, title, description, cta, align = 'start', className, ...props }, ref) => {
    const isCenter = align === 'center';
    return (
      <article
        ref={ref}
        className={cn(
          'flex flex-col gap-3',
          isCenter && 'items-center text-center',
          className
        )}
        {...props}
      >
        {icon && (
          <div
            className={cn(
              'inline-flex h-11 w-11 items-center justify-center rounded-[10px]',
              'bg-[var(--amp-semantic-bg-accent-subtle)] text-[var(--amp-semantic-text-accent)]',
              'shrink-0'
            )}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
        <h3 className="text-[16px] md:text-[18px] font-semibold leading-snug text-[var(--amp-semantic-text-primary)]">
          {title}
        </h3>
        {description && (
          <p
            className={cn(
              'text-[14px] md:text-[15px] leading-relaxed text-[var(--amp-semantic-text-secondary)]',
              isCenter && 'max-w-sm'
            )}
          >
            {description}
          </p>
        )}
        {cta && <div className="mt-1">{cta}</div>}
      </article>
    );
  }
);

IconCallout.displayName = 'IconCallout';
