const { register } = require('../../registry.cjs');

register('sortable-table', (props, ctx) => {
  const columns = props.columns || [
    { key: 'name', label: 'Campaign Name', width: '24%' },
    { key: 'brand', label: 'Brand', width: '16%' },
    { key: 'status', label: 'Status', width: '12%' },
    { key: 'creators', label: 'Creators', width: '12%' },
    { key: 'budget', label: 'Budget', width: '14%' },
    { key: 'date', label: 'Created', width: '14%' }
  ];

  const rows = props.rows || [
    { name: 'Glow Serum Launch', brand: 'Luminara Beauty', status: 'active', creators: '24/30', budget: '\u20B91.2L', date: 'Apr 15, 2026' },
    { name: 'Summer Vibes', brand: 'Beachglow', status: 'active', creators: '18/20', budget: '\u20B985K', date: 'Apr 12, 2026' },
    { name: 'Festive Collection', brand: 'Luminara Beauty', status: 'completed', creators: '32/32', budget: '\u20B92.1L', date: 'Mar 28, 2026' },
    { name: 'Protein Bar Push', brand: 'FitBite', status: 'active', creators: '8/15', budget: '\u20B975K', date: 'Apr 10, 2026' },
    { name: 'Monsoon Ready', brand: 'Umbrella Co', status: 'draft', creators: '0/20', budget: '\u20B91.5L', date: 'Apr 18, 2026' },
    { name: 'Clean Beauty Series', brand: 'PureGlow', status: 'paused', creators: '12/12', budget: '\u20B945K', date: 'Mar 20, 2026' },
    { name: 'Campus Collection', brand: 'StyleU', status: 'active', creators: '40/50', budget: '\u20B93.0L', date: 'Apr 8, 2026' },
    { name: 'Weekend Wellness', brand: 'ZenLife', status: 'completed', creators: '16/16', budget: '\u20B968K', date: 'Mar 15, 2026' }
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
<div class="amp-card" style="padding:0;background:var(--amp-surface);border-radius:var(--amp-radius-xl);overflow:hidden">
  <table style="width:100%;border-collapse:collapse" id="sortableTable">
    <thead>
      <tr style="background:var(--amp-stone-50)">
        <th style="padding:var(--amp-sp-3) var(--amp-sp-4);width:40px">
          <input type="checkbox" onclick="toggleAllRows(this)" style="cursor:pointer;accent-color:var(--amp-accent)" />
        </th>
        ${columns.map(col => `
        <th style="text-align:left;padding:var(--amp-sp-3) var(--amp-sp-3);font-size:var(--amp-text-xs);font-weight:600;color:var(--amp-text-muted);text-transform:uppercase;letter-spacing:.05em;cursor:pointer;width:${col.width};user-select:none" onclick="sortColumn(this,'${col.key}')">
          ${col.label} <span style="opacity:.4;font-size:10px">&#9650;&#9660;</span>
        </th>`).join('')}
        <th style="width:60px;padding:var(--amp-sp-3)"></th>
      </tr>
    </thead>
    <tbody>
      ${rows.map((row, ri) => `
      <tr class="table-row" style="transition:background .15s;cursor:pointer" onmouseover="this.style.background='var(--amp-stone-50)'" onmouseout="this.style.background='transparent'">
        <td style="padding:var(--amp-sp-3) var(--amp-sp-4)">
          <input type="checkbox" class="row-checkbox" onclick="updateBulkCount()" style="cursor:pointer;accent-color:var(--amp-accent)" />
        </td>
        <td style="padding:var(--amp-sp-3);font-size:var(--amp-text-sm);font-weight:500;color:var(--amp-text)">${row.name}</td>
        <td style="padding:var(--amp-sp-3);font-size:var(--amp-text-sm);color:var(--amp-text-secondary)">${row.brand}</td>
        <td style="padding:var(--amp-sp-3)">${statusBadge(row.status)}</td>
        <td style="padding:var(--amp-sp-3);font-size:var(--amp-text-sm);color:var(--amp-text-secondary)">${row.creators}</td>
        <td style="padding:var(--amp-sp-3);font-size:var(--amp-text-sm);font-weight:500;color:var(--amp-text)">${row.budget}</td>
        <td style="padding:var(--amp-sp-3);font-size:var(--amp-text-sm);color:var(--amp-text-muted)">${row.date}</td>
        <td style="padding:var(--amp-sp-3);text-align:center">
          <button onclick="openRowMenu(this,${ri})" style="background:none;border:none;cursor:pointer;font-size:16px;color:var(--amp-stone-400);padding:4px 8px;border-radius:var(--amp-radius-md);transition:background .15s" onmouseover="this.style.background='var(--amp-stone-100)'" onmouseout="this.style.background='none'">&#8942;</button>
        </td>
      </tr>`).join('')}
    </tbody>
  </table>
</div>`;
});
