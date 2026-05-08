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
