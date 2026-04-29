import type { Meta, StoryObj } from '@storybook/react';
import { ContextMenu } from '@amplify-ai/ui';
import type { ContextMenuItem } from '@amplify-ai/ui';

const meta = {
  title: 'Components/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const Target = ({ label }: { label: string }) => (
  <div
    style={{
      width: 320,
      padding: 24,
      borderRadius: 12,
      border: '1px dashed var(--amp-semantic-border-default)',
      textAlign: 'center',
      color: 'var(--amp-semantic-text-secondary)',
    }}
  >
    {label}
  </div>
);

const basic: ContextMenuItem[] = [
  { id: 'edit', label: 'Edit', shortcut: '⌘E', onSelect: () => alert('Edit') },
  { id: 'duplicate', label: 'Duplicate', shortcut: '⌘D', onSelect: () => alert('Duplicate') },
  { type: 'separator' },
  { id: 'delete', label: 'Delete', destructive: true, onSelect: () => alert('Delete') },
];

const withSubmenu: ContextMenuItem[] = [
  { id: 'view', label: 'View', onSelect: () => alert('View') },
  {
    id: 'share',
    label: 'Share',
    onSelect: () => {},
    submenu: [
      { id: 'link', label: 'Copy link', onSelect: () => alert('Copy link') },
      { id: 'email', label: 'Email', onSelect: () => alert('Email') },
      { type: 'separator' },
      { id: 'invite', label: 'Invite people…', onSelect: () => alert('Invite') },
    ],
  },
  { type: 'separator' },
  { id: 'archive', label: 'Archive', onSelect: () => alert('Archive') },
];

export const Basic: Story = {
  render: () => (
    <ContextMenu items={basic}>
      <Target label="Right-click me" />
    </ContextMenu>
  ),
};

export const WithShortcuts: Story = {
  render: () => (
    <ContextMenu
      items={[
        { id: 'cut', label: 'Cut', shortcut: '⌘X', onSelect: () => {} },
        { id: 'copy', label: 'Copy', shortcut: '⌘C', onSelect: () => {} },
        { id: 'paste', label: 'Paste', shortcut: '⌘V', disabled: true, onSelect: () => {} },
      ]}
    >
      <Target label="Right-click for clipboard" />
    </ContextMenu>
  ),
};

export const WithSubmenu: Story = {
  render: () => (
    <ContextMenu items={withSubmenu}>
      <Target label="Right-click — has submenu" />
    </ContextMenu>
  ),
};

export const WithLabels: Story = {
  render: () => (
    <ContextMenu
      items={[
        { type: 'label', label: 'Actions' },
        { id: 'view', label: 'View profile', onSelect: () => {} },
        { id: 'message', label: 'Send message', onSelect: () => {} },
        { type: 'separator' },
        { type: 'label', label: 'Danger zone' },
        { id: 'block', label: 'Block', destructive: true, onSelect: () => {} },
      ]}
    >
      <Target label="Right-click — labeled groups" />
    </ContextMenu>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <ContextMenu
      items={[
        { id: 'star', label: 'Star', icon: <span aria-hidden>⭐</span>, onSelect: () => {} },
        { id: 'pin', label: 'Pin', icon: <span aria-hidden>📌</span>, onSelect: () => {} },
        { type: 'separator' },
        { id: 'remove', label: 'Remove', icon: <span aria-hidden>🗑</span>, destructive: true, onSelect: () => {} },
      ]}
    >
      <Target label="Right-click — with icons" />
    </ContextMenu>
  ),
};
