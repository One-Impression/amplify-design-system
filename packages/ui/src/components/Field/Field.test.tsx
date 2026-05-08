import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Field } from './Field';
import { Input } from '../Input/Input';

describe('Field', () => {
  it('associates the label with the input via htmlFor / id', () => {
    render(
      <Field name="email" label="Email address">
        {(p) => <Input {...p} />}
      </Field>
    );
    const input = screen.getByLabelText('Email address');
    expect(input).toBeDefined();
    expect(input.id).toBeTruthy();
  });

  it('wires hint and error into aria-describedby and aria-invalid', () => {
    render(
      <Field name="email" label="Email" hint="We never share this" error="Bad email">
        {(p) => <Input {...p} />}
      </Field>
    );
    const input = screen.getByLabelText('Email');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    const describedBy = input.getAttribute('aria-describedby') ?? '';
    expect(describedBy).toContain('-error');
    // Hint is hidden when an error is present, so describedby should NOT
    // include the hint id.
    expect(describedBy).not.toContain('-hint');
    // Error renders with role="alert"
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('renders the asterisk and aria-required when required', () => {
    render(
      <Field name="name" label="Full name" required>
        {(p) => <Input {...p} />}
      </Field>
    );
    const input = screen.getByLabelText(/full name/i);
    expect(input.getAttribute('aria-required')).toBe('true');
  });

  it('shows hint id in aria-describedby when no error is set', () => {
    render(
      <Field name="bio" label="Bio" hint="Markdown supported">
        {(p) => <Input {...p} />}
      </Field>
    );
    const input = screen.getByLabelText('Bio');
    const describedBy = input.getAttribute('aria-describedby') ?? '';
    expect(describedBy).toContain('-hint');
  });
});
