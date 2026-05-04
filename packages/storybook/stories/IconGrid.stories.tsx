import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { IconGrid, IconCallout } from '@amplify-ai/ui';

const meta = {
  title: 'Marketing/IconGrid',
  component: IconGrid,
  tags: ['autodocs'],
  argTypes: {
    columns: { control: 'select', options: [2, 3, 4] },
    gap: { control: 'select', options: ['default', 'comfortable'] },
  },
} satisfies Meta<typeof IconGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const Bolt = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h7l-1 8 11-12h-7l0-8z" />
  </svg>
);
const Shield = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z" />
  </svg>
);
const Globe = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" d="M2 12h20M12 2c2.5 3 4 6.5 4 10s-1.5 7-4 10c-2.5-3-4-6.5-4-10s1.5-7 4-10z" />
  </svg>
);
const Spark = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M5 19l4-4M15 9l4-4" />
  </svg>
);

const featureBlocks = (count: number) =>
  [
    {
      icon: <Bolt />,
      title: 'Lightning fast',
      description: 'Sub-second matching, briefs and approvals across the platform.',
    },
    {
      icon: <Shield />,
      title: 'Enterprise security',
      description: 'SOC 2 Type II, SAML SSO, and per-user audit trail out of the box.',
    },
    {
      icon: <Globe />,
      title: 'Global by default',
      description: 'Run multi-region, multi-currency campaigns with one workflow.',
    },
    {
      icon: <Spark />,
      title: 'AI-native',
      description: 'Briefs, scripts, and matching driven by reasoning models, not heuristics.',
    },
  ]
    .slice(0, count)
    .map((b, i) => <IconCallout key={i} {...b} />);

export const ThreeUp: Story = {
  args: { columns: 3, children: featureBlocks(3) },
};

export const FourUp: Story = {
  args: { columns: 4, children: featureBlocks(4) },
};

export const TwoUp: Story = {
  args: { columns: 2, children: featureBlocks(2) },
};

export const Comfortable: Story = {
  args: { columns: 3, gap: 'comfortable', children: featureBlocks(3) },
};

export const Centered: Story = {
  render: () => (
    <IconGrid columns={3}>
      {[
        { icon: <Bolt />, title: 'Speed', description: 'Ship faster.' },
        { icon: <Shield />, title: 'Trust', description: 'Built on a hardened core.' },
        { icon: <Globe />, title: 'Scale', description: 'Across every market.' },
      ].map((b, i) => (
        <IconCallout key={i} align="center" {...b} />
      ))}
    </IconGrid>
  ),
};
