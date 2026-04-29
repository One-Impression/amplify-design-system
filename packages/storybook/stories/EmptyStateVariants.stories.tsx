import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState, Button } from '@amplify-ai/ui';

const meta = {
  title: 'Components/EmptyState/Variants',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'noData', 'noResults', 'noPermission', 'error-network', 'error-server'],
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoData: Story = {
  args: {
    variant: 'noData',
    action: <Button size="sm">Add data</Button>,
  },
};

export const NoResults: Story = {
  args: {
    variant: 'noResults',
    action: <Button size="sm" variant="ghost">Clear filters</Button>,
  },
};

export const NoPermission: Story = {
  args: {
    variant: 'noPermission',
    action: <Button size="sm" variant="outline">Request access</Button>,
  },
};

export const ErrorNetwork: Story = {
  args: {
    variant: 'error-network',
    action: <Button size="sm">Retry</Button>,
  },
};

export const ErrorServer: Story = {
  args: {
    variant: 'error-server',
    action: <Button size="sm">Reload</Button>,
  },
};

export const VariantOverride: Story = {
  args: {
    variant: 'noResults',
    title: 'No creators match your search',
    description: 'Try a wider price range or different niche.',
    action: <Button size="sm" variant="ghost">Reset filters</Button>,
  },
};
