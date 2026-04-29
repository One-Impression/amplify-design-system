import type { Meta, StoryObj } from '@storybook/react';
import { HoverCard, Avatar, Button } from '@amplify-ai/ui';

const meta = {
  title: 'Components/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
  argTypes: {
    side: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
  },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const ProfileContent = () => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
      <Avatar name="Riya Mehta" size="md" />
      <div>
        <div style={{ fontWeight: 600 }}>Riya Mehta</div>
        <div style={{ fontSize: 12, color: 'var(--amp-semantic-text-muted)' }}>@riyacreates</div>
      </div>
    </div>
    <p style={{ fontSize: 13, color: 'var(--amp-semantic-text-secondary)', margin: '0 0 12px' }}>
      Lifestyle creator · Mumbai · 480K reach. Brand favorites: skincare, wellness.
    </p>
    <Button size="sm">Add to campaign</Button>
  </div>
);

export const ProfilePreview: Story = {
  args: { content: <ProfileContent /> },
  render: (args) => (
    <div style={{ padding: 80 }}>
      <HoverCard {...args}>
        <a href="#" style={{ color: 'var(--amp-semantic-accent, #6531FF)', textDecoration: 'underline' }}>
          @riyacreates
        </a>
      </HoverCard>
    </div>
  ),
};

export const SideTop: Story = {
  args: { side: 'top', content: <ProfileContent /> },
  render: (args) => (
    <div style={{ padding: 120 }}>
      <HoverCard {...args}>
        <span style={{ fontWeight: 600 }}>Hover me (top)</span>
      </HoverCard>
    </div>
  ),
};

export const SideRight: Story = {
  args: { side: 'right', content: <div>Quick info on the right side.</div> },
  render: (args) => (
    <div style={{ padding: 80 }}>
      <HoverCard {...args}>
        <span style={{ fontWeight: 600 }}>Hover me (right)</span>
      </HoverCard>
    </div>
  ),
};

export const NarrowWidth: Story = {
  args: { width: 220, content: <div>Compact preview content fits a 220px box.</div> },
  render: (args) => (
    <div style={{ padding: 80 }}>
      <HoverCard {...args}>
        <span style={{ fontWeight: 600 }}>Hover (narrow)</span>
      </HoverCard>
    </div>
  ),
};

export const SlowOpen: Story = {
  args: { openDelay: 800, content: <div>Opens after 800ms.</div> },
  render: (args) => (
    <div style={{ padding: 80 }}>
      <HoverCard {...args}>
        <span style={{ fontWeight: 600 }}>Hover (slow)</span>
      </HoverCard>
    </div>
  ),
};
