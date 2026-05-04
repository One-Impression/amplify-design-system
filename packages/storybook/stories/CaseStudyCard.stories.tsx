import type { Meta, StoryObj } from '@storybook/react';
import { CaseStudyCard, Button } from '@amplify-ai/ui';

const meta = {
  title: 'Marketing/CaseStudyCard',
  component: CaseStudyCard,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'featured'] },
  },
} satisfies Meta<typeof CaseStudyCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const acmeLogo = <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: 1 }}>ACME</span>;
const globexLogo = <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: 1 }}>GLOBEX</span>;

export const Default: Story = {
  args: {
    customerLogo: acmeLogo,
    quote: 'Amplify shipped what would have taken our team six months in just three weeks.',
    stats: [
      { value: '3.2x', label: 'ROAS' },
      { value: '+87%', label: 'Conversion' },
      { value: '12d', label: 'Time to launch' },
    ],
    customerName: 'Priya Sharma',
    customerRole: 'VP Marketing',
    companyLogo: globexLogo,
    cta: <Button variant="ghost">Read story →</Button>,
  },
};

export const Featured: Story = {
  args: {
    ...Default.args!,
    variant: 'featured',
  },
};

export const TwoStats: Story = {
  args: {
    customerLogo: acmeLogo,
    quote: 'A genuinely transformative platform.',
    stats: [
      { value: '$1.2M', label: 'New revenue' },
      { value: '14×', label: 'Faster' },
    ],
    customerName: 'Rohan Mehta',
    customerRole: 'Head of Growth',
  },
};

export const Linked: Story = {
  args: {
    ...Default.args!,
    href: '/customers/acme',
    cta: undefined,
  },
};

export const NoStats: Story = {
  args: {
    customerLogo: acmeLogo,
    quote: 'Switching to Amplify was the single highest-leverage decision of the year.',
    customerName: 'Maya Singh',
    customerRole: 'CMO',
    cta: <Button variant="ghost">Read story →</Button>,
  },
};
