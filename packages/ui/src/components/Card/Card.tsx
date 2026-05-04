import React from 'react';
import { cn } from '../../lib/cn';

/**
 * Card — composable surface primitive.
 *
 * Provides a single canonical Card component with named slots:
 *   <Card>
 *     <Card.Header />
 *     <Card.Media />
 *     <Card.Body />
 *     <Card.Footer />
 *     <Card.Actions />
 *   </Card>
 *
 * The legacy compatibility members (`CardHeader`, `CardTitle`, `CardDescription`,
 * `CardContent`, `CardFooter`) remain exported and behave identically to v1 so
 * downstream products do not regress.
 *
 * The 7 specialised cards (ContentTypeCard, ScriptPreviewCard, GoalCard,
 * PackageCard, MetricCard, WalletCard, CollapsibleCard) are now thin preset
 * wrappers on top of this primitive — see component-status.json
 * (`replacedBy: "Card"`) for the migration hint surfaced to Pixel.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type CardVariant = 'default' | 'elevated' | 'interactive' | 'outlined' | 'ghost';

/**
 * Card padding tokens.
 *
 * - v2 names: `compact | default | comfortable` (recommended)
 * - v1 names: `none | sm | md | lg` (still supported for backward compat;
 *   `sm` ≡ `compact`, `md` ≡ `default`, `lg` ≡ `comfortable`, `none` is unique)
 */
export type CardPadding =
  | 'none'
  | 'sm'
  | 'md'
  | 'lg'
  | 'compact'
  | 'default'
  | 'comfortable';

export type CardHover = 'interactive' | 'static';

type AnyTag = keyof React.JSX.IntrinsicElements;

export interface CardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  variant?: CardVariant;
  padding?: CardPadding;
  /**
   * Hover behaviour. When omitted, hover lift is enabled automatically if the
   * card has an `onClick` handler or the `as="button"` polymorphic tag.
   */
  hover?: CardHover;
  /**
   * Polymorphic root tag. Defaults to `"div"`. Use `"button"` to render the
   * entire card as a native button (and inherit interactive a11y for free).
   */
  as?: AnyTag;
  children: React.ReactNode;
}

export interface CardSlotProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Optional title rendered as the primary heading inside the header. */
  title?: React.ReactNode;
  /** Optional secondary line under the title. */
  subtitle?: React.ReactNode;
  /** Optional icon / avatar / leading visual rendered to the left. */
  icon?: React.ReactNode;
  /** Optional chip / badge / pill rendered to the right. */
  badge?: React.ReactNode;
  /** Override children — when provided, takes precedence over the slot props. */
  children?: React.ReactNode;
}

// Backward-compat aliases — these are the v1 subcomponent prop names.
export type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  children: React.ReactNode;
};
export type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement> & {
  children: React.ReactNode;
};
export type CardContentProps = CardSlotProps;
export type CardFooterProps = CardSlotProps;

// ─── Visual tokens ───────────────────────────────────────────────────────────

const variantClasses: Record<CardVariant, string> = {
  default:
    'border border-[var(--amp-semantic-border-default)] bg-[var(--amp-semantic-bg-surface)]',
  elevated:
    'bg-[var(--amp-semantic-bg-surface)] shadow-lg border border-[var(--amp-semantic-border-default)]',
  interactive:
    'bg-[var(--amp-semantic-bg-surface)] border border-[var(--amp-semantic-border-default)]',
  outlined: 'bg-transparent border border-[var(--amp-semantic-border-default)]',
  ghost: 'bg-transparent border-none',
};

// Map both v1 and v2 padding names to the same Tailwind classes.
const paddingClasses: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  compact: 'p-3',
  default: 'p-4',
  comfortable: 'p-6',
};

const hoverClasses = 'cursor-pointer hover:shadow-lg transition-shadow duration-150';
const focusClasses =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--amp-semantic-accent,#6531FF)]/40';

// ─── Card root ───────────────────────────────────────────────────────────────

const CardRoot = React.forwardRef<HTMLElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hover,
      as,
      onClick,
      onKeyDown,
      className,
      children,
      role,
      tabIndex,
      ...rest
    },
    ref,
  ) => {
    // Derive interactivity. `interactive` variant or any `onClick` / `as=button`
    // implies the card is a click target.
    const isClickable =
      typeof onClick === 'function' || variant === 'interactive' || as === 'button';
    const isHover = hover ?? (isClickable ? 'interactive' : 'static');

    // Decide a11y defaults for non-button polymorphic roots.
    const Tag = (as ?? 'div') as AnyTag;
    const isNativeButton = Tag === 'button';

    const a11yProps: Record<string, unknown> = {};
    if (isClickable && !isNativeButton) {
      a11yProps.role = role ?? 'button';
      a11yProps.tabIndex = tabIndex ?? 0;
      a11yProps.onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick?.(event as unknown as React.MouseEvent<HTMLElement>);
        }
      };
    } else {
      if (role !== undefined) a11yProps.role = role;
      if (tabIndex !== undefined) a11yProps.tabIndex = tabIndex;
      if (onKeyDown) a11yProps.onKeyDown = onKeyDown;
    }

    const classes = cn(
      'rounded-[16px]',
      variantClasses[variant],
      paddingClasses[padding],
      isClickable && isHover === 'interactive' && hoverClasses,
      isClickable && focusClasses,
      className,
    );

    return React.createElement(
      Tag as string,
      {
        ref,
        className: classes,
        onClick,
        ...a11yProps,
        ...rest,
      },
      children,
    );
  },
);
CardRoot.displayName = 'Card';

// ─── Slots ───────────────────────────────────────────────────────────────────

/**
 * Card.Header — title + subtitle + optional icon and badge.
 *
 * Two usage modes:
 *   1. Slot-driven: `<Card.Header title="…" subtitle="…" badge={…} />`
 *   2. Free-form children (legacy v1 behaviour). Pass children to render any
 *      content; the structured props are ignored.
 */
const CardHeaderImpl = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, icon, badge, children, className, ...props }, ref) => {
    if (children !== undefined) {
      return (
        <div ref={ref} className={cn('flex flex-col gap-1.5 pb-3', className)} {...props}>
          {children}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('flex items-start gap-3 pb-3', className)} {...props}>
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          {title && (
            <h3 className="text-[16px] font-semibold text-[var(--amp-semantic-text-primary)] truncate">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-[14px] text-[var(--amp-semantic-text-secondary)]">{subtitle}</p>
          )}
        </div>
        {badge && <div className="flex-shrink-0">{badge}</div>}
      </div>
    );
  },
);
CardHeaderImpl.displayName = 'Card.Header';

const CardTitleImpl = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-[16px] font-semibold text-[var(--amp-semantic-text-primary)]',
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  ),
);
CardTitleImpl.displayName = 'Card.Title';

const CardDescriptionImpl = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-[14px] text-[var(--amp-semantic-text-secondary)]', className)}
      {...props}
    >
      {children}
    </p>
  ),
);
CardDescriptionImpl.displayName = 'Card.Description';

/** Card.Media — full-width media slot (image / video / iframe). */
const CardMediaImpl = React.forwardRef<HTMLDivElement, CardSlotProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative overflow-hidden rounded-[12px] mb-3', className)}
      {...props}
    >
      {children}
    </div>
  ),
);
CardMediaImpl.displayName = 'Card.Media';

/** Card.Body — main content area. Alias for v1 `CardContent`. */
const CardBodyImpl = React.forwardRef<HTMLDivElement, CardSlotProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('py-2', className)} {...props}>
      {children}
    </div>
  ),
);
CardBodyImpl.displayName = 'Card.Body';

/**
 * Card.Footer — meta info, timestamps, supplementary content. Renders a top
 * divider by default to separate from the body.
 */
const CardFooterImpl = React.forwardRef<HTMLDivElement, CardSlotProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center pt-3 border-t border-[var(--amp-semantic-border-default)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
CardFooterImpl.displayName = 'Card.Footer';

/** Card.Actions — buttons row, right-aligned by default. */
const CardActionsImpl = React.forwardRef<HTMLDivElement, CardSlotProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-end gap-2 pt-3', className)}
      {...props}
    >
      {children}
    </div>
  ),
);
CardActionsImpl.displayName = 'Card.Actions';

// ─── Composite export ────────────────────────────────────────────────────────

type CardComponent = React.ForwardRefExoticComponent<
  CardProps & React.RefAttributes<HTMLElement>
> & {
  Header: typeof CardHeaderImpl;
  Title: typeof CardTitleImpl;
  Description: typeof CardDescriptionImpl;
  Media: typeof CardMediaImpl;
  Body: typeof CardBodyImpl;
  Content: typeof CardBodyImpl;
  Footer: typeof CardFooterImpl;
  Actions: typeof CardActionsImpl;
};

export const Card = CardRoot as CardComponent;
Card.Header = CardHeaderImpl;
Card.Title = CardTitleImpl;
Card.Description = CardDescriptionImpl;
Card.Media = CardMediaImpl;
Card.Body = CardBodyImpl;
Card.Content = CardBodyImpl; // alias for v1 naming
Card.Footer = CardFooterImpl;
Card.Actions = CardActionsImpl;

// ─── Backward-compat top-level exports ───────────────────────────────────────
//
// v1 of this file exported these as separate top-level symbols. Products import
// them as `import { CardHeader, CardTitle, ... } from '@amplify-ai/ui'`. Keep
// them exported and pointed at the same implementations.

export const CardHeader = CardHeaderImpl;
export const CardTitle = CardTitleImpl;
export const CardDescription = CardDescriptionImpl;
export const CardContent = CardBodyImpl;
export const CardFooter = CardFooterImpl;
export const CardMedia = CardMediaImpl;
export const CardBody = CardBodyImpl;
export const CardActions = CardActionsImpl;
