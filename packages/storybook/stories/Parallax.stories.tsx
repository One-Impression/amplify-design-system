import type { Meta, StoryObj } from '@storybook/react';
import { Parallax, Card, CardContent } from '@amplify-ai/ui';

const meta = {
  title: 'Motion/Parallax',
  component: Parallax,
  tags: ['autodocs'],
  argTypes: {
    speed: { control: { type: 'number', min: 0, max: 1, step: 0.05 } },
    direction: { control: 'select', options: ['vertical', 'horizontal'] },
  },
} satisfies Meta<typeof Parallax>;

export default meta;
type Story = StoryObj<typeof meta>;

const Filler = ({ h = 600 }: { h?: number }) => (
  <div style={{ height: h, color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    ↕ scroll the iframe
  </div>
);

const Block = ({ label }: { label: string }) => (
  <Card>
    <CardContent>
      <p style={{ margin: 0 }}>{label}</p>
    </CardContent>
  </Card>
);

export const Default: Story = {
  args: { speed: 0.3, direction: 'vertical', children: <Block label="Speed 0.3 vertical" /> },
  render: (args) => (
    <div>
      <Filler />
      <Parallax {...args} />
      <Filler h={800} />
    </div>
  ),
};

export const Slow: Story = {
  render: () => (
    <div>
      <Filler />
      <Parallax speed={0.1}>
        <Block label="Speed 0.1 — barely moves" />
      </Parallax>
      <Filler h={800} />
    </div>
  ),
};

export const Fast: Story = {
  render: () => (
    <div>
      <Filler />
      <Parallax speed={0.6}>
        <Block label="Speed 0.6 — moves a lot" />
      </Parallax>
      <Filler h={800} />
    </div>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <div>
      <Filler />
      <Parallax speed={0.4} direction="horizontal">
        <Block label="Horizontal drift" />
      </Parallax>
      <Filler h={800} />
    </div>
  ),
};

export const Stacked: Story = {
  render: () => (
    <div>
      <Filler />
      <div style={{ display: 'grid', gap: 200, marginBottom: 400 }}>
        <Parallax speed={0.1}><Block label="Layer A — speed 0.1" /></Parallax>
        <Parallax speed={0.3}><Block label="Layer B — speed 0.3" /></Parallax>
        <Parallax speed={0.5}><Block label="Layer C — speed 0.5" /></Parallax>
      </div>
    </div>
  ),
};

export const ReducedMotion: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Under `prefers-reduced-motion: reduce`, no scroll listener is attached and the element renders statically.',
      },
    },
  },
  args: { speed: 0.3, children: <Block label="Static when reduced-motion" /> },
};
