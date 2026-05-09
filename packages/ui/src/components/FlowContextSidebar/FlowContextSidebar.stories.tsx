import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { FlowContextSidebar, type FlowStep } from './FlowContextSidebar';

/**
 * `FlowContextSidebar` is the left-rail multi-step navigator used in the
 * Magic Studio Option-D cockpit
 * (`magic-studio/docs/mockups/option-d.html`, region R5). Implements the
 * `FlowSidebar` v0 contract from
 * `packages/ui/src/components/FlowSidebar/SPEC.md` (PR #101).
 *
 * Mockup region:
 *
 * ```html
 * <aside class="flow-side">
 *   <div class="head">
 *     <div class="title-block">
 *       <div class="title">Brand Order</div>
 *       <div class="sub">5 steps</div>
 *     </div>
 *     <button class="collapse">‹</button>
 *   </div>
 *   <div class="steps">
 *     <div class="step-card active">…</div>
 *     <div class="step-card">…</div>
 *   </div>
 *   <div class="foot">
 *     <button class="apply-all">Apply brief to all 5 steps</button>
 *   </div>
 * </aside>
 * ```
 *
 * Spec: `magic-studio/docs/mockups/OPTION_D_SPEC.md` §1 R5, §2 C4, §4 I13–I15.
 */
const meta = {
  title: 'Studio v0/FlowContextSidebar',
  component: FlowContextSidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    status: { type: 'beta' },
  },
} satisfies Meta<typeof FlowContextSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const Frame: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div style={{ height: 600, display: 'flex' }}>{children}</div>
);

const fiveSteps: FlowStep[] = [
  { id: 's1', label: 'Step 1 · Brief', status: 'complete' },
  { id: 's2', label: 'Step 2 · Package', status: 'in-progress' },
  { id: 's3', label: 'Step 3 · Visuals', status: 'default' },
  { id: 's4', label: 'Step 4 · Review', status: 'default' },
  { id: 's5', label: 'Step 5 · Ship', status: 'default' },
];

const fiveStepsMixed: FlowStep[] = [
  { id: 's1', label: 'Step 1 · Brief', status: 'complete' },
  {
    id: 's2',
    label: 'Step 2 · Package',
    status: 'in-progress',
    badge: { count: 3, tone: 'accent' },
  },
  { id: 's3', label: 'Step 3 · Visuals', status: 'default' },
  { id: 's4', label: 'Step 4 · Review', status: 'skipped' },
  { id: 's5', label: 'Step 5 · Ship', status: 'default' },
];

/** Default — 5 steps, step 2 active, no thumbnails. */
export const Default: Story = {
  render: () => {
    const [active, setActive] = React.useState('s2');
    return (
      <Frame>
        <FlowContextSidebar
          flowName="Brand Order — 5 steps"
          steps={fiveSteps}
          activeStepId={active}
          onStepClick={setActive}
        />
      </Frame>
    );
  },
  args: {
    flowName: 'Brand Order — 5 steps',
    steps: fiveSteps,
    activeStepId: 's2',
  },
};

/** Mixed status — complete / in-progress / skipped + accent badge. */
export const MixedStatus: Story = {
  render: () => {
    const [active, setActive] = React.useState('s2');
    return (
      <Frame>
        <FlowContextSidebar
          flowName="Brand Order — 5 steps"
          steps={fiveStepsMixed}
          activeStepId={active}
          onStepClick={setActive}
        />
      </Frame>
    );
  },
  args: {
    flowName: 'Brand Order — 5 steps',
    steps: fiveStepsMixed,
    activeStepId: 's2',
  },
};

/** Apply-to-all variant — bottom action button visible. */
export const WithApplyToAll: Story = {
  render: () => {
    const [active, setActive] = React.useState('s2');
    return (
      <Frame>
        <FlowContextSidebar
          flowName="Brand Order — 5 steps"
          steps={fiveSteps}
          activeStepId={active}
          onStepClick={setActive}
          onApplyToAll={() => undefined}
          applyToAllLabel="Apply brief to all 5 steps"
        />
      </Frame>
    );
  },
  args: {
    flowName: 'Brand Order — 5 steps',
    steps: fiveSteps,
    activeStepId: 's2',
    onApplyToAll: () => undefined,
  },
};

/** Collapsed — 44px rail of step pips. */
export const Collapsed: Story = {
  render: () => {
    const [collapsed, setCollapsed] = React.useState(true);
    const [active, setActive] = React.useState('s2');
    return (
      <Frame>
        <FlowContextSidebar
          flowName="Brand Order — 5 steps"
          steps={fiveSteps}
          activeStepId={active}
          collapsed={collapsed}
          onCollapse={setCollapsed}
          onStepClick={setActive}
        />
      </Frame>
    );
  },
  args: {
    flowName: 'Brand Order — 5 steps',
    steps: fiveSteps,
    activeStepId: 's2',
    collapsed: true,
  },
};

/** Long list — 12 steps demonstrating sticky header + scrolling. */
export const LongList: Story = {
  render: () => {
    const longSteps: FlowStep[] = Array.from({ length: 12 }, (_, i) => ({
      id: `s${i + 1}`,
      label: `Step ${i + 1} · Lorem ipsum`,
      status: i < 4 ? 'complete' : i === 4 ? 'in-progress' : 'default',
    }));
    return (
      <Frame>
        <FlowContextSidebar
          flowName="Brand Order — 12 steps"
          steps={longSteps}
          activeStepId="s5"
          onApplyToAll={() => undefined}
        />
      </Frame>
    );
  },
  args: {
    flowName: 'Brand Order — 12 steps',
    steps: [],
    activeStepId: 's5',
  },
};

/**
 * Empty — `steps: []` returns null. Story documents that consumers must
 * gate render on `steps.length > 0` (no skeleton).
 */
export const Empty: Story = {
  render: () => (
    <Frame>
      <FlowContextSidebar flowName="No flow" steps={[]} activeStepId="" />
    </Frame>
  ),
  args: {
    flowName: 'No flow',
    steps: [],
    activeStepId: '',
  },
};
