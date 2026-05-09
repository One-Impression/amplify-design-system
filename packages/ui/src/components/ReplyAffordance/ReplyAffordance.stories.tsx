import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ReplyAffordance } from './ReplyAffordance';

/**
 * `ReplyAffordance` is the hover-revealed pill on a `VariantCard` in the
 * Magic Studio Option-D cockpit
 * (`magic-studio/docs/mockups/option-d.html`, region R9). Click pre-fills
 * the composer with `@V<n> (Gen <m>):`.
 *
 * Mockup region:
 *
 * ```html
 * <div class="variant show-reply">
 *   <button class="reply" title="Reply to this variant — pre-fills composer with @V2 (Gen 3):">↩ Reply</button>
 * </div>
 * ```
 *
 * Spec: `magic-studio/docs/mockups/OPTION_D_SPEC.md` §1 R9, §2 C6, §4 I3–I4.
 */
const meta = {
  title: 'Studio v0/ReplyAffordance',
  component: ReplyAffordance,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    status: { type: 'beta' },
  },
} satisfies Meta<typeof ReplyAffordance>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variantRef: { gen: 2, variant: 3 },
    onClick: () => undefined,
  },
};

/**
 * Letter-keyed variant — when consumers use V<A>, V<B> conventions.
 */
export const LetterKey: Story = {
  args: {
    variantRef: { gen: 4, variant: 'B' },
    onClick: () => undefined,
  },
};

/**
 * Custom label — when a denser UI needs a shorter affordance.
 */
export const CustomLabel: Story = {
  args: {
    variantRef: { gen: 2, variant: 3 },
    onClick: () => undefined,
    label: '↩',
  },
};

/**
 * In-context — pinned top-right of a fake variant card to mimic the
 * mockup's hover-revealed positioning.
 */
export const InVariantCardContext: Story = {
  render: () => (
    <div
      style={{
        position: 'relative',
        width: 268,
        height: 320,
        borderRadius: 12,
        background: 'var(--amp-studio-theme-color-bg-elev)',
        border: '1px solid var(--amp-studio-theme-color-border)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 'var(--amp-spacing-3)',
          right: 'var(--amp-spacing-3)',
        }}
      >
        <ReplyAffordance
          variantRef={{ gen: 3, variant: 2 }}
          onClick={() => undefined}
        />
      </div>
    </div>
  ),
  args: {
    variantRef: { gen: 3, variant: 2 },
    onClick: () => undefined,
  },
};
