import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

const Stateful = (args: any) => {
  const [on, setOn] = useState(args.checked ?? false);
  return <Checkbox {...args} checked={on} onChange={setOn} />;
};

export const Unchecked: Story = { render: (args) => <Stateful {...args} />, args: { label: 'I agree' } };
export const Checked: Story = { render: (args) => <Stateful {...args} />, args: { label: 'I agree', checked: true } };
export const NoLabel: Story = { render: (args) => <Stateful {...args} />, args: {} };
export const DisabledUnchecked: Story = { args: { label: 'Locked', disabled: true } };
export const DisabledChecked: Story = { args: { label: 'Locked', checked: true, disabled: true } };

export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Stateful label="Beauty" checked />
      <Stateful label="Lifestyle" />
      <Stateful label="Tech" />
      <Stateful label="Fashion" checked />
      <Stateful label="Food" disabled />
    </div>
  ),
};
