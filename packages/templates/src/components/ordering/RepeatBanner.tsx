import React from 'react';
import { Button } from '@amplify/ui';
import type { ComponentRenderer } from '../../registry';

export const RepeatBanner: ComponentRenderer = ({ props }) => {
  const product = (props.lastProduct as string) || 'Glow Serum';
  const completion = (props.completion as string) || '92%';

  return (
    <div
      id="repeatBanner"
      style={{
        background: 'var(--amp-surface)', borderRadius: 'var(--amp-radius-xl)',
        borderLeft: '4px solid var(--amp-violet-400)',
        padding: 'var(--amp-sp-5) var(--amp-sp-6)', marginBottom: 'var(--amp-sp-6)',
        boxShadow: 'var(--amp-shadow-sm)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--amp-sp-4)',
      }}
    >
      <div style={{ fontSize: 'var(--amp-text-base)', color: 'var(--amp-text-secondary)' }}>
        {'\uD83D\uDD04'} Welcome back! Your last campaign for <strong style={{ color: 'var(--amp-text)' }}>{product}</strong> had {completion} completion.
      </div>
      <div style={{ display: 'flex', gap: 'var(--amp-sp-2)', flexShrink: 0 }}>
        <Button variant="outline" size="sm">Run Similar {'\u2192'}</Button>
        <Button variant="ghost" size="sm">Start Fresh</Button>
      </div>
    </div>
  );
};
