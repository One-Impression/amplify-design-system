import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    helperText: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Campaign name', placeholder: 'Spring 2026 launch' },
};

export const WithHelper: Story = {
  args: {
    label: 'Brand handle',
    placeholder: '@yourbrand',
    helperText: 'Used in invoices and creator briefs',
  },
};

export const Error: Story = {
  args: {
    label: 'Brand email',
    value: 'not-an-email',
    error: 'Please enter a valid email',
  },
};

export const Disabled: Story = {
  args: { label: 'Locked', value: 'Read only', disabled: true },
};

export const Empty: Story = {
  args: { label: 'Empty state', placeholder: 'Type something...' },
};

export const LongLabel: Story = {
  args: {
    label: 'Quarterly creator-acquisition target (with currency, in USD)',
    placeholder: '50000',
  },
};

export const LongValue: Story = {
  args: {
    label: 'Notes',
    value:
      'A very long pre-filled value that demonstrates how the input handles overflow gracefully without breaking the layout — text simply truncates inside the field.',
  },
};

export const NoLabel: Story = {
  args: { placeholder: 'Search creators…' },
};
