import type { Meta, StoryObj } from '@storybook/react';
import { MetricGrid } from '@amplify-ai/ui';

const meta = {
  title: 'Recipes/MetricGrid',
  component: MetricGrid,
  tags: ['autodocs'],
  argTypes: {
    columns: { control: 'select', options: [2, 3, 4, 5, 6] },
  },
} satisfies Meta<typeof MetricGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const fourMetrics = [
  { label: 'Active campaigns', value: 12, trend: 8.4 },
  { label: 'Reach (M)', value: '14.6', trend: 12.1 },
  { label: 'Engagement', value: '4.2%', trend: -1.6 },
  { label: 'Spend', value: '₹18.4L', trend: 6.0 },
];

export const FourColumns: Story = {
  args: { metrics: fourMetrics, columns: 4 },
  render: (args) => (
    <div style={{ width: 1080 }}>
      <MetricGrid {...args} />
    </div>
  ),
};

export const ThreeColumns: Story = {
  args: { metrics: fourMetrics.slice(0, 3), columns: 3 },
  render: (args) => (
    <div style={{ width: 800 }}>
      <MetricGrid {...args} />
    </div>
  ),
};

export const TwoColumns: Story = {
  args: { metrics: fourMetrics.slice(0, 2), columns: 2 },
  render: (args) => (
    <div style={{ width: 540 }}>
      <MetricGrid {...args} />
    </div>
  ),
};

export const FiveColumns: Story = {
  args: {
    metrics: [
      ...fourMetrics,
      { label: 'New creators', value: 24, trend: 22.0 },
    ],
    columns: 5,
  },
  render: (args) => (
    <div style={{ width: 1280 }}>
      <MetricGrid {...args} />
    </div>
  ),
};

export const TightGap: Story = {
  args: { metrics: fourMetrics, columns: 4, gapClassName: 'gap-2' },
  render: (args) => (
    <div style={{ width: 1080 }}>
      <MetricGrid {...args} />
    </div>
  ),
};
