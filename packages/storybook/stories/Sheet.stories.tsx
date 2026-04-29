import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Sheet, Button } from '@amplify-ai/ui';

const meta = {
  title: 'Components/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  argTypes: {
    mode: { control: 'select', options: ['side', 'modal', 'fullscreen'] },
    side: { control: 'select', options: ['left', 'right'] },
  },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const Body = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <p style={{ margin: 0, fontSize: 14, color: 'var(--amp-semantic-text-secondary)' }}>
      Sheet hosts a sustained, focused task. Compose the body with form fields,
      tabs, embedded sections — the user spends time here, unlike a transient
      Drawer.
    </p>
    {Array.from({ length: 5 }).map((_, i) => (
      <input
        key={i}
        placeholder={`Field ${i + 1}`}
        style={{
          height: 38,
          padding: '0 12px',
          borderRadius: 8,
          border: '1px solid var(--amp-semantic-border-default)',
          background: 'var(--amp-semantic-bg-surface)',
        }}
      />
    ))}
  </div>
);

const useOpen = () => {
  const [open, setOpen] = useState(false);
  return { open, openIt: () => setOpen(true), closeIt: () => setOpen(false) };
};

export const SideRight: Story = {
  args: { open: false, onClose: () => {}, mode: 'side', side: 'right', title: 'Edit campaign' },
  render: (args) => {
    const s = useOpen();
    return (
      <>
        <Button onClick={s.openIt}>Open side sheet</Button>
        <Sheet
          {...args}
          open={s.open}
          onClose={s.closeIt}
          footer={
            <>
              <Button variant="ghost" onClick={s.closeIt}>Cancel</Button>
              <Button onClick={s.closeIt}>Save</Button>
            </>
          }
        >
          <Body />
        </Sheet>
      </>
    );
  },
};

export const SideLeft: Story = {
  args: { open: false, onClose: () => {}, mode: 'side', side: 'left', title: 'Inspector' },
  render: (args) => {
    const s = useOpen();
    return (
      <>
        <Button onClick={s.openIt}>Open left side sheet</Button>
        <Sheet {...args} open={s.open} onClose={s.closeIt}>
          <Body />
        </Sheet>
      </>
    );
  },
};

export const Modal: Story = {
  args: { open: false, onClose: () => {}, mode: 'modal', title: 'Compose script' },
  render: (args) => {
    const s = useOpen();
    return (
      <>
        <Button onClick={s.openIt}>Open modal sheet</Button>
        <Sheet
          {...args}
          open={s.open}
          onClose={s.closeIt}
          footer={
            <>
              <Button variant="ghost" onClick={s.closeIt}>Cancel</Button>
              <Button onClick={s.closeIt}>Submit</Button>
            </>
          }
        >
          <Body />
        </Sheet>
      </>
    );
  },
};

export const Fullscreen: Story = {
  args: { open: false, onClose: () => {}, mode: 'fullscreen', title: 'Onboarding' },
  render: (args) => {
    const s = useOpen();
    return (
      <>
        <Button onClick={s.openIt}>Open fullscreen sheet</Button>
        <Sheet
          {...args}
          open={s.open}
          onClose={s.closeIt}
          footer={
            <>
              <Button variant="ghost" onClick={s.closeIt}>Skip</Button>
              <Button onClick={s.closeIt}>Continue</Button>
            </>
          }
        >
          <Body />
        </Sheet>
      </>
    );
  },
};

export const WideSide: Story = {
  args: { open: false, onClose: () => {}, mode: 'side', side: 'right', width: 800, title: 'Detailed inspector' },
  render: (args) => {
    const s = useOpen();
    return (
      <>
        <Button onClick={s.openIt}>Open wide sheet</Button>
        <Sheet {...args} open={s.open} onClose={s.closeIt}>
          <Body />
        </Sheet>
      </>
    );
  },
};
