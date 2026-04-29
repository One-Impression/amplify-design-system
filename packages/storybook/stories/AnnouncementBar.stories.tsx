import type { Meta, StoryObj } from '@storybook/react';
import { AnnouncementBar } from '@amplify/ui';

const meta = {
  title: 'Marketing/AnnouncementBar',
  component: AnnouncementBar,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'accent', 'inverted'] },
    dismissible: { control: 'boolean' },
  },
} satisfies Meta<typeof AnnouncementBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { message: 'New: Atmosphere AI is live. Try it free for 30 days.' },
};

export const WithCta: Story = {
  args: {
    message: 'Black Friday deal — 30% off all plans.',
    cta: (
      <a href="#" style={{ textDecoration: 'underline', fontWeight: 600 }}>
        Learn more →
      </a>
    ),
  },
};

export const Dismissible: Story = {
  args: {
    message: 'Maintenance scheduled for Sunday 2am UTC.',
    dismissible: true,
  },
};

export const Accent: Story = {
  args: {
    variant: 'accent',
    message: 'You are previewing the new design system.',
    dismissible: true,
  },
};

export const Inverted: Story = {
  args: {
    variant: 'inverted',
    message: 'New release available — v2.1.0',
    cta: (
      <a href="#" style={{ textDecoration: 'underline', fontWeight: 600, color: 'inherit' }}>
        Read changelog
      </a>
    ),
    dismissible: true,
  },
};

export const LongMessage: Story = {
  args: {
    message:
      'Heads up — we are migrating to a new authentication provider on Saturday between 10pm and 11pm UTC. You may need to sign in again.',
    dismissible: true,
  },
};
