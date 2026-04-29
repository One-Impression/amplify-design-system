import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar';

const meta = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'success', 'error'] },
    value: { control: { type: 'range', min: 0, max: 100 } },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = { args: { value: 0 } };
export const Quarter: Story = { args: { value: 25 } };
export const Half: Story = { args: { value: 50 } };
export const Full: Story = { args: { value: 100, variant: 'success' } };
export const Failed: Story = { args: { value: 80, variant: 'error' } };

export const OverflowClamped: Story = {
  args: { value: 150 },
  parameters: { docs: { description: { story: 'Values >100 are clamped to 100.' } } },
};

export const NegativeClamped: Story = {
  args: { value: -25 },
  parameters: { docs: { description: { story: 'Negative values are clamped to 0.' } } },
};

export const Stack: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
      <ProgressBar value={20} />
      <ProgressBar value={55} variant="success" />
      <ProgressBar value={90} variant="error" />
    </div>
  ),
};
