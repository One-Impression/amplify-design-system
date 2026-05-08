import type { Meta, StoryObj } from '@storybook/react';
import { Card, Button, Badge } from '@amplify-ai/ui';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'interactive', 'outlined', 'ghost'],
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'compact', 'default', 'comfortable'],
    },
    hover: { control: 'select', options: ['interactive', 'static'] },
    as: { control: 'select', options: ['div', 'article', 'section', 'li', 'button'] },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Plain variants (backward-compat) ────────────────────────────────────────

export const Default: Story = {
  args: {
    children: (
      <div>
        <h3 style={{ fontWeight: 600, marginBottom: 4 }}>Campaign Stats</h3>
        <p style={{ color: '#666', fontSize: 14 }}>15 active campaigns this month</p>
      </div>
    ),
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: (
      <div>
        <h3 style={{ fontWeight: 600, marginBottom: 4 }}>Revenue Overview</h3>
        <p style={{ fontSize: 24, fontWeight: 700 }}>$12,450</p>
      </div>
    ),
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: <p>Outlined card for emphasis</p>,
  },
};

export const Clickable: Story = {
  args: {
    variant: 'default',
    onClick: () => alert('Card clicked!'),
    children: <p>Click me — I have hover, focus and keyboard activation states.</p>,
  },
};

export const PolymorphicButton: Story = {
  args: {
    as: 'button',
    onClick: () => alert('Native button click'),
    children: <p>Rendered as a real &lt;button&gt; element.</p>,
  },
};

export const AllVariants: Story = {
  args: { children: 'placeholder' },
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {(['default', 'elevated', 'interactive', 'outlined', 'ghost'] as const).map((v) => (
        <Card key={v} variant={v} padding="default">
          <p style={{ fontWeight: 600 }}>{v}</p>
          <p style={{ fontSize: 12, color: '#888' }}>Card variant</p>
        </Card>
      ))}
    </div>
  ),
};

// ─── Slot composition ────────────────────────────────────────────────────────

export const FullSlots: Story = {
  args: { children: 'placeholder' },
  render: () => (
    <Card variant="elevated" padding="comfortable" style={{ maxWidth: 360 }}>
      <Card.Header
        title="Q4 Performance"
        subtitle="Updated 2 minutes ago"
        badge={<Badge variant="positive">Live</Badge>}
      />
      <Card.Media>
        <img
          alt="Mountain landscape"
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=60"
          style={{ width: '100%', display: 'block' }}
        />
      </Card.Media>
      <Card.Body>
        <p style={{ fontSize: 14, color: '#444' }}>
          All campaigns running at or above pace. Three are forecast to overdeliver this
          quarter.
        </p>
      </Card.Body>
      <Card.Footer>
        <span style={{ fontSize: 12, color: '#888' }}>Last sync: 12:04 PM</span>
      </Card.Footer>
      <Card.Actions>
        <Button variant="ghost" size="sm">
          Dismiss
        </Button>
        <Button variant="primary" size="sm">
          View report
        </Button>
      </Card.Actions>
    </Card>
  ),
};

export const HeaderWithIconAndBadge: Story = {
  args: { children: 'placeholder' },
  render: () => (
    <Card variant="default" padding="default" style={{ maxWidth: 360 }}>
      <Card.Header
        icon={
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: '#EDE9FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6531FF',
              fontWeight: 700,
            }}
          >
            A
          </div>
        }
        title="Aria"
        subtitle="Creator copilot"
        badge={<Badge variant="positive">Online</Badge>}
      />
      <Card.Body>
        <p style={{ fontSize: 14 }}>Replied to 14 brand briefs in the last hour.</p>
      </Card.Body>
    </Card>
  ),
};

export const PaddingScale: Story = {
  args: { children: 'placeholder' },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      {(['compact', 'default', 'comfortable'] as const).map((p) => (
        <Card key={p} variant="default" padding={p}>
          <p style={{ fontWeight: 600 }}>{p}</p>
          <p style={{ fontSize: 12, color: '#888' }}>padding={p}</p>
        </Card>
      ))}
    </div>
  ),
};

export const InteractiveAuto: Story = {
  args: { children: 'placeholder' },
  render: () => (
    <Card
      variant="default"
      padding="comfortable"
      onClick={() => alert('clicked')}
      style={{ maxWidth: 360 }}
    >
      <Card.Header
        title="Auto-interactive"
        subtitle="Hover/focus styling enabled because onClick is set."
      />
      <Card.Body>
        <p style={{ fontSize: 14 }}>
          Reports role=button, tabIndex=0, activates on Enter / Space.
        </p>
      </Card.Body>
    </Card>
  ),
};
