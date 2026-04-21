/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { CollapsibleNavGroup } from './CollapsibleNavGroup';

afterEach(cleanup);

describe('CollapsibleNavGroup', () => {
  it('renders label and icon', () => {
    render(
      <CollapsibleNavGroup label="AI Creators" icon="🎬">
        <div>child content</div>
      </CollapsibleNavGroup>
    );
    expect(screen.getByText('AI Creators')).toBeDefined();
  });

  it('starts collapsed by default', () => {
    const { container } = render(
      <CollapsibleNavGroup label="Collapsed Group">
        <div>hidden</div>
      </CollapsibleNavGroup>
    );
    const button = screen.getByText('Collapsed Group').closest('button')!;
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(container.querySelector('[role="group"]')).toBe(null);
  });

  it('starts expanded when defaultExpanded is true', () => {
    const { container } = render(
      <CollapsibleNavGroup label="Expanded Group" defaultExpanded>
        <div>visible</div>
      </CollapsibleNavGroup>
    );
    const button = screen.getByText('Expanded Group').closest('button')!;
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(container.querySelector('[role="group"]')).not.toBe(null);
  });

  it('toggles on click', () => {
    const { container } = render(
      <CollapsibleNavGroup label="Toggle Group">
        <div>content</div>
      </CollapsibleNavGroup>
    );
    const button = screen.getByText('Toggle Group').closest('button')!;

    fireEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(container.querySelector('[role="group"]')).not.toBe(null);

    fireEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(container.querySelector('[role="group"]')).toBe(null);
  });

  it('shows count badge', () => {
    render(
      <CollapsibleNavGroup label="Count Group" count={5}>
        <div>children</div>
      </CollapsibleNavGroup>
    );
    expect(screen.getByText('5')).toBeDefined();
  });

  it('calls onToggle callback', () => {
    const onToggle = vi.fn();
    render(
      <CollapsibleNavGroup label="Callback Group" onToggle={onToggle}>
        <div>children</div>
      </CollapsibleNavGroup>
    );
    const button = screen.getByText('Callback Group').closest('button')!;

    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalledWith(true);

    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalledWith(false);
  });

  it('respects controlled expanded prop', () => {
    const { container, rerender } = render(
      <CollapsibleNavGroup label="Controlled Group" expanded={false}>
        <div>content</div>
      </CollapsibleNavGroup>
    );
    expect(container.querySelector('[role="group"]')).toBe(null);

    rerender(
      <CollapsibleNavGroup label="Controlled Group" expanded={true}>
        <div>content</div>
      </CollapsibleNavGroup>
    );
    expect(container.querySelector('[role="group"]')).not.toBe(null);
  });
});
