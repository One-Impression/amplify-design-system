import type { Meta, StoryObj } from '@storybook/react';
import { CouncilRail, type AgentVerdict } from './CouncilRail';

const meta = {
  title: 'Studio v2/CouncilRail',
  component: CouncilRail,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    status: { type: 'beta' },
  },
  decorators: [
    (Story) => (
      <div style={{ height: 600, maxWidth: 360, display: 'flex' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CouncilRail>;

export default meta;
type Story = StoryObj<typeof meta>;

const fullCouncil: AgentVerdict[] = [
  {
    agentId: 'pixel',
    agentName: 'Pixel',
    agentRole: 'Design Director',
    agentColor: 'var(--amp-semantic-accent-primary, #6531FF)',
    initial: 'P',
    verdict: 'ok',
    body: 'Hierarchy and rhythm are right; spacing tokens consistent.',
  },
  {
    agentId: 'zenith',
    agentName: 'Zenith',
    agentRole: 'CTO',
    agentColor: '#0EA5E9',
    initial: 'Z',
    verdict: 'warn',
    body: 'Two unused props; keep the API tighter for the launch.',
  },
  {
    agentId: 'penny',
    agentName: 'Penny',
    agentRole: 'CFO',
    agentColor: '#F59E0B',
    initial: 'N',
    verdict: 'ok',
    body: 'Within content budget; no LLM cost regressions.',
  },
  {
    agentId: 'heimdall',
    agentName: 'Heimdall',
    agentRole: 'Chief Analyst',
    agentColor: '#10B981',
    initial: 'H',
    verdict: 'flag',
    body: 'Last 14 days of similar copy converted 22% lower than the V2 lens.',
  },
];

export const FullCouncil: Story = {
  args: {
    forVariantLabel: 'V1',
    verdicts: fullCouncil,
    summaryHeadline: '3 of 4 agents agree V1',
    summaryDetail: 'Heimdall flags conversion risk — review before lock.',
  },
};

export const Unanimous: Story = {
  args: {
    forVariantLabel: 'V2',
    verdicts: [
      {
        agentId: 'pixel',
        agentName: 'Pixel',
        agentRole: 'Design Director',
        agentColor: 'var(--amp-semantic-accent-primary, #6531FF)',
        initial: 'P',
        verdict: 'ok',
        body: 'Looks great.',
      },
      {
        agentId: 'zenith',
        agentName: 'Zenith',
        agentRole: 'CTO',
        agentColor: '#0EA5E9',
        initial: 'Z',
        verdict: 'ok',
        body: 'Implementation clean.',
      },
      {
        agentId: 'aria',
        agentName: 'Aria',
        agentRole: 'COO',
        agentColor: '#EF4444',
        initial: 'A',
        verdict: 'ok',
        body: 'Operationally sound.',
      },
    ],
    summaryHeadline: 'Council unanimous on V2',
  },
};

export const DisagreementsOnly: Story = {
  args: {
    forVariantLabel: 'V1',
    verdicts: fullCouncil,
    disagreementsOnly: true,
    summaryHeadline: '3 of 4 agents agree V1',
  },
};

export const Empty: Story = {
  args: {
    verdicts: [],
  },
};

export const WithAskQuestion: Story = {
  args: {
    forVariantLabel: 'V3',
    verdicts: fullCouncil.slice(0, 2),
    onAskQuestion: (text) => console.log('asked:', text),
  },
};

/**
 * Option-D fidelity baseline — mirrors the council rail region of
 * `studio-v2-option-d.html` verbatim.
 *
 * Mockup HTML region:
 *
 * ```html
 * <aside class="d-council">
 *   <div class="d-council-head">
 *     <span class="title">COUNCIL</span>
 *     <span class="for">on V1</span>
 *   </div>
 *   <div class="d-council-summary">
 *     <b>3 of 4 agents agree V1</b>
 *     <p>Heimdall flags conversion risk — review before lock.</p>
 *   </div>
 *   <div class="agent-card">
 *     <div class="av" style="background:#6531FF">P</div>
 *     <div>
 *       <div class="who">Pixel</div>
 *       <div class="role">Design Director</div>
 *       <div class="body">Hierarchy and rhythm are right; spacing tokens consistent.</div>
 *     </div>
 *     <span class="verdict ok">ok</span>
 *   </div>
 *   …more cards…
 *   <div class="ask">⌘/  ask the council a question</div>
 * </aside>
 * ```
 *
 * Visual contract:
 * - 11px uppercase tertiary "Council" title; plain accent-text "on V1"
 *   (no pill).
 * - 24px square-ish (rounded-md) avatars, no full-circle.
 * - 3px-rounded compact verdict badges (px-1.5 py-0.5 text-[10px]).
 * - Dashed-border ask input pinned to the bottom.
 */
export const OptionDFidelity: Story = {
  args: {
    forVariantLabel: 'V1',
    verdicts: fullCouncil,
    summaryHeadline: '3 of 4 agents agree V1',
    summaryDetail: 'Heimdall flags conversion risk — review before lock.',
    onAskQuestion: (text) => console.log('asked:', text),
  },
};
