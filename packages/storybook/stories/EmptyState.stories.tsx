import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from '@one-impression/ui';

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'No campaigns yet',
    description: 'Create your first campaign to start reaching creators.',
    action: { label: 'Create Campaign', onClick: () => alert('Create!') },
  },
};

export const WithIcon: Story = {
  args: {
    title: 'No results found',
    description: 'Try adjusting your search or filter criteria.',
    icon: <span style={{ fontSize: 24 }}>🔍</span>,
  },
};

export const MinimalNoAction: Story = {
  args: {
    title: 'All caught up!',
    description: 'No pending tasks right now.',
  },
};
