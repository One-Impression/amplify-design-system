const { register } = require('../../registry.cjs');

register('chart-placeholder', (props, ctx) => {
  const title = props.title || 'Campaign Performance';
  const height = props.height || '280px';

  const bars = [65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95, 68];

  return `
<div class="amp-card" style="padding:var(--amp-sp-5);background:var(--amp-surface);border-radius:var(--amp-radius-xl);margin-bottom:var(--amp-sp-6)">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--amp-sp-4)">
    <div style="font-size:var(--amp-text-md);font-weight:600;color:var(--amp-text)">${title}</div>
    <div style="display:flex;gap:var(--amp-sp-2)">
      <span class="amp-chip active" onclick="selectChartRange(this,'7d')" style="font-size:11px;padding:4px 10px;cursor:pointer">7D</span>
      <span class="amp-chip" onclick="selectChartRange(this,'30d')" style="font-size:11px;padding:4px 10px;cursor:pointer">30D</span>
      <span class="amp-chip" onclick="selectChartRange(this,'90d')" style="font-size:11px;padding:4px 10px;cursor:pointer">90D</span>
    </div>
  </div>
  <div style="height:${height};display:flex;align-items:flex-end;gap:8px;padding:var(--amp-sp-4) 0;border-bottom:1px solid var(--amp-border)">
    ${bars.map((h, i) => `
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
      <div style="width:100%;height:${h}%;background:linear-gradient(180deg,var(--amp-violet-500),var(--amp-violet-300));border-radius:var(--amp-radius-md) var(--amp-radius-md) 0 0;min-height:8px;transition:height .3s"></div>
    </div>`).join('')}
  </div>
  <div style="display:flex;justify-content:space-between;padding-top:var(--amp-sp-2)">
    ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => `
    <span style="flex:1;text-align:center;font-size:10px;color:var(--amp-stone-400)">${m}</span>`).join('')}
  </div>
</div>`;
});
