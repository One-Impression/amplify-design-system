const { register } = require('../../registry.cjs');

register('script-preview', (props, ctx) => {
  const scripts = props.scripts || [
    { num: 1, hook: '"Stop using your serum wrong — here\'s what changed my skin in 7 days"', body: 'Show applying the serum. "This lightweight formula absorbs instantly — no sticky residue. The Vitamin C and Hyaluronic Acid combo..."', cta: '"Link in bio for 15% off your first order"' },
    { num: 2, hook: '"POV: You found a serum that actually delivers on its promises"', body: 'Morning routine montage. "I\'ve tried everything, but this Vitamin C serum from Luminara is different. My skin has never been this hydrated..."', cta: '"Check the link — your skin will thank you"' }
  ];

  return `
<div class="amp-h2">Sample Scripts</div>
<div style="background:var(--amp-violet-50);border-radius:var(--amp-radius-lg);padding:var(--amp-sp-3) var(--amp-sp-4);margin:var(--amp-sp-2) 0 var(--amp-sp-4);display:flex;align-items:center;gap:var(--amp-sp-2)">
  <span style="font-size:16px">💡</span>
  <span style="font-size:var(--amp-text-sm);color:var(--amp-violet-700)">These are samples — you'll customize scripts to your liking after payment</span>
</div>

<div style="display:flex;align-items:center;gap:var(--amp-sp-2);margin-bottom:var(--amp-sp-3);flex-wrap:wrap">
  <span class="amp-badge amp-badge-violet">87% match with top performers</span>
  <span style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">Optimized with: Meta Ads · Amazon · Reddit · Marketplace Trends</span>
</div>

${props.showReturning ? '<div style="font-size:var(--amp-text-xs);color:var(--amp-green-600);margin-bottom:var(--amp-sp-3)">✓ Incorporating learnings from your 3 previous campaigns</div>' : ''}

<div style="display:flex;gap:var(--amp-sp-3);overflow-x:auto;padding:var(--amp-sp-1) 0">
  ${scripts.map(s => `
  <div class="amp-card" style="min-width:280px;flex-shrink:0;padding:var(--amp-sp-4);border:none">
    <div style="font-size:11px;font-weight:600;color:var(--amp-violet-500);text-transform:uppercase;letter-spacing:.04em;margin-bottom:var(--amp-sp-2)">Script ${s.num}</div>
    <div style="margin-bottom:var(--amp-sp-2)"><div style="font-size:10px;font-weight:600;color:var(--amp-stone-400);text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px">⚡ Hook</div><p style="font-size:var(--amp-text-xs);color:var(--amp-text-secondary);line-height:1.4">${s.hook}</p></div>
    <div style="margin-bottom:var(--amp-sp-2)"><div style="font-size:10px;font-weight:600;color:var(--amp-stone-400);text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px">✏️ Body</div><p style="font-size:var(--amp-text-xs);color:var(--amp-text-secondary);line-height:1.4">${s.body}</p></div>
    <div><div style="font-size:10px;font-weight:600;color:var(--amp-stone-400);text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px">🏁 CTA</div><p style="font-size:var(--amp-text-xs);color:var(--amp-text-secondary);line-height:1.4">${s.cta}</p></div>
  </div>`).join('')}
</div>`;
});
