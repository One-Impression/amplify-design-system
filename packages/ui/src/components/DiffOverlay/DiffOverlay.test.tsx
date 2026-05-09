/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { DiffOverlay, type DiffOverlayMode } from './DiffOverlay';

afterEach(cleanup);

const LIVE = 'https://shots.example.com/live.png';
const VARIANT = 'https://shots.example.com/variant.png';

const renderOverlay = (
  mode: DiffOverlayMode = 'highlight',
  overrides: Partial<React.ComponentProps<typeof DiffOverlay>> = {},
) =>
  render(
    <DiffOverlay
      liveScreenshot={LIVE}
      variantScreenshot={VARIANT}
      mode={mode}
      {...overrides}
    />,
  );

describe('DiffOverlay', () => {
  it('always renders the live screenshot as the base layer', () => {
    renderOverlay('highlight');
    const live = screen.getByTestId('diff-overlay-live') as HTMLImageElement;
    expect(live.src).toBe(LIVE);
  });

  it('mode=highlight renders the red/green band layer + legend by default', () => {
    renderOverlay('highlight');
    expect(screen.getByTestId('diff-overlay-highlight')).toBeDefined();
    expect(screen.getByTestId('diff-overlay-legend')).toBeDefined();
    expect(screen.queryByTestId('diff-overlay-swipe')).toBeNull();
    expect(screen.queryByTestId('diff-overlay-side')).toBeNull();
  });

  it('mode=swipe renders the swipe layer + divider; no highlight band; no default legend', () => {
    renderOverlay('swipe');
    expect(screen.getByTestId('diff-overlay-swipe')).toBeDefined();
    expect(screen.getByTestId('diff-overlay-swipe-divider')).toBeDefined();
    expect(screen.queryByTestId('diff-overlay-highlight')).toBeNull();
    expect(screen.queryByTestId('diff-overlay-side')).toBeNull();
    expect(screen.queryByTestId('diff-overlay-legend')).toBeNull();
  });

  it('mode=side-by-side renders the side grid; no highlight band; no default legend', () => {
    renderOverlay('side-by-side');
    expect(screen.getByTestId('diff-overlay-side')).toBeDefined();
    expect(screen.queryByTestId('diff-overlay-highlight')).toBeNull();
    expect(screen.queryByTestId('diff-overlay-swipe')).toBeNull();
    expect(screen.queryByTestId('diff-overlay-legend')).toBeNull();
  });

  it('legend can be force-shown for non-highlight modes via showLegend', () => {
    renderOverlay('swipe', { showLegend: true });
    expect(screen.getByTestId('diff-overlay-legend')).toBeDefined();
  });

  it('legend can be hidden for highlight via showLegend=false', () => {
    renderOverlay('highlight', { showLegend: false });
    expect(screen.queryByTestId('diff-overlay-legend')).toBeNull();
  });

  it('swipePercent positions the divider at the given percentage', () => {
    renderOverlay('swipe', { swipePercent: 70 });
    const divider = screen.getByTestId('diff-overlay-swipe-divider') as HTMLElement;
    expect(divider.style.left).toBe('70%');
  });

  it('swipePercent clamps below 0 to 0 and above 100 to 100', () => {
    const { rerender } = renderOverlay('swipe', { swipePercent: -25 });
    expect(
      (screen.getByTestId('diff-overlay-swipe-divider') as HTMLElement).style.left,
    ).toBe('0%');
    rerender(
      <DiffOverlay
        liveScreenshot={LIVE}
        variantScreenshot={VARIANT}
        mode="swipe"
        swipePercent={250}
      />,
    );
    expect(
      (screen.getByTestId('diff-overlay-swipe-divider') as HTMLElement).style.left,
    ).toBe('100%');
  });

  it('exposes mode via data-mode attribute', () => {
    renderOverlay('side-by-side');
    expect(
      screen.getByTestId('diff-overlay').getAttribute('data-mode'),
    ).toBe('side-by-side');
  });

  it('has role="img" and an accessible name', () => {
    renderOverlay('highlight');
    const overlay = screen.getByTestId('diff-overlay');
    expect(overlay.getAttribute('role')).toBe('img');
    expect(overlay.getAttribute('aria-label')).toBe('Live vs variant diff');
  });

  it('honours custom ariaLabel', () => {
    renderOverlay('highlight', { ariaLabel: 'Order page diff (Gen 3 V2)' });
    expect(
      screen.getByTestId('diff-overlay').getAttribute('aria-label'),
    ).toBe('Order page diff (Gen 3 V2)');
  });

  it('does NOT inject hardcoded hex colours into the rendered DOM', () => {
    const { container } = renderOverlay('highlight');
    expect(container.innerHTML).not.toMatch(/#[0-9a-fA-F]{3,8}/);
  });

  it('does NOT inject inline px appearance values', () => {
    const { container } = renderOverlay('highlight');
    expect(container.innerHTML).not.toMatch(/style="[^"]*\d+px/);
  });
});
