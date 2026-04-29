import type { Meta, StoryObj } from '@storybook/react';
import { Section, Button } from '@amplify-ai/ui';

const meta = {
  title: 'Marketing/Section',
  component: Section,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'muted', 'inverted', 'accent'] },
    align: { control: 'select', options: ['start', 'center'] },
    density: { control: 'select', options: ['compact', 'comfortable', 'spacious'] },
  },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleBody = (
  <p style={{ maxWidth: 720 }}>
    Use Section as a layout primitive for marketing pages. It owns vertical rhythm,
    background treatment, and slot composition for heading / description / body / footer.
  </p>
);

export const Default: Story = {
  args: { heading: 'Why teams choose Amplify', description: 'Built for scale, designed for speed.', body: sampleBody },
};

export const Muted: Story = {
  args: { variant: 'muted', heading: 'Backed by data', description: 'Every decision driven by signal.', body: sampleBody },
};

export const Inverted: Story = {
  args: { variant: 'inverted', heading: 'Dark on light', description: 'High-contrast for emphasis sections.', body: sampleBody },
};

export const Accent: Story = {
  args: { variant: 'accent', heading: 'Featured product', description: 'Highlight a specific moment.', body: sampleBody },
};

export const Centered: Story = {
  args: {
    align: 'center',
    heading: 'A unified design system',
    description: 'Across Brand, Creator, and Atmosphere.',
    body: sampleBody,
  },
};

export const WithFooter: Story = {
  args: {
    heading: 'Get in touch',
    description: 'We respond within one business day.',
    body: sampleBody,
    footer: <Button variant="primary">Contact us</Button>,
  },
};

export const NoHeading: Story = {
  args: { body: sampleBody },
};
