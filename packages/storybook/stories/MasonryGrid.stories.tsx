import type { Meta, StoryObj } from '@storybook/react';
import { MasonryGrid } from '@amplify-ai/ui';

const meta = {
  title: 'Components/Layout/MasonryGrid',
  component: MasonryGrid,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof MasonryGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleHeights = [120, 220, 160, 320, 80, 240, 180, 140, 200, 260, 100, 300];

const Card = ({ i, h }: { i: number; h: number }) => (
  <div
    style={{
      height: h,
      borderRadius: 16,
      border: '1px solid #e5e5e5',
      background: 'linear-gradient(135deg, #faf7ff, #ece4ff)',
      padding: 12,
      fontSize: 14,
      fontWeight: 500,
    }}
  >
    Card #{i + 1} · {h}px
  </div>
);

export const Default: Story = {
  render: (args) => (
    <MasonryGrid {...args}>
      {sampleHeights.map((h, i) => (
        <Card key={i} i={i} h={h} />
      ))}
    </MasonryGrid>
  ),
};

export const TwoColumns: Story = {
  args: { columns: 2 },
  render: (args) => (
    <MasonryGrid {...args}>
      {sampleHeights.map((h, i) => (
        <Card key={i} i={i} h={h} />
      ))}
    </MasonryGrid>
  ),
};

export const FourColumns: Story = {
  args: { columns: 4 },
  render: (args) => (
    <MasonryGrid {...args}>
      {sampleHeights.map((h, i) => (
        <Card key={i} i={i} h={h} />
      ))}
    </MasonryGrid>
  ),
};

export const TightGap: Story = {
  args: { columns: 3, gap: 6 },
  render: (args) => (
    <MasonryGrid {...args}>
      {sampleHeights.map((h, i) => (
        <Card key={i} i={i} h={h} />
      ))}
    </MasonryGrid>
  ),
};

export const Responsive: Story = {
  args: {
    breakpoints: [
      { columns: 1, minWidth: 0 },
      { columns: 2, minWidth: 480 },
      { columns: 4, minWidth: 1024 },
    ],
  },
  render: (args) => (
    <div style={{ resize: 'horizontal', overflow: 'auto', border: '1px dashed #ccc', padding: 8 }}>
      <MasonryGrid {...args}>
        {sampleHeights.map((h, i) => (
          <Card key={i} i={i} h={h} />
        ))}
      </MasonryGrid>
    </div>
  ),
};

export const Sparse: Story = {
  render: (args) => (
    <MasonryGrid {...args}>
      {sampleHeights.slice(0, 4).map((h, i) => (
        <Card key={i} i={i} h={h} />
      ))}
    </MasonryGrid>
  ),
};

export const Many: Story = {
  args: { columns: 5 },
  render: (args) => (
    <MasonryGrid {...args}>
      {Array.from({ length: 30 }).map((_, i) => {
        const h = 100 + ((i * 37) % 240);
        return <Card key={i} i={i} h={h} />;
      })}
    </MasonryGrid>
  ),
};
