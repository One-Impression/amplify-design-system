import type { Meta, StoryObj } from '@storybook/react';
import { ErrorState, Button } from '@amplify-ai/ui';

const meta = {
  title: 'Components/ErrorState',
  component: ErrorState,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['inline', 'block', 'page', 'boundary'],
    },
  },
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inline: Story = {
  args: {
    variant: 'inline',
    message: 'Couldn’t save changes — check your connection.',
  },
};

export const Block: Story = {
  args: {
    variant: 'block',
    title: 'Failed to load creators',
    message: 'Something went wrong while fetching the list. Please retry.',
    action: <Button size="sm">Retry</Button>,
  },
};

export const Page: Story = {
  args: {
    variant: 'page',
    title: 'We hit a snag',
    message: 'The dashboard couldn’t load. Try refreshing — if this keeps happening, contact support.',
    action: <Button>Retry</Button>,
    secondaryAction: <Button variant="ghost">Contact support</Button>,
  },
};

export const Boundary: Story = {
  args: {
    variant: 'boundary',
    error: new Error('Cannot read properties of undefined (reading "creator")'),
    onReset: () => alert('Reset boundary'),
  },
};

export const BoundaryWithCustomAction: Story = {
  args: {
    variant: 'boundary',
    title: 'Crash in dashboard',
    message: 'Render failed because creator was undefined.',
    action: <Button size="sm" variant="primary">Reload page</Button>,
  },
};

export const BlockWithSecondary: Story = {
  args: {
    variant: 'block',
    title: 'Sync failed',
    message: 'We couldn’t sync your campaign data.',
    action: <Button size="sm">Retry sync</Button>,
    secondaryAction: <Button size="sm" variant="ghost">View logs</Button>,
  },
};
