'use client';

import React from 'react';
import { cn } from '../../lib/cn';
import { Input } from '../Input/Input';

// ───────────────────── Footer.Brand ───────────────────────────────────────
export interface FooterBrandProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Logo node — typically an inline SVG or wordmark image. */
  logo?: React.ReactNode;
  /** Short tagline / value-prop. */
  tagline?: React.ReactNode;
}

const FooterBrand = React.forwardRef<HTMLDivElement, FooterBrandProps>(
  ({ logo, tagline, className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-3', className)} {...props}>
      {logo && (
        <div className="text-[var(--amp-semantic-text-primary)] font-bold text-[18px]">
          {logo}
        </div>
      )}
      {tagline && (
        <p className="text-[14px] leading-relaxed text-[var(--amp-semantic-text-secondary)] max-w-xs">
          {tagline}
        </p>
      )}
      {children}
    </div>
  )
);
FooterBrand.displayName = 'Footer.Brand';

// ───────────────────── Footer.LinkColumn ──────────────────────────────────
export interface FooterLinkColumnProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  /** Children should be `<a>` or link components. */
  children: React.ReactNode;
}

const FooterLinkColumn = React.forwardRef<HTMLDivElement, FooterLinkColumnProps>(
  ({ title, children, className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-3', className)} {...props}>
      <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--amp-semantic-text-secondary)]">
        {title}
      </p>
      <ul className="flex flex-col gap-2" role="list">
        {React.Children.map(children, (child, i) => (
          <li key={i} className="text-[14px] text-[var(--amp-semantic-text-primary)] hover:text-[var(--amp-semantic-text-accent)] transition-colors">
            {child}
          </li>
        ))}
      </ul>
    </div>
  )
);
FooterLinkColumn.displayName = 'Footer.LinkColumn';

// ───────────────────── Footer.Social ──────────────────────────────────────
export interface FooterSocialProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Children should be icon links — e.g. `<a href="..." aria-label="Twitter">...</a>`. */
  children: React.ReactNode;
}

const FooterSocial = React.forwardRef<HTMLDivElement, FooterSocialProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center gap-4 text-[var(--amp-semantic-text-secondary)]', className)}
      {...props}
    >
      {children}
    </div>
  )
);
FooterSocial.displayName = 'Footer.Social';

// ───────────────────── Footer.Newsletter ──────────────────────────────────
export interface FooterNewsletterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSubmit' | 'title'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  placeholder?: string;
  buttonLabel?: string;
  /** Fired on submit with the entered email value. Component does not validate. */
  onSubmit?: (email: string) => void;
}

const FooterNewsletter = React.forwardRef<HTMLDivElement, FooterNewsletterProps>(
  (
    {
      title = 'Stay in the loop',
      description,
      placeholder = 'you@company.com',
      buttonLabel = 'Subscribe',
      onSubmit,
      className,
      ...props
    },
    ref
  ) => {
    const [email, setEmail] = React.useState('');
    const inputId = React.useId();
    const handle = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (onSubmit) onSubmit(email);
    };
    return (
      <div ref={ref} className={cn('flex flex-col gap-3', className)} {...props}>
        {title && (
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--amp-semantic-text-secondary)]">
            {title}
          </p>
        )}
        {description && (
          <p className="text-[14px] leading-relaxed text-[var(--amp-semantic-text-secondary)]">
            {description}
          </p>
        )}
        <form className="flex items-start gap-2" onSubmit={handle}>
          <label htmlFor={inputId} className="sr-only">
            Email address
          </label>
          <div className="flex-1">
            <Input
              id={inputId}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={placeholder}
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={cn(
              'shrink-0 h-10 rounded-[16px] px-4 text-[14px] font-medium',
              'bg-[var(--amp-semantic-accent)] text-[var(--amp-semantic-text-inverse)]',
              'transition-opacity hover:opacity-90',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amp-semantic-border-accent)] focus-visible:ring-offset-2'
            )}
          >
            {buttonLabel}
          </button>
        </form>
      </div>
    );
  }
);
FooterNewsletter.displayName = 'Footer.Newsletter';

// ───────────────────── Footer.Legal ───────────────────────────────────────
export interface FooterLegalProps extends React.HTMLAttributes<HTMLDivElement> {
  copyright?: React.ReactNode;
  /** Children rendered as small inline links. */
  children?: React.ReactNode;
}

const FooterLegal = React.forwardRef<HTMLDivElement, FooterLegalProps>(
  ({ copyright, children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-3',
        'pt-6 mt-10 border-t border-[var(--amp-semantic-border-default)]',
        'text-[13px] text-[var(--amp-semantic-text-secondary)]',
        className
      )}
      {...props}
    >
      {copyright && <p>{copyright}</p>}
      {children && (
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2" role="list">
          {React.Children.map(children, (child, i) => (
            <li key={i} className="hover:text-[var(--amp-semantic-text-accent)] transition-colors">
              {child}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
);
FooterLegal.displayName = 'Footer.Legal';

// ───────────────────── Footer (root) ──────────────────────────────────────
export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  /** Children — typically Footer.Brand + Footer.LinkColumn(s) + Footer.Newsletter, then Footer.Legal. */
  children: React.ReactNode;
  /**
   * Number of grid columns at md+. Default 4. Use 5 for brand + 3 link cols + newsletter.
   */
  columns?: 3 | 4 | 5;
}

const columnsClass: Record<NonNullable<FooterProps['columns']>, string> = {
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-2 lg:grid-cols-5',
};

interface FooterComposite
  extends React.ForwardRefExoticComponent<FooterProps & React.RefAttributes<HTMLElement>> {
  Brand: typeof FooterBrand;
  LinkColumn: typeof FooterLinkColumn;
  Social: typeof FooterSocial;
  Newsletter: typeof FooterNewsletter;
  Legal: typeof FooterLegal;
}

// Split children into "grid" content vs. Footer.Legal so Legal renders below
// the grid spanning the full width.
function partitionChildren(children: React.ReactNode) {
  const gridChildren: React.ReactNode[] = [];
  const legalChildren: React.ReactNode[] = [];
  React.Children.forEach(children, (child) => {
    if (
      React.isValidElement(child) &&
      // displayName comparison keeps this resilient to forwardRef wrappers.
      (child.type as { displayName?: string })?.displayName === 'Footer.Legal'
    ) {
      legalChildren.push(child);
    } else {
      gridChildren.push(child);
    }
  });
  return { gridChildren, legalChildren };
}

const FooterRoot = React.forwardRef<HTMLElement, FooterProps>(
  ({ children, columns = 4, className, ...props }, ref) => {
    const { gridChildren, legalChildren } = partitionChildren(children);
    return (
      <footer
        ref={ref}
        // The "darkens" requirement is honoured via --amp-semantic-bg-sunken.
        className={cn(
          'w-full px-4 md:px-8 lg:px-12 py-12 md:py-16',
          'bg-[var(--amp-semantic-bg-sunken)] text-[var(--amp-semantic-text-primary)]',
          'border-t border-[var(--amp-semantic-border-default)]',
          className
        )}
        {...props}
      >
        <div className="mx-auto max-w-7xl">
          <div className={cn('grid grid-cols-1 sm:grid-cols-2 gap-10', columnsClass[columns])}>
            {gridChildren}
          </div>
          {legalChildren}
        </div>
      </footer>
    );
  }
) as FooterComposite;

FooterRoot.displayName = 'Footer';
FooterRoot.Brand = FooterBrand;
FooterRoot.LinkColumn = FooterLinkColumn;
FooterRoot.Social = FooterSocial;
FooterRoot.Newsletter = FooterNewsletter;
FooterRoot.Legal = FooterLegal;

export { FooterRoot as Footer };
