import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Reveal, Card, CardContent, Button } from '@amplify-ai/ui';

const meta = {
  title: 'Motion/Reveal',
  component: Reveal,
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'select', options: ['up', 'down', 'left', 'right', 'fade'] },
    trigger: { control: 'select', options: ['mount', 'scroll'] },
    delay: { control: { type: 'number', min: 0, max: 2000, step: 50 } },
    duration: { control: { type: 'number', min: 100, max: 3000, step: 50 } },
    distance: { control: { type: 'number', min: 0, max: 100 } },
  },
} satisfies Meta<typeof Reveal>;

export default meta;
type Story = StoryObj<typeof meta>;

const Demo = () => (
  <Card>
    <CardContent>
      <p>Hello — I just animated in.</p>
    </CardContent>
  </Card>
);

export const FadeUp: Story = {
  args: { direction: 'up', trigger: 'mount', children: <Demo /> },
};

export const FadeIn: Story = {
  args: { direction: 'fade', trigger: 'mount', duration: 800, children: <Demo /> },
};

export const FromLeft: Story = {
  args: { direction: 'left', trigger: 'mount', distance: 32, children: <Demo /> },
};

export const ReplayOnRemount: Story = {
  render: () => {
    const [n, setN] = useState(0);
    return (
      <div>
        <Button onClick={() => setN((x) => x + 1)} variant="secondary">
          Replay
        </Button>
        <div style={{ marginTop: 16 }}>
          <Reveal key={n} trigger="mount" direction="up">
            <Demo />
          </Reveal>
        </div>
      </div>
    );
  },
};

export const ScrollIntoView: Story = {
  parameters: {
    docs: {
      description: { story: 'Scroll the iframe down to trigger each Reveal as it enters the viewport.' },
    },
  },
  render: () => (
    <div>
      <p style={{ height: 320, color: '#888' }}>Scroll down ↓</p>
      {(['up', 'down', 'left', 'right', 'fade'] as const).map((dir) => (
        <div key={dir} style={{ marginBottom: 280 }}>
          <Reveal direction={dir} trigger="scroll">
            <Card>
              <CardContent>
                <p>Direction: {dir}</p>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      ))}
    </div>
  ),
};

export const ReducedMotion: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Under `prefers-reduced-motion: reduce`, the element renders fully visible immediately with no transition.',
      },
    },
  },
  args: { trigger: 'mount', children: <Demo /> },
};
