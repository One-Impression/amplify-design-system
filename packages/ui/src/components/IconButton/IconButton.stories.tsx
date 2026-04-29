import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';

const Pencil = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'ghost', 'outline'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
  args: { icon: Pencil, label: 'Edit' },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { variant: 'default' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Outline: Story = { args: { variant: 'outline' } };
export const Disabled: Story = { args: { variant: 'default', disabled: true } };

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <IconButton {...args} size="xs" />
      <IconButton {...args} size="sm" />
      <IconButton {...args} size="md" />
      <IconButton {...args} size="lg" />
    </div>
  ),
};

export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8 }}>
      <IconButton {...args} variant="default" />
      <IconButton {...args} variant="ghost" />
      <IconButton {...args} variant="outline" />
    </div>
  ),
};
