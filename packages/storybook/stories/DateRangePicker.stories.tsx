import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DateRangePicker, type DateRange } from '@amplify-ai/ui';

const meta = {
  title: 'Components/Forms/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: { label: 'Campaign window' },
};

export const NoPresets: Story = {
  args: { hidePresets: true, label: 'Date range (no presets)' },
};

export const WithDefaultRange: Story = {
  args: {
    label: 'Last 7 days',
    defaultValue: {
      from: new Date(Date.now() - 6 * 86400_000),
      to: new Date(),
    } satisfies DateRange,
  },
};

export const Disabled: Story = {
  args: { label: 'Locked', disabled: true },
};

export const WithMinMax: Story = {
  args: {
    label: 'Within current month',
    minDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    maxDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [range, setRange] = useState<DateRange>({ from: null, to: null });
    return (
      <div>
        <DateRangePicker {...args} value={range} onChange={setRange} label="Pick a range" />
        <pre style={{ marginTop: 12, fontSize: 12, background: '#f5f5f5', padding: 8, borderRadius: 8 }}>
          {JSON.stringify(
            { from: range.from?.toISOString() ?? null, to: range.to?.toISOString() ?? null },
            null,
            2
          )}
        </pre>
      </div>
    );
  },
};

export const CustomPresets: Story = {
  args: {
    label: 'Reporting window',
    presets: [
      { label: 'Yesterday', getRange: () => ({ from: new Date(Date.now() - 86400_000), to: new Date(Date.now() - 86400_000) }) },
      { label: 'This quarter', getRange: () => {
        const now = new Date();
        const q = Math.floor(now.getMonth() / 3);
        return { from: new Date(now.getFullYear(), q * 3, 1), to: now };
      }},
      { label: 'YTD', getRange: () => ({ from: new Date(new Date().getFullYear(), 0, 1), to: new Date() }) },
    ],
  },
};
