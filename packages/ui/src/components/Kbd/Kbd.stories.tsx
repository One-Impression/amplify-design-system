import type { Meta, StoryObj } from '@storybook/react';
import { Kbd } from './Kbd';

const meta = {
  title: 'Components/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
    isMac: { control: 'boolean' },
  },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleKey: Story = {
  args: { children: 'K' },
};

export const ShortcutMac: Story = {
  args: { keys: ['mod', 'K'], isMac: true },
};

export const ShortcutWindows: Story = {
  args: { keys: ['mod', 'K'], isMac: false },
};

export const InContext: Story = {
  render: () => (
    <p className="text-[14px] text-[var(--amp-semantic-text-primary)]">
      Press <Kbd keys={['mod', 'K']} isMac /> to open the command palette, then{' '}
      <Kbd>↵</Kbd> to confirm.
    </p>
  ),
};
