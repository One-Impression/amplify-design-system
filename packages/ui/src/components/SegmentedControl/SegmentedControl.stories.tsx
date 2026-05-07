import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { SegmentedControl, type SegmentedControlOption } from './SegmentedControl';
import { DensityProvider } from '../../lib/density';

const meta = {
  title: 'Studio v2/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    status: { type: 'beta' },
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

type Mode = 'grid' | 'map' | 'list';

const modeOptions: SegmentedControlOption<Mode>[] = [
  { value: 'grid', label: 'Grid' },
  { value: 'map', label: 'Map' },
  { value: 'list', label: 'List' },
];

const GridIcon = () => (
  <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const MapIcon = () => (
  <svg
    width={12}
    height={12}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path d="M9 20l-5.5-2V4L9 6m0 14l6-2m-6 2V6m6 12l5.5 2V6L15 4m0 14V4M9 6l6-2" />
  </svg>
);

const ListIcon = () => (
  <svg
    width={12}
    height={12}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </svg>
);

const modeOptionsWithIcons: SegmentedControlOption<Mode>[] = [
  { value: 'grid', label: 'Grid', icon: <GridIcon /> },
  { value: 'map', label: 'Map', icon: <MapIcon /> },
  { value: 'list', label: 'List', icon: <ListIcon /> },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState<Mode>('grid');
    return (
      <SegmentedControl<Mode>
        value={value}
        options={modeOptions}
        onChange={setValue}
        ariaLabel="View mode"
      />
    );
  },
  args: {
    value: 'grid',
    options: modeOptions,
    onChange: () => undefined,
    ariaLabel: 'View mode',
  },
};

export const WithIcons: Story = {
  render: () => {
    const [value, setValue] = React.useState<Mode>('map');
    return (
      <SegmentedControl<Mode>
        value={value}
        options={modeOptionsWithIcons}
        onChange={setValue}
        ariaLabel="View mode"
      />
    );
  },
  args: {
    value: 'grid',
    options: modeOptionsWithIcons,
    onChange: () => undefined,
    ariaLabel: 'View mode',
  },
};

export const TwoOption: Story = {
  render: () => {
    const [value, setValue] = React.useState<'grid' | 'map'>('grid');
    const opts: SegmentedControlOption<'grid' | 'map'>[] = [
      { value: 'grid', label: 'Grid', icon: <GridIcon /> },
      { value: 'map', label: 'Map', icon: <MapIcon /> },
    ];
    return (
      <SegmentedControl<'grid' | 'map'>
        value={value}
        options={opts}
        onChange={setValue}
        ariaLabel="View mode"
      />
    );
  },
  args: {
    value: 'grid',
    options: modeOptions,
    onChange: () => undefined,
    ariaLabel: 'View mode',
  },
};

export const Small: Story = {
  render: () => {
    const [value, setValue] = React.useState<Mode>('grid');
    return (
      <SegmentedControl<Mode>
        value={value}
        options={modeOptions}
        onChange={setValue}
        ariaLabel="View mode"
        size="sm"
      />
    );
  },
  args: {
    value: 'grid',
    options: modeOptions,
    onChange: () => undefined,
    ariaLabel: 'View mode',
    size: 'sm',
  },
};

export const Disabled: Story = {
  args: {
    value: 'grid',
    options: modeOptions,
    onChange: () => undefined,
    ariaLabel: 'View mode',
    disabled: true,
  },
};

export const DensityCompact: Story = {
  render: () => {
    const [value, setValue] = React.useState<Mode>('grid');
    return (
      <DensityProvider density="compact">
        <SegmentedControl<Mode>
          value={value}
          options={modeOptions}
          onChange={setValue}
          ariaLabel="View mode"
          size="md"
        />
      </DensityProvider>
    );
  },
  args: {
    value: 'grid',
    options: modeOptions,
    onChange: () => undefined,
    ariaLabel: 'View mode',
  },
};
