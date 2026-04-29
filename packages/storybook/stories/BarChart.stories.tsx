import type { Meta, StoryObj } from '@storybook/react';
import { BarChart } from '@amplify-ai/ui';

const meta = {
  title: 'Data Viz/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VerticalCampaigns: Story = {
  args: {
    ariaLabel: 'Top 8 campaigns by GMV',
    xAxis: ['Nykaa', 'Sugar', 'Mamaearth', 'Boat', 'Plum', 'Wow', 'Lakme', 'MyGlamm'],
    series: [{ name: 'GMV (₹L)', values: [124, 98, 87, 76, 64, 51, 48, 42] }],
  },
};

export const HorizontalCreators: Story = {
  args: {
    layout: 'horizontal',
    ariaLabel: 'Top creators by deliveries this quarter',
    xAxis: ['Nikhil', 'Priya', 'Aanchal', 'Rohan', 'Tara', 'Vikram'],
    series: [{ name: 'Deliveries', values: [42, 38, 35, 28, 24, 21] }],
  },
};

export const StackedRevenueMix: Story = {
  args: {
    layout: 'stacked',
    ariaLabel: 'Quarterly revenue mix by content type',
    xAxis: ['Q1', 'Q2', 'Q3', 'Q4'],
    series: [
      { name: 'Reels', values: [180, 220, 280, 340] },
      { name: 'Stories', values: [80, 95, 110, 130] },
      { name: 'Shorts', values: [45, 60, 75, 95] },
      { name: 'Posts', values: [30, 35, 38, 42] },
    ],
  },
};

export const GroupedBudgetVsActual: Story = {
  args: {
    layout: 'grouped',
    ariaLabel: 'Monthly budget vs actual spend',
    xAxis: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    series: [
      { name: 'Budget', values: [50, 50, 60, 60, 75, 75] },
      { name: 'Actual', values: [42, 48, 58, 67, 72, 81] },
    ],
  },
};
