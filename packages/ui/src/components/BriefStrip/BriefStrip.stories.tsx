import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { BriefStrip, type BriefChipItem } from './BriefStrip';

const meta = {
  title: 'Studio v2/BriefStrip',
  component: BriefStrip,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    status: { type: 'beta' },
  },
} satisfies Meta<typeof BriefStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleChips: BriefChipItem[] = [
  { id: 'g', kind: 'goal', key: 'goal:', value: 'confident editorial' },
  { id: 'a', kind: 'audience', key: 'for:', value: 'returning brands' },
  { id: 'l', kind: 'lock', value: 'serif heading', locked: true },
  { id: 'av', kind: 'avoid', key: 'avoid:', value: 'stock photography' },
  { id: 'r', kind: 'ref', key: 'ref:', value: 'Issue 42' },
  { id: 'd', kind: 'density', key: 'density:', value: 'spacious' },
];

export const Empty: Story = {
  args: {
    chips: [],
  },
};

export const Populated: Story = {
  args: {
    chips: sampleChips,
  },
};

export const WithLockedChips: Story = {
  args: {
    chips: [
      { id: '1', kind: 'goal', key: 'goal:', value: 'launch announcement' },
      { id: '2', kind: 'lock', value: 'brand purple', locked: true },
      { id: '3', kind: 'lock', value: 'logo top-left', locked: true },
    ],
  },
};

export const Expandable: Story = {
  args: {
    chips: sampleChips,
    expandable: true,
  },
};

/**
 * Option-D fidelity baseline — mirrors the brief strip region of the
 * `studio-v2-option-d.html` mockup verbatim. Used as the visual contract
 * Chromatic snapshots against.
 *
 * Mockup HTML region:
 *
 * ```html
 * <div class="d-brief">
 *   <span class="lead">Brief</span>
 *   <span class="d-bchip"><span class="key">goal:</span> confident editorial</span>
 *   <span class="d-bchip"><span class="key">for:</span> returning brands</span>
 *   <span class="d-bchip lock">🔒 keep price column</span>
 *   <span class="d-bchip lock">🔒 keep GST badge</span>
 *   <span class="d-bchip"><span class="key">avoid:</span> tax footer</span>
 *   <span class="d-bchip"><span class="key">refs:</span> Linear pricing · 2 more</span>
 *   <span class="d-bchip"><span class="key">density:</span> cozy</span>
 *   <span class="d-bchip add">+ add</span>
 *   <span class="expand">⤢ expand</span>
 * </div>
 * ```
 *
 * Visual contract:
 * - 11px uppercase tertiary "Brief" label, 7px-rounded chips.
 * - Locked chips render with accent-soft background + lock glyph.
 * - Trailing dashed "+ add" pill, "Expand brief" affordance pinned right.
 */
export const OptionDFidelity: Story = {
  args: {
    chips: [
      { id: 'g', kind: 'goal', key: 'goal:', value: 'confident editorial' },
      { id: 'a', kind: 'audience', key: 'for:', value: 'returning brands' },
      { id: 'l1', kind: 'lock', value: 'keep price column', locked: true },
      { id: 'l2', kind: 'lock', value: 'keep GST badge', locked: true },
      { id: 'av', kind: 'avoid', key: 'avoid:', value: 'tax footer' },
      { id: 'r', kind: 'ref', key: 'refs:', value: 'Linear pricing · 2 more' },
      { id: 'd', kind: 'density', key: 'density:', value: 'cozy' },
    ],
    expandable: true,
  },
};

export const Interactive: Story = {
  render: () => {
    const [chips, setChips] = React.useState<BriefChipItem[]>([
      { id: '1', kind: 'goal', key: 'goal:', value: 'editorial cover' },
      { id: '2', kind: 'audience', key: 'for:', value: 'design leads' },
    ]);
    return (
      <BriefStrip
        chips={chips}
        onChipRemove={(id) => setChips((c) => c.filter((x) => x.id !== id))}
        onParseInput={(text) =>
          setChips((c) => [
            ...c,
            { id: String(Date.now()), kind: 'custom', value: text },
          ])
        }
        expandable
        onExpand={() => undefined}
      />
    );
  },
  args: {
    chips: [],
  },
};
