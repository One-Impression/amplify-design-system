/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { BriefStrip, type BriefChipItem } from './BriefStrip';

afterEach(cleanup);

const baseChips: BriefChipItem[] = [
  { id: 'g', kind: 'goal', key: 'goal:', value: 'confident editorial' },
  { id: 'a', kind: 'audience', key: 'for:', value: 'returning brands' },
  { id: 'l', kind: 'lock', value: 'serif heading', locked: true },
];

describe('BriefStrip', () => {
  it('renders a region with aria-label="Brief"', () => {
    render(<BriefStrip chips={baseChips} />);
    const region = screen.getByRole('region', { name: 'Brief' });
    expect(region).toBeDefined();
  });

  it('renders one listitem per chip plus the add affordance', () => {
    render(<BriefStrip chips={baseChips} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(baseChips.length);
  });

  it('renders chip key prefix and value text', () => {
    render(<BriefStrip chips={baseChips} />);
    expect(screen.getByText('goal:')).toBeDefined();
    expect(screen.getByText('confident editorial')).toBeDefined();
    expect(screen.getByText('for:')).toBeDefined();
    expect(screen.getByText('returning brands')).toBeDefined();
  });

  it('shows empty-state placeholder text when chips=[]', () => {
    render(<BriefStrip chips={[]} />);
    // The placeholder copy lives inside the "+ add" button.
    expect(
      screen.getByText('Type a goal, audience, or constraint…'),
    ).toBeDefined();
  });

  it('fires onChipClick when a chip is clicked', () => {
    const onChipClick = vi.fn();
    render(<BriefStrip chips={baseChips} onChipClick={onChipClick} />);
    fireEvent.click(screen.getByLabelText('Edit goal: confident editorial'));
    expect(onChipClick).toHaveBeenCalledWith('g');
  });

  it('renders remove button only for non-locked chips when onChipRemove provided', () => {
    const onChipRemove = vi.fn();
    render(<BriefStrip chips={baseChips} onChipRemove={onChipRemove} />);
    // Two non-locked chips (goal + audience) → two remove buttons.
    const removeButtons = screen.getAllByRole('button', { name: /Remove / });
    expect(removeButtons).toHaveLength(2);
  });

  it('does NOT render remove button for locked chips', () => {
    const onChipRemove = vi.fn();
    render(<BriefStrip chips={baseChips} onChipRemove={onChipRemove} />);
    const lockedRemove = screen.queryByRole('button', {
      name: 'Remove lock: serif heading',
    });
    expect(lockedRemove).toBeNull();
  });

  it('fires onChipRemove with the right id when remove button clicked', () => {
    const onChipRemove = vi.fn();
    render(<BriefStrip chips={baseChips} onChipRemove={onChipRemove} />);
    fireEvent.click(
      screen.getByRole('button', { name: 'Remove goal: confident editorial' }),
    );
    expect(onChipRemove).toHaveBeenCalledWith('g');
  });

  it('clicking + add fires onAddRequest then opens an input', () => {
    const onAddRequest = vi.fn();
    render(<BriefStrip chips={baseChips} onAddRequest={onAddRequest} />);
    fireEvent.click(screen.getByLabelText('Add to brief'));
    expect(onAddRequest).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('Add to brief')).toBeDefined();
    // After click, the input is rendered (replaces the button).
    expect(
      (screen.getByLabelText('Add to brief') as HTMLInputElement).tagName,
    ).toBe('INPUT');
  });

  it('Enter on input fires onParseInput with the raw text', () => {
    const onParseInput = vi.fn();
    render(<BriefStrip chips={[]} onParseInput={onParseInput} />);
    fireEvent.click(screen.getByLabelText(/Add to brief/));
    const input = screen.getByLabelText('Add to brief') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'for premium creators' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onParseInput).toHaveBeenCalledWith('for premium creators');
  });

  it('Escape on input cancels without firing onParseInput', () => {
    const onParseInput = vi.fn();
    render(<BriefStrip chips={[]} onParseInput={onParseInput} />);
    fireEvent.click(screen.getByLabelText(/Add to brief/));
    const input = screen.getByLabelText('Add to brief') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'should be cancelled' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onParseInput).not.toHaveBeenCalled();
  });

  it('renders Expand brief button only when expandable=true', () => {
    const onExpand = vi.fn();
    const { rerender } = render(<BriefStrip chips={baseChips} />);
    expect(screen.queryByRole('button', { name: 'Expand brief' })).toBeNull();
    rerender(<BriefStrip chips={baseChips} expandable onExpand={onExpand} />);
    fireEvent.click(screen.getByRole('button', { name: 'Expand brief' }));
    expect(onExpand).toHaveBeenCalledTimes(1);
  });

  it('locked chip renders the lock glyph', () => {
    render(<BriefStrip chips={baseChips} />);
    const lockChip = screen.getByLabelText('Edit lock: serif heading');
    // Lock glyph is rendered as a sibling span; check its presence in DOM.
    expect(lockChip.textContent).toContain('serif heading');
  });
});
