import type { Meta, StoryObj } from '@storybook/react';
import { MessageBubble, Avatar } from '@amplify-ai/ui';

const meta = {
  title: 'Conversational/MessageBubble',
  component: MessageBubble,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['incoming', 'outgoing', 'system'] },
    status: {
      control: 'select',
      options: [undefined, 'sending', 'sent', 'delivered', 'read', 'failed'],
    },
    tail: { control: 'boolean' },
  },
} satisfies Meta<typeof MessageBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Incoming: Story = {
  args: {
    variant: 'incoming',
    children: 'Hey Penny, can you draft a follow-up to Acme Corp?',
    avatar: <Avatar initials="JD" size="sm" />,
    author: 'James',
    timestamp: '10:42 AM',
  },
};

export const Outgoing: Story = {
  args: {
    variant: 'outgoing',
    children: "On it — I'll send a draft in the next 2 minutes.",
    timestamp: '10:42 AM',
    status: 'read',
  },
};

export const System: Story = {
  args: {
    variant: 'system',
    children: 'James joined the conversation',
  },
};

export const WithReactions: Story = {
  args: {
    variant: 'incoming',
    children: 'Q3 numbers came in 18% above plan.',
    avatar: <Avatar initials="AP" size="sm" />,
    author: 'Aria',
    timestamp: '11:04 AM',
    reactions: [
      { emoji: '🔥', count: 3, reacted: true },
      { emoji: '🎉', count: 2 },
      { emoji: '👏', count: 1 },
    ],
  },
};

export const StatusFailed: Story = {
  args: {
    variant: 'outgoing',
    children: 'Could not deliver — message failed.',
    timestamp: '11:08 AM',
    status: 'failed',
  },
};

export const NoTail: Story = {
  args: {
    variant: 'incoming',
    children: 'Tail disabled — clean rounded bubble.',
    avatar: <Avatar initials="OD" size="sm" />,
    timestamp: '11:10 AM',
    tail: false,
  },
};

export const Thread: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480 }}>
      <MessageBubble variant="system">Conversation started</MessageBubble>
      <MessageBubble
        variant="incoming"
        avatar={<Avatar initials="JD" size="sm" />}
        author="James"
        timestamp="10:42 AM"
      >
        Hey Penny, can you draft a follow-up to Acme Corp?
      </MessageBubble>
      <MessageBubble variant="outgoing" timestamp="10:42 AM" status="read">
        On it — I'll send a draft in the next 2 minutes.
      </MessageBubble>
      <MessageBubble
        variant="incoming"
        avatar={<Avatar initials="JD" size="sm" />}
        timestamp="10:44 AM"
        reactions={[{ emoji: '🙏', count: 1 }]}
      >
        Thanks!
      </MessageBubble>
    </div>
  ),
};
