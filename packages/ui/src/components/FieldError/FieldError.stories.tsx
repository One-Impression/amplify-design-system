import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { FieldError } from './FieldError';

const meta = {
  title: 'Forms/FieldError',
  component: FieldError,
  tags: ['autodocs'],
  parameters: { status: 'beta' },
} satisfies Meta<typeof FieldError>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Please enter a valid email address' },
};

export const Long: Story = {
  args: {
    children:
      'Campaign budget must be at least $500 and cannot exceed your wallet balance of $2,340.50 — top up your wallet or lower the budget to proceed.',
  },
};

export const Empty: Story = {
  // FieldError renders nothing when children is empty
  args: { children: '' },
};
