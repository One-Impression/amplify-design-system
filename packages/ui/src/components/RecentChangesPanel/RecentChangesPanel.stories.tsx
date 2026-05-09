import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  RecentChangesPanel,
  type GitCommit,
} from './RecentChangesPanel';

/**
 * `RecentChangesPanel` is the right-side slide-in panel listing the last
 * N git commits touching the target file. Used in Magic Studio's
 * Option-D cockpit (`magic-studio/docs/mockups/option-d.html`, region R4
 * + state `#changes`).
 *
 * Mockup region:
 *
 * ```html
 * <aside class="changes-panel">
 *   <div class="panel-head">
 *     <h3>Recent changes</h3>
 *     <button>×</button>
 *   </div>
 *   <div class="commit">
 *     <div class="msg">…</div>
 *     <div class="meta-row">
 *       <span>Apaksh Gupta</span> · <span>3h ago</span>
 *       · <span class="added">+38</span> <span class="removed">−12</span>
 *     </div>
 *   </div>
 * </aside>
 * ```
 *
 * Spec: `magic-studio/docs/mockups/OPTION_D_SPEC.md` §1 R4, §2 C5, §4 I10.
 */
const meta = {
  title: 'Studio v0/RecentChangesPanel',
  component: RecentChangesPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    status: { type: 'beta' },
  },
} satisfies Meta<typeof RecentChangesPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const Frame: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div style={{ height: 600, display: 'flex', justifyContent: 'flex-end' }}>
    {children}
  </div>
);

const baseCommit = (i: number): GitCommit => ({
  sha: `${'a'.repeat(7 - i.toString().length)}${i}sha`,
  message: [
    'Add live-page diff overlay over fullscreen viewer',
    'Lift CTA pills above sticky header on small viewports',
    'Wire @-reference reply syntax into composer',
    'Switch composer to /api/v1/design/generate-async',
    'Inline reference-snapshot pill in top bar',
    'Resolve hover-toolbar z-index regression',
    'Rebuild thread auto-scroll on new turn',
  ][i % 7],
  author: ['Apaksh Gupta', 'Claude Opus 4.7', 'Pixel Agent'][i % 3],
  timestamp: new Date(Date.now() - (i + 1) * 3600_000),
  added: 38 - i * 4,
  removed: 12 - i,
  url: i === 0 ? 'https://github.com/One-Impression/magic-studio/commit/abc1234' : undefined,
});

const sevenCommits: GitCommit[] = Array.from({ length: 7 }, (_, i) => baseCommit(i));

/** Default — 7 commits for `src/components/Order.tsx`. */
export const Default: Story = {
  render: () => (
    <Frame>
      <RecentChangesPanel
        filePath="src/components/Order.tsx"
        commits={sevenCommits}
        onClose={() => undefined}
        formatTime={() => '3h ago'}
      />
    </Frame>
  ),
  args: {
    filePath: 'src/components/Order.tsx',
    commits: sevenCommits,
    onClose: () => undefined,
  },
};

/** Empty — no commits yet. Renders the empty-state message. */
export const Empty: Story = {
  render: () => (
    <Frame>
      <RecentChangesPanel
        filePath="src/components/UnchangedFile.tsx"
        commits={[]}
        onClose={() => undefined}
      />
    </Frame>
  ),
  args: {
    filePath: 'src/components/UnchangedFile.tsx',
    commits: [],
    onClose: () => undefined,
  },
};

/** Single commit — verifies row sizing on a sparse panel. */
export const SingleCommit: Story = {
  render: () => (
    <Frame>
      <RecentChangesPanel
        filePath="src/components/Order.tsx"
        commits={[sevenCommits[0]]}
        onClose={() => undefined}
        formatTime={() => '12m ago'}
      />
    </Frame>
  ),
  args: {
    filePath: 'src/components/Order.tsx',
    commits: [sevenCommits[0]],
    onClose: () => undefined,
  },
};
