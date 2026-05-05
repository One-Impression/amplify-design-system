import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { MapEdge } from './MapEdge';

const meta = {
  title: 'Studio v2/MapEdge',
  component: MapEdge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    status: { type: 'beta' },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: 480,
          height: 240,
          background: 'var(--amp-semantic-bg-base)',
          padding: 24,
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 480 240">
          <Story />
        </svg>
      </div>
    ),
  ],
} satisfies Meta<typeof MapEdge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DashedIdle: Story = {
  args: {
    fromX: 40,
    fromY: 40,
    toX: 440,
    toY: 200,
  },
};

export const ActiveSolid: Story = {
  args: {
    fromX: 40,
    fromY: 40,
    toX: 440,
    toY: 200,
    active: true,
    dashed: false,
  },
};

export const ActiveDashed: Story = {
  args: {
    fromX: 40,
    fromY: 40,
    toX: 440,
    toY: 200,
    active: true,
    dashed: true,
  },
};

export const Horizontal: Story = {
  args: {
    fromX: 40,
    fromY: 120,
    toX: 440,
    toY: 120,
  },
};

export const Network: Story = {
  render: () => {
    const points = [
      { x: 60, y: 60 },
      { x: 240, y: 40 },
      { x: 420, y: 80 },
      { x: 240, y: 180 },
      { x: 80, y: 200 },
    ];
    const edges: Array<[number, number, boolean]> = [
      [0, 1, true],
      [1, 2, false],
      [1, 3, false],
      [3, 4, false],
      [0, 4, false],
    ];
    return (
      <>
        {edges.map(([a, b, active], i) => (
          <MapEdge
            key={i}
            fromX={points[a].x}
            fromY={points[a].y}
            toX={points[b].x}
            toY={points[b].y}
            active={active}
            dashed={!active}
          />
        ))}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={6}
            fill="var(--amp-semantic-bg-raised)"
            stroke="var(--amp-semantic-border-accent)"
            strokeWidth={1.5}
          />
        ))}
      </>
    );
  },
  args: {
    fromX: 0,
    fromY: 0,
    toX: 100,
    toY: 100,
  },
};
