import type { Meta, StoryObj } from '@storybook/react';
import { StatusTag } from './StatusTag';

const meta = {
  title: 'Components/StatusTag',
  component: StatusTag,
  tags: ['autodocs'],
  argTypes: {
    status: { control: 'select', options: ['healthy', 'warning', 'error', 'offline', 'active', 'pending'] },
    size: { control: 'select', options: ['sm', 'md'] },
    pulse: { control: 'boolean' },
  },
} satisfies Meta<typeof StatusTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Healthy: Story = { args: { status: 'healthy' } };
export const Warning: Story = { args: { status: 'warning' } };
export const Error: Story = { args: { status: 'error' } };
export const Offline: Story = { args: { status: 'offline' } };
export const Active: Story = { args: { status: 'active', pulse: true } };
export const Pending: Story = { args: { status: 'pending' } };

export const CustomLabel: Story = {
  args: { status: 'healthy', label: 'All systems operational' },
};

export const SmallSize: Story = { args: { status: 'healthy', size: 'sm' } };

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {(['healthy', 'warning', 'error', 'offline', 'active', 'pending'] as const).map((s) => (
        <StatusTag key={s} status={s} />
      ))}
    </div>
  ),
};
