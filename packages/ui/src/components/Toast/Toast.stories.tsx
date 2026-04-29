import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';

const meta = {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['success', 'error', 'warning', 'info'] },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: { variant: 'success', message: 'Campaign published successfully' },
};

export const Error: Story = {
  args: { variant: 'error', message: 'Could not save changes — check your connection' },
};

export const Warning: Story = {
  args: { variant: 'warning', message: 'Your subscription expires in 3 days' },
};

export const Info: Story = {
  args: { variant: 'info', message: '12 new creator applications waiting' },
};

export const WithClose: Story = {
  args: {
    variant: 'success',
    message: 'Saved.',
    onClose: () => alert('Toast dismissed'),
  },
};

export const LongMessage: Story = {
  args: {
    variant: 'info',
    message:
      'Your weekly creator report has finished generating. It includes performance metrics, content quality scores, and acquisition recommendations across all 14 active campaigns.',
  },
};
