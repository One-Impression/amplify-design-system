import type { Meta, StoryObj } from '@storybook/react';
import { HistoryStrip, type GenerationItem } from './HistoryStrip';

const meta = {
  title: 'Studio v2/HistoryStrip',
  component: HistoryStrip,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    status: { type: 'beta' },
  },
} satisfies Meta<typeof HistoryStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

const gen1: GenerationItem = {
  id: 'g1',
  label: 'Gen 1',
  thumbs: [
    { id: 'v1', status: 'ready' },
    { id: 'v2', status: 'ready' },
    { id: 'v3', status: 'win' },
    { id: 'v4', status: 'ready' },
  ],
  summary: '8.2s · V3 selected',
};

const gen2Current: GenerationItem = {
  id: 'g2',
  label: 'Gen 2 · now',
  thumbs: [
    { id: 'v1', status: 'locked' },
    { id: 'v2', status: 'generating' },
    { id: 'v3', status: 'generating' },
  ],
  summary: 'generating…',
  current: true,
};

const gen3Errored: GenerationItem = {
  id: 'g3',
  label: 'Gen 3',
  thumbs: [
    { id: 'v1', status: 'ready' },
    { id: 'v2', status: 'error' },
  ],
  summary: '12.4s · 1 failed',
};

export const Empty: Story = {
  args: {
    generations: [],
  },
};

export const SingleGeneration: Story = {
  args: {
    generations: [{ ...gen1, current: true }],
  },
};

export const FullTimeline: Story = {
  args: {
    generations: [gen1, gen2Current, gen3Errored],
  },
};

export const MixedStates: Story = {
  args: {
    generations: [
      {
        id: 'gx',
        label: 'Gen 1',
        thumbs: [
          { id: 'v1', status: 'ready' },
          { id: 'v2', status: 'win' },
          { id: 'v3', status: 'locked' },
          { id: 'v4', status: 'error' },
        ],
        summary: 'all four states',
        current: true,
      },
    ],
  },
};

export const Interactive: Story = {
  args: {
    generations: [gen1, gen2Current, gen3Errored],
    onSelect: (id) => console.log('select gen', id),
    onThumbSelect: (gid, vid) => console.log('select variant', gid, vid),
  },
};

/**
 * Option-D fidelity baseline — mirrors the history timeline region of
 * `studio-v2-option-d.html` verbatim. Two generations connected by a
 * styled branch-line, with a "live now" trailing slot pinned right.
 *
 * Mockup HTML region:
 *
 * ```html
 * <div class="d-history">
 *   <span class="h-label">Variants</span>
 *   <button class="d-genchip">
 *     <div>
 *       <div class="gen-no">GEN 1</div>
 *       <div class="thumb-row">
 *         <span class="mini"></span><span class="mini win"></span>
 *         <span class="mini"></span><span class="mini"></span>
 *       </div>
 *     </div>
 *     <div class="summary">8.2s · <b>V2</b> selected</div>
 *   </button>
 *   <span class="branchline"></span>
 *   <button class="d-genchip current">
 *     <div>
 *       <div class="gen-no">GEN 2 · NOW</div>
 *       <div class="thumb-row">
 *         <span class="mini locked"></span><span class="mini"></span>
 *         <span class="mini"></span>
 *       </div>
 *     </div>
 *     <div class="summary">generating…</div>
 *   </button>
 *   <span class="live-now">● AI sees the live page</span>
 * </div>
 * ```
 *
 * Visual contract:
 * - 11px uppercase tertiary "Variants" leading label.
 * - Mini-thumbs use a 135deg gradient between subtle + canvas tokens.
 * - `win` thumbs render a 1.5x success dot with a 2px surface ring.
 * - Branch-line is a 16px-wide hairline with a centered arrow.
 * - `live-now` slot pinned right via `ml-auto`, accent text.
 */
export const OptionDFidelity: Story = {
  args: {
    generations: [
      {
        id: 'g1',
        label: 'Gen 1',
        thumbs: [
          { id: 'v1', status: 'ready' },
          { id: 'v2', status: 'win' },
          { id: 'v3', status: 'ready' },
          { id: 'v4', status: 'ready' },
        ],
        summary: '8.2s · V2 selected',
      },
      {
        id: 'g2',
        label: 'Gen 2 · now',
        thumbs: [
          { id: 'v1', status: 'locked' },
          { id: 'v2', status: 'generating' },
          { id: 'v3', status: 'generating' },
        ],
        summary: 'generating…',
        current: true,
      },
    ],
    liveSlot: (
      <>
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: 'var(--amp-semantic-status-success)',
          }}
        />
        AI sees the live page
      </>
    ),
  },
};
