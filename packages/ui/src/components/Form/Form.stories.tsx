import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Form } from './Form';
import { Field } from '../Field/Field';
import { FormSection } from '../FormSection/FormSection';
import { Input } from '../Input/Input';
import { Textarea } from '../Textarea/Textarea';
import { Button } from '../Button/Button';

const meta = {
  title: 'Forms/Form',
  component: Form,
  tags: ['autodocs'],
  parameters: { status: 'beta' },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Form
      defaultValues={{ name: '', email: '' }}
      onSubmit={({ values, isValid }) => {
        // eslint-disable-next-line no-console
        console.log('submit', { values, isValid });
      }}
      style={{ width: 360 }}
    >
      <Field name="name" label="Full name" required>
        {(props) => <Input {...props} placeholder="Ada Lovelace" />}
      </Field>
      <Field name="email" label="Email" hint="We never share this">
        {(props) => <Input {...props} type="email" placeholder="ada@analytical.engine" />}
      </Field>
      <Button type="submit">Save</Button>
    </Form>
  ),
};

/**
 * Demonstrates schema-driven validation. Uses a hand-rolled adapter that
 * matches the `FormSchema` interface — works identically with a real zod
 * schema.
 */
export const WithSchemaValidation: Story = {
  render: function WithSchemaValidationStory() {
    const [submitted, setSubmitted] = useState<{ ok: boolean; values: unknown } | null>(null);
    const schema = {
      safeParse(input: unknown) {
        const v = (input ?? {}) as Record<string, unknown>;
        const issues: Array<{ path: string[]; message: string }> = [];
        if (!v.name || (typeof v.name === 'string' && v.name.length < 2)) {
          issues.push({ path: ['name'], message: 'Name must be at least 2 characters' });
        }
        if (!v.email || !String(v.email).includes('@')) {
          issues.push({ path: ['email'], message: 'Enter a valid email' });
        }
        return issues.length ? { success: false, error: { issues } } : { success: true, data: v };
      },
    };
    return (
      <div style={{ width: 360 }}>
        <Form
          schema={schema}
          onSubmit={({ values, isValid }) => setSubmitted({ ok: isValid, values })}
        >
          <Field name="name" label="Full name" required>
            {(props) => <Input {...props} placeholder="Try submitting empty" />}
          </Field>
          <Field name="email" label="Email" required>
            {(props) => <Input {...props} type="email" placeholder="missing-at-sign" />}
          </Field>
          <Button type="submit">Validate</Button>
        </Form>
        {submitted && (
          <pre
            style={{
              marginTop: 12,
              fontSize: 12,
              padding: 8,
              background: 'var(--amp-semantic-bg-sunken)',
              borderRadius: 8,
            }}
          >
            {JSON.stringify(submitted, null, 2)}
          </pre>
        )}
      </div>
    );
  },
};

export const WithSections: Story = {
  render: () => (
    <Form style={{ width: 480 }} defaultValues={{}}>
      <FormSection title="Account" description="How we identify you">
        <Field name="name" label="Display name" required>
          {(props) => <Input {...props} />}
        </Field>
        <Field name="email" label="Email">
          {(props) => <Input {...props} type="email" />}
        </Field>
      </FormSection>
      <FormSection title="Profile" description="Optional details">
        <Field name="bio" label="Bio" hint="Markdown supported">
          {(props) => <Textarea {...props} rows={3} />}
        </Field>
      </FormSection>
      <Button type="submit">Save profile</Button>
    </Form>
  ),
};
