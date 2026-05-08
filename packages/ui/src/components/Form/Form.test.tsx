import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Form, type FormSchema } from './Form';
import { Field } from '../Field/Field';
import { Input } from '../Input/Input';

describe('Form', () => {
  it('renders a real <form> and calls onSubmit with collected values', async () => {
    const onSubmit = vi.fn();
    render(
      <Form defaultValues={{ name: 'Ada' }} onSubmit={onSubmit}>
        <Field name="name" label="Name">
          {(p) => <Input {...p} defaultValue="Ada" />}
        </Field>
        <button type="submit">Save</button>
      </Form>
    );
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    const payload = onSubmit.mock.calls[0][0];
    expect(payload.isValid).toBe(true);
    expect(payload.values).toBeDefined();
  });

  it('marks payload invalid when schema rejects', async () => {
    const schema: FormSchema = {
      safeParse: (input) => {
        const v = (input ?? {}) as Record<string, unknown>;
        if (!v.name) {
          return { success: false, error: { issues: [{ path: ['name'], message: 'Required' }] } };
        }
        return { success: true, data: v };
      },
    };
    const onSubmit = vi.fn();
    render(
      <Form schema={schema} onSubmit={onSubmit}>
        <Field name="name" label="Name">
          {(p) => <Input {...p} />}
        </Field>
        <button type="submit">Save</button>
      </Form>
    );
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    const payload = onSubmit.mock.calls[0][0];
    expect(payload.isValid).toBe(false);
  });

  it('surfaces schema errors on the matching <Field> after submit', async () => {
    const schema: FormSchema = {
      safeParse: () => ({
        success: false,
        error: { issues: [{ path: ['email'], message: 'Bad email' }] },
      }),
    };
    render(
      <Form schema={schema}>
        <Field name="email" label="Email">
          {(p) => <Input {...p} />}
        </Field>
        <button type="submit">Submit</button>
      </Form>
    );
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeDefined();
      expect(screen.getByText('Bad email')).toBeDefined();
    });
  });
});
