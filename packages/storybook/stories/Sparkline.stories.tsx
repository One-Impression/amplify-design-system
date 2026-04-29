import type { Meta, StoryObj } from '@storybook/react';
import { Sparkline } from '@amplify-ai/ui';

const meta = {
  title: 'Data Viz/Sparkline',
  component: Sparkline,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['line', 'bar', 'area'] },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

const trendData = [12, 18, 14, 22, 28, 25, 32, 38, 35, 42, 48, 56];

export const LineDefault: Story = {
  args: {
    ariaLabel: 'Engagement trend last 12 weeks',
    data: trendData,
    variant: 'line',
    color: '#7c3aed',
  },
};

export const BarVariant: Story = {
  args: {
    ariaLabel: 'Daily deliveries last 12 days',
    data: trendData,
    variant: 'bar',
    color: '#16a34a',
    width: 100,
    height: 32,
  },
};

export const AreaVariant: Story = {
  args: {
    ariaLabel: 'Revenue trend',
    data: trendData,
    variant: 'area',
    color: '#2563eb',
    width: 120,
    height: 36,
  },
};

export const InlineWithMetric: Story = {
  render: () => (
    <div className="flex items-center gap-3 text-[14px]">
      <span className="font-semibold tabular-nums">₹4.2 Cr</span>
      <Sparkline
        ariaLabel="Quarterly revenue trend"
        data={[2.1, 2.4, 2.8, 3.1, 3.5, 3.7, 4.0, 4.2]}
        variant="area"
        color="#16a34a"
      />
      <span className="text-[var(--amp-semantic-status-success,#16a34a)] text-[12px]">+12.4%</span>
    </div>
  ),
};
