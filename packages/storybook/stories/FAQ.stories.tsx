import type { Meta, StoryObj } from '@storybook/react';
import { FAQ } from '@amplify-ai/ui';

const meta = {
  title: 'Marketing/FAQ',
  component: FAQ,
  tags: ['autodocs'],
  argTypes: {
    mode: { control: 'select', options: ['single', 'multi'] },
    emitJsonLd: { control: 'boolean' },
  },
} satisfies Meta<typeof FAQ>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseItems = [
  {
    id: 'what',
    question: 'What is Amplify?',
    answer:
      'Amplify is an end-to-end creator marketing platform that handles discovery, briefs, contracts, content review, payouts, and ROAS reporting in a single workflow.',
  },
  {
    id: 'pricing',
    question: 'How does pricing work?',
    answer: 'Plans start free and scale based on the number of campaigns and creators per month. See pricing for details.',
  },
  {
    id: 'support',
    question: 'Do you offer support?',
    answer: 'Yes — every plan includes email support, and growth plans add a dedicated success manager.',
  },
  {
    id: 'data',
    question: 'How is my data handled?',
    answer:
      'Amplify is SOC 2 Type II certified. Data is encrypted at rest and in transit, and never used to train third-party models without explicit opt-in.',
  },
];

export const Default: Story = {
  args: {
    title: 'Frequently asked questions',
    items: baseItems,
  },
};

export const SingleOpen: Story = {
  args: {
    items: baseItems,
    mode: 'single',
    defaultOpenIds: ['what'],
  },
};

export const MultiOpen: Story = {
  args: {
    items: baseItems,
    mode: 'multi',
    defaultOpenIds: ['what', 'pricing'],
  },
};

export const NoTitle: Story = {
  args: { items: baseItems },
};

export const WithoutSeoSchema: Story = {
  args: {
    title: 'No SEO schema',
    items: baseItems,
    emitJsonLd: false,
  },
};
