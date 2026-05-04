import type { Meta, StoryObj } from '@storybook/react';
import { VariantCard } from './VariantCard';

const meta = {
  title: 'Studio v2/VariantCard',
  component: VariantCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    status: { type: 'beta' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320, height: 240 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VariantCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    state: 'empty',
    name: 'V1',
    lensTag: 'editorial',
    statusText: '⌘1',
  },
};

export const Generating: Story = {
  args: {
    state: 'generating',
    name: 'V2',
    lensTag: 'spatial',
    statusText: 'generating · 3.2s',
  },
};

export const Ready: Story = {
  args: {
    state: 'ready',
    name: 'V1',
    lensTag: 'editorial',
    statusText: '⌘1',
    scoreLabel: '●● 91 council',
    scoreVariant: 'good',
    actions: [
      { id: 'lock', label: 'Lock', onClick: () => undefined },
      { id: 'fork', label: 'Fork', onClick: () => undefined },
    ],
    children: (
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
          fontSize: 28,
        }}
      >
        Editorial mock
      </div>
    ),
  },
};

export const Selected: Story = {
  args: {
    ...(Ready.args ?? {}),
    state: 'ready',
    name: 'V1',
    selected: true,
    onClick: () => undefined,
  },
};

export const Error: Story = {
  args: {
    state: 'error',
    name: 'V3',
    lensTag: 'minimal',
    statusText: 'retry',
    errorMessage: 'Generation timed out after 30s',
    onRetry: () => undefined,
  },
};

export const ScoreVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(3, 1fr)' }}>
      <VariantCard
        state="ready"
        name="V1"
        lensTag="good"
        scoreLabel="●● 91 council"
        scoreVariant="good"
      >
        <div style={{ padding: 16 }}>good</div>
      </VariantCard>
      <VariantCard
        state="ready"
        name="V2"
        lensTag="neutral"
        scoreLabel="● 64 council"
        scoreVariant="neutral"
      >
        <div style={{ padding: 16 }}>neutral</div>
      </VariantCard>
      <VariantCard
        state="ready"
        name="V3"
        lensTag="bad"
        scoreLabel="○ 38 council"
        scoreVariant="bad"
      >
        <div style={{ padding: 16 }}>bad</div>
      </VariantCard>
    </div>
  ),
  args: {
    state: 'ready',
    name: 'V1',
  },
};
