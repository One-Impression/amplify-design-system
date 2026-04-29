import type { Meta, StoryObj } from '@storybook/react';
import { LineChart } from '@amplify-ai/ui';

const meta = {
  title: 'Data Viz/LineChart',
  component: LineChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Hand-rolled SVG line chart for single or multi-series time-series data. Responsive (100% width), tooltip slot, SR-only data table fallback.',
      },
    },
  },
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const SingleSeriesRevenue: Story = {
  args: {
    ariaLabel: 'Monthly GMV in 2026',
    xAxis: months,
    series: [
      {
        name: 'GMV (₹ Cr)',
        values: [3.2, 3.8, 4.1, 4.6, 5.4, 6.2, 6.8, 7.4, 8.1, 8.9, 9.7, 11.5],
      },
    ],
  },
};

export const MultiSeriesCampaignPerf: Story = {
  args: {
    ariaLabel: 'Campaign performance — impressions vs engagement vs conversions',
    xAxis: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Wk 7', 'Wk 8'],
    series: [
      { name: 'Impressions (K)', values: [120, 180, 240, 310, 380, 420, 510, 580] },
      { name: 'Engagements (K)', values: [12, 22, 28, 41, 49, 58, 71, 84] },
      { name: 'Conversions', values: [340, 580, 720, 980, 1240, 1410, 1820, 2150] },
    ],
  },
};

export const CreatorEngagement: Story = {
  args: {
    ariaLabel: 'Creator engagement rate over 30 days',
    xAxis: Array.from({ length: 30 }, (_, i) => `D${i + 1}`),
    series: [
      {
        name: 'Engagement %',
        values: [
          4.2, 4.5, 4.1, 4.8, 5.2, 5.6, 5.9, 6.1, 5.8, 6.3, 6.7, 7.1, 6.9, 7.4, 7.8, 8.1, 7.6, 8.2,
          8.6, 8.9, 9.1, 8.7, 9.3, 9.6, 9.9, 9.5, 10.1, 10.4, 10.7, 11.0,
        ],
      },
    ],
  },
};

export const BudgetVsActual: Story = {
  args: {
    ariaLabel: 'Brand budget vs actual spend',
    xAxis: months.slice(0, 6),
    series: [
      { name: 'Budget', values: [50, 50, 60, 60, 75, 75], strokeDasharray: '6 4' },
      { name: 'Actual', values: [42, 48, 58, 67, 72, 81] },
    ],
    tooltip: (idx, label, series) => (
      <div className="rounded border border-[var(--amp-semantic-border-default)] bg-[var(--amp-semantic-bg-surface)] p-2 inline-block shadow-sm">
        <p className="font-medium">{label}</p>
        {series.map(s => (
          <p key={s.name}>
            {s.name}: ₹{s.values[idx]}L
          </p>
        ))}
      </div>
    ),
  },
};
