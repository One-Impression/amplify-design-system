import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '@one-impression/ui';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined', 'ghost'],
    },
    padding: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
    as: { control: 'select', options: ['div', 'article', 'section', 'li'] },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div>
        <h3 style={{ fontWeight: 600, marginBottom: 4 }}>Campaign Stats</h3>
        <p style={{ color: '#666', fontSize: 14 }}>15 active campaigns this month</p>
      </div>
    ),
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: (
      <div>
        <h3 style={{ fontWeight: 600, marginBottom: 4 }}>Revenue Overview</h3>
        <p style={{ fontSize: 24, fontWeight: 700 }}>$12,450</p>
      </div>
    ),
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: <p>Outlined card for emphasis</p>,
  },
};

export const Clickable: Story = {
  args: {
    variant: 'default',
    onClick: () => alert('Card clicked!'),
    children: <p>Click me — I have hover and active states</p>,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {(['default', 'elevated', 'outlined', 'ghost'] as const).map((v) => (
        <Card key={v} variant={v} padding="md">
          <p style={{ fontWeight: 600 }}>{v}</p>
          <p style={{ fontSize: 12, color: '#888' }}>Card variant</p>
        </Card>
      ))}
    </div>
  ),
};
