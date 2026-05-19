import type { Meta, StoryObj } from '@storybook/react';
import { Wordmark } from '@amplify-ai/ui';

const meta = {
  title: 'Oportunities/Wordmark',
  component: Wordmark,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    animated: { control: 'boolean' },
    monochrome: { control: 'boolean' },
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
} satisfies Meta<typeof Wordmark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { size: 'lg' } };
export const Small: Story = { args: { size: 'sm' } };
export const Extra: Story = { args: { size: 'xl' } };
export const Animated: Story = { args: { size: 'xl', animated: true } };
export const Monochrome: Story = { args: { size: 'lg', monochrome: true } };
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Wordmark size="sm" />
      <Wordmark size="md" />
      <Wordmark size="lg" />
      <Wordmark size="xl" />
    </div>
  ),
};
