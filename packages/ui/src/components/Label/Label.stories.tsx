import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Label } from './Label';

const meta = {
  title: 'Forms/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: { status: 'beta' },
  argTypes: {
    required: { control: 'boolean' },
    emphasis: { control: 'radio', options: ['primary', 'secondary'] },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Campaign name', required: false },
};

export const Required: Story = {
  args: { children: 'Email address', required: true },
};

export const Secondary: Story = {
  args: { children: 'Optional note', emphasis: 'secondary' },
};

export const Composed: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
      <Label htmlFor="demo-1" required>
        Brand name
      </Label>
      <input
        id="demo-1"
        placeholder="Type a brand name"
        style={{ height: 40, padding: '0 12px', border: '1px solid #ddd', borderRadius: 16 }}
      />
    </div>
  ),
};
