import React from 'react';
import { cn } from '../../lib/cn';

export interface CaseStudyStat {
  /** Hero value, pre-formatted (e.g. "3.2x", "₹1.2Cr", "+87%"). */
  value: React.ReactNode;
  /** Short label, e.g. "ROAS lift". */
  label: React.ReactNode;
}

export interface CaseStudyCardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Customer brand logo — typically an <img> or inline SVG. Rendered prominently at the top. */
  customerLogo?: React.ReactNode;
  /** Pull quote / headline summary of the story. */
  quote: React.ReactNode;
  /** 2-3 stat cards. Recommended length: 2 or 3. */
  stats?: CaseStudyStat[];
  /** Customer contact / spokesperson name. */
  customerName: string;
  /** Customer role / title (e.g. "Head of Growth, Acme"). */
  customerRole?: string;
  /** Optional small company logo for the footer (different from `customerLogo`). */
  companyLogo?: React.ReactNode;
  /** Optional CTA element — typically rendered as a "Read story" link. */
  cta?: React.ReactNode;
  /** Make the whole card a link target. */
  href?: string;
  /** Visual emphasis — `featured` adds a stronger surface and accent border. */
  variant?: 'default' | 'featured';
}

const variantWrapper: Record<NonNullable<CaseStudyCardProps['variant']>, string> = {
  default:
    'border-[var(--amp-semantic-border-default)] bg-[var(--amp-semantic-bg-surface)]',
  featured:
    'border-[var(--amp-semantic-border-accent)] bg-[var(--amp-semantic-bg-accent-subtle)] shadow-md',
};

export const CaseStudyCard = React.forwardRef<HTMLElement, CaseStudyCardProps>(
  (
    {
      customerLogo,
      quote,
      stats,
      customerName,
      customerRole,
      companyLogo,
      cta,
      href,
      variant = 'default',
      className,
      ...props
    },
    ref
  ) => {
    const content = (
      <>
        {customerLogo && (
          <div className="mb-5 flex h-8 items-center text-[var(--amp-semantic-text-primary)]">
            {customerLogo}
          </div>
        )}
        <blockquote
          className={cn(
            'text-[18px] md:text-[20px] leading-snug font-medium text-[var(--amp-semantic-text-primary)]'
          )}
        >
          <span aria-hidden="true" className="select-none text-[var(--amp-semantic-text-accent)] mr-1">
            &ldquo;
          </span>
          {quote}
          <span aria-hidden="true" className="select-none text-[var(--amp-semantic-text-accent)] ml-1">
            &rdquo;
          </span>
        </blockquote>

        {stats && stats.length > 0 && (
          <ul
            className={cn(
              'mt-6 grid gap-3',
              stats.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
            )}
          >
            {stats.map((s, i) => (
              <li
                key={i}
                className={cn(
                  'rounded-[12px] border border-[var(--amp-semantic-border-default)]',
                  'bg-[var(--amp-semantic-bg-surface)] p-3'
                )}
              >
                <p className="text-[20px] md:text-[24px] font-bold leading-tight text-[var(--amp-semantic-text-primary)] tabular-nums">
                  {s.value}
                </p>
                <p className="mt-1 text-[12px] uppercase tracking-wide text-[var(--amp-semantic-text-secondary)]">
                  {s.label}
                </p>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-[var(--amp-semantic-text-primary)] truncate">
              {customerName}
            </p>
            {customerRole && (
              <p className="text-[13px] text-[var(--amp-semantic-text-secondary)] truncate">
                {customerRole}
              </p>
            )}
          </div>
          {companyLogo && (
            <div className="shrink-0 ml-auto h-6 opacity-70 grayscale flex items-center">
              {companyLogo}
            </div>
          )}
        </div>

        {cta && <div className="mt-5">{cta}</div>}
      </>
    );

    const wrapperClass = cn(
      'group relative block w-full text-left',
      'rounded-[20px] border p-6 md:p-8',
      'transition-[transform,box-shadow,border-color] duration-200',
      'hover:shadow-lg hover:-translate-y-0.5 hover:border-[var(--amp-semantic-border-accent)]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amp-semantic-border-accent)]',
      variantWrapper[variant],
      className
    );

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={wrapperClass}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }
    return (
      <article ref={ref} className={wrapperClass} {...props}>
        {content}
      </article>
    );
  }
);

CaseStudyCard.displayName = 'CaseStudyCard';
