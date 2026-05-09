/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ReferenceSnapshotPill } from './ReferenceSnapshotPill';

afterEach(cleanup);

const FIXED_DATE = new Date('2026-05-08T15:42:00');
const SCREENSHOT = 'https://snapshots.example.com/abc.png';

describe('ReferenceSnapshotPill', () => {
  it('renders as a button (keyboard-activatable)', () => {
    render(<ReferenceSnapshotPill capturedAt={FIXED_DATE} screenshotUrl={SCREENSHOT} />);
    const btn = screen.getByTestId('reference-snapshot-pill');
    expect(btn.tagName).toBe('BUTTON');
    expect(btn.getAttribute('type')).toBe('button');
  });

  it('renders the label and formatted time text', () => {
    render(<ReferenceSnapshotPill capturedAt={FIXED_DATE} screenshotUrl={SCREENSHOT} />);
    const btn = screen.getByTestId('reference-snapshot-pill');
    // Default label
    expect(btn.textContent).toMatch(/Reference snapshot/);
    // Default formatter — locale-dependent but should at minimum contain digits
    expect(btn.textContent).toMatch(/\d/);
  });

  it('honours a custom formatTime', () => {
    render(
      <ReferenceSnapshotPill
        capturedAt={FIXED_DATE}
        screenshotUrl={SCREENSHOT}
        formatTime={() => 'EXACTLY-NOW'}
      />,
    );
    expect(screen.getByTestId('reference-snapshot-pill').textContent).toContain(
      'EXACTLY-NOW',
    );
  });

  it('honours a custom label prefix', () => {
    render(
      <ReferenceSnapshotPill
        capturedAt={FIXED_DATE}
        screenshotUrl={SCREENSHOT}
        label="Original page"
      />,
    );
    expect(screen.getByTestId('reference-snapshot-pill').textContent).toContain(
      'Original page',
    );
  });

  it('exposes the screenshot URL via data-screenshot-url', () => {
    render(<ReferenceSnapshotPill capturedAt={FIXED_DATE} screenshotUrl={SCREENSHOT} />);
    expect(
      screen
        .getByTestId('reference-snapshot-pill')
        .getAttribute('data-screenshot-url'),
    ).toBe(SCREENSHOT);
  });

  it('exposes the ISO capturedAt via data-captured-at', () => {
    render(<ReferenceSnapshotPill capturedAt={FIXED_DATE} screenshotUrl={SCREENSHOT} />);
    expect(
      screen
        .getByTestId('reference-snapshot-pill')
        .getAttribute('data-captured-at'),
    ).toBe(FIXED_DATE.toISOString());
  });

  it('fires onClick when clicked', () => {
    const onClick = vi.fn();
    render(
      <ReferenceSnapshotPill
        capturedAt={FIXED_DATE}
        screenshotUrl={SCREENSHOT}
        onClick={onClick}
      />,
    );
    fireEvent.click(screen.getByTestId('reference-snapshot-pill'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('has a descriptive aria-label naming the action', () => {
    render(
      <ReferenceSnapshotPill
        capturedAt={FIXED_DATE}
        screenshotUrl={SCREENSHOT}
        formatTime={() => '3:42 PM'}
      />,
    );
    const btn = screen.getByTestId('reference-snapshot-pill');
    expect(btn.getAttribute('aria-label')).toMatch(
      /Reference snapshot taken at 3:42 PM — click to view the original screenshot/,
    );
  });

  it('does NOT inject hardcoded hex colours into the rendered DOM', () => {
    const { container } = render(
      <ReferenceSnapshotPill capturedAt={FIXED_DATE} screenshotUrl={SCREENSHOT} />,
    );
    expect(container.innerHTML).not.toMatch(/#[0-9a-fA-F]{3,8}/);
  });

  it('does NOT inject inline px appearance values', () => {
    const { container } = render(
      <ReferenceSnapshotPill capturedAt={FIXED_DATE} screenshotUrl={SCREENSHOT} />,
    );
    expect(container.innerHTML).not.toMatch(/style="[^"]*\d+px/);
  });
});
