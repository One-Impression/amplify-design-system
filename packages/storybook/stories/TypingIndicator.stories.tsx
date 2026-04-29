import type { Meta, StoryObj } from '@storybook/react';
import { TypingIndicator, MessageBubble, Avatar } from '@amplify-ai/ui';

const meta = {
  title: 'Conversational/TypingIndicator',
  component: TypingIndicator,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
    color: { control: 'color' },
  },
} satisfies Meta<typeof TypingIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: { label: 'Penny is typing' },
};

export const Small: Story = {
  args: { size: 'sm', label: 'Aria is typing' },
};

export const Large: Story = {
  args: { size: 'lg' },
};

export const CustomColor: Story = {
  args: { color: '#7C3AED', label: 'Pixel is sketching' },
};

export const InMessageBubble: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <MessageBubble variant="incoming" avatar={<Avatar initials="PE" size="sm" />} author="Penny">
        <TypingIndicator />
      </MessageBubble>
    </div>
  ),
};

export const ReducedMotionFallback: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'When `prefers-reduced-motion: reduce` is set in the OS, dots stop animating and render as static low-opacity dots. Toggle the OS setting to verify.',
      },
    },
  },
  args: { label: 'Reduced-motion safe' },
};
