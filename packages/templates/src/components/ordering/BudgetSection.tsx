import React from 'react';
import { Card, Badge } from '@amplify/ui';
import type { ComponentRenderer } from '../../registry';

interface PackageItem {
  id: string;
  name: string;
  videos: number;
  pricePerVideo: number;
  total: number;
  popular?: boolean;
  savings?: string;
}

const defaultPackages: PackageItem[] = [
  { id: 'starter', name: 'Starter', videos: 5, pricePerVideo: 2500, total: 12500 },
  { id: 'growth', name: 'Growth', videos: 15, pricePerVideo: 2000, total: 30000, popular: true },
  { id: 'pro', name: 'Pro', videos: 30, pricePerVideo: 1600, total: 48000, savings: '36%' },
];

export const BudgetSection: ComponentRenderer = ({ props }) => {
  const packages = (props.aiPackages as PackageItem[]) || defaultPackages;

  return (
    <div>
      <h2 style={{ fontSize: 'var(--amp-text-lg)', fontWeight: 600, color: 'var(--amp-text)', lineHeight: 1.3 }}>Investment</h2>

      {/* AI Budget */}
      <div id="aiBudget">
        <p style={{ fontSize: 'var(--amp-text-sm)', color: 'var(--amp-text-muted)', margin: 'var(--amp-sp-2) 0 var(--amp-sp-4)' }}>Choose a package {'\u2014'} bigger packages save more per video</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--amp-sp-3)' }}>
          {packages.map((p, i) => (
            <Card key={p.id} variant="interactive" padding="md" className={`clickable${i === 1 ? ' selected' : ''}`} data-package={p.id} data-total={p.total} style={{ position: 'relative' }}>
              {p.popular && (
                <div style={{ position: 'absolute', top: 'var(--amp-sp-3)', right: 'var(--amp-sp-3)' }}>
                  <Badge variant="brand">Most Popular</Badge>
                </div>
              )}
              {p.savings && (
                <div style={{ position: 'absolute', top: 'var(--amp-sp-3)', right: 'var(--amp-sp-3)' }}>
                  <Badge variant="positive">Save {p.savings}</Badge>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 'var(--amp-text-md)', fontWeight: 700 }}>{p.name}</div>
                  <div style={{ fontSize: 'var(--amp-text-sm)', color: 'var(--amp-text-muted)' }}>
                    {p.videos} videos {'\u00B7'} {'\u20B9'}{p.pricePerVideo.toLocaleString('en-IN')}/video {'\u00B7'} 24s
                  </div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--amp-violet-700)' }}>{'\u20B9'}{p.total.toLocaleString('en-IN')}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Human Budget (hidden by default) */}
      <div id="humanBudget" style={{ display: 'none' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--amp-sp-2)' }}>
          <span id="budgetDisplay" style={{ fontSize: 28, fontWeight: 700, color: 'var(--amp-violet-700)' }}>{'\u20B9'}50,000</span>
        </div>
        <input type="range" id="budgetSlider" min={5000} max={250000} defaultValue={50000} step={5000} />
        <div className="amp-slider-marks">
          <span>{'\u20B9'}5K</span><span>{'\u20B9'}25K</span><span>{'\u20B9'}50K</span><span>{'\u20B9'}1L</span><span>{'\u20B9'}2.5L</span>
        </div>

        <Card variant="default" padding="md" style={{ marginTop: 'var(--amp-sp-5)', border: 'none', background: 'var(--amp-stone-100)' }}>
          <div style={{ fontSize: 'var(--amp-text-base)', fontWeight: 600, marginBottom: 'var(--amp-sp-3)' }}>{'\uD83D\uDCCA'} Campaign Estimate</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--amp-sp-3)' }}>
            {[
              { id: 'estCreators', val: '8', label: 'creators' },
              { id: 'estVideos', val: '8', label: 'videos' },
              { id: 'estDays', val: '10', label: 'day delivery' },
              { id: '', val: '\u2605\u2605\u2605', label: 'quality (Flexi)' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center', padding: 'var(--amp-sp-3)', background: 'var(--amp-surface)', borderRadius: 'var(--amp-radius-lg)' }}>
                <div id={item.id || undefined} style={{ fontSize: 'var(--amp-text-xl)', fontWeight: 700, color: 'var(--amp-violet-700)' }}>{item.val}</div>
                <div style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-text-muted)' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
