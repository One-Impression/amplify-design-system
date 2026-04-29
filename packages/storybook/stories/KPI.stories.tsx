import type { Meta, StoryObj } from '@storybook/react';
import { KPI } from '@amplify-ai/ui';

const meta = {
  title: 'Data Viz/KPI',
  component: KPI,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['md', 'lg', 'xl'] },
    trend: { control: 'select', options: [undefined, 'up', 'down', 'neutral'] },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof KPI>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RevenueLarge: Story = {
  args: {
    label: 'Quarterly GMV',
    value: '₹11.5 Cr',
    delta: 18.4,
    deltaLabel: 'vs Q3',
    sparkline: [3.2, 4.1, 4.8, 5.6, 6.4, 7.2, 8.1, 9.4, 10.2, 11.5],
    size: 'lg',
  },
};

export const ActiveCampaignsXL: Story = {
  args: {
    label: 'Active Campaigns',
    value: 142,
    delta: 12.5,
    deltaLabel: 'vs last week',
    size: 'xl',
    sparkline: [98, 105, 112, 118, 124, 131, 138, 142],
  },
};

export const ChurnInverted: Story = {
  args: {
    label: 'Brand Churn Rate',
    value: '2.4%',
    delta: -0.8,
    deltaLabel: 'vs last month',
    higherIsBetter: false, // a *decrease* in churn is good → green
    size: 'md',
  },
};

export const NeutralKPI: Story = {
  args: {
    label: 'Total Creators',
    value: '12,840',
    subtitle: 'across India + SEA',
    size: 'md',
  },
};

export const InteractiveKPI: Story = {
  args: {
    label: 'Pending Approvals',
    value: 7,
    delta: 16.7,
    deltaLabel: 'vs yesterday',
    higherIsBetter: false,
    size: 'lg',
    onClick: () => alert('Navigate to approvals'),
  },
};

export const KPIGrid: Story = {
  render: () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KPI
        label="GMV"
        value="₹11.5 Cr"
        delta={18.4}
        deltaLabel="QoQ"
        sparkline={[6, 7, 8, 9, 10, 11.5]}
        size="md"
      />
      <KPI
        label="Active Campaigns"
        value={142}
        delta={12.5}
        deltaLabel="WoW"
        sparkline={[110, 118, 124, 131, 138, 142]}
        size="md"
      />
      <KPI
        label="Avg Engagement"
        value="6.4%"
        delta={-0.3}
        deltaLabel="WoW"
        higherIsBetter={true}
        size="md"
      />
      <KPI
        label="Churn"
        value="2.4%"
        delta={-0.8}
        deltaLabel="MoM"
        higherIsBetter={false}
        size="md"
      />
    </div>
  ),
};
