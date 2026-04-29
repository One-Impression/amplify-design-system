import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@amplify-ai/ui';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'brand', 'positive', 'negative', 'warning', 'neutral'],
    },
    size: { control: 'select', options: ['sm', 'md'] },
    dot: { control: 'boolean' },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Default', variant: 'default' },
};

export const Brand: Story = {
  args: { children: 'Active', variant: 'brand', dot: true },
};

export const Positive: Story = {
  args: { children: 'Live', variant: 'positive', dot: true },
};

export const Negative: Story = {
  args: { children: 'Failed', variant: 'negative' },
};

export const Warning: Story = {
  args: { children: 'Pending', variant: 'warning' },
};

export const Small: Story = {
  args: { children: '3', variant: 'brand', size: 'sm' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Badge variant="default">Default</Badge>
      <Badge variant="brand" dot>Brand</Badge>
      <Badge variant="positive" dot>Positive</Badge>
      <Badge variant="negative">Negative</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="neutral">Neutral</Badge>
    </div>
  ),
};
