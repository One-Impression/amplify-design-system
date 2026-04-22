const { register } = require('../../registry.cjs');

register('pagination', (props, ctx) => {
  const total = props.total || 156;
  const perPage = props.perPage || 10;
  const currentPage = props.currentPage || 1;
  const totalPages = Math.ceil(total / perPage);
  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, total);

  const pages = [];
  for (let i = 1; i <= Math.min(totalPages, 5); i++) pages.push(i);

  return `
<div style="display:flex;align-items:center;justify-content:space-between;padding:var(--amp-sp-4) 0;margin-top:var(--amp-sp-2)">
  <div style="font-size:var(--amp-text-sm);color:var(--amp-text-muted)">
    Showing <span style="font-weight:600;color:var(--amp-text)">${start}-${end}</span> of <span style="font-weight:600;color:var(--amp-text)">${total}</span>
  </div>
  <div style="display:flex;align-items:center;gap:var(--amp-sp-1)">
    <button onclick="goToPage(${currentPage - 1})" style="padding:6px 10px;border:1px solid var(--amp-border);border-radius:var(--amp-radius-md);background:var(--amp-surface);color:var(--amp-text-secondary);cursor:pointer;font-size:var(--amp-text-sm);transition:all .15s;${currentPage === 1 ? 'opacity:.4;pointer-events:none' : ''}" ${currentPage === 1 ? 'disabled' : ''}>&#8592; Prev</button>
    ${pages.map(p => `
    <button onclick="goToPage(${p})" style="width:32px;height:32px;border:${p === currentPage ? 'none' : '1px solid var(--amp-border)'};border-radius:var(--amp-radius-md);background:${p === currentPage ? 'var(--amp-accent)' : 'var(--amp-surface)'};color:${p === currentPage ? '#fff' : 'var(--amp-text-secondary)'};cursor:pointer;font-size:var(--amp-text-sm);font-weight:${p === currentPage ? '600' : '400'};transition:all .15s">${p}</button>`).join('')}
    ${totalPages > 5 ? '<span style="color:var(--amp-stone-400);font-size:var(--amp-text-sm)">...</span><button onclick="goToPage(' + totalPages + ')" style="width:32px;height:32px;border:1px solid var(--amp-border);border-radius:var(--amp-radius-md);background:var(--amp-surface);color:var(--amp-text-secondary);cursor:pointer;font-size:var(--amp-text-sm)">' + totalPages + '</button>' : ''}
    <button onclick="goToPage(${currentPage + 1})" style="padding:6px 10px;border:1px solid var(--amp-border);border-radius:var(--amp-radius-md);background:var(--amp-surface);color:var(--amp-text-secondary);cursor:pointer;font-size:var(--amp-text-sm);transition:all .15s;${currentPage >= totalPages ? 'opacity:.4;pointer-events:none' : ''}" ${currentPage >= totalPages ? 'disabled' : ''}>Next &#8594;</button>
  </div>
</div>`;
});
