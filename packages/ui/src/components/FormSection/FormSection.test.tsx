import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormSection } from './FormSection';

describe('FormSection', () => {
  it('renders title and description in the static variant', () => {
    render(
      <FormSection title="Account" description="How we identify you">
        <div>child</div>
      </FormSection>
    );
    expect(screen.getByText('Account')).toBeDefined();
    expect(screen.getByText('How we identify you')).toBeDefined();
    expect(screen.getByText('child')).toBeDefined();
  });

  it('renders inside a CollapsibleSection when collapsible', () => {
    render(
      <FormSection title="Advanced" collapsible defaultOpen={false}>
        <div>hidden child</div>
      </FormSection>
    );
    // CollapsibleSection trigger button exposes aria-expanded
    const trigger = screen.getByRole('button');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(screen.getByText('Advanced')).toBeDefined();
  });
});
