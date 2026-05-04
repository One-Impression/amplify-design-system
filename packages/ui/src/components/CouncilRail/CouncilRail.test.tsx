/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { CouncilRail, type AgentVerdict } from './CouncilRail';

afterEach(cleanup);

const verdicts: AgentVerdict[] = [
  {
    agentId: 'pixel',
    agentName: 'Pixel',
    agentRole: 'Design Director',
    agentColor: '#6531FF',
    initial: 'P',
    verdict: 'ok',
    body: 'Looks tight.',
  },
  {
    agentId: 'zenith',
    agentName: 'Zenith',
    agentRole: 'CTO',
    agentColor: '#0EA5E9',
    initial: 'Z',
    verdict: 'warn',
    body: 'Two unused props.',
  },
  {
    agentId: 'heimdall',
    agentName: 'Heimdall',
    agentRole: 'Chief Analyst',
    agentColor: '#10B981',
    initial: 'H',
    verdict: 'flag',
    body: 'Conversion risk vs last 14 days.',
  },
];

const allOk: AgentVerdict[] = verdicts.map((v) => ({ ...v, verdict: 'ok' as const }));

describe('CouncilRail', () => {
  it('renders a region with aria-label="Council critiques"', () => {
    render(<CouncilRail verdicts={verdicts} />);
    expect(screen.getByRole('region', { name: 'Council critiques' })).toBeDefined();
  });

  it('renders the Council header', () => {
    render(<CouncilRail verdicts={verdicts} />);
    expect(screen.getByRole('heading', { name: 'Council', level: 3 })).toBeDefined();
  });

  it('renders the variant label tag when forVariantLabel provided', () => {
    render(<CouncilRail forVariantLabel="V1" verdicts={verdicts} />);
    expect(screen.getByTestId('council-rail-variant-label').textContent).toContain('V1');
  });

  it('renders one card per verdict by default', () => {
    render(<CouncilRail verdicts={verdicts} />);
    expect(screen.getByText('Pixel')).toBeDefined();
    expect(screen.getByText('Zenith')).toBeDefined();
    expect(screen.getByText('Heimdall')).toBeDefined();
    // body text rendered.
    expect(screen.getByText('Looks tight.')).toBeDefined();
    expect(screen.getByText('Two unused props.')).toBeDefined();
  });

  it('uses verdict for each badge', () => {
    const { container } = render(<CouncilRail verdicts={verdicts} />);
    expect(container.querySelectorAll('[data-verdict="ok"]').length).toBe(1);
    expect(container.querySelectorAll('[data-verdict="warn"]').length).toBe(1);
    expect(container.querySelectorAll('[data-verdict="flag"]').length).toBe(1);
  });

  it('renders the summary card when summaryHeadline supplied', () => {
    render(
      <CouncilRail
        verdicts={verdicts}
        summaryHeadline="3 of 4 agents agree V1"
        summaryDetail="Heimdall flags conversion risk."
      />,
    );
    expect(screen.getByTestId('council-summary')).toBeDefined();
    expect(screen.getByText('3 of 4 agents agree V1')).toBeDefined();
    expect(screen.getByText('Heimdall flags conversion risk.')).toBeDefined();
  });

  it('does NOT render summary when neither headline nor detail supplied', () => {
    render(<CouncilRail verdicts={verdicts} />);
    expect(screen.queryByTestId('council-summary')).toBeNull();
  });

  it('disagreementsOnly collapses ok agents into a single line', () => {
    render(
      <CouncilRail forVariantLabel="V1" verdicts={verdicts} disagreementsOnly />,
    );
    expect(screen.getByTestId('council-rail-unanimous')).toBeDefined();
    // Only warn + flag cards should remain.
    expect(screen.queryByText('Looks tight.')).toBeNull();
    expect(screen.getByText('Two unused props.')).toBeDefined();
    expect(screen.getByText('Conversion risk vs last 14 days.')).toBeDefined();
  });

  it('disagreementsOnly with all ok shows just the unanimous line', () => {
    render(<CouncilRail forVariantLabel="V2" verdicts={allOk} disagreementsOnly />);
    expect(screen.getByTestId('council-rail-unanimous')).toBeDefined();
    // No CouncilCard rendered.
    expect(screen.queryByText('Pixel')).toBeNull();
  });

  it('shows empty placeholder when verdicts is empty', () => {
    render(<CouncilRail verdicts={[]} />);
    expect(screen.getByTestId('council-rail-empty')).toBeDefined();
  });

  it('fires onAskQuestion on Enter when input has text', () => {
    const onAskQuestion = vi.fn();
    render(<CouncilRail verdicts={verdicts} onAskQuestion={onAskQuestion} />);
    const input = screen.getByLabelText('Ask the council a question');
    fireEvent.change(input, { target: { value: 'how would Pixel score this?' } });
    fireEvent.submit(input.closest('form')!);
    expect(onAskQuestion).toHaveBeenCalledWith('how would Pixel score this?');
  });

  it('does NOT fire onAskQuestion when input is empty', () => {
    const onAskQuestion = vi.fn();
    render(<CouncilRail verdicts={verdicts} onAskQuestion={onAskQuestion} />);
    const input = screen.getByLabelText('Ask the council a question');
    fireEvent.submit(input.closest('form')!);
    expect(onAskQuestion).not.toHaveBeenCalled();
  });

  it('a11y: each card has an aria-label that combines agent name + role + verdict', () => {
    render(<CouncilRail verdicts={verdicts} />);
    expect(
      screen.getByLabelText('Pixel (Design Director) — ok'),
    ).toBeDefined();
    expect(
      screen.getByLabelText('Heimdall (Chief Analyst) — flag'),
    ).toBeDefined();
  });
});
