import type { Meta, StoryObj } from '@storybook/react';
import { Notification, NotificationList } from './Notification';

const meta = {
  title: 'Components/Notification',
  component: Notification,
  tags: ['autodocs'],
} satisfies Meta<typeof Notification>;

export default meta;
type Story = StoryObj<typeof meta>;

const BellIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

export const Unread: Story = {
  args: {
    title: 'New campaign assigned',
    body: 'Glow Cosmetics — Q4 launch needs your review.',
    icon: BellIcon,
    timestamp: '2m ago',
    read: false,
  },
};

export const Read: Story = {
  args: {
    title: 'Payout completed',
    body: '₹45,000 deposited to your linked account.',
    icon: BellIcon,
    timestamp: 'Yesterday',
    read: true,
  },
};

export const WithLink: Story = {
  args: {
    title: 'Creator accepted brief',
    body: '@nikhil_p accepted Brand X campaign.',
    icon: BellIcon,
    timestamp: '1h ago',
    href: '#',
  },
};

export const ListExample: StoryObj = {
  render: () => (
    <div className="w-[420px]">
      <NotificationList label="Notifications">
        <Notification
          title="New brief from Glow Cosmetics"
          body="Q4 launch — 8 deliverables, ₹2L total"
          icon={BellIcon}
          timestamp="2m ago"
        />
        <Notification
          title="Payout completed"
          body="₹45,000 deposited"
          icon={BellIcon}
          timestamp="Yesterday"
          read
        />
        <Notification
          title="Campaign approved"
          body="Atmosphere Beauty — ready to publish"
          icon={BellIcon}
          timestamp="3d ago"
          read
        />
      </NotificationList>
    </div>
  ),
};
