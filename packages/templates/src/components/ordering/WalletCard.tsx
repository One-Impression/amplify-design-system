import React from 'react';
import type { ComponentRenderer } from '../../registry';

export const WalletCard: ComponentRenderer = ({ props, context }) => {
  const data = (context.data as Record<string, unknown>) || {};
  const balance = (data.wallet as number) || 12400;
  const total = (props.campaignTotal as number) || 30000;
  const coverage = Math.min(100, Math.round(balance / (total * 1.18) * 100));

  return (
    <div className="amp-wallet" style={{ marginTop: 'var(--amp-sp-5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--amp-sp-2)' }}>
        {'\uD83D\uDCB0'} <span style={{ fontSize: 'var(--amp-text-base)', fontWeight: 600, color: 'var(--amp-violet-700)' }}>{'\u20B9'}{balance.toLocaleString('en-IN')} available in OI Money</span>
      </div>
      <p style={{ fontSize: 'var(--amp-text-sm)', color: 'var(--amp-accent)', marginTop: 'var(--amp-sp-1)' }}>
        Auto-applied at checkout {'\u2014'} covers ~{coverage}% of this campaign
      </p>
      <div className="amp-wallet-bar">
        <div className="amp-wallet-fill" style={{ width: `${coverage}%` }} />
      </div>
    </div>
  );
};
