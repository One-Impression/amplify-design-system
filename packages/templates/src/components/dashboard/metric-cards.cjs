const { register } = require('../../registry.cjs');

register('metric-cards', (props, ctx) => {
  const metrics = props.metrics || [
    { label: 'Active Campaigns', value: '12', change: '+3', trend: 'up' },
    { label: 'Total GMV', value: '\u20B94.2L', change: '+18%', trend: 'up' },
    { label: 'Creator Completion', value: '87%', change: '-2%', trend: 'down' },
    { label: 'Avg Delivery', value: '8.2 days', change: '-0.5', trend: 'up' }
  ];

  const trendArrow = (trend) => trend === 'up'
    ? '<span style="color:var(--amp-green-600)">&#9650;</span>'
    : '<span style="color:var(--amp-red-600)">&#9660;</span>';

  const trendColor = (trend) => trend === 'up' ? 'var(--amp-green-600)' : 'var(--amp-red-600)';

  return `
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--amp-sp-4);margin-bottom:var(--amp-sp-6)">
  ${metrics.map(m => `
  <div class="amp-card" style="padding:var(--amp-sp-5);background:var(--amp-surface);border-radius:var(--amp-radius-xl)">
    <div style="font-size:28px;font-weight:700;color:var(--amp-text);line-height:1.2">${m.value}</div>
    <div style="font-size:var(--amp-text-sm);color:var(--amp-text-muted);margin:var(--amp-sp-1) 0 var(--amp-sp-3)">${m.label}</div>
    <div style="display:flex;align-items:center;gap:var(--amp-sp-1);font-size:var(--amp-text-xs);font-weight:600;color:${trendColor(m.trend)}">
      ${trendArrow(m.trend)} ${m.change}
    </div>
  </div>`).join('')}
</div>`;
});
