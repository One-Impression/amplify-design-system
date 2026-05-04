import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Tour, type TourStep } from './Tour';

const steps: TourStep[] = [
  { title: 'Step 1', body: 'First', placement: 'center' },
  { title: 'Step 2', body: 'Second', placement: 'center' },
  { title: 'Step 3', body: 'Third', placement: 'center' },
];

describe('Tour', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders nothing when open=false', () => {
    render(<Tour tourId="t1" steps={steps} open={false} persist={false} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders first step + step counter when opened', () => {
    render(<Tour tourId="t1" steps={steps} open persist={false} />);
    expect(screen.getByText('Step 1')).toBeDefined();
    expect(screen.getByText('1 of 3')).toBeDefined();
  });

  it('Enter key advances to next step', () => {
    render(<Tour tourId="t1" steps={steps} open persist={false} />);
    act(() => {
      fireEvent.keyDown(document, { key: 'Enter' });
    });
    expect(screen.getByText('Step 2')).toBeDefined();
  });

  it('Escape calls onClose', () => {
    const onClose = vi.fn();
    render(<Tour tourId="t1" steps={steps} open onClose={onClose} persist={false} />);
    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('completing the last step calls onComplete', () => {
    const onComplete = vi.fn();
    render(
      <Tour tourId="t1" steps={steps} open onComplete={onComplete} persist={false} startAt={2} />
    );
    fireEvent.click(screen.getByRole('button', { name: /done/i }));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('persists progress to localStorage', () => {
    render(<Tour tourId="persist-test" steps={steps} open persist />);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(window.localStorage.getItem('amp:tour:persist-test')).toBe('1');
  });

  it('clears persisted progress on completion', () => {
    window.localStorage.setItem('amp:tour:persist-test', '2');
    const onComplete = vi.fn();
    render(
      <Tour
        tourId="persist-test"
        steps={steps}
        open
        onComplete={onComplete}
        persist
        startAt={2}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /done/i }));
    expect(window.localStorage.getItem('amp:tour:persist-test')).toBeNull();
  });

  it('Back button returns to previous step', () => {
    render(<Tour tourId="t1" steps={steps} open persist={false} startAt={1} />);
    expect(screen.getByText('Step 2')).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(screen.getByText('Step 1')).toBeDefined();
  });
});
