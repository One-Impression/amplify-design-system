import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { DiffOverlay } from './DiffOverlay';

/**
 * `DiffOverlay` is the red/green pixel-diff layer painted on top of the
 * Magic Studio Live pane in the Option-D cockpit
 * (`magic-studio/docs/mockups/option-d.html`, region R15).
 *
 * Mockup region:
 *
 * ```html
 * <div class="diff-overlay" aria-hidden="true"></div>
 * <div class="diff-legend">
 *   <div class="lg-row"><span class="sw add"></span>Added</div>
 *   <div class="lg-row"><span class="sw rm"></span>Removed</div>
 * </div>
 * ```
 *
 * Spec: `magic-studio/docs/mockups/OPTION_D_SPEC.md` §1 R15, §2 C3, §4 I9.
 */
const meta = {
  title: 'Studio v0/DiffOverlay',
  component: DiffOverlay,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    status: { type: 'beta' },
  },
} satisfies Meta<typeof DiffOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

// Inline data-URI placeholders so stories render in offline / no-network
// Chromatic environments without depending on a CDN. Each is a tiny SVG
// rectangle in a token-friendly grey.
const liveShot =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 480">' +
      '<rect width="320" height="480" fill="%23eef0f3"/>' +
      '<text x="50%" y="50%" font-family="sans-serif" font-size="20" fill="%23222" text-anchor="middle">LIVE PAGE</text>' +
      '</svg>',
  );
const variantShot =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 480">' +
      '<rect width="320" height="480" fill="%23dde7ff"/>' +
      '<text x="50%" y="50%" font-family="sans-serif" font-size="20" fill="%23222" text-anchor="middle">VARIANT</text>' +
      '</svg>',
  );

const Wrap: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div style={{ width: 320, height: 480, position: 'relative' }}>{children}</div>
);

/**
 * `mode='highlight'` — the canonical Option-D state. Translucent green
 * (added) and red (removed) bands layered with mix-blend-multiply over
 * the live page; legend pill top-right.
 */
export const Highlight: Story = {
  render: () => (
    <Wrap>
      <DiffOverlay
        liveScreenshot={liveShot}
        variantScreenshot={variantShot}
        mode="highlight"
      />
    </Wrap>
  ),
  args: {
    liveScreenshot: liveShot,
    variantScreenshot: variantShot,
    mode: 'highlight',
  },
};

/**
 * `mode='swipe'` — vertical curtain at 50% (default). Variant occupies
 * the left side; live page on the right.
 */
export const Swipe: Story = {
  render: () => (
    <Wrap>
      <DiffOverlay
        liveScreenshot={liveShot}
        variantScreenshot={variantShot}
        mode="swipe"
      />
    </Wrap>
  ),
  args: {
    liveScreenshot: liveShot,
    variantScreenshot: variantShot,
    mode: 'swipe',
  },
};

/** `mode='swipe'` curtain at 70% — variant occupies the larger area. */
export const SwipeAt70: Story = {
  render: () => (
    <Wrap>
      <DiffOverlay
        liveScreenshot={liveShot}
        variantScreenshot={variantShot}
        mode="swipe"
        swipePercent={70}
      />
    </Wrap>
  ),
  args: {
    liveScreenshot: liveShot,
    variantScreenshot: variantShot,
    mode: 'swipe',
    swipePercent: 70,
  },
};

/** `mode='side-by-side'` — both screenshots in a 1fr / 1fr grid. */
export const SideBySide: Story = {
  render: () => (
    <Wrap>
      <DiffOverlay
        liveScreenshot={liveShot}
        variantScreenshot={variantShot}
        mode="side-by-side"
      />
    </Wrap>
  ),
  args: {
    liveScreenshot: liveShot,
    variantScreenshot: variantShot,
    mode: 'side-by-side',
  },
};
