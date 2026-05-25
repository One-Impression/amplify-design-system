import type { Meta, StoryObj } from '@storybook/react';
import { AppIconOportunities } from '@one-impression/ui';

const meta = {
  title: 'Oportunities/AppIconOportunities',
  component: AppIconOportunities,
  tags: ['autodocs'],
  argTypes: {
    size: { control: { type: 'number', min: 24, max: 512, step: 8 } },
    dark: { control: 'boolean' },
  },
  parameters: {
    backgrounds: {
      default: 'neutral',
      values: [
        { name: 'cream', value: '#FDF8F3' },
        { name: 'ink', value: '#15110D' },
        { name: 'neutral', value: '#E7E5E4' },
      ],
    },
  },
} satisfies Meta<typeof AppIconOportunities>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { size: 96 } };
export const Dark: Story = { args: { size: 96, dark: true } };
export const Small: Story = { args: { size: 40 } };
export const Large: Story = { args: { size: 192 } };

export const SizeGallery: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <AppIconOportunities size={32} />
      <AppIconOportunities size={48} />
      <AppIconOportunities size={64} />
      <AppIconOportunities size={96} />
      <AppIconOportunities size={128} />
    </div>
  ),
};

export const LightAndDark: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      <AppIconOportunities size={128} />
      <AppIconOportunities size={128} dark />
    </div>
  ),
};
