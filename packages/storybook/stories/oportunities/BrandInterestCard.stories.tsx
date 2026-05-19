import type { Meta, StoryObj } from '@storybook/react';
import { BrandInterestCard } from '@amplify-ai/ui';

const meta = {
  title: 'Oportunities/BrandInterestCard',
  component: BrandInterestCard,
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
} satisfies Meta<typeof BrandInterestCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleBrand = {
  name: 'Hush Sleep Co.',
  category: 'Sleep tech · DTC',
};

const sampleInterest = {
  headline: 'Wants you for spring launch',
  message:
    'Loved your wind-down rituals series. We have a 3-part story arc and would love your voice on it — paid + product seeded.',
  aiFitScore: 91,
};

export const Default: Story = {
  args: {
    brand: sampleBrand,
    interest: sampleInterest,
    onReply: () => alert('Reply'),
    onDecline: () => alert('Decline'),
  },
};

export const WithLogo: Story = {
  args: {
    brand: {
      ...sampleBrand,
      logo: 'https://i.pravatar.cc/150?img=22',
    },
    interest: sampleInterest,
    onReply: () => alert('Reply'),
    onDecline: () => alert('Decline'),
  },
};

export const NoAIScore: Story = {
  args: {
    brand: sampleBrand,
    interest: { ...sampleInterest, aiFitScore: undefined },
    onReply: () => alert('Reply'),
    onDecline: () => alert('Decline'),
  },
};

export const ReplyOnly: Story = {
  args: {
    brand: sampleBrand,
    interest: sampleInterest,
    onReply: () => alert('Reply'),
  },
};
