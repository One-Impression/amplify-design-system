import React from 'react';
import { cn } from '../../lib/cn';
import { useDensity, type Density } from '../../lib/density';

export type SectionVariant = 'default' | 'muted' | 'inverted' | 'accent';
export type SectionAlign = 'start' | 'center';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Optional heading rendered at the top of the section. */
  heading?: React.ReactNode;
  /** Optional supporting description shown beneath the heading. */
  description?: React.ReactNode;
  /** Body content. Equivalent to `children`, included for slot clarity. */
  body?: React.ReactNode;
  /** Optional footer slot rendered after the body. */
  footer?: React.ReactNode;
  /** Background / colour treatment. */
  variant?: SectionVariant;
  /** Header alignment — does not affect body. */
  align?: SectionAlign;
  /** Override ambient density. */
  density?: Density;
}

const variantClasses: Record<SectionVariant, string> = {
  default: 'bg-[var(--amp-semantic-bg-surface)] text-[var(--amp-semantic-text-primary)]',
  muted: 'bg-[var(--amp-semantic-bg-sunken)] text-[var(--amp-semantic-text-primary)]',
  // TODO(phase-a): swap to amplify-surface tokens once phase A merges
  inverted: 'bg-neutral-900 text-white',
  accent:
    'bg-[var(--amp-semantic-bg-accent-subtle)] text-[var(--amp-semantic-text-primary)]',
};

const densityVerticalPadding: Record<Density, string> = {
  compact: 'py-8 md:py-12',
  comfortable: 'py-12 md:py-20',
  spacious: 'py-20 md:py-28',
};

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      heading,
      description,
      body,
      footer,
      variant = 'default',
      align = 'start',
      density: densityOverride,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const ambientDensity = useDensity();
    const density = densityOverride ?? ambientDensity;
    const isInverted = variant === 'inverted';
    const isCenter = align === 'center';

    return (
      <section
        ref={ref}
        className={cn(
          'w-full px-4 md:px-8 lg:px-12',
          variantClasses[variant],
          densityVerticalPadding[density],
          className
        )}
        {...props}
      >
        <div className="mx-auto max-w-7xl">
          {(heading || description) && (
            <header
              className={cn(
                'mb-8 md:mb-12 flex flex-col gap-3',
                isCenter && 'items-center text-center'
              )}
            >
              {heading && (
                <h2
                  className={cn(
                    'text-[28px] md:text-[36px] font-bold tracking-tight',
                    isInverted ? 'text-white' : 'text-[var(--amp-semantic-text-primary)]',
                    isCenter && 'max-w-3xl'
                  )}
                >
                  {heading}
                </h2>
              )}
              {description && (
                <p
                  className={cn(
                    'text-[16px] md:text-[18px] leading-relaxed',
                    isInverted
                      ? 'text-white/70'
                      : 'text-[var(--amp-semantic-text-secondary)]',
                    isCenter && 'max-w-2xl'
                  )}
                >
                  {description}
                </p>
              )}
            </header>
          )}
          {(body || children) && <div>{body ?? children}</div>}
          {footer && <div className="mt-8 md:mt-12">{footer}</div>}
        </div>
      </section>
    );
  }
);

Section.displayName = 'Section';
