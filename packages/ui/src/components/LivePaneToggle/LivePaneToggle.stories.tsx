import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { LivePaneToggle, type LivePaneMode } from './LivePaneToggle';

/**
 * `LivePaneToggle` is the 3-state pane-mode control in the Magic Studio
 * cockpit (`magic-studio/docs/mockups/option-d.html`). Mockup region:
 *
 * ```html
 * <div class="seg" role="group" aria-label="Pane mode">
 *   <button>Live</button>
 *   <button class="on">Variants</button>
 *   <button>Split</button>
 * </div>
 * ```
 *
 * Spec: `magic-studio/docs/mockups/OPTION_D_SPEC.md` §1 R3, §2 C1.
 */
const meta = {
  title: 'Studio v0/LivePaneToggle',
  component: LivePaneToggle,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    status: { type: 'beta' },
  },
} satisfies Meta<typeof LivePaneToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state — `variants` selected. Matches the canonical cockpit's
 * `#loaded` state where the user is reviewing AI-generated variants.
 */
export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState<LivePaneMode>('variants');
    return (
      <LivePaneToggle
        value={value}
        onChange={setValue}
        liveUrl="https://app.example.com/order"
      />
    );
  },
  args: {
    value: 'variants',
    onChange: () => undefined,
  },
};

/**
 * `live` selected — matches `#live-split` state where the live iframe
 * occupies the workspace (variants hidden).
 */
export const LiveActive: Story = {
  render: () => {
    const [value, setValue] = React.useState<LivePaneMode>('live');
    return (
      <LivePaneToggle
        value={value}
        onChange={setValue}
        liveUrl="https://app.example.com/order"
      />
    );
  },
  args: {
    value: 'live',
    onChange: () => undefined,
  },
};

/**
 * `split` selected — matches `#live-split` state with side-by-side Live +
 * Variants layout.
 */
export const SplitActive: Story = {
  render: () => {
    const [value, setValue] = React.useState<LivePaneMode>('split');
    return (
      <LivePaneToggle
        value={value}
        onChange={setValue}
        liveUrl="https://app.example.com/order"
      />
    );
  },
  args: {
    value: 'split',
    onChange: () => undefined,
  },
};

export const Disabled: Story = {
  args: {
    value: 'variants',
    onChange: () => undefined,
    disabled: true,
  },
};
