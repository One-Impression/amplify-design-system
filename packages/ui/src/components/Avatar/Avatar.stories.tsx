import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Image: Story = {
  args: { src: 'https://i.pravatar.cc/150?img=12', alt: 'Akash P.' },
};

export const Initials: Story = {
  args: { initials: 'AP' },
};

export const FallbackOnImageError: Story = {
  args: { src: 'https://broken.example/missing.jpg', initials: 'AP' },
};

export const Small: Story = {
  args: { initials: 'AP', size: 'sm' },
};

export const Large: Story = {
  args: { initials: 'AP', size: 'lg' },
};

export const Empty: Story = {
  args: {},
};

export const Stack: Story = {
  render: () => (
    <div style={{ display: 'flex' }}>
      {['AP', 'JS', 'MK', 'RD'].map((i, idx) => (
        <div key={i} style={{ marginLeft: idx === 0 ? 0 : -8 }}>
          <Avatar initials={i} />
        </div>
      ))}
    </div>
  ),
};
