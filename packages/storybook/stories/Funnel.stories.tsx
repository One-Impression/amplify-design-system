import type { Meta, StoryObj } from '@storybook/react';
import { Funnel } from '@amplify-ai/ui';

const meta = {
  title: 'Data Viz/Funnel',
  component: Funnel,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Funnel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CampaignPipeline: Story = {
  args: {
    ariaLabel: 'Campaign pipeline conversion',
    stages: [
      { name: 'Brand sign-ups', value: 4800 },
      { name: 'Briefs created', value: 2640 },
      { name: 'Creators matched', value: 1820 },
      { name: 'Drafts approved', value: 1240 },
      { name: 'Live campaigns', value: 920 },
      { name: 'Reorders', value: 380, description: 'Same-brand repeat' },
    ],
  },
};

export const CreatorOnboarding: Story = {
  args: {
    ariaLabel: 'Creator onboarding funnel',
    stages: [
      { name: 'Profile views', value: 12400 },
      { name: 'Sign-ups', value: 4200 },
      { name: 'KYC complete', value: 2180 },
      { name: 'First brief shipped', value: 1340 },
      { name: 'Reach 5+ deliveries', value: 720 },
    ],
    showConversion: true,
  },
};

export const PaymentRecovery: Story = {
  args: {
    ariaLabel: 'Overdue payment recovery flow',
    stages: [
      { name: 'Invoices raised', value: 880 },
      { name: 'Reminder sent', value: 420 },
      { name: 'Acknowledged', value: 280 },
      { name: 'Paid', value: 210 },
    ],
  },
};
