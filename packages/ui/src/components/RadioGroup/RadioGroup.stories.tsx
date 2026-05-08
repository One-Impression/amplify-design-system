import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Radio, RadioGroup } from './RadioGroup';

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Accessible radio group with full keyboard navigation. Use children-based composition with `<Radio>` items. Status: beta (since 2.6.0).',
      },
    },
  },
  argTypes: {
    name: { control: 'text' },
    orientation: { control: 'select', options: ['vertical', 'horizontal'] },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    label: { control: 'text' },
    error: { control: 'text' },
    helperText: { control: 'text' },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

type StatefulArgs = Partial<
  Omit<React.ComponentProps<typeof RadioGroup>, 'children' | 'value' | 'onValueChange'>
> & {
  initial?: string | null;
};

const Stateful = (args: StatefulArgs) => {
  const [value, setValue] = useState<string | null>(args.initial ?? null);
  const { initial: _initial, name = 'demo', ...rest } = args;
  return (
    <RadioGroup name={name} {...rest} value={value} onValueChange={setValue}>
      <Radio value="red">Red</Radio>
      <Radio value="green">Green</Radio>
      <Radio value="blue">Blue</Radio>
      <Radio value="violet" disabled>
        Violet (disabled)
      </Radio>
    </RadioGroup>
  );
};

export const Default: Story = {
  render: (args) => <Stateful {...args} />,
  args: { name: 'color', label: 'Pick a color', helperText: 'Use arrow keys to navigate.' },
};

export const WithSelection: Story = {
  render: (args) => <Stateful {...args} initial="green" />,
  args: { name: 'color-with-selection', label: 'Pick a color' },
};

export const Horizontal: Story = {
  render: (args) => <Stateful {...args} initial="red" />,
  args: { name: 'color-horizontal', label: 'Pick a color', orientation: 'horizontal' },
};

export const WithError: Story = {
  render: (args) => <Stateful {...args} />,
  args: {
    name: 'color-error',
    label: 'Pick a color',
    error: 'Please choose a color before continuing.',
  },
};

export const ReadOnly: Story = {
  render: (args) => <Stateful {...args} initial="blue" />,
  args: {
    name: 'color-readonly',
    label: 'Selected color (read-only)',
    readOnly: true,
    helperText: 'Selection is locked.',
  },
};

export const Disabled: Story = {
  render: (args) => <Stateful {...args} initial="green" />,
  args: {
    name: 'color-disabled',
    label: 'Locked group',
    disabled: true,
  },
};
