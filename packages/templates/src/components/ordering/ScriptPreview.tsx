import React from 'react';
import { Card, Badge } from '@one-impression/ui';
import type { ComponentRenderer } from '../../registry';

interface Script {
  num: number;
  hook: string;
  body: string;
  cta: string;
}

const defaultScripts: Script[] = [
  { num: 1, hook: '"Stop using your serum wrong \u2014 here\'s what changed my skin in 7 days"', body: 'Show applying the serum. "This lightweight formula absorbs instantly \u2014 no sticky residue. The Vitamin C and Hyaluronic Acid combo..."', cta: '"Link in bio for 15% off your first order"' },
  { num: 2, hook: '"POV: You found a serum that actually delivers on its promises"', body: 'Morning routine montage. "I\'ve tried everything, but this Vitamin C serum from Luminara is different. My skin has never been this hydrated..."', cta: '"Check the link \u2014 your skin will thank you"' },
];

export const ScriptPreview: ComponentRenderer = ({ props }) => {
  const scripts = (props.scripts as Script[]) || defaultScripts;
  const showReturning = props.showReturning as boolean;

  return (
    <div>
      <h2 style={{ fontSize: 'var(--amp-text-lg)', fontWeight: 600, color: 'var(--amp-text)', lineHeight: 1.3 }}>Sample Scripts</h2>

      <div style={{ background: 'var(--amp-violet-50)', borderRadius: 'var(--amp-radius-lg)', padding: 'var(--amp-sp-3) var(--amp-sp-4)', margin: 'var(--amp-sp-2) 0 var(--amp-sp-4)', display: 'flex', alignItems: 'center', gap: 'var(--amp-sp-2)' }}>
        <span style={{ fontSize: 16 }}>{'\uD83D\uDCA1'}</span>
        <span style={{ fontSize: 'var(--amp-text-sm)', color: 'var(--amp-violet-700)' }}>These are samples {'\u2014'} you'll customize scripts to your liking after payment</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--amp-sp-2)', marginBottom: 'var(--amp-sp-3)', flexWrap: 'wrap' }}>
        <Badge variant="brand">87% match with top performers</Badge>
        <span style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-text-muted)' }}>
          Optimized with: Meta Ads {'\u00B7'} Amazon {'\u00B7'} Reddit {'\u00B7'} Marketplace Trends
        </span>
      </div>

      {showReturning && (
        <div style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-green-600)', marginBottom: 'var(--amp-sp-3)' }}>
          {'\u2713'} Incorporating learnings from your 3 previous campaigns
        </div>
      )}

      <div style={{ display: 'flex', gap: 'var(--amp-sp-3)', overflowX: 'auto', padding: 'var(--amp-sp-1) 0' }}>
        {scripts.map((s) => (
          <Card key={s.num} variant="default" padding="md" style={{ minWidth: 280, flexShrink: 0, border: 'none' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--amp-violet-500)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 'var(--amp-sp-2)' }}>Script {s.num}</div>
            <div style={{ marginBottom: 'var(--amp-sp-2)' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--amp-stone-400)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 2 }}>{'\u26A1'} Hook</div>
              <p style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-text-secondary)', lineHeight: 1.4 }}>{s.hook}</p>
            </div>
            <div style={{ marginBottom: 'var(--amp-sp-2)' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--amp-stone-400)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 2 }}>{'\u270F\uFE0F'} Body</div>
              <p style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-text-secondary)', lineHeight: 1.4 }}>{s.body}</p>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--amp-stone-400)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 2 }}>{'\uD83C\uDFC1'} CTA</div>
              <p style={{ fontSize: 'var(--amp-text-xs)', color: 'var(--amp-text-secondary)', lineHeight: 1.4 }}>{s.cta}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
