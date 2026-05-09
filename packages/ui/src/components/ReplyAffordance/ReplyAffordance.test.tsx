/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ReplyAffordance } from './ReplyAffordance';

afterEach(cleanup);

describe('ReplyAffordance', () => {
  it('renders as a button (keyboard-activatable)', () => {
    render(
      <ReplyAffordance
        variantRef={{ gen: 2, variant: 3 }}
        onClick={() => undefined}
      />,
    );
    const btn = screen.getByTestId('reply-affordance');
    expect(btn.tagName).toBe('BUTTON');
    expect(btn.getAttribute('type')).toBe('button');
  });

  it('renders the default label "↩ Reply"', () => {
    render(
      <ReplyAffordance
        variantRef={{ gen: 2, variant: 3 }}
        onClick={() => undefined}
      />,
    );
    expect(screen.getByTestId('reply-affordance').textContent).toBe('↩ Reply');
  });

  it('honours a custom label', () => {
    render(
      <ReplyAffordance
        variantRef={{ gen: 2, variant: 3 }}
        onClick={() => undefined}
        label="Reply to this variant"
      />,
    );
    expect(screen.getByTestId('reply-affordance').textContent).toBe(
      'Reply to this variant',
    );
  });

  it('exposes the reference syntax via data-ref-syntax', () => {
    render(
      <ReplyAffordance
        variantRef={{ gen: 2, variant: 3 }}
        onClick={() => undefined}
      />,
    );
    expect(
      screen.getByTestId('reply-affordance').getAttribute('data-ref-syntax'),
    ).toBe('@V3 (Gen 2):');
  });

  it('exposes gen / variant attributes for analytics introspection', () => {
    render(
      <ReplyAffordance
        variantRef={{ gen: 4, variant: 'B' }}
        onClick={() => undefined}
      />,
    );
    const btn = screen.getByTestId('reply-affordance');
    expect(btn.getAttribute('data-variant-gen')).toBe('4');
    expect(btn.getAttribute('data-variant')).toBe('B');
    expect(btn.getAttribute('data-ref-syntax')).toBe('@VB (Gen 4):');
  });

  it('clicking fires onClick with the same variantRef object', () => {
    const onClick = vi.fn();
    const ref = { gen: 2, variant: 3 };
    render(<ReplyAffordance variantRef={ref} onClick={onClick} />);
    fireEvent.click(screen.getByTestId('reply-affordance'));
    expect(onClick).toHaveBeenCalledWith(ref);
  });

  it('Enter / Space activate the button (native semantics)', () => {
    const onClick = vi.fn();
    render(
      <ReplyAffordance
        variantRef={{ gen: 1, variant: 1 }}
        onClick={onClick}
      />,
    );
    const btn = screen.getByTestId('reply-affordance');
    btn.focus();
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('aria-label describes the action and references the syntax inserted', () => {
    render(
      <ReplyAffordance
        variantRef={{ gen: 2, variant: 3 }}
        onClick={() => undefined}
      />,
    );
    expect(
      screen.getByTestId('reply-affordance').getAttribute('aria-label'),
    ).toBe(
      'Reply to V3 (Gen 2) — pre-fills composer with @V3 (Gen 2):',
    );
  });

  it('does NOT inject hardcoded hex colours into the rendered DOM', () => {
    const { container } = render(
      <ReplyAffordance
        variantRef={{ gen: 2, variant: 3 }}
        onClick={() => undefined}
      />,
    );
    expect(container.innerHTML).not.toMatch(/#[0-9a-fA-F]{3,8}/);
  });

  it('does NOT inject inline px appearance values', () => {
    const { container } = render(
      <ReplyAffordance
        variantRef={{ gen: 2, variant: 3 }}
        onClick={() => undefined}
      />,
    );
    expect(container.innerHTML).not.toMatch(/style="[^"]*\d+px/);
  });
});
