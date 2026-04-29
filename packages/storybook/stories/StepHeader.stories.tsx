import type { Meta, StoryObj } from '@storybook/react';
import { StepHeader, Button } from '@amplify-ai/ui';

const meta = {
  title: 'Recipes/StepHeader',
  component: StepHeader,
  tags: ['autodocs'],
} satisfies Meta<typeof StepHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const steps = [
  { label: 'Brief', status: 'completed' as const },
  { label: 'Creators', status: 'active' as const },
  { label: 'Review', status: 'upcoming' as const },
  { label: 'Publish', status: 'upcoming' as const },
];

export const Default: Story = {
  args: {
    steps,
    title: 'Pick your creators',
    description: 'Choose the creators you want to invite to this campaign.',
  },
  render: (args) => (
    <div style={{ width: 800 }}>
      <StepHeader {...args} />
    </div>
  ),
};

export const WithHelp: Story = {
  args: {
    steps,
    title: 'Pick your creators',
    description: 'Choose creators that match the brief.',
    help: <span>Tip: ⌘K opens our match assistant.</span>,
  },
  render: (args) => (
    <div style={{ width: 800 }}>
      <StepHeader {...args} />
    </div>
  ),
};

export const WithRightSlot: Story = {
  args: {
    steps,
    title: 'Pick your creators',
    description: 'Choose 6–10 creators.',
    rightSlot: <Button size="sm" variant="ghost">Save draft</Button>,
  },
  render: (args) => (
    <div style={{ width: 800 }}>
      <StepHeader {...args} />
    </div>
  ),
};

export const FirstStep: Story = {
  args: {
    steps: [
      { label: 'Brief', status: 'active' as const },
      { label: 'Creators', status: 'upcoming' as const },
      { label: 'Review', status: 'upcoming' as const },
    ],
    title: 'Tell us about the campaign',
    description: 'Goals, audience, deliverables, timing.',
  },
  render: (args) => (
    <div style={{ width: 800 }}>
      <StepHeader {...args} />
    </div>
  ),
};

export const FinalStep: Story = {
  args: {
    steps: [
      { label: 'Brief', status: 'completed' as const },
      { label: 'Creators', status: 'completed' as const },
      { label: 'Review', status: 'active' as const },
    ],
    title: 'Ready to publish',
    description: 'Review the brief and confirm to send creator invites.',
    rightSlot: <Button size="sm">Publish</Button>,
  },
  render: (args) => (
    <div style={{ width: 800 }}>
      <StepHeader {...args} />
    </div>
  ),
};
