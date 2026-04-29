import type { Meta, StoryObj } from '@storybook/react';
import { MetricCard } from './MetricCard';

const meta = {
  title: 'Components/MetricCard',
  component: MetricCard,
  tags: ['autodocs'],
  argTypes: {
    iconVariant: { control: 'select', options: ['accent', 'success', 'warning', 'error', 'info'] },
  },
} satisfies Meta<typeof MetricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Active campaigns', value: 14 },
};

export const WithTrendUp: Story = {
  args: {
    label: 'Revenue (this month)',
    value: '$12,450',
    trend: 12.5,
    trendLabel: 'vs last month',
  },
};

export const WithTrendDown: Story = {
  args: {
    label: 'Acceptance rate',
    value: '64%',
    trend: -3.2,
    trendLabel: 'vs last week',
  },
};

export const SuccessVariant: Story = {
  args: {
    label: 'Healthy creators',
    value: 142,
    iconVariant: 'success',
    subtitle: 'No issues in last 7 days',
  },
};

export const WarningVariant: Story = {
  args: {
    label: 'At-risk campaigns',
    value: 3,
    iconVariant: 'warning',
    subtitle: 'Below pace',
  },
};

export const ErrorVariant: Story = {
  args: {
    label: 'Failed payouts',
    value: 1,
    iconVariant: 'error',
    subtitle: 'Bank rejected — retry required',
  },
};

export const HugeNumber: Story = {
  args: { label: 'Total reach', value: '14,592,318' },
};

export const ZeroValue: Story = {
  args: { label: 'Pending approvals', value: 0, subtitle: 'All clear' },
};

export const Grid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      <MetricCard label="Campaigns" value={14} trend={12} iconVariant="accent" />
      <MetricCard label="Creators" value={142} trend={5} iconVariant="success" />
      <MetricCard label="Issues" value={3} trend={-1} iconVariant="warning" />
    </div>
  ),
};
