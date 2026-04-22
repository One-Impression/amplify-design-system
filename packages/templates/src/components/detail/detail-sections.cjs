const { register } = require('../../registry.cjs');

register('detail-sections', (props, ctx) => {
  const sections = props.sections || [
    { title: 'Campaign Details', rows: [
      { label: 'Campaign Type', value: 'Influencer Marketing' },
      { label: 'Content Format', value: 'Instagram Reels + Stories' },
      { label: 'Target Audience', value: 'Women 18-35, Beauty & Lifestyle' },
      { label: 'Goal', value: 'Brand Awareness + UGC Generation' }
    ]},
    { title: 'Delivery Timeline', rows: [
      { label: 'Start Date', value: 'April 15, 2026' },
      { label: 'End Date', value: 'May 15, 2026' },
      { label: 'Content Deadline', value: 'April 28, 2026' },
      { label: 'Review Period', value: '3 business days' }
    ]},
    { title: 'Budget Breakdown', rows: [
      { label: 'Creator Fees', value: '\u20B985,000' },
      { label: 'Platform Fee (15%)', value: '\u20B912,750' },
      { label: 'Content Boost', value: '\u20B922,250' },
      { label: 'Total Budget', value: '\u20B91,20,000' }
    ]}
  ];

  return `
<div style="display:flex;flex-direction:column;gap:var(--amp-sp-4)">
  ${sections.map((section, si) => `
  <div class="amp-card detail-section" style="padding:0;background:var(--amp-surface);border-radius:var(--amp-radius-xl);overflow:hidden">
    <div onclick="toggleSection(this,${si})" style="display:flex;align-items:center;justify-content:space-between;padding:var(--amp-sp-4) var(--amp-sp-5);cursor:pointer;transition:background .15s" onmouseover="this.style.background='var(--amp-stone-50)'" onmouseout="this.style.background='transparent'">
      <div style="font-size:var(--amp-text-md);font-weight:600;color:var(--amp-text)">${section.title}</div>
      <span class="section-chevron" style="font-size:12px;color:var(--amp-stone-400);transition:transform .2s;display:inline-block">&#9660;</span>
    </div>
    <div class="section-body" id="sectionBody${si}" style="border-top:1px solid var(--amp-stone-100)">
      ${section.rows.map((row, ri) => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:var(--amp-sp-3) var(--amp-sp-5);${ri < section.rows.length - 1 ? 'border-bottom:1px solid var(--amp-stone-50)' : ''}">
        <span style="font-size:var(--amp-text-sm);color:var(--amp-text-muted)">${row.label}</span>
        <span style="font-size:var(--amp-text-sm);font-weight:500;color:var(--amp-text)">${row.value}</span>
      </div>`).join('')}
    </div>
  </div>`).join('')}
</div>`;
});
