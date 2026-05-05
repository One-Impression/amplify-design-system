/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MapNode } from './MapNode';

afterEach(cleanup);

describe('MapNode', () => {
  it('renders the label and lens tag', () => {
    render(
      <MapNode
        id="n1"
        state="ready"
        label="v1 · editorial"
        lensTag="editorial"
        x={10}
        y={20}
      />,
    );
    expect(screen.getByTestId('map-node-label').textContent).toBe('v1 · editorial');
    expect(screen.getByTestId('map-node-lens').textContent).toBe('editorial');
  });

  it('positions the node absolutely using x/y/width', () => {
    render(<MapNode id="n1" state="ready" x={42} y={84} width={200} label="v1" />);
    const node = screen.getByRole('group', { name: /Map node v1/ });
    expect(node.style.position).toBe('absolute');
    expect(node.style.left).toBe('42px');
    expect(node.style.top).toBe('84px');
    expect(node.style.width).toBe('200px');
  });

  it('uses default width=180 when not provided', () => {
    render(<MapNode id="n1" state="ready" x={0} y={0} label="v1" />);
    const node = screen.getByRole('group', { name: /Map node v1/ });
    expect(node.style.width).toBe('180px');
  });

  it('exposes data-state and data-selected attributes for styling hooks', () => {
    const { rerender } = render(
      <MapNode id="n1" state="generating" x={0} y={0} label="v1" />,
    );
    const node = screen.getByRole('group', { name: /Map node v1/ });
    expect(node.getAttribute('data-state')).toBe('generating');
    expect(node.getAttribute('data-selected')).toBe('false');

    rerender(<MapNode id="n1" state="focus" selected x={0} y={0} label="v1" />);
    const node2 = screen.getByRole('group', { name: /Map node v1/ });
    expect(node2.getAttribute('data-state')).toBe('focus');
    expect(node2.getAttribute('data-selected')).toBe('true');
  });

  it('generating state renders the shimmer body with role="status"', () => {
    render(<MapNode id="n1" state="generating" x={0} y={0} label="v1" />);
    const shimmer = screen.getByTestId('map-node-shimmer');
    expect(shimmer).toBeDefined();
    expect(shimmer.getAttribute('role')).toBe('status');
    expect(shimmer.getAttribute('aria-label')).toBe('Generating v1');
  });

  it('does NOT render shimmer when state !== generating', () => {
    render(<MapNode id="n1" state="ready" x={0} y={0} label="v1" />);
    expect(screen.queryByTestId('map-node-shimmer')).toBeNull();
  });

  it('locked=true renders the lock badge', () => {
    render(
      <MapNode id="n1" state="ready" x={0} y={0} label="v1" locked />,
    );
    expect(screen.getByTestId('map-node-lock-badge')).toBeDefined();
  });

  it('locked=false does NOT render the lock badge', () => {
    render(<MapNode id="n1" state="ready" x={0} y={0} label="v1" />);
    expect(screen.queryByTestId('map-node-lock-badge')).toBeNull();
  });

  it('error state renders the red error corner with role="alert"', () => {
    render(<MapNode id="n1" state="error" x={0} y={0} label="v1" />);
    const corner = screen.getByTestId('map-node-error-corner');
    expect(corner.getAttribute('role')).toBe('alert');
    expect(corner.getAttribute('aria-label')).toBe('v1 failed');
  });

  it('error corner is not present in non-error states', () => {
    render(<MapNode id="n1" state="ready" x={0} y={0} label="v1" />);
    expect(screen.queryByTestId('map-node-error-corner')).toBeNull();
  });

  it('renders score label with the correct variant data attribute', () => {
    render(
      <MapNode
        id="n1"
        state="ready"
        x={0}
        y={0}
        label="v1"
        scoreLabel="●● 91"
        scoreVariant="good"
      />,
    );
    const score = screen.getByTestId('map-node-score');
    expect(score.textContent).toBe('●● 91');
    expect(score.getAttribute('data-score-variant')).toBe('good');
  });

  it('clicking the node fires onClick when interactive', () => {
    const onClick = vi.fn();
    render(
      <MapNode id="n1" state="ready" x={0} y={0} label="v1" onClick={onClick} />,
    );
    const node = screen.getByRole('button', { name: /Map node v1/ });
    fireEvent.click(node);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('Enter / Space on interactive node fires onClick', () => {
    const onClick = vi.fn();
    render(
      <MapNode id="n1" state="ready" x={0} y={0} label="v1" onClick={onClick} />,
    );
    const node = screen.getByRole('button', { name: /Map node v1/ });
    fireEvent.keyDown(node, { key: 'Enter' });
    fireEvent.keyDown(node, { key: ' ' });
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('non-interactive node renders as group, not button', () => {
    render(<MapNode id="n1" state="ready" x={0} y={0} label="v1" />);
    expect(screen.queryByRole('button', { name: /Map node v1/ })).toBeNull();
    expect(screen.getByRole('group', { name: /Map node v1/ })).toBeDefined();
  });

  it('selected interactive node sets aria-pressed=true', () => {
    render(
      <MapNode
        id="n1"
        state="ready"
        x={0}
        y={0}
        label="v1"
        selected
        onClick={() => undefined}
      />,
    );
    const node = screen.getByRole('button', { name: /Map node v1/ });
    expect(node.getAttribute('aria-pressed')).toBe('true');
  });

  it('a11y: aria-label includes state, locked, and selected affordances', () => {
    render(
      <MapNode
        id="n1"
        state="focus"
        x={0}
        y={0}
        label="v1"
        locked
        selected
        onClick={() => undefined}
      />,
    );
    const node = screen.getByRole('button');
    const aria = node.getAttribute('aria-label') ?? '';
    expect(aria).toContain('Map node v1');
    expect(aria).toContain('focus');
    expect(aria).toContain('locked');
    expect(aria).toContain('selected');
  });

  it('falls back to id when label is omitted in the aria-label', () => {
    render(<MapNode id="n-fallback" state="ready" x={0} y={0} />);
    expect(
      screen.getByRole('group', { name: /Map node n-fallback/ }),
    ).toBeDefined();
  });

  it('exposes data-node-id for graph-layer wiring', () => {
    render(<MapNode id="n-42" state="ready" x={0} y={0} label="v1" />);
    const node = screen.getByRole('group', { name: /Map node v1/ });
    expect(node.getAttribute('data-node-id')).toBe('n-42');
  });
});
