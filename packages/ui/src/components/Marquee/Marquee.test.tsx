import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Marquee } from './Marquee';

describe('Marquee', () => {
  it('duplicates children for seamless loop', () => {
    const { container } = render(
      <Marquee>
        <span data-testid="item">A</span>
      </Marquee>
    );
    // First copy + duplicate copy = 2 elements with the same text.
    const items = container.querySelectorAll('[data-testid="item"]');
    expect(items.length).toBe(2);
  });

  it('marks the duplicate strip aria-hidden', () => {
    const { container } = render(
      <Marquee>
        <span>X</span>
      </Marquee>
    );
    const tracks = container.querySelectorAll('.amp-marquee-track > div');
    expect(tracks.length).toBe(2);
    // First strip is visible to a11y, second strip is hidden.
    expect(tracks[1].getAttribute('aria-hidden')).toBe('true');
  });

  it('injects keyframes stylesheet only once', () => {
    render(
      <Marquee>
        <span>A</span>
      </Marquee>
    );
    render(
      <Marquee>
        <span>B</span>
      </Marquee>
    );
    expect(document.querySelectorAll('#amp-marquee-keyframes').length).toBe(1);
  });
});
