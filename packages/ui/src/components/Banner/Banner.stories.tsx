import type { Meta, StoryObj } from '@storybook/react';
import { Banner } from './Banner';

const meta = {
  title: 'Components/Banner',
  component: Banner,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['info', 'warning', 'error', 'success'] },
    dismissible: { control: 'boolean' },
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Scheduled maintenance',
    message: 'Atmosphere will be briefly unavailable Friday at 02:00 UTC.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Action required',
    message: 'Verify your billing address before your next invoice.',
    dismissible: true,
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Payment failed',
    message: 'We could not process your last payment. Update your card to avoid service interruption.',
  },
};

export const SuccessWithActions: Story = {
  args: {
    variant: 'success',
    message: 'Your campaign is live and visible to creators.',
    actions: (
      <button
        type="button"
        className="text-[13px] font-medium underline text-[var(--amp-semantic-text-primary)]"
      >
        View campaign
      </button>
    ),
    dismissible: true,
  },
};
