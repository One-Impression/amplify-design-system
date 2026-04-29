import type { Meta, StoryObj } from '@storybook/react';
import { ActionCard } from '@amplify-ai/ui';

const meta = {
  title: 'Recipes/ActionCard',
  component: ActionCard,
  tags: ['autodocs'],
} satisfies Meta<typeof ActionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const SparkIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m12 3-1.9 5.8L4 10.5l4.6 1.6L10 18l1.4-5.9L16 10.5l-5.7-1.7Z" />
  </svg>
);

export const Default: Story = {
  args: {
    icon: SparkIcon,
    title: 'Create your first campaign',
    description: 'Pick a goal, tap a few creators, and we’ll handle the rest.',
    actionLabel: 'New campaign',
    onAction: () => alert('New campaign'),
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <ActionCard {...args} />
    </div>
  ),
};

export const Secondary: Story = {
  args: {
    icon: SparkIcon,
    title: 'Connect a brand',
    description: 'Wire up a brand to share campaign data automatically.',
    actionLabel: 'Connect',
    actionVariant: 'secondary',
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <ActionCard {...args} />
    </div>
  ),
};

export const NoAction: Story = {
  args: {
    icon: SparkIcon,
    title: 'Coming soon',
    description: 'Multi-brand reporting will be available next quarter.',
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <ActionCard {...args} />
    </div>
  ),
};

export const Outline: Story = {
  args: {
    icon: SparkIcon,
    title: 'Browse templates',
    description: 'Pick from 30+ proven campaign templates.',
    actionLabel: 'Browse',
    actionVariant: 'outline',
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <ActionCard {...args} />
    </div>
  ),
};

export const Grid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 320px)', gap: 16 }}>
      <ActionCard icon={SparkIcon} title="Spark a script" description="AI-generated brief in seconds." actionLabel="Try it" />
      <ActionCard icon={SparkIcon} title="Match creators" description="Find creators that fit your brief." actionLabel="Match" />
      <ActionCard icon={SparkIcon} title="Publish & track" description="Live deliverables and metrics." actionLabel="Open" />
    </div>
  ),
};
