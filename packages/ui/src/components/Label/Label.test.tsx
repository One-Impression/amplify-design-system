import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label } from './Label';

describe('Label', () => {
  it('renders a real <label> with the provided text', () => {
    render(<Label htmlFor="x">Email</Label>);
    const label = screen.getByText('Email');
    expect(label.tagName.toLowerCase()).toBe('label');
    expect(label.getAttribute('for')).toBe('x');
  });

  it('renders an asterisk when required (aria-hidden)', () => {
    const { container } = render(<Label required>Name</Label>);
    const asterisk = container.querySelector('span[aria-hidden="true"]');
    expect(asterisk).not.toBeNull();
    expect(asterisk?.textContent).toBe('*');
  });

  it('forwards ref to the underlying label element', () => {
    const ref = React.createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Hello</Label>);
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });
});
