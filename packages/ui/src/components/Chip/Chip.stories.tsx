import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from './Chip';

const meta = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'selected', 'outline', 'dark'] },
    size: { control: 'select', options: ['sm', 'md'] },
    removable: { control: 'boolean' },
  },
  args: { children: 'Beauty' },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { variant: 'selected' } };
export const Outline: Story = { args: { variant: 'outline' } };
export const Dark: Story = { args: { variant: 'dark' } };
export const Small: Story = { args: { size: 'sm' } };

export const Removable: Story = {
  args: { variant: 'selected', removable: true, onRemove: () => alert('removed') },
};

export const FilterStack: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      <Chip variant="selected" removable onRemove={() => {}}>Beauty</Chip>
      <Chip variant="selected" removable onRemove={() => {}}>Lifestyle</Chip>
      <Chip variant="default">Tech</Chip>
      <Chip variant="default">Fashion</Chip>
      <Chip variant="default">Food</Chip>
    </div>
  ),
};
