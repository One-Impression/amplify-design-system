import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { AnimatedNumber, Button } from '@amplify-ai/ui';

const meta = {
  title: 'Motion/AnimatedNumber',
  component: AnimatedNumber,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'number' } },
    duration: { control: { type: 'number', min: 100, max: 5000, step: 100 } },
    animateOnView: { control: 'boolean' },
  },
} satisfies Meta<typeof AnimatedNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 1245, duration: 1200 },
  render: (args) => (
    <span style={{ fontSize: 48, fontWeight: 600 }}>
      <AnimatedNumber {...args} />
    </span>
  ),
};

export const Currency: Story = {
  args: {
    value: 28499,
    duration: 1500,
    format: (n) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
  },
  render: (args) => (
    <span style={{ fontSize: 48, fontWeight: 600, color: '#10B981' }}>
      <AnimatedNumber {...args} />
    </span>
  ),
};

export const Decimals: Story = {
  args: { value: 98.76, duration: 1500, format: (n) => n.toFixed(2) + '%' },
  render: (args) => (
    <span style={{ fontSize: 48, fontWeight: 600 }}>
      <AnimatedNumber {...args} />
    </span>
  ),
};

export const Click: Story = {
  render: () => {
    const [v, setV] = useState(0);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 48, fontWeight: 600 }}>
          <AnimatedNumber value={v} duration={800} />
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button onClick={() => setV((x) => x + 100)} variant="secondary">+100</Button>
          <Button onClick={() => setV((x) => x + 1000)} variant="secondary">+1000</Button>
          <Button onClick={() => setV(0)} variant="ghost">Reset</Button>
        </div>
      </div>
    );
  },
};

export const OnViewport: Story = {
  args: { value: 50000, animateOnView: true, duration: 1500 },
  render: (args) => (
    <div>
      <p style={{ height: 320, color: '#888' }}>Scroll down ↓</p>
      <span style={{ fontSize: 56, fontWeight: 700 }}>
        <AnimatedNumber {...args} format={(n) => Math.round(n).toLocaleString()} />
      </span>
      <p style={{ marginTop: 8, color: '#888' }}>creators reached</p>
    </div>
  ),
};

export const ReducedMotion: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Under `prefers-reduced-motion: reduce`, the number jumps immediately to its target value with no tween.',
      },
    },
  },
  args: { value: 9999, duration: 1500 },
  render: (args) => (
    <span style={{ fontSize: 48, fontWeight: 600 }}>
      <AnimatedNumber {...args} />
    </span>
  ),
};
