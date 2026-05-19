import type { Meta, StoryObj } from '@storybook/react';
import { SignalDot } from '@amplify-ai/ui';

const meta = {
  title: 'Oportunities/SignalDot',
  component: SignalDot,
  tags: ['autodocs'],
  argTypes: {
    size: { control: { type: 'number', min: 6, max: 96, step: 2 } },
    pulse: { control: 'boolean' },
    gradient: { control: 'boolean' },
    live: { control: 'boolean' },
  },
  parameters: {
    backgrounds: {
      default: 'cream',
      values: [
        { name: 'cream', value: '#FDF8F3' },
        { name: 'ink', value: '#15110D' },
      ],
    },
  },
} satisfies Meta<typeof SignalDot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { size: 16 } };
export const Pulse: Story = { args: { size: 20, pulse: true } };
export const Gradient: Story = { args: { size: 24, gradient: true } };
export const Live: Story = { args: { size: 14, live: true } };
export const LargeGradientLive: Story = { args: { size: 28, gradient: true, live: true } };

export const Gallery: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
      <SignalDot size={16} />
      <SignalDot size={20} pulse />
      <SignalDot size={24} gradient />
      <SignalDot size={14} live />
      <SignalDot size={28} gradient live />
    </div>
  ),
};
