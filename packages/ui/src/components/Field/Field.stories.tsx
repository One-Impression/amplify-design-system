import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Field } from './Field';
import { Input } from '../Input/Input';
import { Select } from '../Select/Select';

const meta = {
  title: 'Forms/Field',
  component: Field,
  tags: ['autodocs'],
  parameters: { status: 'beta' },
  argTypes: {
    layout: { control: 'radio', options: ['stacked', 'inline'] },
    required: { control: 'boolean' },
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'campaign',
    label: 'Campaign name',
    hint: 'Visible to creators in their dashboard',
    required: false,
    layout: 'stacked',
  },
  render: (args) => (
    <div style={{ width: 360 }}>
      <Field {...args}>{(props) => <Input {...props} placeholder="Spring 2026 launch" />}</Field>
    </div>
  ),
};

export const WithError: Story = {
  args: { name: 'email', label: 'Email', error: 'Enter a valid email address' },
  render: (args) => (
    <div style={{ width: 360 }}>
      <Field {...args}>{(props) => <Input {...props} type="email" defaultValue="not-an-email" />}</Field>
    </div>
  ),
};

export const Required: Story = {
  args: { name: 'name', label: 'Full name', required: true, hint: 'Required for invoicing' },
  render: (args) => (
    <div style={{ width: 360 }}>
      <Field {...args}>{(props) => <Input {...props} />}</Field>
    </div>
  ),
};

export const InlineLayout: Story = {
  args: { name: 'currency', label: 'Currency', layout: 'inline' },
  render: (args) => (
    <div style={{ width: 480 }}>
      <Field {...args}>
        {(props) => (
          <Select
            {...props}
            options={[
              { value: 'USD', label: 'USD — US Dollar' },
              { value: 'INR', label: 'INR — Indian Rupee' },
              { value: 'EUR', label: 'EUR — Euro' },
            ]}
          />
        )}
      </Field>
    </div>
  ),
};
