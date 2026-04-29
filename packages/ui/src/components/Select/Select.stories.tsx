import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const platforms = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'linkedin', label: 'LinkedIn' },
];

export const Default: Story = {
  args: { label: 'Platform', placeholder: 'Pick one', options: platforms },
};

export const WithSelection: Story = {
  args: { label: 'Platform', value: 'instagram', options: platforms },
};

export const Error: Story = {
  args: {
    label: 'Required field',
    placeholder: 'Pick one',
    error: 'Please choose a platform',
    options: platforms,
  },
};

export const Disabled: Story = {
  args: { label: 'Locked', placeholder: 'Choose…', disabled: true, options: platforms },
};

export const SingleOption: Story = {
  args: {
    label: 'Currency',
    options: [{ value: 'USD', label: 'USD — US Dollar' }],
  },
};

export const ManyOptions: Story = {
  args: {
    label: 'Country',
    placeholder: 'Select a country',
    options: Array.from({ length: 30 }, (_, i) => ({
      value: `country-${i}`,
      label: `Country ${i + 1}`,
    })),
  },
};

export const NoLabel: Story = {
  args: { placeholder: 'Pick one', options: platforms },
};
