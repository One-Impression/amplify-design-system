const { register } = require('../../registry.cjs');

register('repeat-banner', (props, ctx) => {
  const product = props.lastProduct || 'Glow Serum';
  const completion = props.completion || '92%';

  return `
<div id="repeatBanner" style="background:var(--amp-surface);border-radius:var(--amp-radius-xl);border-left:4px solid var(--amp-violet-400);padding:var(--amp-sp-5) var(--amp-sp-6);margin-bottom:var(--amp-sp-6);box-shadow:var(--amp-shadow-sm);display:flex;align-items:center;justify-content:space-between;gap:var(--amp-sp-4)">
  <div style="font-size:var(--amp-text-base);color:var(--amp-text-secondary)">🔄 Welcome back! Your last campaign for <strong style="color:var(--amp-text)">${product}</strong> had ${completion} completion.</div>
  <div style="display:flex;gap:var(--amp-sp-2);flex-shrink:0">
    <button class="amp-btn amp-btn-outline" style="font-size:var(--amp-text-sm);padding:var(--amp-sp-2) var(--amp-sp-4)" onclick="quickReorder()">Run Similar →</button>
    <button class="amp-btn amp-btn-text" style="font-size:var(--amp-text-sm)" onclick="document.getElementById('repeatBanner').style.display='none'">Start Fresh</button>
  </div>
</div>`;
});
