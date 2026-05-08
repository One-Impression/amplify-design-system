import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FieldError } from './FieldError';

describe('FieldError', () => {
  it('renders nothing when children is empty', () => {
    const { container } = render(<FieldError>{''}</FieldError>);
    expect(container.firstChild).toBeNull();
  });

  it('renders with role="alert" when a message is provided', () => {
    render(<FieldError>Bad email</FieldError>);
    const alert = screen.getByRole('alert');
    expect(alert).toBeDefined();
    expect(alert.textContent).toContain('Bad email');
  });

  it('uses the provided id so aria-describedby can target it', () => {
    render(<FieldError id="x-error">Boom</FieldError>);
    const alert = screen.getByRole('alert');
    expect(alert.id).toBe('x-error');
  });
});
