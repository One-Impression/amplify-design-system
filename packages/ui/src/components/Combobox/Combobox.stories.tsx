import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Combobox, type ComboboxItemData } from './Combobox';

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Searchable single-value select. Supports static `items={...}` or `<Combobox.Item>` children, plus async `loadItems(query)` for server-driven results. Status: beta (since 2.6.0).',
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    helperText: { control: 'text' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

const platforms: ComboboxItemData[] = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube', hint: 'Long-form' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'X / Twitter' },
  { value: 'pinterest', label: 'Pinterest', disabled: true },
];

type StatefulArgs = Partial<
  Omit<React.ComponentProps<typeof Combobox>, 'value' | 'onValueChange'>
> & {
  initial?: string | null;
};

const Stateful = (args: StatefulArgs) => {
  const [value, setValue] = useState<string | null>(args.initial ?? null);
  const { initial: _initial, ...rest } = args;
  return <Combobox {...rest} value={value} onValueChange={setValue} />;
};

export const Default: Story = {
  render: (args) => <Stateful {...args} items={platforms} />,
  args: { label: 'Platform', placeholder: 'Search platforms…' },
};

export const WithSelection: Story = {
  render: (args) => <Stateful {...args} items={platforms} initial="youtube" />,
  args: { label: 'Platform' },
};

export const WithError: Story = {
  render: (args) => <Stateful {...args} items={platforms} />,
  args: {
    label: 'Platform',
    placeholder: 'Search platforms…',
    error: 'Please pick a platform.',
  },
};

export const ReadOnly: Story = {
  render: (args) => <Stateful {...args} items={platforms} initial="instagram" />,
  args: { label: 'Platform (locked)', readOnly: true, helperText: 'Already provisioned.' },
};

export const Disabled: Story = {
  render: (args) => <Stateful {...args} items={platforms} initial="tiktok" />,
  args: { label: 'Platform', disabled: true },
};

export const ChildrenComposition: Story = {
  render: (args) => (
    <Stateful {...args}>
      <Combobox.Item value="usd" label="USD — US Dollar" hint="Default" />
      <Combobox.Item value="eur" label="EUR — Euro" />
      <Combobox.Item value="inr" label="INR — Indian Rupee" />
      <Combobox.Item value="gbp" label="GBP — Pound" />
      <Combobox.Item value="jpy" label="JPY — Yen" disabled />
    </Stateful>
  ),
  args: { label: 'Currency', placeholder: 'Pick a currency' },
};

const allCountries: ComboboxItemData[] = Array.from({ length: 60 }, (_, i) => ({
  value: `country-${i}`,
  label: `Country ${i + 1}`,
}));

const fakeLoad = (query: string): Promise<ComboboxItemData[]> =>
  new Promise((resolve) => {
    setTimeout(() => {
      const q = query.toLowerCase();
      resolve(allCountries.filter((c) => c.label.toLowerCase().includes(q)).slice(0, 20));
    }, 350);
  });

export const AsyncSearch: Story = {
  render: (args) => <Stateful {...args} loadItems={fakeLoad} />,
  args: {
    label: 'Country',
    placeholder: 'Type to search…',
    helperText: 'Loads from a (mock) async source.',
  },
};

export const NoMatches: Story = {
  render: (args) => <Stateful {...args} items={platforms.slice(0, 1)} />,
  args: {
    label: 'Platform',
    placeholder: 'Try typing "zzz" — no matches expected',
    emptyMessage: 'No platforms match.',
  },
};
