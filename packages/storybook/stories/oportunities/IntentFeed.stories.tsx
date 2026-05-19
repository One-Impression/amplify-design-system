import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { IntentFeed, type CreatorIntentCardProps, type IntentFeedFilters } from '@amplify-ai/ui';

const meta = {
  title: 'Oportunities/IntentFeed',
  component: IntentFeed,
  tags: ['autodocs'],
  parameters: {
    backgrounds: {
      default: 'cream',
      values: [
        { name: 'cream', value: '#FDF8F3' },
        { name: 'ink', value: '#15110D' },
      ],
    },
    layout: 'fullscreen',
  },
} satisfies Meta<typeof IntentFeed>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleCards: CreatorIntentCardProps[] = [
  {
    creator: {
      name: 'Amrita Patel',
      handle: '@amrita.notes',
      niche: 'Slow-luxe lifestyle',
      followers: 128_000,
      avatarGradient: 'linear-gradient(135deg, #E68F47 0%, #7B5BFF 100%)',
    },
    intent: {
      headline: 'Wind-down rituals × sleep-tech brand — 3-part arc.',
      dateRange: 'Apr 22 – May 14',
      vibe: 'editorial · slow-luxe',
      openTo: ['Story', 'Reel'],
    },
    aiFitScore: 87,
  },
  {
    creator: {
      name: 'Jordan Kim',
      handle: '@jkfilms',
      niche: 'Cinematic travel',
      followers: 412_000,
      avatarGradient: 'linear-gradient(135deg, #7B5BFF 0%, #E68F47 100%)',
    },
    intent: {
      headline: 'Open to a hotel-collab arc — would shoot at golden hour.',
      dateRange: 'May 1 – Jun 5',
      vibe: 'cinematic · slow-pan',
      openTo: ['Reel', 'YouTube'],
    },
    aiFitScore: 73,
  },
  {
    creator: {
      name: 'Tara Vohra',
      handle: '@tara.cooks',
      niche: 'Modern Indian food',
      followers: 56_000,
      avatarGradient: 'linear-gradient(135deg, #E68F47 0%, #5C82B0 100%)',
    },
    intent: {
      headline: 'Looking for a single-origin spice brand — paid recipe series.',
      dateRange: 'Apr',
      vibe: 'editorial · warm',
      openTo: ['Reel', 'Newsletter'],
    },
    aiFitScore: 92,
  },
];

const sampleFilters: IntentFeedFilters = {
  category: ['Lifestyle', 'Food', 'Travel', 'Tech'],
  effort: ['Organic', 'Sample', 'Sponsor', 'Paid'],
  freshness: ['<24h', 'This week', 'This month'],
};

export const Default: Story = {
  args: {
    cards: sampleCards,
    filters: sampleFilters,
    heading: 'Live creator intents',
    onUnlock: (idx) => alert(`Unlocked card ${idx}`),
  },
};

export const WithActiveFilters: Story = {
  args: {
    cards: sampleCards,
    filters: sampleFilters,
    activeFilters: { category: ['Lifestyle'], effort: ['Organic'] },
    heading: 'Live creator intents',
    onFilter: (change) => console.log('filter change', change),
  },
};

export const EmptyState: Story = {
  args: {
    cards: [],
    filters: sampleFilters,
    activeFilters: { category: ['Tech'], effort: ['Paid'] },
    heading: 'Live creator intents',
    emptyState: (
      <div style={{ padding: 32, textAlign: 'center', color: '#5C5249' }}>
        No intents match your filters yet. Loosen them to see more creators.
      </div>
    ),
  },
};

export const Interactive: Story = {
  args: { cards: sampleCards, filters: sampleFilters },
  render: (args) => {
    const [active, setActive] = React.useState<IntentFeedFilters>({});
    return (
      <IntentFeed
        {...args}
        activeFilters={active}
        onFilter={({ group, value, selected }) => {
          setActive((prev) => {
            const cur = new Set(prev[group] ?? []);
            if (selected) cur.add(value);
            else cur.delete(value);
            return { ...prev, [group]: Array.from(cur) };
          });
        }}
      />
    );
  },
};
