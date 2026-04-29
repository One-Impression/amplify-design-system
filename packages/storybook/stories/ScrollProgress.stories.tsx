import type { Meta, StoryObj } from '@storybook/react';
import { ScrollProgress } from '@amplify-ai/ui';

const meta = {
  title: 'Motion/ScrollProgress',
  component: ScrollProgress,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['linear', 'radial'] },
    position: { control: 'select', options: ['top', 'bottom'] },
    thickness: { control: { type: 'number', min: 1, max: 10 } },
    size: { control: { type: 'number', min: 24, max: 120 } },
    color: { control: 'color' },
  },
} satisfies Meta<typeof ScrollProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

const Filler = () => (
  <div>
    {Array.from({ length: 30 }).map((_, i) => (
      <p key={i} style={{ marginBottom: 16, color: '#888' }}>
        Filler paragraph {i + 1} — scroll the iframe to see the progress bar advance.
      </p>
    ))}
  </div>
);

export const LinearTop: Story = {
  args: { variant: 'linear', position: 'top', thickness: 3 },
  render: (args) => (
    <div>
      <ScrollProgress {...args} />
      <Filler />
    </div>
  ),
};

export const LinearBottom: Story = {
  args: { variant: 'linear', position: 'bottom', thickness: 4 },
  render: (args) => (
    <div>
      <ScrollProgress {...args} />
      <Filler />
    </div>
  ),
};

export const ThickColored: Story = {
  args: { variant: 'linear', thickness: 6, color: '#7C3AED' },
  render: (args) => (
    <div>
      <ScrollProgress {...args} />
      <Filler />
    </div>
  ),
};

export const Radial: Story = {
  args: { variant: 'radial', size: 56 },
  render: (args) => (
    <div>
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 50 }}>
        <ScrollProgress {...args} />
      </div>
      <Filler />
    </div>
  ),
};

export const RadialLarge: Story = {
  args: { variant: 'radial', size: 96, color: '#10B981' },
  render: (args) => (
    <div>
      <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 50 }}>
        <ScrollProgress {...args} />
      </div>
      <Filler />
    </div>
  ),
};

export const ShortPage: Story = {
  args: { variant: 'linear', position: 'top' },
  parameters: {
    docs: {
      description: {
        story: 'When the page does not scroll, progress stays at 0 and the bar is effectively invisible.',
      },
    },
  },
  render: (args) => (
    <div>
      <ScrollProgress {...args} />
      <p style={{ color: '#888' }}>Short content — no scroll, no progress.</p>
    </div>
  ),
};
