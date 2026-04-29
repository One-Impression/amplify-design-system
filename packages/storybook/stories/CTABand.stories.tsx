import type { Meta, StoryObj } from '@storybook/react';
import { CTABand, Button } from '@amplify-ai/ui';

const meta = {
  title: 'Marketing/CTABand',
  component: CTABand,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'accent', 'inverted'] },
    align: { control: 'select', options: ['start', 'center', 'between'] },
  },
} satisfies Meta<typeof CTABand>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    heading: 'Ready to get started?',
    description: 'Launch your first campaign in under 10 minutes.',
    primaryCta: <Button variant="primary">Get started</Button>,
    secondaryCta: <Button variant="ghost">Talk to sales</Button>,
  },
};

export const Accent: Story = {
  args: {
    variant: 'accent',
    heading: 'New: Atmosphere AI',
    description: 'AI-powered insights for your campaigns.',
    primaryCta: <Button variant="primary">Try it now</Button>,
  },
};

export const Inverted: Story = {
  args: {
    variant: 'inverted',
    heading: 'Built for the next decade of marketing',
    description: 'Join 500+ teams already using Amplify.',
    primaryCta: <Button variant="primary">Sign up</Button>,
    secondaryCta: <Button variant="outline">View demo</Button>,
  },
};

export const Centered: Story = {
  args: {
    align: 'center',
    heading: 'One platform. Every campaign.',
    description: 'Discovery, briefs, contracts, payouts. Done.',
    primaryCta: <Button variant="primary">Start free trial</Button>,
  },
};

export const HeadingOnly: Story = {
  args: {
    heading: 'Have questions?',
    primaryCta: <Button variant="primary">Contact us</Button>,
  },
};

export const LongContent: Story = {
  args: {
    heading: 'Replace spreadsheets, agencies, and dashboards with one unified platform',
    description:
      'Amplify combines creator discovery, matching, briefing, contracts, content review, payouts, and ROAS reporting into a single AI-driven workflow.',
    primaryCta: <Button variant="primary">Book a demo</Button>,
    secondaryCta: <Button variant="ghost">Read case studies</Button>,
  },
};
