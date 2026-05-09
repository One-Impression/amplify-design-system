/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import {
  FlowContextSidebar,
  type FlowStep,
} from './FlowContextSidebar';

afterEach(cleanup);

const fiveSteps: FlowStep[] = [
  { id: 's1', label: 'Step 1 · Brief', status: 'complete' },
  { id: 's2', label: 'Step 2 · Package', status: 'in-progress' },
  { id: 's3', label: 'Step 3 · Visuals', status: 'default' },
  { id: 's4', label: 'Step 4 · Review', status: 'skipped' },
  { id: 's5', label: 'Step 5 · Ship', status: 'default' },
];

describe('FlowContextSidebar', () => {
  it('renders a navigation landmark with the configured aria-label', () => {
    render(
      <FlowContextSidebar
        flowName="Brand Order — 5 steps"
        steps={fiveSteps}
        activeStepId="s2"
      />,
    );
    expect(screen.getByRole('navigation', { name: 'Flow steps' })).toBeDefined();
  });

  it('renders all step labels', () => {
    render(
      <FlowContextSidebar
        flowName="Brand Order"
        steps={fiveSteps}
        activeStepId="s1"
      />,
    );
    fiveSteps.forEach((s) => {
      expect(screen.getAllByText((text) => text.includes(s.label)).length).toBeGreaterThan(0);
    });
  });

  it('renders the flow name in the sticky header', () => {
    render(
      <FlowContextSidebar
        flowName="Brand Order — 5 steps"
        steps={fiveSteps}
        activeStepId="s1"
      />,
    );
    expect(
      screen.getByTestId('flow-context-sidebar-title').textContent,
    ).toBe('Brand Order — 5 steps');
  });

  it('only the active step has aria-current="step"', () => {
    render(
      <FlowContextSidebar flowName="F" steps={fiveSteps} activeStepId="s2" />,
    );
    expect(
      screen
        .getByTestId('flow-context-sidebar-step-s2')
        .getAttribute('aria-current'),
    ).toBe('step');
    expect(
      screen
        .getByTestId('flow-context-sidebar-step-s1')
        .getAttribute('aria-current'),
    ).toBeNull();
  });

  it('clicking a step fires onStepClick with the step id', () => {
    const onStepClick = vi.fn();
    render(
      <FlowContextSidebar
        flowName="F"
        steps={fiveSteps}
        activeStepId="s1"
        onStepClick={onStepClick}
      />,
    );
    fireEvent.click(screen.getByTestId('flow-context-sidebar-step-s3'));
    expect(onStepClick).toHaveBeenCalledWith('s3');
  });

  it('roving tabindex — only the active chip is in the tab order', () => {
    render(
      <FlowContextSidebar flowName="F" steps={fiveSteps} activeStepId="s2" />,
    );
    expect(
      screen
        .getByTestId('flow-context-sidebar-step-s2')
        .getAttribute('tabindex'),
    ).toBe('0');
    expect(
      screen
        .getByTestId('flow-context-sidebar-step-s1')
        .getAttribute('tabindex'),
    ).toBe('-1');
  });

  it('ArrowDown moves focus to the next chip; ArrowUp to the previous (wraps)', () => {
    render(
      <FlowContextSidebar flowName="F" steps={fiveSteps} activeStepId="s2" />,
    );
    const chip2 = screen.getByTestId('flow-context-sidebar-step-s2');
    chip2.focus();
    fireEvent.keyDown(chip2, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(
      screen.getByTestId('flow-context-sidebar-step-s3'),
    );
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(
      screen.getByTestId('flow-context-sidebar-step-s2'),
    );
  });

  it('Home / End jump to first / last chip', () => {
    render(
      <FlowContextSidebar flowName="F" steps={fiveSteps} activeStepId="s3" />,
    );
    const chip3 = screen.getByTestId('flow-context-sidebar-step-s3');
    chip3.focus();
    fireEvent.keyDown(chip3, { key: 'Home' });
    expect(document.activeElement).toBe(
      screen.getByTestId('flow-context-sidebar-step-s1'),
    );
    fireEvent.keyDown(document.activeElement!, { key: 'End' });
    expect(document.activeElement).toBe(
      screen.getByTestId('flow-context-sidebar-step-s5'),
    );
  });

  it('Enter / Space activate the focused chip', () => {
    const onStepClick = vi.fn();
    render(
      <FlowContextSidebar
        flowName="F"
        steps={fiveSteps}
        activeStepId="s1"
        onStepClick={onStepClick}
      />,
    );
    fireEvent.keyDown(screen.getByTestId('flow-context-sidebar-step-s2'), {
      key: 'Enter',
    });
    expect(onStepClick).toHaveBeenLastCalledWith('s2');
    fireEvent.keyDown(screen.getByTestId('flow-context-sidebar-step-s3'), {
      key: ' ',
    });
    expect(onStepClick).toHaveBeenLastCalledWith('s3');
  });

  it('collapse toggle changes aria-expanded and emits onCollapse(!collapsed)', () => {
    const onCollapse = vi.fn();
    const { rerender } = render(
      <FlowContextSidebar
        flowName="F"
        steps={fiveSteps}
        activeStepId="s1"
        collapsed={false}
        onCollapse={onCollapse}
      />,
    );
    const toggle = screen.getByTestId('flow-context-sidebar-collapse');
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(toggle);
    expect(onCollapse).toHaveBeenCalledWith(true);

    rerender(
      <FlowContextSidebar
        flowName="F"
        steps={fiveSteps}
        activeStepId="s1"
        collapsed={true}
        onCollapse={onCollapse}
      />,
    );
    const toggle2 = screen.getByTestId('flow-context-sidebar-collapse');
    expect(toggle2.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(toggle2);
    expect(onCollapse).toHaveBeenLastCalledWith(false);
  });

  it('href chips render as <a> and still fire onStepClick on click', () => {
    const onStepClick = vi.fn();
    const linked: FlowStep[] = [
      { id: 'a', label: 'A', href: '/a' },
      { id: 'b', label: 'B', href: '/b' },
    ];
    render(
      <FlowContextSidebar
        flowName="F"
        steps={linked}
        activeStepId="a"
        onStepClick={onStepClick}
      />,
    );
    const chip = screen.getByTestId('flow-context-sidebar-step-b');
    expect(chip.tagName).toBe('A');
    expect(chip.getAttribute('href')).toBe('/b');
    fireEvent.click(chip);
    expect(onStepClick).toHaveBeenCalledWith('b');
  });

  it('skipped chip remains keyboard-focusable (skipped !== disabled)', () => {
    render(
      <FlowContextSidebar flowName="F" steps={fiveSteps} activeStepId="s4" />,
    );
    const skipped = screen.getByTestId('flow-context-sidebar-step-s4');
    skipped.focus();
    expect(document.activeElement).toBe(skipped);
  });

  it('apply-to-all button is hidden when onApplyToAll is not provided', () => {
    render(
      <FlowContextSidebar flowName="F" steps={fiveSteps} activeStepId="s1" />,
    );
    expect(
      screen.queryByTestId('flow-context-sidebar-apply-to-all'),
    ).toBeNull();
  });

  it('apply-to-all button renders and fires the callback when provided', () => {
    const onApplyToAll = vi.fn();
    render(
      <FlowContextSidebar
        flowName="F"
        steps={fiveSteps}
        activeStepId="s1"
        onApplyToAll={onApplyToAll}
      />,
    );
    const btn = screen.getByTestId('flow-context-sidebar-apply-to-all');
    fireEvent.click(btn);
    expect(onApplyToAll).toHaveBeenCalledOnce();
  });

  it('apply-to-all label honours the applyToAllLabel prop', () => {
    render(
      <FlowContextSidebar
        flowName="F"
        steps={fiveSteps}
        activeStepId="s1"
        onApplyToAll={() => undefined}
        applyToAllLabel="Apply to all 5 steps"
      />,
    );
    expect(
      screen.getByTestId('flow-context-sidebar-apply-to-all').textContent,
    ).toBe('Apply to all 5 steps');
  });

  it('empty steps renders nothing', () => {
    const { container } = render(
      <FlowContextSidebar flowName="F" steps={[]} activeStepId="any" />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('status surfaces in aria-label', () => {
    render(
      <FlowContextSidebar flowName="F" steps={fiveSteps} activeStepId="s1" />,
    );
    expect(
      screen
        .getByTestId('flow-context-sidebar-step-s1')
        .getAttribute('aria-label'),
    ).toContain('complete');
    expect(
      screen
        .getByTestId('flow-context-sidebar-step-s4')
        .getAttribute('aria-label'),
    ).toContain('skipped');
    expect(
      screen
        .getByTestId('flow-context-sidebar-step-s2')
        .getAttribute('aria-label'),
    ).toContain('in progress');
  });

  it('thumbnail null/undefined renders the dashed placeholder block', () => {
    render(
      <FlowContextSidebar flowName="F" steps={fiveSteps} activeStepId="s1" />,
    );
    expect(
      screen.getAllByTestId('flow-context-sidebar-thumb-placeholder').length,
    ).toBe(fiveSteps.length);
  });

  it('thumbnail URL renders an <img>', () => {
    const withThumb: FlowStep[] = [
      { id: 'a', label: 'A', thumbnail: 'data:image/svg+xml,a' },
      { id: 'b', label: 'B', thumbnail: null },
    ];
    const { container } = render(
      <FlowContextSidebar
        flowName="F"
        steps={withThumb}
        activeStepId="a"
      />,
    );
    expect(container.querySelectorAll('img').length).toBe(1);
  });

  it('collapsed=true exposes data-collapsed="true" on the nav', () => {
    render(
      <FlowContextSidebar
        flowName="F"
        steps={fiveSteps}
        activeStepId="s1"
        collapsed
      />,
    );
    expect(
      screen
        .getByTestId('flow-context-sidebar')
        .getAttribute('data-collapsed'),
    ).toBe('true');
  });

  it('collapsed=true hides the title and apply-to-all', () => {
    render(
      <FlowContextSidebar
        flowName="F"
        steps={fiveSteps}
        activeStepId="s1"
        collapsed
        onApplyToAll={() => undefined}
      />,
    );
    expect(screen.queryByTestId('flow-context-sidebar-title')).toBeNull();
    expect(
      screen.queryByTestId('flow-context-sidebar-apply-to-all'),
    ).toBeNull();
  });

  it('badge renders with the count when provided', () => {
    const withBadge: FlowStep[] = [
      { id: 'a', label: 'A', badge: { count: 3, tone: 'accent' } },
    ];
    render(
      <FlowContextSidebar
        flowName="F"
        steps={withBadge}
        activeStepId="a"
      />,
    );
    expect(
      screen.getByTestId('flow-context-sidebar-badge').textContent,
    ).toBe('3');
  });

  it('does NOT inject hardcoded hex colours into the rendered DOM', () => {
    const { container } = render(
      <FlowContextSidebar
        flowName="F"
        steps={fiveSteps}
        activeStepId="s1"
        onApplyToAll={() => undefined}
      />,
    );
    expect(container.innerHTML).not.toMatch(/#[0-9a-fA-F]{3,8}/);
  });
});
