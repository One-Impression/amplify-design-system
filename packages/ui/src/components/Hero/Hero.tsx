import React from 'react';
import { cn } from '../../lib/cn';
import { useDensity, type Density } from '../../lib/density';

export type HeroVariant = 'centered' | 'split' | 'asymmetric';

export interface HeroProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Optional small label rendered above the headline. */
  eyebrow?: React.ReactNode;
  /** The hero headline — accepts string or rich node. */
  headline: React.ReactNode;
  /** Supporting copy under the headline. */
  description?: React.ReactNode;
  /** Primary call-to-action element (typically a Button). */
  primaryCta?: React.ReactNode;
  /** Secondary CTA element (typically a ghost or outline Button). */
  secondaryCta?: React.ReactNode;
  /** Optional media slot — image, video, illustration. Used in split / asymmetric variants. */
  media?: React.ReactNode;
  /** Visual layout variant. */
  variant?: HeroVariant;
  /** Override ambient density. */
  density?: Density;
}

const densityVerticalPadding: Record<Density, string> = {
  compact: 'py-12 md:py-16',
  comfortable: 'py-16 md:py-24',
  spacious: 'py-24 md:py-32',
};

const densityGap: Record<Density, string> = {
  compact: 'gap-4',
  comfortable: 'gap-6',
  spacious: 'gap-8',
};

export const Hero = React.forwardRef<HTMLElement, HeroProps>(
  (
    {
      eyebrow,
      headline,
      description,
      primaryCta,
      secondaryCta,
      media,
      variant = 'centered',
      density: densityOverride,
      className,
      ...props
    },
    ref
  ) => {
    const ambientDensity = useDensity();
    const density = densityOverride ?? ambientDensity;
    const isCentered = variant === 'centered';
    const isSplit = variant === 'split';
    const isAsymmetric = variant === 'asymmetric';

    const content = (
      <div className={cn('flex flex-col', densityGap[density], isCentered && 'items-center text-center')}>
        {eyebrow && (
          <span
            className={cn(
              'inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold uppercase tracking-wide',
              'bg-[var(--amp-semantic-bg-accent-subtle)] text-[var(--amp-semantic-text-accent)]'
            )}
          >
            {eyebrow}
          </span>
        )}
        <h1
          className={cn(
            'font-bold tracking-tight text-[var(--amp-semantic-text-primary)]',
            'text-[40px] leading-[1.1] sm:text-[48px] md:text-[56px] lg:text-[64px]',
            isCentered && 'max-w-3xl'
          )}
        >
          {headline}
        </h1>
        {description && (
          <p
            className={cn(
              'text-[18px] md:text-[20px] leading-relaxed text-[var(--amp-semantic-text-secondary)]',
              isCentered && 'max-w-2xl'
            )}
          >
            {description}
          </p>
        )}
        {(primaryCta || secondaryCta) && (
          <div
            className={cn(
              'flex flex-wrap items-center gap-3 mt-2',
              isCentered && 'justify-center'
            )}
          >
            {primaryCta}
            {secondaryCta}
          </div>
        )}
      </div>
    );

    return (
      <section
        ref={ref}
        className={cn(
          'w-full px-4 md:px-8 lg:px-12',
          densityVerticalPadding[density],
          className
        )}
        {...props}
      >
        <div className="mx-auto max-w-7xl">
          {isCentered && (
            <div className="flex flex-col items-center">
              {content}
              {media && <div className="mt-12 w-full">{media}</div>}
            </div>
          )}
          {isSplit && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>{content}</div>
              {media && <div className="w-full">{media}</div>}
            </div>
          )}
          {isAsymmetric && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7">{content}</div>
              {media && <div className="lg:col-span-5 w-full">{media}</div>}
            </div>
          )}
        </div>
      </section>
    );
  }
);

Hero.displayName = 'Hero';
