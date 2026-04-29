import type { Meta, StoryObj } from '@storybook/react';
import { PieChart } from '@amplify-ai/ui';

const meta = {
  title: 'Data Viz/PieChart',
  component: PieChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PieChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DonutContentMix: Story = {
  args: {
    variant: 'donut',
    ariaLabel: 'Content type mix this quarter',
    data: [
      { name: 'Reels', value: 1240 },
      { name: 'Stories', value: 680 },
      { name: 'Shorts', value: 420 },
      { name: 'Static Posts', value: 220 },
      { name: 'Long-form', value: 80 },
    ],
    centerSlot: (
      <div>
        <p className="text-[10px] uppercase tracking-wide text-[var(--amp-semantic-text-muted)]">
          Total
        </p>
        <p className="text-[20px] font-bold">2,640</p>
      </div>
    ),
  },
};

export const PieRevenueShare: Story = {
  args: {
    variant: 'pie',
    ariaLabel: 'Revenue share by category',
    size: 220,
    data: [
      { name: 'Beauty', value: 4.2 },
      { name: 'Fashion', value: 2.8 },
      { name: 'F&B', value: 1.6 },
      { name: 'Tech', value: 1.1 },
      { name: 'Other', value: 0.7 },
    ],
  },
};

export const DonutCreatorStatus: Story = {
  args: {
    variant: 'donut',
    ariaLabel: 'Creator pipeline status',
    size: 180,
    data: [
      { name: 'Active', value: 142 },
      { name: 'Paused', value: 38 },
      { name: 'Onboarding', value: 22 },
      { name: 'Churned', value: 14 },
    ],
  },
};
