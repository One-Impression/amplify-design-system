import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MediaShowcase } from './MediaShowcase';

describe('MediaShowcase', () => {
  beforeEach(() => {
    // Provide a minimal IntersectionObserver mock for jsdom.
    class IO {
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
      takeRecords = vi.fn();
      root = null;
      rootMargin = '';
      thresholds = [];
    }
    (globalThis as unknown as { IntersectionObserver: typeof IO }).IntersectionObserver = IO;
  });

  it('renders an <img> for type=image', () => {
    const { container } = render(
      <MediaShowcase
        media={{ type: 'image', src: '/poster.jpg', alt: 'Hero shot' }}
      />
    );
    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img?.getAttribute('alt')).toBe('Hero shot');
  });

  it('renders a <video> with caption tracks for type=video', () => {
    const { container } = render(
      <MediaShowcase
        media={{
          type: 'video',
          src: '/clip.mp4',
          alt: 'Demo',
          tracks: [
            { src: '/cc.vtt', srcLang: 'en', label: 'English', default: true },
          ],
        }}
      />
    );
    expect(container.querySelector('video')).not.toBeNull();
    const track = container.querySelector('track');
    expect(track).not.toBeNull();
    expect(track?.getAttribute('srclang')).toBe('en');
  });

  it('renders headline overlay when provided', () => {
    render(
      <MediaShowcase
        media={{ type: 'image', src: '/x.jpg' }}
        headline="See how it works"
        description="A 2-minute walkthrough."
      />
    );
    expect(screen.getByText('See how it works')).toBeDefined();
    expect(screen.getByText('A 2-minute walkthrough.')).toBeDefined();
  });

  it('renders play button when showPlayButton + video', () => {
    render(
      <MediaShowcase
        media={{ type: 'video', src: '/x.mp4' }}
        showPlayButton
      />
    );
    expect(screen.getByRole('button', { name: 'Play video' })).toBeDefined();
  });
});
