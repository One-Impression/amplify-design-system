import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Switch } from './Switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

const Stateful = (args: any) => {
  const [on, setOn] = useState(args.checked ?? false);
  return <Switch {...args} checked={on} onChange={setOn} />;
};

export const Off: Story = { render: (args) => <Stateful {...args} />, args: { label: 'Notifications', checked: false } };
export const On: Story = { render: (args) => <Stateful {...args} />, args: { label: 'Notifications', checked: true } };
export const NoLabel: Story = { render: (args) => <Stateful {...args} />, args: { checked: false } };
export const DisabledOff: Story = { args: { label: 'Locked', checked: false, disabled: true } };
export const DisabledOn: Story = { args: { label: 'Locked', checked: true, disabled: true } };

export const Stack: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Stateful label="Email notifications" checked />
      <Stateful label="WhatsApp updates" />
      <Stateful label="SMS alerts" disabled />
    </div>
  ),
};
