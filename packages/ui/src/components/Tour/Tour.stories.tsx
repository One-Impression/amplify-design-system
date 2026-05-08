import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tour, type TourStep } from './Tour';

const meta = {
  title: 'Components/Tour',
  component: Tour,
  tags: ['autodocs'],
} satisfies Meta<typeof Tour>;

export default meta;
type Story = StoryObj<typeof meta>;

const demoSteps: TourStep[] = [
  {
    target: '#tour-demo-search',
    title: 'Find anything fast',
    body: 'Use search to jump between campaigns, creators, and reports.',
    placement: 'bottom',
  },
  {
    target: '#tour-demo-create',
    title: 'Launch a new campaign',
    body: 'Click here to brief Atmosphere on your next launch.',
    placement: 'bottom',
  },
  {
    title: 'You are all set',
    body: 'Atmosphere will guide you through the rest in-context.',
    placement: 'center',
  },
];

const TourPlayground: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-8 min-h-[400px] flex flex-col gap-6 bg-[var(--amp-semantic-bg-canvas,#0b0b0c)]">
      <div className="flex items-center gap-3">
        <input
          id="tour-demo-search"
          placeholder="Search campaigns, creators…"
          className="px-3 py-2 rounded-md border border-[var(--amp-semantic-border-default)] bg-[var(--amp-semantic-bg-surface)] text-[var(--amp-semantic-text-primary)] w-[280px]"
        />
        <button
          id="tour-demo-create"
          type="button"
          className="px-3 py-2 rounded-md bg-[var(--amp-semantic-status-info)] text-white text-[14px] font-medium"
        >
          New campaign
        </button>
      </div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="self-start px-3 py-1.5 rounded-md border border-[var(--amp-semantic-border-default)] text-[14px] text-[var(--amp-semantic-text-primary)]"
      >
        Start tour
      </button>
      <Tour
        tourId="storybook-demo"
        steps={demoSteps}
        open={open}
        onClose={() => setOpen(false)}
        onComplete={() => setOpen(false)}
        persist={false}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <TourPlayground />,
};

export const SingleCenteredStep: Story = {
  render: () => {
    const Inner: React.FC = () => {
      const [open, setOpen] = useState(true);
      return (
        <div className="p-8 min-h-[300px]">
          <Tour
            tourId="centered-demo"
            steps={[
              {
                title: 'Welcome to Atmosphere',
                body: 'A unified workspace for marketing teams. Press Esc to close.',
                placement: 'center',
              },
            ]}
            open={open}
            onClose={() => setOpen(false)}
            onComplete={() => setOpen(false)}
            persist={false}
          />
        </div>
      );
    };
    return <Inner />;
  },
};
