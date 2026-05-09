import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ReferenceSnapshotPill } from './ReferenceSnapshotPill';

/**
 * `ReferenceSnapshotPill` is the time-stamped pill in the Magic Studio
 * top-bar that announces when the original page screenshot was captured
 * (`magic-studio/docs/mockups/option-d.html`, region R2).
 *
 * Mockup region:
 *
 * ```html
 * <button class="pill-snapshot" title="Click to view the original screenshot">
 *   Reference snapshot · 3:42 PM
 * </button>
 * ```
 *
 * Spec: `magic-studio/docs/mockups/OPTION_D_SPEC.md` §1 R2.
 */
const meta = {
  title: 'Studio v0/ReferenceSnapshotPill',
  component: ReferenceSnapshotPill,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    status: { type: 'beta' },
  },
} satisfies Meta<typeof ReferenceSnapshotPill>;

export default meta;
type Story = StoryObj<typeof meta>;

const capturedAt = new Date('2026-05-08T15:42:00');

export const Default: Story = {
  args: {
    capturedAt,
    screenshotUrl: 'https://snapshots.example.com/order-page-3-42pm.png',
    onClick: () => undefined,
  },
};

/** Custom label — used when the snapshot is of something other than a page. */
export const CustomLabel: Story = {
  args: {
    capturedAt,
    screenshotUrl: 'https://snapshots.example.com/order-page-3-42pm.png',
    label: 'Original design',
    onClick: () => undefined,
  },
};

/** Pinned formatTime so the rendered label is locale-independent for VR. */
export const PinnedTimeFormat: Story = {
  args: {
    capturedAt,
    screenshotUrl: 'https://snapshots.example.com/order-page-3-42pm.png',
    formatTime: () => '3:42 PM',
    onClick: () => undefined,
  },
};
