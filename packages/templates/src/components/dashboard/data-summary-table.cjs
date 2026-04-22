const { register } = require('../../registry.cjs');

register('data-summary-table', (props, ctx) => {
  const columns = props.columns || ['Campaign', 'Status', 'Creators', 'Budget', 'Completion'];
  const rows = props.rows || [
    ['Glow Serum Launch', 'active', '24', '\u20B91.2L', '78%'],
    ['Summer Collection', 'active', '18', '\u20B985K', '45%'],
    ['Festive Promo', 'completed', '32', '\u20B92.1L', '100%'],
    ['Brand Awareness Q2', 'draft', '0', '\u20B950K', '0%'],
    ['Skincare Routine', 'active', '12', '\u20B965K', '62%']
  ];

  const statusBadge = (status) => {
    const colors = {
      active: { bg: 'var(--amp-green-50)', text: 'var(--amp-green-600)' },
      completed: { bg: 'var(--amp-blue-50)', text: 'var(--amp-blue-600)' },
      draft: { bg: 'var(--amp-stone-100)', text: 'var(--amp-stone-500)' },
      paused: { bg: 'var(--amp-amber-50)', text: 'var(--amp-amber-600)' }
    };
    const c = colors[status] || colors.draft;
    return `<span style="display:inline-block;padding:2px 10px;border-radius:var(--amp-radius-full);font-size:var(--amp-text-xs);font-weight:600;background:${c.bg};color:${c.text};text-transform:capitalize">${status}</span>`;
  };

  return `
<div class="amp-card" style="padding:var(--amp-sp-5);background:var(--amp-surface);border-radius:var(--amp-radius-xl);overflow:hidden">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--amp-sp-4)">
    <div style="font-size:var(--amp-text-md);font-weight:600;color:var(--amp-text)">Recent Campaigns</div>
    <a href="#" style="font-size:var(--amp-text-sm);color:var(--amp-accent);text-decoration:none;font-weight:500">View all &rarr;</a>
  </div>
  <table style="width:100%;border-collapse:collapse">
    <thead>
      <tr>
        ${columns.map(col => `<th style="text-align:left;padding:var(--amp-sp-2) var(--amp-sp-3);font-size:var(--amp-text-xs);font-weight:600;color:var(--amp-text-muted);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--amp-border);cursor:pointer" onclick="sortTable(this)">
          ${col} <span style="opacity:.4;font-size:10px">&#9650;&#9660;</span>
        </th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${rows.map(row => `
      <tr style="transition:background .15s;cursor:pointer" onmouseover="this.style.background='var(--amp-stone-50)'" onmouseout="this.style.background='transparent'">
        ${row.map((cell, ci) => `<td style="padding:var(--amp-sp-3);font-size:var(--amp-text-sm);color:var(--amp-text-secondary);border-bottom:1px solid var(--amp-stone-100)">
          ${ci === 0 ? '<span style="font-weight:500;color:var(--amp-text)">' + cell + '</span>' : ci === 1 ? statusBadge(cell) : cell}
        </td>`).join('')}
      </tr>`).join('')}
    </tbody>
  </table>
</div>`;
});
