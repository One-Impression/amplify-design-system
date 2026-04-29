import type { Meta, StoryObj } from '@storybook/react';
import { FeatureGrid } from '@amplify-ai/ui';

const meta = {
  title: 'Marketing/FeatureGrid',
  component: FeatureGrid,
  tags: ['autodocs'],
  argTypes: {
    columns: { control: 'select', options: ['auto', 1, 2, 3, 4] },
    variant: { control: 'select', options: ['plain', 'card', 'bordered'] },
  },
} satisfies Meta<typeof FeatureGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const Icon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const baseItems = [
  { icon: Icon, title: 'Lightning fast', description: 'Sub-second page loads with edge caching and prefetch.' },
  { icon: Icon, title: 'Built for scale', description: 'Architected to support millions of creator profiles.' },
  { icon: Icon, title: 'AI-native', description: 'Every workflow has an AI copilot baked in.' },
  { icon: Icon, title: 'Secure by default', description: 'SOC 2, GDPR, and granular access controls.' },
];

export const Default: Story = { args: { items: baseItems } };

export const TwoColumns: Story = { args: { items: baseItems.slice(0, 2), columns: 2 } };
export const ThreeColumns: Story = { args: { items: baseItems.slice(0, 3), columns: 3 } };
export const FourColumns: Story = { args: { items: baseItems, columns: 4 } };

export const CardVariant: Story = { args: { items: baseItems, variant: 'card' } };
export const BorderedVariant: Story = { args: { items: baseItems, variant: 'bordered' } };

export const WithLinks: Story = {
  args: {
    items: baseItems.map((b) => ({
      ...b,
      link: <a href="#" className="text-[var(--amp-semantic-text-accent)]">Learn more →</a>,
    })),
    variant: 'card',
  },
};

export const NoIcons: Story = {
  args: { items: baseItems.map(({ icon: _icon, ...rest }) => rest), variant: 'bordered' },
};
