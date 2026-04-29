import type { Meta, StoryObj } from '@storybook/react';
import { ProgressRing } from '@amplify-ai/ui';

const meta = {
  title: 'Data Viz/ProgressRing',
  component: ProgressRing,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    variant: { control: 'select', options: ['default', 'accent', 'success', 'warning', 'error'] },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ProgressRing>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 68, size: 'lg', variant: 'accent' },
};

export const SizeScale: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      <ProgressRing value={42} size="sm" />
      <ProgressRing value={68} size="md" />
      <ProgressRing value={84} size="lg" />
      <ProgressRing value={92} size="xl" />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      <ProgressRing value={75} size="lg" variant="default" />
      <ProgressRing value={75} size="lg" variant="accent" />
      <ProgressRing value={75} size="lg" variant="success" />
      <ProgressRing value={75} size="lg" variant="warning" />
      <ProgressRing value={75} size="lg" variant="error" />
    </div>
  ),
};

export const CustomCenterSlot: Story = {
  args: {
    value: 78,
    size: 'xl',
    variant: 'success',
    children: (
      <div>
        <p className="text-[10px] uppercase tracking-wide text-[var(--amp-semantic-text-muted)]">
          Brief health
        </p>
        <p className="text-[28px] font-bold leading-none">A−</p>
        <p className="text-[10px] text-[var(--amp-semantic-text-muted)]">78/100</p>
      </div>
    ),
  },
};

export const CampaignCompletion: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ProgressRing value={64} size="lg" variant="accent" />
      <div>
        <p className="text-[14px] font-semibold">Q4 Campaign Goal</p>
        <p className="text-[12px] text-[var(--amp-semantic-text-muted)]">
          ₹7.4 Cr of ₹11.5 Cr delivered • 64% complete
        </p>
      </div>
    </div>
  ),
};
