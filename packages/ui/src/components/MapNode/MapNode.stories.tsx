import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { MapNode } from './MapNode';

const meta = {
  title: 'Studio v2/MapNode',
  component: MapNode,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    status: { type: 'beta' },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          position: 'relative',
          width: '100%',
          minHeight: 320,
          background: 'var(--amp-semantic-bg-base)',
          padding: 24,
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MapNode>;

export default meta;
type Story = StoryObj<typeof meta>;

const placeholderThumbnail = (
  <div
    style={{
      width: '100%',
      height: '100%',
      background:
        'linear-gradient(135deg, var(--amp-semantic-bg-subtle), var(--amp-semantic-bg-raised))',
    }}
  />
);

export const Live: Story = {
  args: {
    id: 'n-live',
    state: 'live',
    x: 24,
    y: 24,
    label: 'v1 · editorial',
    lensTag: 'editorial',
    scoreLabel: '●● 91',
    scoreVariant: 'good',
    thumbnail: placeholderThumbnail,
  },
};

export const Ready: Story = {
  args: {
    id: 'n-ready',
    state: 'ready',
    x: 24,
    y: 24,
    label: 'v2 · bold',
    lensTag: 'bold',
    scoreLabel: '●● 78',
    scoreVariant: 'neutral',
    thumbnail: placeholderThumbnail,
  },
};

export const Generating: Story = {
  args: {
    id: 'n-generating',
    state: 'generating',
    x: 24,
    y: 24,
    label: 'v3 · minimal',
    lensTag: 'minimal',
  },
};

export const Error: Story = {
  args: {
    id: 'n-error',
    state: 'error',
    x: 24,
    y: 24,
    label: 'v4 · failed',
    lensTag: 'editorial',
    thumbnail: placeholderThumbnail,
    scoreLabel: '— —',
    scoreVariant: 'bad',
  },
};

export const Locked: Story = {
  args: {
    id: 'n-locked',
    state: 'ready',
    x: 24,
    y: 24,
    label: 'v5 · pinned',
    lensTag: 'editorial',
    locked: true,
    scoreLabel: '●● 88',
    scoreVariant: 'good',
    thumbnail: placeholderThumbnail,
  },
};

export const Focus: Story = {
  args: {
    id: 'n-focus',
    state: 'focus',
    x: 24,
    y: 24,
    label: 'v6 · selected',
    lensTag: 'editorial',
    selected: true,
    scoreLabel: '●● 94',
    scoreVariant: 'good',
    thumbnail: placeholderThumbnail,
  },
};

export const Interactive: Story = {
  render: () => {
    const [selectedId, setSelectedId] = React.useState<string | null>('n-1');
    const nodes: Array<{ id: string; x: number; y: number; label: string }> = [
      { id: 'n-1', x: 24, y: 24, label: 'v1' },
      { id: 'n-2', x: 224, y: 24, label: 'v2' },
      { id: 'n-3', x: 424, y: 24, label: 'v3' },
    ];
    return (
      <>
        {nodes.map((n) => (
          <MapNode
            key={n.id}
            id={n.id}
            state={selectedId === n.id ? 'focus' : 'ready'}
            x={n.x}
            y={n.y}
            label={n.label}
            lensTag="editorial"
            scoreLabel="●● 80"
            scoreVariant="neutral"
            selected={selectedId === n.id}
            onClick={() => setSelectedId(n.id)}
            thumbnail={placeholderThumbnail}
          />
        ))}
      </>
    );
  },
  args: {
    id: 'placeholder',
    state: 'ready',
    x: 0,
    y: 0,
  },
};
