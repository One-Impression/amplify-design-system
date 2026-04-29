import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MarkdownEditor } from '@amplify-ai/ui';

const meta = {
  title: 'Components/Forms/MarkdownEditor',
  component: MarkdownEditor,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    mode: { control: 'select', options: ['split', 'write', 'preview'] },
  },
} satisfies Meta<typeof MarkdownEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE = `# Campaign brief

A great brief should be **clear**, *focused*, and answer:

1. Who is the audience?
2. What is the message?
3. What does success look like?

> Don't write more than one page.

Read the [docs](https://example.com) for examples.

\`\`\`json
{ "objective": "awareness", "budget": 500000 }
\`\`\`
`;

export const SplitMode: Story = {
  args: { defaultValue: SAMPLE, label: 'Brief', mode: 'split' },
};

export const WriteOnly: Story = {
  args: { defaultValue: SAMPLE, label: 'Notes', mode: 'write' },
};

export const PreviewOnly: Story = {
  args: { defaultValue: SAMPLE, label: 'Rendered preview', mode: 'preview' },
};

export const Empty: Story = {
  args: { placeholder: 'Start typing Markdown…', label: 'Empty editor' },
};

export const Controlled: Story = {
  render: (args) => {
    const [text, setText] = useState('# Hello\n\nType here…');
    return (
      <div>
        <MarkdownEditor {...args} value={text} onChange={setText} label="Controlled" />
        <div style={{ marginTop: 12, fontSize: 12, color: '#666' }}>
          {text.length} chars · {text.split(/\s+/).filter(Boolean).length} words
        </div>
      </div>
    );
  },
};

export const WithHelper: Story = {
  args: {
    label: 'Description',
    helperText: 'Tip: Cmd/Ctrl + B for bold, Cmd/Ctrl + I for italic.',
    defaultValue: '*italic* and **bold** with `code`',
  },
};

export const Disabled: Story = {
  args: { label: 'Locked', defaultValue: SAMPLE, disabled: true },
};

export const ShortHeight: Story = {
  args: { label: 'Compact', minHeight: 160, defaultValue: '- one\n- two\n- three' },
};
