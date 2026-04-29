import type { Meta, StoryObj } from '@storybook/react';
import { SearchCombobox } from '@amplify-ai/ui';

const SAMPLE = [
  { id: '1', label: 'Riya Mehta', hint: '@riyacreates' },
  { id: '2', label: 'Aman Joshi', hint: '@amanj' },
  { id: '3', label: 'Pooja Iyer', hint: '@poojaiyer' },
  { id: '4', label: 'Sneha Kapoor', hint: '@snehak' },
  { id: '5', label: 'Vikram Reddy', hint: '@vikreddy' },
  { id: '6', label: 'Anjali Verma', hint: '@anjaliv' },
];

const fakeQuery = async (q: string) => {
  await new Promise((r) => setTimeout(r, 300));
  const lc = q.toLowerCase();
  return SAMPLE.filter((s) => s.label.toLowerCase().includes(lc) || s.hint.toLowerCase().includes(lc));
};

const meta = {
  title: 'Recipes/SearchCombobox',
  component: SearchCombobox,
  tags: ['autodocs'],
} satisfies Meta<typeof SearchCombobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <SearchCombobox onQuery={fakeQuery} onSelect={(o) => alert(`Selected: ${o.label}`)} placeholder="Search creators…" />
    </div>
  ),
};

export const FastDebounce: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <SearchCombobox debounceMs={50} onQuery={fakeQuery} onSelect={() => {}} />
    </div>
  ),
};

export const MinTwoChars: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <SearchCombobox minChars={2} onQuery={fakeQuery} onSelect={() => {}} placeholder="Type 2+ characters…" />
    </div>
  ),
};

export const InitialQuery: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <SearchCombobox initialQuery="Riya" onQuery={fakeQuery} onSelect={() => {}} />
    </div>
  ),
};

export const NoResults: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <SearchCombobox
        onQuery={async () => []}
        onSelect={() => {}}
        emptyMessage="Try a different search term."
      />
    </div>
  ),
};

export const AlwaysLoading: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <SearchCombobox
        onQuery={() => new Promise(() => {})}
        onSelect={() => {}}
        placeholder="Forever loading…"
      />
    </div>
  ),
};
