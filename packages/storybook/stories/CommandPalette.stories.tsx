import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { CommandPalette, Button } from '@amplify-ai/ui';
import type { CommandItem } from '@amplify-ai/ui';

const baseItems: CommandItem[] = [
  { id: 'new-campaign', label: 'New campaign', group: 'Create', shortcut: ['⌘', 'N'], onSelect: () => alert('New campaign') },
  { id: 'new-creator', label: 'Add creator', group: 'Create', onSelect: () => alert('Add creator') },
  { id: 'go-dashboard', label: 'Go to dashboard', group: 'Navigate', onSelect: () => alert('Dashboard') },
  { id: 'go-creators', label: 'Go to creators', group: 'Navigate', onSelect: () => alert('Creators') },
  { id: 'go-billing', label: 'Go to billing', group: 'Navigate', hint: '/billing', onSelect: () => alert('Billing') },
  { id: 'theme-toggle', label: 'Toggle dark mode', group: 'Settings', shortcut: ['⌘', '⇧', 'L'], onSelect: () => alert('Theme') },
  { id: 'sign-out', label: 'Sign out', group: 'Settings', onSelect: () => alert('Sign out') },
];

const meta = {
  title: 'Components/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

const Wrapper = (props: { items?: CommandItem[]; recentsKey?: string | null }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open palette (⌘K)</Button>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        items={props.items ?? baseItems}
        recentsKey={props.recentsKey ?? null}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <Wrapper />,
};

export const WithRecents: Story = {
  render: () => <Wrapper recentsKey="storybook-cmd-palette-recents" />,
};

export const ManyItems: Story = {
  render: () => {
    const items: CommandItem[] = Array.from({ length: 30 }, (_, i) => ({
      id: `item-${i}`,
      label: `Action ${i + 1}`,
      group: i < 10 ? 'Create' : i < 20 ? 'Navigate' : 'Settings',
      onSelect: () => alert(`Action ${i + 1}`),
    }));
    return <Wrapper items={items} />;
  },
};

export const Empty: Story = {
  render: () => <Wrapper items={[]} />,
};

export const WithIcons: Story = {
  render: () => {
    const items: CommandItem[] = [
      {
        id: 'search',
        label: 'Search creators',
        group: 'Find',
        icon: <span aria-hidden>🔍</span>,
        onSelect: () => {},
      },
      {
        id: 'star',
        label: 'Favorite creator',
        group: 'Find',
        icon: <span aria-hidden>⭐</span>,
        onSelect: () => {},
      },
      {
        id: 'archive',
        label: 'Archive campaign',
        group: 'Manage',
        icon: <span aria-hidden>🗄️</span>,
        onSelect: () => {},
      },
    ];
    return <Wrapper items={items} />;
  },
};
