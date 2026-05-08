import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { StatusBar, type StatusBarItem } from './StatusBar';
import { DensityProvider } from '../../lib/density';

const meta = {
  title: 'Studio v2/StatusBar',
  component: StatusBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    status: { type: 'beta' },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: '100%',
          minHeight: 96,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          background: 'var(--amp-semantic-bg-base)',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatusBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const cockpitItems: StatusBarItem[] = [
  { id: 'model', label: 'Model', value: 'opus-4-7' },
  { id: 'sha', label: 'SHA', value: '87dce7a', variant: 'mono' },
  { id: 'gens', label: 'Gens', value: '12' },
  { id: 'preset', label: 'Preset', value: 'editorial-bold' },
];

export const Default: Story = {
  args: {
    items: cockpitItems,
  },
};

export const Between: Story = {
  args: {
    items: cockpitItems,
    align: 'between',
  },
};

export const WithMonoValues: Story = {
  args: {
    items: [
      { id: 'sha', label: 'SHA', value: 'a1b2c3d4e5f6', variant: 'mono' },
      { id: 'ver', label: 'Version', value: '2.11.0', variant: 'mono' },
      { id: 'env', label: 'Env', value: 'production' },
    ],
  },
};

export const Truncated: Story = {
  args: {
    items: [
      { id: 'model', label: 'Model', value: 'opus-4-7' },
      {
        id: 'path',
        label: 'Path',
        value:
          '/Users/admin/one-impression/amplify-design-system/packages/ui/src/components/StatusBar/StatusBar.tsx',
        truncate: true,
        maxWidth: '20rem',
      },
      { id: 'env', label: 'Env', value: 'production' },
    ],
  },
};

export const RichValue: Story = {
  args: {
    items: [
      {
        id: 'status',
        label: 'Status',
        value: (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span
              aria-hidden="true"
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--amp-semantic-status-success)',
                display: 'inline-block',
              }}
            />
            Live
          </span>
        ),
      },
      { id: 'sha', label: 'SHA', value: '87dce7a', variant: 'mono' },
      { id: 'env', label: 'Env', value: 'production' },
    ],
    align: 'between',
  },
};

export const DensityCompact: Story = {
  render: (args) => (
    <DensityProvider density="compact">
      <StatusBar {...args} />
    </DensityProvider>
  ),
  args: {
    items: cockpitItems,
  },
};

export const DensitySpacious: Story = {
  render: (args) => (
    <DensityProvider density="spacious">
      <StatusBar {...args} />
    </DensityProvider>
  ),
  args: {
    items: cockpitItems,
  },
};

export const SingleItem: Story = {
  args: {
    items: [{ id: 'model', label: 'Model', value: 'opus-4-7' }],
  },
};
