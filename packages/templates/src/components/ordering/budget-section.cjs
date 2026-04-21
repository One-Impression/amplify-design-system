const { register } = require('../../registry.cjs');

register('budget-section', (props, ctx) => {
  const packages = props.aiPackages || [
    { id: 'starter', name: 'Starter', videos: 5, pricePerVideo: 2500, total: 12500 },
    { id: 'growth', name: 'Growth', videos: 15, pricePerVideo: 2000, total: 30000, popular: true },
    { id: 'pro', name: 'Pro', videos: 30, pricePerVideo: 1600, total: 48000, savings: '36%' }
  ];

  return `
<div class="amp-h2">Investment</div>

<div id="aiBudget">
  <p style="font-size:var(--amp-text-sm);color:var(--amp-text-muted);margin:var(--amp-sp-2) 0 var(--amp-sp-4)">Choose a package — bigger packages save more per video</p>
  <div style="display:flex;flex-direction:column;gap:var(--amp-sp-3)">
    ${packages.map((p, i) => `
    <div class="amp-card clickable${i === 1 ? ' selected' : ''}" onclick="selectPackage(this,'${p.id}')" style="padding:var(--amp-sp-4) var(--amp-sp-5);position:relative" data-package="${p.id}" data-total="${p.total}">
      ${p.popular ? '<span class="amp-badge amp-badge-violet" style="position:absolute;top:var(--amp-sp-3);right:var(--amp-sp-3)">Most Popular</span>' : ''}
      ${p.savings ? `<span class="amp-badge amp-badge-green" style="position:absolute;top:var(--amp-sp-3);right:var(--amp-sp-3)">Save ${p.savings}</span>` : ''}
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:var(--amp-text-md);font-weight:700">${p.name}</div>
          <div style="font-size:var(--amp-text-sm);color:var(--amp-text-muted)">${p.videos} videos · ₹${p.pricePerVideo.toLocaleString('en-IN')}/video · 24s</div>
        </div>
        <div style="font-size:20px;font-weight:800;color:var(--amp-violet-700)">₹${p.total.toLocaleString('en-IN')}</div>
      </div>
    </div>`).join('')}
  </div>
</div>

<div id="humanBudget" style="display:none">
  <div style="text-align:center;margin-bottom:var(--amp-sp-2)"><span id="budgetDisplay" style="font-size:28px;font-weight:700;color:var(--amp-violet-700)">₹50,000</span></div>
  <input type="range" id="budgetSlider" min="5000" max="250000" value="50000" step="5000" oninput="updateBudget(+this.value)">
  <div class="amp-slider-marks"><span>₹5K</span><span>₹25K</span><span>₹50K</span><span>₹1L</span><span>₹2.5L</span></div>
  <div class="amp-card" style="padding:var(--amp-sp-5);margin-top:var(--amp-sp-5);border:none;background:var(--amp-stone-100)">
    <div style="font-size:var(--amp-text-base);font-weight:600;margin-bottom:var(--amp-sp-3)">📊 Campaign Estimate</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--amp-sp-3)">
      <div style="text-align:center;padding:var(--amp-sp-3);background:var(--amp-surface);border-radius:var(--amp-radius-lg)"><div style="font-size:var(--amp-text-xl);font-weight:700;color:var(--amp-violet-700)" id="estCreators">8</div><div style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">creators</div></div>
      <div style="text-align:center;padding:var(--amp-sp-3);background:var(--amp-surface);border-radius:var(--amp-radius-lg)"><div style="font-size:var(--amp-text-xl);font-weight:700;color:var(--amp-violet-700)" id="estVideos">8</div><div style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">videos</div></div>
      <div style="text-align:center;padding:var(--amp-sp-3);background:var(--amp-surface);border-radius:var(--amp-radius-lg)"><div style="font-size:var(--amp-text-xl);font-weight:700;color:var(--amp-violet-700)" id="estDays">10</div><div style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">day delivery</div></div>
      <div style="text-align:center;padding:var(--amp-sp-3);background:var(--amp-surface);border-radius:var(--amp-radius-lg)"><div style="font-size:var(--amp-text-xl);font-weight:700;color:var(--amp-violet-700)">★★★</div><div style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">quality (Flexi)</div></div>
    </div>
  </div>
</div>`;
});
