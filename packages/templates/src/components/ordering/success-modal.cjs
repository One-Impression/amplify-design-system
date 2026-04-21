const { register } = require('../../registry.cjs');

register('success-modal', (props, ctx) => {
  return `
<div class="amp-modal-bg" id="successModal">
  <div class="amp-modal" style="text-align:center">
    <svg class="amp-success-check" viewBox="0 0 72 72"><circle cx="36" cy="36" r="30"/><path d="M22 36 L32 46 L50 28" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <div class="amp-h1" style="font-size:22px">Campaign Created! 🎉</div>
    <p style="color:var(--amp-text-muted);margin-top:var(--amp-sp-2)">Your campaign for <strong>Glow Radiance Serum</strong> is being set up.</p>
    <div style="text-align:left;margin:var(--amp-sp-6) 0;display:flex;flex-direction:column;gap:var(--amp-sp-3)">
      <div style="display:flex;align-items:center;gap:var(--amp-sp-3);font-size:var(--amp-text-sm);color:var(--amp-text-secondary)"><div style="width:8px;height:8px;border-radius:var(--amp-radius-full);background:var(--amp-violet-300);flex-shrink:0"></div><strong>Day 1-3:</strong>&nbsp;Creator applications open</div>
      <div style="display:flex;align-items:center;gap:var(--amp-sp-3);font-size:var(--amp-text-sm);color:var(--amp-text-secondary)"><div style="width:8px;height:8px;border-radius:var(--amp-radius-full);background:var(--amp-violet-400);flex-shrink:0"></div><strong>Day 3-5:</strong>&nbsp;Selection & matching</div>
      <div style="display:flex;align-items:center;gap:var(--amp-sp-3);font-size:var(--amp-text-sm);color:var(--amp-text-secondary)"><div style="width:8px;height:8px;border-radius:var(--amp-radius-full);background:var(--amp-accent);flex-shrink:0"></div><strong>Day 5-10:</strong>&nbsp;Content creation & delivery</div>
    </div>
    <button class="amp-btn amp-btn-primary amp-btn-lg amp-btn-full" onclick="document.getElementById('successModal').classList.remove('show')">Go to Dashboard →</button>
  </div>
</div>`;
});
