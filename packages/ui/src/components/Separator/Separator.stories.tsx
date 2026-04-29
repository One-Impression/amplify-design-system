import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './Separator';

const meta = {
  title: 'Components/Separator',
  component: Separator,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <p style={{ margin: 0 }}>Section above</p>
      <Separator />
      <p style={{ margin: 0 }}>Section below</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 32 }}>
      <span>Edit</span>
      <Separator orientation="vertical" />
      <span>Duplicate</span>
      <Separator orientation="vertical" />
      <span>Delete</span>
    </div>
  ),
};

export const InsideCard: Story = {
  render: () => (
    <div style={{ border: '1px solid #e5e5e5', borderRadius: 8, padding: 16, width: 280 }}>
      <p style={{ margin: 0, fontWeight: 600 }}>Spring 2026 Beauty</p>
      <p style={{ margin: '4px 0 0', color: '#666', fontSize: 13 }}>Active · 12 creators</p>
      <Separator />
      <p style={{ margin: '0 0 4px', fontSize: 12, color: '#888' }}>METRICS</p>
      <p style={{ margin: 0 }}>Reach: 1.2M</p>
    </div>
  ),
};
