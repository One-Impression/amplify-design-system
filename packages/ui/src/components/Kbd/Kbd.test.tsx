import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Kbd } from './Kbd';

describe('Kbd', () => {
  it('renders a static key with role="img"', () => {
    render(<Kbd>K</Kbd>);
    const el = screen.getByRole('img');
    expect(el.textContent).toBe('K');
    expect(el.getAttribute('aria-label')).toBe('K');
  });

  it('renders Mac substitutions for keys=["mod","K"]', () => {
    render(<Kbd keys={['mod', 'K']} isMac />);
    const wrapper = screen.getByRole('img');
    expect(wrapper.textContent).toContain('⌘');
    expect(wrapper.textContent).toContain('K');
    expect(wrapper.getAttribute('aria-label')).toBe('⌘ K');
  });

  it('renders Ctrl on non-Mac for keys=["mod","K"]', () => {
    render(<Kbd keys={['mod', 'K']} isMac={false} />);
    const wrapper = screen.getByRole('img');
    expect(wrapper.textContent).toContain('Ctrl');
    expect(wrapper.getAttribute('aria-label')).toBe('Ctrl K');
  });

  it('respects aria-label override', () => {
    render(<Kbd keys={['mod', 'K']} isMac aria-label="Open palette" />);
    expect(screen.getByLabelText('Open palette')).toBeDefined();
  });
});
