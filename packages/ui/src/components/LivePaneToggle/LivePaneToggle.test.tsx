/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { LivePaneToggle, type LivePaneMode } from './LivePaneToggle';

afterEach(cleanup);

const renderToggle = (
  initial: LivePaneMode = 'variants',
  overrides: Partial<React.ComponentProps<typeof LivePaneToggle>> = {},
) => {
  const onChange = vi.fn();
  const utils = render(
    <LivePaneToggle value={initial} onChange={onChange} {...overrides} />,
  );
  return { onChange, ...utils };
};

describe('LivePaneToggle', () => {
  it('renders three radio buttons (Live / Variants / Split)', () => {
    renderToggle();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByRole('radio', { name: 'Live' })).toBeDefined();
    expect(screen.getByRole('radio', { name: 'Variants' })).toBeDefined();
    expect(screen.getByRole('radio', { name: 'Split' })).toBeDefined();
  });

  it('marks the active option with aria-checked=true and others false', () => {
    renderToggle('split');
    expect(
      screen.getByRole('radio', { name: 'Split' }).getAttribute('aria-checked'),
    ).toBe('true');
    expect(
      screen.getByRole('radio', { name: 'Live' }).getAttribute('aria-checked'),
    ).toBe('false');
    expect(
      screen.getByRole('radio', { name: 'Variants' }).getAttribute('aria-checked'),
    ).toBe('false');
  });

  it('clicking an option fires onChange with that value', () => {
    const { onChange } = renderToggle('variants');
    fireEvent.click(screen.getByRole('radio', { name: 'Live' }));
    expect(onChange).toHaveBeenCalledWith('live');
  });

  it('roving tabindex — only the active option is tabbable', () => {
    renderToggle('split');
    expect(
      screen.getByRole('radio', { name: 'Live' }).getAttribute('tabindex'),
    ).toBe('-1');
    expect(
      screen.getByRole('radio', { name: 'Variants' }).getAttribute('tabindex'),
    ).toBe('-1');
    expect(
      screen.getByRole('radio', { name: 'Split' }).getAttribute('tabindex'),
    ).toBe('0');
  });

  it('ArrowRight cycles to next; ArrowLeft to previous (wraps)', () => {
    const { onChange } = renderToggle('variants');
    fireEvent.keyDown(screen.getByRole('radio', { name: 'Variants' }), {
      key: 'ArrowRight',
    });
    expect(onChange).toHaveBeenLastCalledWith('split');
    fireEvent.keyDown(screen.getByRole('radio', { name: 'Variants' }), {
      key: 'ArrowLeft',
    });
    expect(onChange).toHaveBeenLastCalledWith('live');
  });

  it('Home / End jump to first / last', () => {
    const { onChange } = renderToggle('variants');
    fireEvent.keyDown(screen.getByRole('radio', { name: 'Variants' }), {
      key: 'Home',
    });
    expect(onChange).toHaveBeenLastCalledWith('live');
    fireEvent.keyDown(screen.getByRole('radio', { name: 'Variants' }), {
      key: 'End',
    });
    expect(onChange).toHaveBeenLastCalledWith('split');
  });

  it('Enter / Space activate the focused option', () => {
    const { onChange } = renderToggle('variants');
    fireEvent.keyDown(screen.getByRole('radio', { name: 'Live' }), { key: 'Enter' });
    expect(onChange).toHaveBeenLastCalledWith('live');
    fireEvent.keyDown(screen.getByRole('radio', { name: 'Split' }), { key: ' ' });
    expect(onChange).toHaveBeenLastCalledWith('split');
  });

  it('renders with role=radiogroup and the configured ariaLabel', () => {
    renderToggle('live', { ariaLabel: 'Studio pane mode' });
    expect(
      screen.getByRole('radiogroup', { name: 'Studio pane mode' }),
    ).toBeDefined();
  });

  it('exposes liveUrl via data-live-url attribute when provided', () => {
    const { container } = renderToggle('split', { liveUrl: 'https://app.example.com' });
    const wrap = container.querySelector('[role="radiogroup"]') as HTMLElement;
    expect(wrap.getAttribute('data-live-url')).toBe('https://app.example.com');
  });

  it('omits data-live-url when liveUrl is not provided', () => {
    const { container } = renderToggle();
    const wrap = container.querySelector('[role="radiogroup"]') as HTMLElement;
    expect(wrap.hasAttribute('data-live-url')).toBe(false);
  });

  it('disabled — aria-disabled set, click does not fire onChange', () => {
    const { onChange } = renderToggle('variants', { disabled: true });
    expect(
      screen.getByRole('radiogroup').getAttribute('aria-disabled'),
    ).toBe('true');
    fireEvent.click(screen.getByRole('radio', { name: 'Live' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does NOT inject hardcoded hex colours into the rendered DOM', () => {
    const { container } = renderToggle();
    expect(container.innerHTML).not.toMatch(/#[0-9a-fA-F]{3,8}/);
  });

  it('does NOT inject hardcoded px appearance values into the rendered DOM', () => {
    const { container } = renderToggle();
    // Allow tailwind utility tokens (`px-3`, `py-1`, `gap-0.5`) — block
    // explicit `Npx` literals in the DOM (they only appear if a hex / px
    // bypasses tokens). The DOM stringified by jsdom contains only
    // class names, never the resolved CSS, so any literal like
    // `style="padding: 12px"` would be a smoking gun.
    expect(container.innerHTML).not.toMatch(/style="[^"]*\d+px/);
  });
});
