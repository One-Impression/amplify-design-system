/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { PhaseRibbon, type PhaseItem } from './PhaseRibbon';

afterEach(cleanup);

const phases: PhaseItem[] = [
  { id: 'discover', label: 'Discover' },
  { id: 'design', label: 'Design' },
  { id: 'build', label: 'Build' },
  { id: 'ship', label: 'Ship' },
];

describe('PhaseRibbon', () => {
  it('renders a list with one listitem per phase', () => {
    render(<PhaseRibbon phases={phases} current="design" />);
    const list = screen.getByRole('list', { name: 'Workflow phases' });
    expect(list).toBeDefined();
    expect(screen.getAllByRole('listitem')).toHaveLength(phases.length);
  });

  it('renders the phase labels', () => {
    render(<PhaseRibbon phases={phases} current="design" />);
    for (const p of phases) {
      expect(screen.getByText(p.label)).toBeDefined();
    }
  });

  it('derives status from current — phases before current are done', () => {
    render(<PhaseRibbon phases={phases} current="build" />);
    expect(
      screen
        .getByTestId('phase-ribbon-item-discover')
        .getAttribute('data-phase-status'),
    ).toBe('done');
    expect(
      screen
        .getByTestId('phase-ribbon-item-design')
        .getAttribute('data-phase-status'),
    ).toBe('done');
  });

  it('derives status — the matching phase is active', () => {
    render(<PhaseRibbon phases={phases} current="build" />);
    expect(
      screen
        .getByTestId('phase-ribbon-item-build')
        .getAttribute('data-phase-status'),
    ).toBe('active');
  });

  it('derives status — phases after current are pending', () => {
    render(<PhaseRibbon phases={phases} current="design" />);
    expect(
      screen
        .getByTestId('phase-ribbon-item-build')
        .getAttribute('data-phase-status'),
    ).toBe('pending');
    expect(
      screen
        .getByTestId('phase-ribbon-item-ship')
        .getAttribute('data-phase-status'),
    ).toBe('pending');
  });

  it('flags the active phase with aria-current="step"', () => {
    render(<PhaseRibbon phases={phases} current="design" />);
    const designItem = screen.getByTestId('phase-ribbon-item-design');
    expect(designItem.getAttribute('aria-current')).toBe('step');
  });

  it('non-active phases do NOT have aria-current', () => {
    render(<PhaseRibbon phases={phases} current="design" />);
    expect(
      screen
        .getByTestId('phase-ribbon-item-discover')
        .getAttribute('aria-current'),
    ).toBeNull();
    expect(
      screen.getByTestId('phase-ribbon-item-build').getAttribute('aria-current'),
    ).toBeNull();
  });

  it('done phases render the check glyph instead of the number', () => {
    render(<PhaseRibbon phases={phases} current="ship" />);
    const doneCircle = screen.getByTestId('phase-ribbon-circle-design');
    // Number "2" should NOT appear — replaced by SVG.
    expect(doneCircle.querySelector('svg')).not.toBeNull();
    expect(doneCircle.textContent?.trim()).toBe('');
  });

  it('active phase renders the phase number (not a check)', () => {
    render(<PhaseRibbon phases={phases} current="design" />);
    const activeCircle = screen.getByTestId('phase-ribbon-circle-design');
    expect(activeCircle.textContent?.trim()).toBe('2');
    expect(activeCircle.querySelector('svg')).toBeNull();
  });

  it('respects explicit phase.status (overrides derivation)', () => {
    const withErr: PhaseItem[] = [
      { id: 'a', label: 'A', status: 'done' },
      { id: 'b', label: 'B', status: 'error' },
      { id: 'c', label: 'C', status: 'pending' },
    ];
    render(<PhaseRibbon phases={withErr} current="b" />);
    expect(
      screen.getByTestId('phase-ribbon-item-b').getAttribute('data-phase-status'),
    ).toBe('error');
  });

  it('error status circle has the error background class', () => {
    const items: PhaseItem[] = [
      { id: 'x', label: 'X', status: 'error' },
      { id: 'y', label: 'Y', status: 'pending' },
    ];
    render(<PhaseRibbon phases={items} current="x" />);
    const circle = screen.getByTestId('phase-ribbon-circle-x');
    expect(circle.className).toContain('bg-[var(--amp-semantic-status-error)]');
  });

  it('renders a connector between every pair of phases (n-1 connectors)', () => {
    render(<PhaseRibbon phases={phases} current="design" />);
    const connectors = screen.getAllByTestId(/^phase-ribbon-connector-/);
    expect(connectors).toHaveLength(phases.length - 1);
  });

  it('does NOT render a connector after the last phase', () => {
    render(<PhaseRibbon phases={phases} current="design" />);
    expect(screen.queryByTestId('phase-ribbon-connector-ship')).toBeNull();
  });

  it('uses phase.hint as the circle title attribute', () => {
    const items: PhaseItem[] = [
      { id: 'a', label: 'Alpha', hint: 'First step in the journey' },
      { id: 'b', label: 'Beta' },
    ];
    render(<PhaseRibbon phases={items} current="a" />);
    expect(
      screen.getByTestId('phase-ribbon-circle-a').getAttribute('title'),
    ).toBe('First step in the journey');
  });

  it('aria-label on the circle includes phase number, label, and status', () => {
    render(<PhaseRibbon phases={phases} current="design" />);
    const circle = screen.getByTestId('phase-ribbon-circle-design');
    expect(circle.getAttribute('aria-label')).toBe(
      'Phase 2: Design (active)',
    );
  });

  it('handles current that does not match any phase — all pending', () => {
    render(<PhaseRibbon phases={phases} current="missing-id" />);
    for (const p of phases) {
      expect(
        screen
          .getByTestId(`phase-ribbon-item-${p.id}`)
          .getAttribute('data-phase-status'),
      ).toBe('pending');
    }
  });

  it('does NOT inject hardcoded hex colours into the rendered DOM', () => {
    const { container } = render(
      <PhaseRibbon phases={phases} current="design" />,
    );
    expect(container.innerHTML).not.toMatch(/#[0-9a-fA-F]{3,8}/);
  });

  it('renders single-phase ribbon without a connector', () => {
    render(<PhaseRibbon phases={[{ id: 'only', label: 'Only' }]} current="only" />);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.queryAllByTestId(/^phase-ribbon-connector-/)).toHaveLength(0);
  });

  it('honours numeric ids', () => {
    const numeric: PhaseItem[] = [
      { id: 1, label: 'One' },
      { id: 2, label: 'Two' },
      { id: 3, label: 'Three' },
    ];
    render(<PhaseRibbon phases={numeric} current={2} />);
    expect(
      screen.getByTestId('phase-ribbon-item-2').getAttribute('data-phase-status'),
    ).toBe('active');
  });
});
