import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Drawer, Button } from '@amplify-ai/ui';

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  argTypes: {
    side: { control: 'select', options: ['left', 'right', 'top', 'bottom'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

const Body = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <p style={{ fontSize: 14, color: 'var(--amp-semantic-text-secondary)', margin: 0 }}>
      Drawer body content. Use for filters, secondary navigation, or ancillary info.
    </p>
    <input
      placeholder="Quick input"
      style={{
        height: 36,
        padding: '0 12px',
        borderRadius: 8,
        border: '1px solid var(--amp-semantic-border-default)',
        background: 'var(--amp-semantic-bg-surface)',
      }}
    />
  </div>
);

const useDrawer = () => {
  const [open, setOpen] = useState(false);
  return { open, openIt: () => setOpen(true), closeIt: () => setOpen(false) };
};

export const Right: Story = {
  args: { open: false, onClose: () => {}, side: 'right', title: 'Filters' },
  render: (args) => {
    const d = useDrawer();
    return (
      <>
        <Button onClick={d.openIt}>Open right drawer</Button>
        <Drawer
          {...args}
          open={d.open}
          onClose={d.closeIt}
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={d.closeIt}>Cancel</Button>
              <Button size="sm" onClick={d.closeIt}>Apply</Button>
            </>
          }
        >
          <Body />
        </Drawer>
      </>
    );
  },
};

export const Left: Story = {
  args: { open: false, onClose: () => {}, side: 'left', title: 'Navigation' },
  render: (args) => {
    const d = useDrawer();
    return (
      <>
        <Button onClick={d.openIt}>Open left drawer</Button>
        <Drawer {...args} open={d.open} onClose={d.closeIt}>
          <Body />
        </Drawer>
      </>
    );
  },
};

export const Top: Story = {
  args: { open: false, onClose: () => {}, side: 'top', size: 'sm', title: 'Announcement' },
  render: (args) => {
    const d = useDrawer();
    return (
      <>
        <Button onClick={d.openIt}>Open top drawer</Button>
        <Drawer {...args} open={d.open} onClose={d.closeIt}>
          <Body />
        </Drawer>
      </>
    );
  },
};

export const Bottom: Story = {
  args: { open: false, onClose: () => {}, side: 'bottom', size: 'md', title: 'Quick actions' },
  render: (args) => {
    const d = useDrawer();
    return (
      <>
        <Button onClick={d.openIt}>Open bottom drawer</Button>
        <Drawer {...args} open={d.open} onClose={d.closeIt}>
          <Body />
        </Drawer>
      </>
    );
  },
};

export const LargeSize: Story = {
  args: { open: false, onClose: () => {}, side: 'right', size: 'lg', title: 'Detailed inspector' },
  render: (args) => {
    const d = useDrawer();
    return (
      <>
        <Button onClick={d.openIt}>Open large drawer</Button>
        <Drawer {...args} open={d.open} onClose={d.closeIt}>
          <Body />
        </Drawer>
      </>
    );
  },
};

export const NoOverlay: Story = {
  args: { open: false, onClose: () => {}, side: 'right', size: 'sm', title: 'Side panel', hideOverlay: true },
  render: (args) => {
    const d = useDrawer();
    return (
      <>
        <Button onClick={d.openIt}>Open without overlay</Button>
        <Drawer {...args} open={d.open} onClose={d.closeIt}>
          <Body />
        </Drawer>
      </>
    );
  },
};
