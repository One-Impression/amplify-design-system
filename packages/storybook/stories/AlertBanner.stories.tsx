import type { Meta, StoryObj } from '@storybook/react';
import { AlertBanner } from '@amplify-ai/ui';

const meta = {
  title: 'Recipes/AlertBanner',
  component: AlertBanner,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'select', options: ['info', 'success', 'warning', 'error'] },
    dismissible: { control: 'boolean' },
  },
} satisfies Meta<typeof AlertBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    tone: 'info',
    title: 'Heads up: new dashboard',
    description: 'We rolled out a redesigned analytics dashboard.',
    actionLabel: 'See what’s new',
    dismissible: true,
  },
  render: (args) => (
    <div style={{ width: 720 }}>
      <AlertBanner {...args} />
    </div>
  ),
};

export const Success: Story = {
  args: {
    tone: 'success',
    title: 'Campaign published',
    description: 'Invites sent to 8 creators.',
    actionLabel: 'View campaign',
  },
  render: (args) => (
    <div style={{ width: 720 }}>
      <AlertBanner {...args} />
    </div>
  ),
};

export const Warning: Story = {
  args: {
    tone: 'warning',
    title: 'Wallet balance running low',
    description: 'Recharge in the next 24 hours to keep auto-payouts active.',
    actionLabel: 'Recharge',
    dismissible: true,
  },
  render: (args) => (
    <div style={{ width: 720 }}>
      <AlertBanner {...args} />
    </div>
  ),
};

export const Error: Story = {
  args: {
    tone: 'error',
    title: 'Payment failed',
    description: 'Card was declined. Try a different payment method.',
    actionLabel: 'Update card',
  },
  render: (args) => (
    <div style={{ width: 720 }}>
      <AlertBanner {...args} />
    </div>
  ),
};

export const NoAction: Story = {
  args: {
    tone: 'info',
    title: 'Maintenance window scheduled',
    description: 'Reports will be unavailable Saturday 2–4am IST.',
    dismissible: true,
  },
  render: (args) => (
    <div style={{ width: 720 }}>
      <AlertBanner {...args} />
    </div>
  ),
};

export const TitleOnly: Story = {
  args: {
    tone: 'success',
    title: 'Saved.',
  },
  render: (args) => (
    <div style={{ width: 480 }}>
      <AlertBanner {...args} />
    </div>
  ),
};
