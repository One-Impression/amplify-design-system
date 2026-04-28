import React from 'react';
import { Button } from '@amplify-ai/ui';
import type { ComponentRenderer } from '../../registry';

export const SuccessModal: ComponentRenderer = () => {
  const timeline = [
    { days: 'Day 1-3:', text: 'Creator applications open', color: 'var(--amp-violet-300)' },
    { days: 'Day 3-5:', text: 'Selection & matching', color: 'var(--amp-violet-400)' },
    { days: 'Day 5-10:', text: 'Content creation & delivery', color: 'var(--amp-accent)' },
  ];

  return (
    <div className="amp-modal-bg" id="successModal">
      <div className="amp-modal" style={{ textAlign: 'center' }}>
        <svg className="amp-success-check" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r="30" />
          <path d="M22 36 L32 46 L50 28" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--amp-text)' }}>Campaign Created! {'\uD83C\uDF89'}</h1>
        <p style={{ color: 'var(--amp-text-muted)', marginTop: 'var(--amp-sp-2)' }}>
          Your campaign for <strong>Glow Radiance Serum</strong> is being set up.
        </p>
        <div style={{ textAlign: 'left', margin: 'var(--amp-sp-6) 0', display: 'flex', flexDirection: 'column', gap: 'var(--amp-sp-3)' }}>
          {timeline.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--amp-sp-3)', fontSize: 'var(--amp-text-sm)', color: 'var(--amp-text-secondary)' }}>
              <div style={{ width: 8, height: 8, borderRadius: 'var(--amp-radius-full)', background: item.color, flexShrink: 0 }} />
              <strong>{item.days}</strong>{'\u00A0'}{item.text}
            </div>
          ))}
        </div>
        <Button variant="primary" size="lg" className="amp-btn-full">Go to Dashboard {'\u2192'}</Button>
      </div>
    </div>
  );
};
