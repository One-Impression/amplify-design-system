const { register } = require('../../registry.cjs');

register('intelligence', (props, ctx) => {
  // This component is used inline — the actual animation is handled by JS in the layout
  return `
<div class="amp-card" style="padding:var(--amp-sp-5);background:var(--amp-violet-50);border:none;margin-top:var(--amp-sp-4)">
  <div style="display:flex;align-items:center;gap:var(--amp-sp-2);margin-bottom:var(--amp-sp-2)">
    <span style="font-size:16px">🧠</span>
    <span style="font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-violet-700)">Platform Intelligence</span>
  </div>
  <p style="font-size:var(--amp-text-sm);color:var(--amp-violet-600)">Based on 847 beauty campaigns, Problem→Solution scripts convert 3.2x better for serums</p>
  <div style="display:flex;gap:var(--amp-sp-2);margin-top:var(--amp-sp-2);flex-wrap:wrap">
    <span class="amp-badge amp-badge-violet">Meta Ads</span>
    <span class="amp-badge amp-badge-violet">Amazon Reviews</span>
    <span class="amp-badge amp-badge-violet">Reddit</span>
    <span class="amp-badge amp-badge-violet">Marketplace Trends</span>
  </div>
</div>`;
});
