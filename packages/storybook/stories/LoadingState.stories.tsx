import type { Meta, StoryObj } from '@storybook/react';
import { LoadingState } from '@amplify-ai/ui';

const meta = {
  title: 'Components/LoadingState',
  component: LoadingState,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['spinner', 'dots', 'bar', 'skeleton-page', 'skeleton-table', 'skeleton-card'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof LoadingState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Spinner: Story = {
  args: { variant: 'spinner', size: 'md' },
};

export const Dots: Story = {
  args: { variant: 'dots', size: 'md' },
};

export const Bar: Story = {
  args: { variant: 'bar', size: 'md' },
  render: (args) => (
    <div style={{ width: 320 }}>
      <LoadingState {...args} />
    </div>
  ),
};

export const SkeletonPage: Story = {
  args: { variant: 'skeleton-page' },
  render: (args) => (
    <div style={{ width: 720 }}>
      <LoadingState {...args} />
    </div>
  ),
};

export const SkeletonTable: Story = {
  args: { variant: 'skeleton-table', rows: 6 },
  render: (args) => (
    <div style={{ width: 600 }}>
      <LoadingState {...args} />
    </div>
  ),
};

export const SkeletonCard: Story = {
  args: { variant: 'skeleton-card' },
  render: (args) => (
    <div style={{ width: 360 }}>
      <LoadingState {...args} />
    </div>
  ),
};

export const AllSizes: Story = {
  args: { variant: 'spinner' },
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <LoadingState variant="spinner" size="sm" />
      <LoadingState variant="spinner" size="md" />
      <LoadingState variant="spinner" size="lg" />
    </div>
  ),
};
