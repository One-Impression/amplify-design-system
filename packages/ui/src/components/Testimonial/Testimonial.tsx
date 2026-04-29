import React from 'react';
import { cn } from '../../lib/cn';

export type TestimonialVariant = 'card' | 'inline' | 'featured';

export interface TestimonialProps extends React.HTMLAttributes<HTMLElement> {
  /** The quote body. Plain string or rich node. */
  quote: React.ReactNode;
  /** Author name. */
  author: string;
  /** Author role / title. */
  role?: string;
  /** Optional avatar — typically an Avatar component or <img>. */
  avatar?: React.ReactNode;
  /** Optional company logo node or image src. */
  companyLogo?: React.ReactNode;
  variant?: TestimonialVariant;
}

const variantWrapperClasses: Record<TestimonialVariant, string> = {
  card:
    'rounded-[16px] border border-[var(--amp-semantic-border-default)] bg-[var(--amp-semantic-bg-surface)] p-6',
  inline: '',
  featured:
    'rounded-[24px] bg-[var(--amp-semantic-bg-accent-subtle)] p-8 md:p-12',
};

const variantQuoteClasses: Record<TestimonialVariant, string> = {
  card: 'text-[16px] leading-relaxed text-[var(--amp-semantic-text-primary)]',
  inline: 'text-[16px] leading-relaxed text-[var(--amp-semantic-text-primary)]',
  featured:
    'text-[22px] md:text-[28px] font-medium leading-snug text-[var(--amp-semantic-text-primary)]',
};

export const Testimonial = React.forwardRef<HTMLElement, TestimonialProps>(
  (
    { quote, author, role, avatar, companyLogo, variant = 'card', className, ...props },
    ref
  ) => {
    return (
      <figure
        ref={ref}
        className={cn(variantWrapperClasses[variant], className)}
        {...props}
      >
        <blockquote className={variantQuoteClasses[variant]}>
          <span aria-hidden="true" className="select-none text-[var(--amp-semantic-text-accent)] mr-1">
            &ldquo;
          </span>
          {quote}
          <span aria-hidden="true" className="select-none text-[var(--amp-semantic-text-accent)] ml-1">
            &rdquo;
          </span>
        </blockquote>
        <figcaption className="mt-5 flex items-center gap-3">
          {avatar && <div className="shrink-0">{avatar}</div>}
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-[var(--amp-semantic-text-primary)] truncate">
              {author}
            </p>
            {role && (
              <p className="text-[13px] text-[var(--amp-semantic-text-secondary)] truncate">
                {role}
              </p>
            )}
          </div>
          {companyLogo && (
            <div className="shrink-0 ml-auto opacity-70 grayscale">
              {typeof companyLogo === 'string' ? (
                <img src={companyLogo} alt="" className="h-6 w-auto" />
              ) : (
                companyLogo
              )}
            </div>
          )}
        </figcaption>
      </figure>
    );
  }
);

Testimonial.displayName = 'Testimonial';
