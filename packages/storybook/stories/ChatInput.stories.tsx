import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ChatInput, IconButton } from '@amplify-ai/ui';

const meta = {
  title: 'Conversational/ChatInput',
  component: ChatInput,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    minRows: { control: { type: 'number', min: 1, max: 10 } },
    maxRows: { control: { type: 'number', min: 1, max: 12 } },
  },
} satisfies Meta<typeof ChatInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const PaperclipSVG = (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
  </svg>
);

const MicSVG = (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
    <path d="M19 10v2a7 7 0 01-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

export const Default: Story = {
  args: { placeholder: 'Type a message…' },
  render: (args) => (
    <div style={{ width: 480 }}>
      <ChatInput {...args} onSend={(v) => alert(`Sent: ${v}`)} />
    </div>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    const [v, setV] = useState('');
    return (
      <div style={{ width: 480 }}>
        <ChatInput
          {...args}
          value={v}
          onChange={setV}
          onSend={(msg) => {
            alert(`Sent: ${msg}`);
            setV('');
          }}
        />
        <p style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
          Current value: {JSON.stringify(v)}
        </p>
      </div>
    );
  },
};

export const WithSlots: Story = {
  args: {
    placeholder: 'Send a message',
    hint: 'Press Enter to send · Shift+Enter for newline',
    attachSlot: (
      <IconButton aria-label="Attach" variant="ghost" size="sm">
        {PaperclipSVG}
      </IconButton>
    ),
    voiceSlot: (
      <IconButton aria-label="Voice" variant="ghost" size="sm">
        {MicSVG}
      </IconButton>
    ),
  },
  render: (args) => (
    <div style={{ width: 520 }}>
      <ChatInput {...args} onSend={(v) => alert(`Sent: ${v}`)} />
    </div>
  ),
};

export const AutoResize: Story = {
  args: {
    placeholder: 'Type a long message and watch it grow…',
    minRows: 1,
    maxRows: 6,
    defaultValue:
      'This is a longer message.\nIt spans multiple lines.\nThe textarea grows as you type.\nUntil it hits maxRows, then it scrolls.',
  },
  render: (args) => (
    <div style={{ width: 480 }}>
      <ChatInput {...args} onSend={(v) => alert(`Sent: ${v}`)} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    placeholder: 'Penny is offline',
    disabled: true,
    defaultValue: 'You cannot send while disabled.',
  },
  render: (args) => (
    <div style={{ width: 480 }}>
      <ChatInput {...args} />
    </div>
  ),
};

export const WithHint: Story = {
  args: {
    placeholder: 'Ask anything…',
    hint: 'Cmd+Enter to send',
  },
  render: (args) => (
    <div style={{ width: 480 }}>
      <ChatInput {...args} onSend={(v) => alert(`Sent: ${v}`)} />
    </div>
  ),
};
