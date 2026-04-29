import type { Meta, StoryObj } from '@storybook/react';
import { Heatmap } from '@amplify-ai/ui';

const meta = {
  title: 'Data Viz/Heatmap',
  component: Heatmap,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Heatmap>;

export default meta;
type Story = StoryObj<typeof meta>;

// Generate calendar data — 90 days
function generateCalendarData() {
  const cells = [];
  const today = new Date();
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    // Weekend lower; mid-week peak
    const dayOfWeek = d.getDay();
    const base = dayOfWeek === 0 || dayOfWeek === 6 ? 1 : 5;
    cells.push({
      id: iso,
      value: Math.max(0, Math.floor(Math.random() * base * 4)),
    });
  }
  return cells;
}

export const CalendarCreatorActivity: Story = {
  args: {
    variant: 'calendar',
    ariaLabel: 'Creator deliveries — last 90 days',
    data: generateCalendarData(),
  },
};

export const MatrixCampaignPerformance: Story = {
  args: {
    variant: 'matrix',
    ariaLabel: 'Engagement rate by content type and time of day',
    rowLabels: ['Morning', 'Midday', 'Evening', 'Night'],
    colLabels: ['Reels', 'Stories', 'Shorts', 'Posts'],
    data: [
      { id: 'm-r', value: 6.2, row: 0, col: 0 },
      { id: 'm-s', value: 4.1, row: 0, col: 1 },
      { id: 'm-sh', value: 5.8, row: 0, col: 2 },
      { id: 'm-p', value: 2.3, row: 0, col: 3 },
      { id: 'd-r', value: 8.4, row: 1, col: 0 },
      { id: 'd-s', value: 5.6, row: 1, col: 1 },
      { id: 'd-sh', value: 7.2, row: 1, col: 2 },
      { id: 'd-p', value: 3.1, row: 1, col: 3 },
      { id: 'e-r', value: 11.8, row: 2, col: 0 },
      { id: 'e-s', value: 9.2, row: 2, col: 1 },
      { id: 'e-sh', value: 10.4, row: 2, col: 2 },
      { id: 'e-p', value: 4.8, row: 2, col: 3 },
      { id: 'n-r', value: 7.6, row: 3, col: 0 },
      { id: 'n-s', value: 6.8, row: 3, col: 1 },
      { id: 'n-sh', value: 8.1, row: 3, col: 2 },
      { id: 'n-p', value: 3.4, row: 3, col: 3 },
    ],
    cellSize: 28,
    cellGap: 4,
  },
};
