import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb } from './Breadcrumb';

const meta = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = { args: { items: [{ label: 'Dashboard' }] } };

export const Twolevel: Story = {
  args: {
    items: [
      { label: 'Campaigns', href: '/campaigns' },
      { label: 'Spring 2026' },
    ],
  },
};

export const Deep: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Campaigns', href: '/campaigns' },
      { label: 'Beauty', href: '/campaigns/beauty' },
      { label: 'Spring 2026', href: '/campaigns/beauty/spring-2026' },
      { label: 'Edit' },
    ],
  },
};

export const TruncatingLabels: Story = {
  args: {
    items: [
      { label: 'Long parent section name that wraps', href: '/' },
      { label: 'Another long intermediate label', href: '/x' },
      { label: 'Final very long page title' },
    ],
  },
};

export const NoLinks: Story = {
  args: {
    items: [{ label: 'Settings' }, { label: 'Account' }, { label: 'Profile' }],
  },
};
