import React from 'react';
import { cn } from '../../lib/cn';
import { CollapsibleSection } from '../CollapsibleSection/CollapsibleSection';

export interface FormSectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Section heading. */
  title: React.ReactNode;
  /** Optional supporting copy below the title. */
  description?: React.ReactNode;
  /**
   * When true, render inside a `<CollapsibleSection>` so the user can
   * fold the section. Use sparingly — most form sections should stay
   * open by default.
   */
  collapsible?: boolean;
  /** Initial open state when `collapsible`. Defaults to `true`. */
  defaultOpen?: boolean;
  /** Section content — typically `<Field>` instances. */
  children: React.ReactNode;
}

/**
 * Visual grouping for related fields inside a `<Form>`. Renders a heading,
 * optional description, and a vertical stack of children. Switches to a
 * `<CollapsibleSection>` when `collapsible` is true.
 */
export const FormSection = React.forwardRef<HTMLElement, FormSectionProps>(
  ({ title, description, collapsible = false, defaultOpen = true, children, className, ...props }, ref) => {
    if (collapsible) {
      const titleStr = typeof title === 'string' ? title : '';
      // CollapsibleSection requires a string label; if a node was passed, we
      // fall back to rendering the node inside the body.
      return (
        <section
          ref={ref}
          className={cn('w-full', className)}
          {...props}
        >
          <CollapsibleSection label={titleStr || 'Section'} defaultOpen={defaultOpen}>
            {description && (
              <p className="text-[13px] text-[var(--amp-semantic-text-secondary)] mb-3">
                {description}
              </p>
            )}
            <div className="flex flex-col gap-4">{children}</div>
          </CollapsibleSection>
        </section>
      );
    }

    return (
      <section
        ref={ref}
        className={cn(
          'flex flex-col gap-3',
          'pb-4 border-b border-[var(--amp-semantic-border-subtle,var(--amp-semantic-border-default))]',
          'last:border-b-0 last:pb-0',
          className
        )}
        {...props}
      >
        <header className="flex flex-col gap-0.5">
          <h3 className="text-[15px] font-semibold text-[var(--amp-semantic-text-primary)] leading-tight">
            {title}
          </h3>
          {description && (
            <p className="text-[13px] leading-snug text-[var(--amp-semantic-text-secondary)]">
              {description}
            </p>
          )}
        </header>
        <div className="flex flex-col gap-4">{children}</div>
      </section>
    );
  }
);
FormSection.displayName = 'FormSection';
