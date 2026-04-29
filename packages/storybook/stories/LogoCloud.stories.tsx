import type { Meta, StoryObj } from '@storybook/react';
import { LogoCloud } from '@amplify-ai/ui';

const meta = {
  title: 'Marketing/LogoCloud',
  component: LogoCloud,
  tags: ['autodocs'],
  argTypes: {
    colorMode: { control: 'select', options: ['greyscale', 'colour', 'colour-on-hover'] },
    columns: { control: 'select', options: [3, 4, 5, 6] },
  },
} satisfies Meta<typeof LogoCloud>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  { name: 'Acme' },
  { name: 'Globex' },
  { name: 'Initech' },
  { name: 'Umbrella' },
  { name: 'Hooli' },
  { name: 'Massive Dynamic' },
];

export const Default: Story = { args: { items, title: 'Trusted by teams at' } };

export const NoTitle: Story = { args: { items } };

export const Colour: Story = { args: { items, colorMode: 'colour', title: 'Our partners' } };

export const ColourOnHover: Story = {
  args: { items, colorMode: 'colour-on-hover', title: 'Hover to see brand colours' },
};

export const SixColumns: Story = { args: { items, columns: 6, title: 'Trusted by' } };

export const ThreeColumns: Story = { args: { items: items.slice(0, 3), columns: 3, title: 'Featured' } };

export const WithLinks: Story = {
  args: {
    items: items.map((it) => ({ ...it, href: '#' })),
    colorMode: 'colour-on-hover',
    title: 'Click any logo',
  },
};
