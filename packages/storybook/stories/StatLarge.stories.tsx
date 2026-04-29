import type { Meta, StoryObj } from '@storybook/react';
import { StatLarge } from '@amplify-ai/ui';

const meta = {
  title: 'Marketing/StatLarge',
  component: StatLarge,
  tags: ['autodocs'],
  argTypes: {
    align: { control: 'select', options: ['start', 'center'] },
    trend: { control: 'select', options: [undefined, 'up', 'down', 'flat'] },
  },
} satisfies Meta<typeof StatLarge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '$12.4M',
    label: 'GMV processed last quarter',
    description: 'Total gross merchandise volume run through Amplify-managed campaigns.',
  },
};

export const WithTrend: Story = {
  args: {
    value: '40%',
    label: 'Average ROAS improvement',
    trend: 'up',
    trendValue: '+12.4%',
    trendLabel: 'vs last quarter',
  },
};

export const Down: Story = {
  args: {
    value: '2.1d',
    label: 'Time to launch a campaign',
    trend: 'down',
    trendValue: '-65%',
    trendLabel: 'faster than industry average',
  },
};

export const Centered: Story = {
  args: {
    align: 'center',
    value: '500+',
    label: 'Brand teams',
  },
};

export const Grid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
      <StatLarge value="500+" label="Brand teams" />
      <StatLarge value="50K" label="Vetted creators" />
      <StatLarge value="$12.4M" label="GMV processed" />
    </div>
  ),
};

export const NoDescription: Story = { args: { value: '99.99%', label: 'Uptime SLA' } };

export const FlatTrend: Story = {
  args: {
    value: '0',
    label: 'P0 incidents',
    trend: 'flat',
    trendValue: 'No change',
    trendLabel: 'last 12 months',
  },
};
