import type { Meta, StoryObj } from '@storybook/react';
import { CreatorIntentCard } from '@one-impression/ui';

const meta = {
  title: 'Oportunities/CreatorIntentCard',
  component: CreatorIntentCard,
  tags: ['autodocs'],
  parameters: {
    backgrounds: {
      default: 'cream',
      values: [
        { name: 'cream', value: '#FDF8F3' },
        { name: 'ink', value: '#15110D' },
      ],
    },
  },
} satisfies Meta<typeof CreatorIntentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleCreator = {
  name: 'Amrita Patel',
  handle: '@amrita.notes',
  niche: 'Slow-luxe lifestyle',
  followers: 128_000,
  avatarGradient: 'linear-gradient(135deg, #E68F47 0%, #7B5BFF 100%)',
};

const sampleIntent = {
  headline:
    'I want to partner with a sleep-tech brand on a 3-part story arc covering wind-down rituals.',
  dateRange: 'Apr 22 – May 14',
  vibe: 'editorial · slow-luxe · brand-led',
  openTo: ['Story', 'Reel', 'IRL'],
};

export const Default: Story = {
  args: {
    creator: sampleCreator,
    intent: sampleIntent,
    aiFitScore: 87,
    onUnlock: () => alert('Unlocked!'),
  },
};

export const WithoutAIScore: Story = {
  args: {
    creator: sampleCreator,
    intent: sampleIntent,
    onUnlock: () => alert('Unlocked!'),
  },
};

export const WithImage: Story = {
  args: {
    creator: {
      ...sampleCreator,
      avatarSrc: 'https://i.pravatar.cc/150?img=47',
    },
    intent: sampleIntent,
    aiFitScore: 73,
    onUnlock: () => alert('Unlocked!'),
  },
};

export const MinimalIntent: Story = {
  args: {
    creator: sampleCreator,
    intent: {
      headline: 'Looking for a coffee brand to collab with this spring.',
      dateRange: 'May',
      vibe: 'casual · organic',
    },
    aiFitScore: 62,
    onUnlock: () => alert('Unlocked!'),
  },
};
