import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from '@amplify/ui';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['text', 'rectangular', 'circular'] },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: { variant: 'text', width: '60%' },
};

export const Rectangular: Story = {
  args: { variant: 'rectangular', width: 200, height: 120 },
};

export const Circular: Story = {
  args: { variant: 'circular', width: 48, height: 48 },
};

export const CardLoading: Story = {
  render: () => (
    <div style={{ width: 300, padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
      <Skeleton variant="text" width="40%" />
      <div style={{ height: 8 }} />
      <Skeleton variant="rectangular" height={24} width="60%" />
      <div style={{ height: 12 }} />
      <Skeleton variant="text" width="80%" />
      <div style={{ height: 4 }} />
      <Skeleton variant="text" width="65%" />
    </div>
  ),
};

export const AvatarWithText: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Skeleton variant="circular" width={40} height={40} />
      <div>
        <Skeleton variant="text" width={120} />
        <div style={{ height: 4 }} />
        <Skeleton variant="text" width={80} />
      </div>
    </div>
  ),
};
