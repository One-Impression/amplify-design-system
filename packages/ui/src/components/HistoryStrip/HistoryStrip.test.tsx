/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { HistoryStrip, type GenerationItem } from './HistoryStrip';

afterEach(cleanup);

const baseGenerations: GenerationItem[] = [
  {
    id: 'g1',
    label: 'Gen 1',
    thumbs: [
      { id: 'v1', status: 'ready' },
      { id: 'v2', status: 'win' },
    ],
    summary: '8.2s · V2 selected',
  },
  {
    id: 'g2',
    label: 'Gen 2 · now',
    thumbs: [
      { id: 'v1', status: 'generating' },
      { id: 'v2', status: 'locked' },
      { id: 'v3', status: 'error' },
    ],
    summary: 'generating',
    current: true,
  },
];

describe('HistoryStrip', () => {
  it('renders a region with aria-label="Variant history"', () => {
    render(<HistoryStrip generations={baseGenerations} />);
    expect(screen.getByRole('region', { name: 'Variant history' })).toBeDefined();
  });

  it('renders one button per generation', () => {
    render(<HistoryStrip generations={baseGenerations} />);
    expect(screen.getByRole('button', { name: 'Select Gen 1' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Select Gen 2 · now' })).toBeDefined();
  });

  it('shows empty state when generations is []', () => {
    render(<HistoryStrip generations={[]} />);
    expect(screen.getByTestId('history-strip-empty')).toBeDefined();
    expect(screen.getByText('No generations yet')).toBeDefined();
  });

  it('marks current generation with aria-current', () => {
    render(<HistoryStrip generations={baseGenerations} />);
    const current = screen.getByRole('button', { name: 'Select Gen 2 · now' });
    expect(current.getAttribute('aria-current')).toBe('true');
    const non = screen.getByRole('button', { name: 'Select Gen 1' });
    expect(non.getAttribute('aria-current')).toBeNull();
  });

  it('fires onSelect with generation id', () => {
    const onSelect = vi.fn();
    render(<HistoryStrip generations={baseGenerations} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: 'Select Gen 1' }));
    expect(onSelect).toHaveBeenCalledWith('g1');
  });

  it('renders summary text when supplied', () => {
    render(<HistoryStrip generations={baseGenerations} />);
    expect(screen.getByText('8.2s · V2 selected')).toBeDefined();
    expect(screen.getByText('generating')).toBeDefined();
  });

  it('renders thumbs with data-status attribute reflecting status', () => {
    const { container } = render(<HistoryStrip generations={baseGenerations} />);
    const ready = container.querySelectorAll('[data-status="ready"]');
    const win = container.querySelectorAll('[data-status="win"]');
    const generating = container.querySelectorAll('[data-status="generating"]');
    const locked = container.querySelectorAll('[data-status="locked"]');
    const error = container.querySelectorAll('[data-status="error"]');
    expect(ready.length).toBe(1);
    expect(win.length).toBe(1);
    expect(generating.length).toBe(1);
    expect(locked.length).toBe(1);
    expect(error.length).toBe(1);
  });

  it('thumbs are clickable when onThumbSelect provided', () => {
    const onThumbSelect = vi.fn();
    render(
      <HistoryStrip generations={baseGenerations} onThumbSelect={onThumbSelect} />,
    );
    const variantButtons = screen.getAllByRole('button', { name: /^Variant / });
    expect(variantButtons.length).toBe(5);
    fireEvent.click(variantButtons[0]);
    expect(onThumbSelect).toHaveBeenCalledTimes(1);
    expect(onThumbSelect).toHaveBeenCalledWith('g1', 'v1');
  });

  it('thumbs are NOT focusable / clickable when onThumbSelect missing', () => {
    render(<HistoryStrip generations={baseGenerations} />);
    expect(screen.queryByRole('button', { name: /^Variant / })).toBeNull();
  });

  it('Enter on thumb triggers onThumbSelect', () => {
    const onThumbSelect = vi.fn();
    render(
      <HistoryStrip generations={baseGenerations} onThumbSelect={onThumbSelect} />,
    );
    const variantButton = screen.getAllByRole('button', { name: /^Variant / })[1];
    fireEvent.keyDown(variantButton, { key: 'Enter' });
    expect(onThumbSelect).toHaveBeenCalledTimes(1);
  });

  it('renders branch arrow between consecutive generations', () => {
    const { container } = render(<HistoryStrip generations={baseGenerations} />);
    // Find arrow span — the only span containing the right-arrow glyph.
    const arrows = Array.from(container.querySelectorAll('span')).filter((el) =>
      el.textContent === '→',
    );
    expect(arrows.length).toBe(1);
  });

  it('truncates thumbs beyond 4 with overflow indicator', () => {
    const many: GenerationItem[] = [
      {
        id: 'big',
        label: 'Gen big',
        thumbs: [
          { id: '1', status: 'ready' },
          { id: '2', status: 'ready' },
          { id: '3', status: 'ready' },
          { id: '4', status: 'ready' },
          { id: '5', status: 'ready' },
          { id: '6', status: 'ready' },
        ],
      },
    ];
    render(<HistoryStrip generations={many} />);
    expect(screen.getByLabelText('2 more variants')).toBeDefined();
  });
});
