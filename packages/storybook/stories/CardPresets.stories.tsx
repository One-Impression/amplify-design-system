import type { Meta, StoryObj } from '@storybook/react';
import {
  ContentTypeCard,
  ScriptPreviewCard,
  GoalCard,
  PackageCard,
  MetricCard,
  WalletCard,
  CollapsibleCard,
} from '@amplify-ai/ui';

/**
 * One story per Card preset wrapper proving the public API still renders
 * correctly after the consolidation onto `<Card>`. Visual parity is part of
 * the backward-compat contract.
 */

const meta: Meta = {
  title: 'Components/Card/Presets',
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj;

// ─── ContentTypeCard ─────────────────────────────────────────────────────────

export const ContentType: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 280px)', gap: 16 }}>
      <ContentTypeCard
        badge="Reels"
        badgeColor="violet"
        title="Short-form reel"
        price="₹12,000"
        pros={[
          '15–30s vertical video',
          'Best for product launches',
          'High completion rate',
        ]}
        cancelPolicy="Free cancellation up to 48h"
      />
      <ContentTypeCard
        badge="Static"
        badgeColor="green"
        title="Static post"
        price="₹4,500"
        pros={['Single image carousel', 'Lower production cost']}
        recommended
        selected
        onSelect={() => undefined}
      />
    </div>
  ),
};

// ─── ScriptPreviewCard ───────────────────────────────────────────────────────

export const ScriptPreview: Story = {
  render: () => (
    <ScriptPreviewCard
      concept="Hook → Demo → CTA"
      duration="0:30"
      sections={[
        {
          label: 'Hook',
          emoji: '🎬',
          timing: '0:00–0:05',
          content: 'Open on a tired creator scrolling through DMs.',
        },
        {
          label: 'Demo',
          emoji: '📦',
          timing: '0:05–0:25',
          content: 'Show the product solving the pain in three quick beats.',
        },
        {
          label: 'CTA',
          emoji: '👉',
          timing: '0:25–0:30',
          content: 'Link in bio with discount code AMPLIFY.',
        },
      ]}
    />
  ),
};

// ─── GoalCard ────────────────────────────────────────────────────────────────

export const Goal: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 200px)', gap: 16 }}>
      <GoalCard
        icon="🎯"
        title="Awareness"
        subtitle="Reach new audiences"
        tag="Top of funnel"
        tagColor="violet"
      />
      <GoalCard
        icon="🛒"
        title="Conversions"
        subtitle="Drive purchases"
        tag="Bottom of funnel"
        tagColor="green"
        selected
        onSelect={() => undefined}
      />
      <GoalCard
        icon="🔁"
        title="Retention"
        subtitle="Re-engage existing"
        tag="Lifecycle"
        tagColor="blue"
      />
    </div>
  ),
};

// ─── PackageCard ─────────────────────────────────────────────────────────────

export const Package: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 420 }}>
      <PackageCard
        name="Starter"
        description="1 reel + 2 stories"
        price="₹15k"
        onSelect={() => undefined}
      />
      <PackageCard
        name="Growth"
        description="3 reels + 5 stories"
        price="₹38k"
        selected
        onSelect={() => undefined}
      />
      <PackageCard
        name="Scale"
        description="6 reels + 10 stories + analytics"
        price="₹80k"
        onSelect={() => undefined}
      />
    </div>
  ),
};

// ─── MetricCard ──────────────────────────────────────────────────────────────

export const Metric: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      <MetricCard label="Active campaigns" value={14} trend={12} iconVariant="accent" />
      <MetricCard label="Healthy creators" value={142} trend={5} iconVariant="success" />
      <MetricCard
        label="Failed payouts"
        value={1}
        trend={-3}
        subtitle="Bank rejected"
        iconVariant="error"
      />
    </div>
  ),
};

// ─── WalletCard ──────────────────────────────────────────────────────────────

export const Wallet: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <WalletCard
        balance={42_500}
        percentage={68}
        topupMessage="Add ₹10,000 to unlock the next campaign tier."
        subtitle="Bonus: ₹500 cashback on top-ups above ₹5,000"
      />
    </div>
  ),
};

// ─── CollapsibleCard ─────────────────────────────────────────────────────────

export const Collapsible: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <CollapsibleCard
        defaultOpen
        header={
          <div>
            <p style={{ fontWeight: 600 }}>Audience details</p>
            <p style={{ fontSize: 13, color: '#666' }}>India, 18–34, sports</p>
          </div>
        }
      >
        <div style={{ padding: '12px 24px 20px' }}>
          <p style={{ fontSize: 13, color: '#444' }}>
            Targeting expands to gym-goers and amateur cricketers in metros + Tier-2.
            Estimated reach: 2.4M monthly active users on Reels.
          </p>
        </div>
      </CollapsibleCard>
    </div>
  ),
};
