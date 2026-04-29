import type { Meta, StoryObj } from '@storybook/react';
import { BentoGrid, BentoItem } from '@amplify-ai/ui';

const meta = {
  title: 'Components/Layout/BentoGrid',
  component: BentoGrid,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof BentoGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const Cell = ({ title, hint }: { title: string; hint?: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 4 }}>
    <div style={{ fontWeight: 600 }}>{title}</div>
    {hint && <div style={{ fontSize: 12, color: '#888' }}>{hint}</div>}
  </div>
);

export const Default: Story = {
  render: (args) => (
    <BentoGrid {...args}>
      <BentoItem size="2x2"><Cell title="Hero" hint="2×2" /></BentoItem>
      <BentoItem><Cell title="Stat A" hint="1×1" /></BentoItem>
      <BentoItem><Cell title="Stat B" hint="1×1" /></BentoItem>
      <BentoItem size="1x2"><Cell title="Sidebar" hint="1×2" /></BentoItem>
      <BentoItem size="2x1"><Cell title="Long row" hint="2×1" /></BentoItem>
      <BentoItem><Cell title="Note" hint="1×1" /></BentoItem>
    </BentoGrid>
  ),
};

export const ThreeColumns: Story = {
  args: { columns: 3 },
  render: (args) => (
    <BentoGrid {...args}>
      <BentoItem size="2x2"><Cell title="Featured" /></BentoItem>
      <BentoItem><Cell title="A" /></BentoItem>
      <BentoItem><Cell title="B" /></BentoItem>
      <BentoItem><Cell title="C" /></BentoItem>
      <BentoItem size="2x1"><Cell title="D (2×1)" /></BentoItem>
    </BentoGrid>
  ),
};

export const SixColumns: Story = {
  args: { columns: 6 },
  render: (args) => (
    <BentoGrid {...args}>
      {Array.from({ length: 12 }).map((_, i) => (
        <BentoItem key={i}><Cell title={`#${i + 1}`} /></BentoItem>
      ))}
    </BentoGrid>
  ),
};

export const VariedSizes: Story = {
  render: (args) => (
    <BentoGrid {...args}>
      <BentoItem size="1x2"><Cell title="Tall" hint="1×2" /></BentoItem>
      <BentoItem size="2x1"><Cell title="Wide" hint="2×1" /></BentoItem>
      <BentoItem><Cell title="Small" hint="1×1" /></BentoItem>
      <BentoItem size="2x2"><Cell title="Huge" hint="2×2" /></BentoItem>
      <BentoItem><Cell title="Small 2" /></BentoItem>
      <BentoItem><Cell title="Small 3" /></BentoItem>
    </BentoGrid>
  ),
};

export const CompactGap: Story = {
  args: { gap: 6 },
  render: (args) => (
    <BentoGrid {...args}>
      {Array.from({ length: 8 }).map((_, i) => (
        <BentoItem key={i}><Cell title={`Tile ${i + 1}`} /></BentoItem>
      ))}
    </BentoGrid>
  ),
};

export const TallRows: Story = {
  args: { rowHeight: 200 },
  render: (args) => (
    <BentoGrid {...args}>
      <BentoItem size="2x2"><Cell title="Tall hero" /></BentoItem>
      <BentoItem><Cell title="A" /></BentoItem>
      <BentoItem><Cell title="B" /></BentoItem>
    </BentoGrid>
  ),
};

export const CollapsibleOnMobile: Story = {
  args: { collapseBelow: 800 },
  render: (args) => (
    <div style={{ resize: 'horizontal', overflow: 'auto', border: '1px dashed #ccc', padding: 8 }}>
      <BentoGrid {...args}>
        <BentoItem size="2x2"><Cell title="Resize me" hint="Drag the bottom-right corner of this box" /></BentoItem>
        <BentoItem><Cell title="A" /></BentoItem>
        <BentoItem><Cell title="B" /></BentoItem>
        <BentoItem size="2x1"><Cell title="C" /></BentoItem>
      </BentoGrid>
    </div>
  ),
};
