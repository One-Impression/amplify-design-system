import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SplitPane } from '@amplify-ai/ui';

const meta = {
  title: 'Components/Layout/SplitPane',
  component: SplitPane,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
  },
} satisfies Meta<typeof SplitPane>;

export default meta;
type Story = StoryObj<typeof meta>;

const Pane = ({ title, color }: { title: string; color: string }) => (
  <div
    style={{
      height: '100%',
      width: '100%',
      padding: 16,
      background: color,
      color: '#1a1a1a',
      fontSize: 14,
    }}
  >
    <strong>{title}</strong>
    <p>Drag the divider to resize.</p>
  </div>
);

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    primary: <Pane title="Left" color="#fef3c7" />,
    secondary: <Pane title="Right" color="#e0e7ff" />,
    defaultSize: 320,
  },
  render: (args) => (
    <div style={{ height: 400, border: '1px solid #ddd', borderRadius: 12, overflow: 'hidden' }}>
      <SplitPane {...args} />
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    primary: <Pane title="Top" color="#dbeafe" />,
    secondary: <Pane title="Bottom" color="#fce7f3" />,
    defaultSize: 200,
  },
  render: (args) => (
    <div style={{ height: 500, border: '1px solid #ddd', borderRadius: 12, overflow: 'hidden' }}>
      <SplitPane {...args} />
    </div>
  ),
};

export const WithMinMax: Story = {
  args: {
    orientation: 'horizontal',
    primary: <Pane title="Constrained 200–500" color="#fef3c7" />,
    secondary: <Pane title="Right" color="#e0e7ff" />,
    minSize: 200,
    maxSize: 500,
    defaultSize: 320,
  },
  render: (args) => (
    <div style={{ height: 400, border: '1px solid #ddd', borderRadius: 12, overflow: 'hidden' }}>
      <SplitPane {...args} />
    </div>
  ),
};

export const Persisted: Story = {
  args: {
    name: 'storybook-demo',
    primary: <Pane title="Persisted" color="#dcfce7" />,
    secondary: <Pane title="Resize then reload — size remembered" color="#fee2e2" />,
    defaultSize: 280,
  },
  render: (args) => (
    <div style={{ height: 400, border: '1px solid #ddd', borderRadius: 12, overflow: 'hidden' }}>
      <SplitPane {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    primary: <Pane title="Locked" color="#f3f4f6" />,
    secondary: <Pane title="Locked" color="#f3f4f6" />,
    defaultSize: 240,
  },
  render: (args) => (
    <div style={{ height: 400, border: '1px solid #ddd', borderRadius: 12, overflow: 'hidden' }}>
      <SplitPane {...args} />
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [size, setSize] = useState(300);
    return (
      <div>
        <div style={{ padding: 12, fontFamily: 'monospace' }}>size = {size}px</div>
        <div style={{ height: 400, border: '1px solid #ddd', borderRadius: 12, overflow: 'hidden' }}>
          <SplitPane
            primary={<Pane title="Left" color="#fef3c7" />}
            secondary={<Pane title="Right" color="#e0e7ff" />}
            size={size}
            onResize={setSize}
            minSize={120}
          />
        </div>
      </div>
    );
  },
};

export const NestedSplit: Story = {
  render: () => (
    <div style={{ height: 500, border: '1px solid #ddd', borderRadius: 12, overflow: 'hidden' }}>
      <SplitPane
        orientation="horizontal"
        defaultSize={260}
        primary={<Pane title="Sidebar" color="#f5f3ff" />}
        secondary={
          <SplitPane
            orientation="vertical"
            defaultSize={200}
            primary={<Pane title="Editor" color="#fff7ed" />}
            secondary={<Pane title="Console" color="#0f172a" />}
          />
        }
      />
    </div>
  ),
};
