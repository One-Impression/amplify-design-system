import type { Meta, StoryObj } from '@storybook/react';
import { PricingTable, Button, type PricingTier } from '@amplify-ai/ui';

const meta = {
  title: 'Marketing/PricingTable',
  component: PricingTable,
  tags: ['autodocs'],
} satisfies Meta<typeof PricingTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseTiers: PricingTier[] = [
  {
    name: 'Starter',
    price: '$49',
    billingPeriod: '/ month',
    description: 'For small teams getting started.',
    features: [
      { label: 'Up to 5 active campaigns' },
      { label: '100 creator matches / month' },
      { label: 'Email support' },
      { label: 'Custom integrations', included: false },
    ],
    cta: <Button variant="outline">Choose Starter</Button>,
  },
  {
    name: 'Pro',
    price: '$199',
    billingPeriod: '/ month',
    description: 'Most popular plan for growing brands.',
    features: [
      { label: 'Unlimited campaigns' },
      { label: '1,000 creator matches / month' },
      { label: 'Priority support' },
      { label: 'Custom integrations' },
    ],
    cta: <Button variant="primary">Choose Pro</Button>,
    highlighted: true,
    badge: 'Most popular',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For organisations with custom needs.',
    features: [
      { label: 'Unlimited everything' },
      { label: 'Dedicated CSM' },
      { label: 'SSO + advanced security' },
      { label: 'Custom SLAs' },
    ],
    cta: <Button variant="outline">Contact sales</Button>,
  },
];

export const Default: Story = { args: { tiers: baseTiers, caption: 'All prices in USD. Cancel anytime.' } };

export const TwoTiers: Story = { args: { tiers: baseTiers.slice(0, 2) } };

export const FourTiers: Story = {
  args: {
    tiers: [
      ...baseTiers.slice(0, 2),
      {
        name: 'Business',
        price: '$499',
        billingPeriod: '/ month',
        description: 'For mid-market brands.',
        features: [
          { label: 'Unlimited campaigns' },
          { label: '5,000 matches / month' },
          { label: 'SSO' },
        ],
        cta: <Button variant="outline">Choose Business</Button>,
      },
      baseTiers[2],
    ],
  },
};

export const NoHighlight: Story = {
  args: { tiers: baseTiers.map((t) => ({ ...t, highlighted: false, badge: undefined })) },
};

export const WithoutBilling: Story = {
  args: {
    tiers: baseTiers.map((t) => ({ ...t, billingPeriod: undefined })),
  },
};

export const LongFeatureList: Story = {
  args: {
    tiers: baseTiers.map((t) => ({
      ...t,
      features: [
        ...t.features,
        { label: 'Audit logs' },
        { label: 'Webhooks' },
        { label: 'API access' },
        { label: 'Custom branding', included: t.name !== 'Starter' },
      ],
    })),
  },
};
