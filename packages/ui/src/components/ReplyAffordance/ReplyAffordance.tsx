'use client';

import React from 'react';
import { cn } from '../../lib/cn';

/**
 * ReplyAffordance — hover-revealed pill that appears on a `VariantCard`
 * in the Magic Studio Option-D cockpit
 * (`magic-studio/docs/mockups/option-d.html`, region R9). Click pre-fills
 * the composer with `@V<n> (Gen <m>):` so users can chain a follow-up
 * brief tied to a specific variant.
 *
 * Visibility is owned by the parent `VariantCard`'s hover state — this
 * component only renders the pill itself; the parent wires `display:
 * none` / `display: inline-flex` based on hover. We keep that contract
 * intact: this primitive renders unconditionally and the parent shows /
 * hides it via `data-hovered`-driven CSS or by mounting only on hover.
 *
 * Note from the SPEC (§4 I3–I4): the affordance opens the composer with
 * `@V<n> (Gen <m>):` inserted. The reference syntax is `@V` + variant
 * number + ` (Gen ` + generation number + `):`. Consumers handle that
 * prefill themselves via `onClick(variantRef)`.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface VariantRef {
  /** Generation number, 1-indexed. e.g. `2` → "Gen 2". */
  gen: number;
  /**
   * Variant identifier — typically a 1-indexed slot number ("3" → "V3").
   * Accepts string for letter-keyed variants ("A" / "B") if the consumer
   * uses that convention.
   */
  variant: number | string;
}

export interface ReplyAffordanceProps {
  /** The variant being replied to. */
  variantRef: VariantRef;
  /** Fired on click — receives the same `variantRef`. */
  onClick: (variantRef: VariantRef) => void;
  /** Optional label override. Defaults to `"↩ Reply"`. */
  label?: string;
  /** Optional className passthrough. */
  className?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatRefSyntax = (ref: VariantRef): string =>
  `@V${ref.variant} (Gen ${ref.gen}):`;

// ─── Component ───────────────────────────────────────────────────────────────

export const ReplyAffordance = React.forwardRef<
  HTMLButtonElement,
  ReplyAffordanceProps
>(function ReplyAffordance(
  { variantRef, onClick, label = '↩ Reply', className },
  ref,
) {
  const refSyntax = formatRefSyntax(variantRef);
  const ariaLabel = `Reply to V${variantRef.variant} (Gen ${variantRef.gen}) — pre-fills composer with ${refSyntax}`;

  return (
    <button
      ref={ref}
      type="button"
      data-variant-gen={variantRef.gen}
      data-variant={String(variantRef.variant)}
      data-ref-syntax={refSyntax}
      data-testid="reply-affordance"
      aria-label={ariaLabel}
      title={`Reply to this variant — pre-fills composer with ${refSyntax}`}
      onClick={() => onClick(variantRef)}
      className={cn(
        'inline-flex items-center gap-[var(--amp-spacing-1)]',
        'rounded-full border cursor-pointer',
        'border-[var(--amp-studio-theme-color-border)]',
        'bg-[var(--amp-studio-theme-color-bg-elev)]',
        'text-[var(--amp-studio-theme-color-fg)]',
        'px-[var(--amp-spacing-2)] py-[3px]',
        'text-[var(--amp-font-size-xs)]',
        'transition-[background-color,border-color,box-shadow] duration-[var(--amp-motion-duration-fast)]',
        'motion-reduce:transition-none',
        'hover:border-[var(--amp-semantic-border-accent)]',
        'hover:bg-[var(--amp-studio-theme-color-bg-subtle)]',
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-[var(--amp-semantic-border-focus)]',
        'focus-visible:ring-offset-1',
        className,
      )}
    >
      {label}
    </button>
  );
});

ReplyAffordance.displayName = 'ReplyAffordance';
