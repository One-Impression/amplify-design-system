import type { Meta, StoryObj } from '@storybook/react';
import { Testimonial, Avatar } from '@amplify-ai/ui';

const meta = {
  title: 'Marketing/Testimonial',
  component: Testimonial,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['card', 'inline', 'featured'] },
  },
} satisfies Meta<typeof Testimonial>;

export default meta;
type Story = StoryObj<typeof meta>;

const author = 'Priya Sharma';
const role = 'VP Marketing, Acme';

export const Card: Story = {
  args: {
    variant: 'card',
    quote: 'Amplify cut our campaign launch time from three weeks to two days.',
    author,
    role,
    avatar: <Avatar name={author} size="md" />,
  },
};

export const Inline: Story = {
  args: {
    variant: 'inline',
    quote: 'The matching engine is genuinely impressive — it just works.',
    author,
    role,
  },
};

export const Featured: Story = {
  args: {
    variant: 'featured',
    quote:
      'Switching to Amplify was the single highest-leverage decision we made last year. ROAS improved 40% in the first quarter.',
    author,
    role,
    avatar: <Avatar name={author} size="lg" />,
  },
};

export const WithCompanyLogo: Story = {
  args: {
    variant: 'card',
    quote: 'Best-in-class platform.',
    author,
    role,
    avatar: <Avatar name={author} size="md" />,
    companyLogo: <span style={{ fontWeight: 700 }}>ACME</span>,
  },
};

export const NoRole: Story = {
  args: {
    variant: 'card',
    quote: 'Highly recommended.',
    author: 'Rohan Mehta',
  },
};

export const LongQuote: Story = {
  args: {
    variant: 'featured',
    quote:
      'We evaluated five platforms before landing on Amplify. The combination of creator quality, automation depth, and reporting is unmatched. Our team has scaled from 2 to 12 campaigns per month with the same headcount.',
    author,
    role,
    avatar: <Avatar name={author} size="lg" />,
  },
};
