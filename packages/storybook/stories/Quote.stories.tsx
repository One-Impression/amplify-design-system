import type { Meta, StoryObj } from '@storybook/react';
import { Quote } from '@amplify-ai/ui';

const meta = {
  title: 'Marketing/Quote',
  component: Quote,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    align: { control: 'select', options: ['start', 'center'] },
  },
} satisfies Meta<typeof Quote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    size: 'small',
    children: 'A small inline pull-quote that complements body copy.',
    attribution: 'Aria Mehta',
    source: 'Head of Design, Amplify',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
    children: 'Amplify made it possible for us to ship campaigns at the pace of product launches.',
    attribution: 'Priya Sharma',
    source: 'VP Marketing, Acme',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    children:
      'The single best decision we made last year was switching to Amplify. Period.',
    attribution: 'Rohan Mehta',
    source: 'Founder, Globex',
  },
};

export const Centered: Story = {
  args: {
    size: 'large',
    align: 'center',
    children: 'Beautiful is better than ugly. Explicit is better than implicit.',
    attribution: 'Tim Peters',
  },
};

export const NoAttribution: Story = {
  args: {
    size: 'medium',
    children: 'A quote without attribution still works as a visual element.',
  },
};

export const LongQuote: Story = {
  args: {
    size: 'medium',
    children:
      'We replaced spreadsheets, three SaaS tools, and a manual approval process with one Amplify workflow. Our team is now twice as productive and our reporting is finally trustworthy.',
    attribution: 'Sara Lin',
    source: 'COO, Initech',
  },
};
