import type { Meta, StoryObj } from '@storybook/react';
import { Hero, Button } from '@amplify/ui';

const meta = {
  title: 'Marketing/Hero',
  component: Hero,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['centered', 'split', 'asymmetric'] },
    density: { control: 'select', options: ['compact', 'comfortable', 'spacious'] },
  },
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

const placeholderMedia = (
  <div
    style={{
      aspectRatio: '16 / 10',
      borderRadius: 16,
      background:
        'linear-gradient(135deg, rgba(101, 49, 255, 0.15), rgba(101, 49, 255, 0.05))',
      border: '1px solid rgba(0,0,0,0.06)',
    }}
  />
);

export const Centered: Story = {
  args: {
    variant: 'centered',
    eyebrow: 'New',
    headline: 'Run influencer campaigns at scale',
    description:
      'Amplify connects you with thousands of vetted creators and runs your campaigns end-to-end.',
    primaryCta: <Button variant="primary">Get started</Button>,
    secondaryCta: <Button variant="ghost">View pricing</Button>,
  },
};

export const Split: Story = {
  args: {
    variant: 'split',
    eyebrow: 'Q2 launch',
    headline: 'Marketing copilot for modern brands',
    description: 'Generate briefs, match creators, and launch in minutes — not weeks.',
    primaryCta: <Button variant="primary">Book a demo</Button>,
    secondaryCta: <Button variant="outline">Learn more</Button>,
    media: placeholderMedia,
  },
};

export const Asymmetric: Story = {
  args: {
    variant: 'asymmetric',
    headline: 'AI-native creator marketing',
    description:
      'Brief once, run everywhere. From discovery to delivery, Amplify automates the long tail.',
    primaryCta: <Button variant="primary">Start free trial</Button>,
    media: placeholderMedia,
  },
};

export const NoEyebrow: Story = {
  args: {
    variant: 'centered',
    headline: 'Simple, fast, beautiful',
    description: 'Built for teams that move quickly.',
    primaryCta: <Button variant="primary">Get started</Button>,
  },
};

export const HeadlineOnly: Story = {
  args: {
    variant: 'centered',
    headline: 'Less, but better.',
  },
};

export const LongContent: Story = {
  args: {
    variant: 'split',
    eyebrow: 'Featured launch',
    headline:
      'A full-stack platform for influencer-led brand growth, built for the next decade of marketing',
    description:
      'From discovery and matching to contracts, briefs, content review, payouts, and ROAS reporting — Amplify is the operating system for performance-driven creator marketing across every region.',
    primaryCta: <Button variant="primary">Talk to sales</Button>,
    secondaryCta: <Button variant="ghost">Watch overview</Button>,
    media: placeholderMedia,
  },
};

export const CompactDensity: Story = {
  args: {
    variant: 'centered',
    density: 'compact',
    headline: 'Compact density hero',
    description: 'Tighter vertical rhythm for dense pages.',
    primaryCta: <Button variant="primary">Continue</Button>,
  },
};

export const SpaciousDensity: Story = {
  args: {
    variant: 'centered',
    density: 'spacious',
    headline: 'Spacious density hero',
    description: 'More breathing room for marquee landing pages.',
    primaryCta: <Button variant="primary">Continue</Button>,
  },
};
