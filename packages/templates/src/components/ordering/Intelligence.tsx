import React from 'react';
import { Card, Badge } from '@one-impression/ui';
import type { ComponentRenderer } from '../../registry';

export const Intelligence: ComponentRenderer = () => {
  return (
    <Card variant="default" padding="md" style={{ background: 'var(--amp-violet-50)', border: 'none', marginTop: 'var(--amp-sp-4)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--amp-sp-2)', marginBottom: 'var(--amp-sp-2)' }}>
        <span style={{ fontSize: 16 }}>{'\uD83E\uDDE0'}</span>
        <span style={{ fontSize: 'var(--amp-text-sm)', fontWeight: 600, color: 'var(--amp-violet-700)' }}>Platform Intelligence</span>
      </div>
      <p style={{ fontSize: 'var(--amp-text-sm)', color: 'var(--amp-violet-600)' }}>
        Based on 847 beauty campaigns, Problem{'\u2192'}Solution scripts convert 3.2x better for serums
      </p>
      <div style={{ display: 'flex', gap: 'var(--amp-sp-2)', marginTop: 'var(--amp-sp-2)', flexWrap: 'wrap' }}>
        {['Meta Ads', 'Amazon Reviews', 'Reddit', 'Marketplace Trends'].map((source) => (
          <Badge key={source} variant="brand">{source}</Badge>
        ))}
      </div>
    </Card>
  );
};
