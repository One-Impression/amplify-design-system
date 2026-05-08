import type { Meta, StoryObj } from '@storybook/react';
import { Marquee } from '@amplify-ai/ui';

const meta = {
  title: 'Marketing/Marquee',
  component: Marquee,
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'select', options: ['left', 'right'] },
    speed: { control: 'select', options: ['slow', 'normal', 'fast'] },
    pauseOnHover: { control: 'boolean' },
    fadeEdges: { control: 'boolean' },
    gap: { control: 'number' },
  },
} satisfies Meta<typeof Marquee>;

export default meta;
type Story = StoryObj<typeof meta>;

const logoPill = (label: string) => (
  <div
    key={label}
    style={{
      padding: '8px 20px',
      fontWeight: 700,
      fontSize: 18,
      letterSpacing: 1,
      color: 'var(--amp-semantic-text-secondary)',
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </div>
);

const brands = ['Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli', 'Massive Dynamic', 'Cyberdyne', 'Wayne Enterprises'];

export const LogoMarquee: Story = {
  args: {
    direction: 'left',
    speed: 'normal',
    pauseOnHover: true,
    children: <>{brands.map(logoPill)}</>,
  },
};

export const ReverseDirection: Story = {
  args: {
    direction: 'right',
    speed: 'normal',
    children: <>{brands.map(logoPill)}</>,
  },
};

export const Slow: Story = {
  args: {
    direction: 'left',
    speed: 'slow',
    children: <>{brands.map(logoPill)}</>,
  },
};

export const Fast: Story = {
  args: {
    direction: 'left',
    speed: 'fast',
    children: <>{brands.map(logoPill)}</>,
  },
};

export const TestimonialMarquee: Story = {
  args: {
    direction: 'left',
    speed: 'slow',
    gap: 24,
    children: (
      <>
        {[
          'Best-in-class platform.',
          'Transformative tooling.',
          '3x ROAS in 30 days.',
          'Highly recommended.',
          'A genuine game-changer.',
        ].map((q, i) => (
          <div
            key={i}
            style={{
              padding: '14px 20px',
              borderRadius: 16,
              border: '1px solid var(--amp-semantic-border-default)',
              background: 'var(--amp-semantic-bg-surface)',
              fontSize: 14,
              color: 'var(--amp-semantic-text-primary)',
              whiteSpace: 'nowrap',
              minWidth: 220,
            }}
          >
            “{q}”
          </div>
        ))}
      </>
    ),
  },
};

export const NoFadeEdges: Story = {
  args: {
    direction: 'left',
    speed: 'normal',
    fadeEdges: false,
    children: <>{brands.map(logoPill)}</>,
  },
};
