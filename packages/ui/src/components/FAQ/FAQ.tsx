'use client';

import React from 'react';
import { cn } from '../../lib/cn';

export interface FAQItem {
  /** Stable ID — used for ARIA and as a React key. Auto-generated if omitted. */
  id?: string;
  /** Question text. Plain string preferred for SEO. */
  question: string;
  /** Answer body. Plain string preferred for SEO; rich nodes are allowed but
   * only the string form (or React nodes that stringify cleanly) is included
   * in the JSON-LD payload. */
  answer: React.ReactNode;
}

export type FAQMode = 'single' | 'multi';

export interface FAQProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  items: FAQItem[];
  /** Optional title rendered above the list (h2). */
  title?: React.ReactNode;
  /**
   * Single = only one item open at a time (auto-collapses siblings).
   * Multi = any combination open. Default `single`.
   */
  mode?: FAQMode;
  /** Optionally start with one or more items pre-opened. Use IDs from `items`. */
  defaultOpenIds?: string[];
  /**
   * Emit a `schema.org/FAQPage` JSON-LD `<script>` tag inline. Default `true`.
   * Critical for SEO. Set to false if a parent already emits the schema.
   */
  emitJsonLd?: boolean;
}

function plainTextOf(node: React.ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(plainTextOf).join('');
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    return plainTextOf(props.children);
  }
  return '';
}

export const FAQ = React.forwardRef<HTMLElement, FAQProps>(
  (
    {
      items,
      title,
      mode = 'single',
      defaultOpenIds,
      emitJsonLd = true,
      className,
      ...props
    },
    ref
  ) => {
    const idBase = React.useId();
    const resolved = React.useMemo(
      () => items.map((it, i) => ({ ...it, id: it.id ?? `${idBase}-faq-${i}` })),
      [items, idBase]
    );

    const [openIds, setOpenIds] = React.useState<Set<string>>(
      () => new Set(defaultOpenIds ?? [])
    );

    const toggle = React.useCallback(
      (id: string) => {
        setOpenIds((prev) => {
          const next = new Set(prev);
          if (next.has(id)) {
            next.delete(id);
          } else {
            if (mode === 'single') next.clear();
            next.add(id);
          }
          return next;
        });
      },
      [mode]
    );

    const jsonLd = React.useMemo(() => {
      if (!emitJsonLd) return null;
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: resolved.map((it) => ({
          '@type': 'Question',
          name: it.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: plainTextOf(it.answer),
          },
        })),
      };
    }, [resolved, emitJsonLd]);

    return (
      <section
        ref={ref}
        className={cn('w-full', className)}
        {...props}
      >
        {title && (
          <h2 className="text-[24px] md:text-[32px] font-bold tracking-tight text-[var(--amp-semantic-text-primary)] mb-6">
            {title}
          </h2>
        )}
        <ul className="flex flex-col gap-3" role="list">
          {resolved.map((item) => {
            const isOpen = openIds.has(item.id!);
            const headerId = `${item.id}-header`;
            const panelId = `${item.id}-panel`;
            return (
              <li
                key={item.id}
                className={cn(
                  'rounded-[12px] border border-[var(--amp-semantic-border-default)]',
                  'bg-[var(--amp-semantic-bg-surface)]'
                )}
              >
                <h3 className="m-0">
                  <button
                    id={headerId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(item.id!)}
                    className={cn(
                      'flex w-full items-center justify-between gap-4 px-4 py-3 text-left',
                      'text-[15px] md:text-[16px] font-medium text-[var(--amp-semantic-text-primary)]',
                      'transition-colors hover:bg-[var(--amp-semantic-bg-accent-subtle)]',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--amp-semantic-border-accent)]',
                      isOpen ? 'rounded-t-[12px]' : 'rounded-[12px]'
                    )}
                  >
                    <span>{item.question}</span>
                    <svg
                      className={cn(
                        'h-4 w-4 shrink-0 text-[var(--amp-semantic-text-secondary)] transition-transform duration-200',
                        isOpen && 'rotate-180'
                      )}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  hidden={!isOpen}
                  className={cn(
                    'border-t border-[var(--amp-semantic-border-default)] px-4 py-3',
                    'text-[14px] md:text-[15px] leading-relaxed text-[var(--amp-semantic-text-secondary)]'
                  )}
                >
                  {item.answer}
                </div>
              </li>
            );
          })}
        </ul>
        {jsonLd && (
          <script
            type="application/ld+json"
            // JSON-LD must be raw, not React-escaped.
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
      </section>
    );
  }
);

FAQ.displayName = 'FAQ';
