import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    side: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Top: Story = {
  args: { side: 'top', content: 'Edit campaign', children: <button>Hover me</button> },
};

export const Bottom: Story = {
  args: { side: 'bottom', content: 'Open in new tab', children: <button>Hover me</button> },
};

export const Left: Story = {
  args: { side: 'left', content: 'Quick action', children: <button>Hover me</button> },
};

export const Right: Story = {
  args: { side: 'right', content: 'More info', children: <button>Hover me</button> },
};

export const LongContent: Story = {
  args: {
    content:
      'This tooltip has substantially more content than usual to test how line-wrapping behaves in the floating layer.',
    children: <button>Hover for details</button>,
  },
};

export const OnIconOnly: Story = {
  args: {
    content: 'Settings',
    children: (
      <button aria-label="Settings" style={{ width: 32, height: 32 }}>
        ⚙
      </button>
    ),
  },
};
