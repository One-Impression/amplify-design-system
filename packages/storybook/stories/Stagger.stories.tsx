import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Stagger, Card, CardContent, Button } from '@amplify-ai/ui';

const meta = {
  title: 'Motion/Stagger',
  component: Stagger,
  tags: ['autodocs'],
  argTypes: {
    interval: { control: { type: 'number', min: 0, max: 500, step: 10 } },
    initialDelay: { control: { type: 'number', min: 0, max: 2000, step: 50 } },
    direction: { control: 'select', options: ['up', 'down', 'left', 'right', 'fade'] },
    trigger: { control: 'select', options: ['mount', 'scroll'] },
  },
} satisfies Meta<typeof Stagger>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = ['Reach', 'Engagement', 'Conversion', 'Revenue', 'Retention'];

const renderCards = () =>
  items.map((label) => (
    <Card key={label}>
      <CardContent>
        <p style={{ margin: 0 }}>{label}</p>
      </CardContent>
    </Card>
  ));

export const Default: Story = {
  args: { interval: 100, trigger: 'mount', direction: 'up', children: renderCards() },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
      <Stagger {...args} />
    </div>
  ),
};

export const FastInterval: Story = {
  args: { interval: 40, trigger: 'mount', direction: 'up', children: renderCards() },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
      <Stagger {...args} />
    </div>
  ),
};

export const FromLeft: Story = {
  args: { interval: 120, direction: 'left', trigger: 'mount', children: renderCards() },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
      <Stagger {...args} />
    </div>
  ),
};

export const Replay: Story = {
  render: () => {
    const [n, setN] = useState(0);
    return (
      <div>
        <Button onClick={() => setN((x) => x + 1)} variant="secondary">
          Replay
        </Button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320, marginTop: 16 }}>
          <Stagger key={n} interval={80} trigger="mount" direction="up">
            {renderCards()}
          </Stagger>
        </div>
      </div>
    );
  },
};

export const ScrollIntoView: Story = {
  render: () => (
    <div>
      <p style={{ height: 320, color: '#888' }}>Scroll down ↓</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
        <Stagger interval={120} trigger="scroll">
          {renderCards()}
        </Stagger>
      </div>
    </div>
  ),
};

export const ReducedMotion: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Under `prefers-reduced-motion: reduce`, all children appear at once without sequential delay.',
      },
    },
  },
  args: { interval: 100, trigger: 'mount', children: renderCards() },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
      <Stagger {...args} />
    </div>
  ),
};
