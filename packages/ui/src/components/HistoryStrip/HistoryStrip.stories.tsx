import type { Meta, StoryObj } from '@storybook/react';
import { HistoryStrip, type GenerationItem } from './HistoryStrip';

const meta = {
  title: 'Studio v2/HistoryStrip',
  component: HistoryStrip,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    status: { type: 'beta' },
  },
} satisfies Meta<typeof HistoryStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

const gen1: GenerationItem = {
  id: 'g1',
  label: 'Gen 1',
  thumbs: [
    { id: 'v1', status: 'ready' },
    { id: 'v2', status: 'ready' },
    { id: 'v3', status: 'win' },
    { id: 'v4', status: 'ready' },
  ],
  summary: '8.2s · V3 selected',
};

const gen2Current: GenerationItem = {
  id: 'g2',
  label: 'Gen 2 · now',
  thumbs: [
    { id: 'v1', status: 'locked' },
    { id: 'v2', status: 'generating' },
    { id: 'v3', status: 'generating' },
  ],
  summary: 'generating…',
  current: true,
};

const gen3Errored: GenerationItem = {
  id: 'g3',
  label: 'Gen 3',
  thumbs: [
    { id: 'v1', status: 'ready' },
    { id: 'v2', status: 'error' },
  ],
  summary: '12.4s · 1 failed',
};

export const Empty: Story = {
  args: {
    generations: [],
  },
};

export const SingleGeneration: Story = {
  args: {
    generations: [{ ...gen1, current: true }],
  },
};

export const FullTimeline: Story = {
  args: {
    generations: [gen1, gen2Current, gen3Errored],
  },
};

export const MixedStates: Story = {
  args: {
    generations: [
      {
        id: 'gx',
        label: 'Gen 1',
        thumbs: [
          { id: 'v1', status: 'ready' },
          { id: 'v2', status: 'win' },
          { id: 'v3', status: 'locked' },
          { id: 'v4', status: 'error' },
        ],
        summary: 'all four states',
        current: true,
      },
    ],
  },
};

export const Interactive: Story = {
  args: {
    generations: [gen1, gen2Current, gen3Errored],
    onSelect: (id) => console.log('select gen', id),
    onThumbSelect: (gid, vid) => console.log('select variant', gid, vid),
  },
};
