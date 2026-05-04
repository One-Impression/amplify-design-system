import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { FormSection } from './FormSection';
import { Field } from '../Field/Field';
import { Input } from '../Input/Input';

const meta = {
  title: 'Forms/FormSection',
  component: FormSection,
  tags: ['autodocs'],
  parameters: { status: 'beta' },
  argTypes: {
    collapsible: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
  },
} satisfies Meta<typeof FormSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Account details',
    description: 'How we identify you across Amplify products',
  },
  render: (args) => (
    <div style={{ width: 480 }}>
      <FormSection {...args}>
        <Field name="name" label="Full name" required>
          {(props) => <Input {...props} />}
        </Field>
        <Field name="email" label="Email">
          {(props) => <Input {...props} type="email" />}
        </Field>
      </FormSection>
    </div>
  ),
};

export const Collapsible: Story = {
  args: {
    title: 'Advanced settings',
    description: 'Tweak only if you know what these do',
    collapsible: true,
    defaultOpen: false,
  },
  render: (args) => (
    <div style={{ width: 480 }}>
      <FormSection {...args}>
        <Field name="webhook" label="Webhook URL" hint="POST destination for events">
          {(props) => <Input {...props} placeholder="https://hooks.example.com/abc" />}
        </Field>
      </FormSection>
    </div>
  ),
};

export const StackedSections: Story = {
  render: () => (
    <div style={{ width: 480, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <FormSection title="Brand info" description="Used on invoices and creator briefs">
        <Field name="brand" label="Brand name" required>
          {(props) => <Input {...props} />}
        </Field>
      </FormSection>
      <FormSection title="Billing" description="Where we send your receipts">
        <Field name="billingEmail" label="Billing email">
          {(props) => <Input {...props} type="email" />}
        </Field>
      </FormSection>
    </div>
  ),
};
