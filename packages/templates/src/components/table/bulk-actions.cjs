const { register } = require('../../registry.cjs');

register('bulk-actions', (props, ctx) => {
  return `
<div id="bulkActions" style="display:none;align-items:center;gap:var(--amp-sp-3);padding:var(--amp-sp-3) var(--amp-sp-4);background:var(--amp-violet-50);border:1px solid var(--amp-violet-200);border-radius:var(--amp-radius-lg);margin-bottom:var(--amp-sp-4);animation:fadeSlideIn .2s ease-out">
  <span style="font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-violet-700)">
    <span id="selectedCount">0</span> selected
  </span>
  <div style="width:1px;height:20px;background:var(--amp-violet-200)"></div>
  <button onclick="bulkExport()" style="display:flex;align-items:center;gap:4px;padding:6px 14px;border:1px solid var(--amp-violet-200);border-radius:var(--amp-radius-md);background:var(--amp-surface);color:var(--amp-violet-700);cursor:pointer;font-size:var(--amp-text-xs);font-weight:500;transition:all .15s" onmouseover="this.style.background='var(--amp-violet-100)'" onmouseout="this.style.background='var(--amp-surface)'">&#128229; Export</button>
  <button onclick="bulkArchive()" style="display:flex;align-items:center;gap:4px;padding:6px 14px;border:1px solid var(--amp-violet-200);border-radius:var(--amp-radius-md);background:var(--amp-surface);color:var(--amp-violet-700);cursor:pointer;font-size:var(--amp-text-xs);font-weight:500;transition:all .15s" onmouseover="this.style.background='var(--amp-violet-100)'" onmouseout="this.style.background='var(--amp-surface)'">&#128451; Archive</button>
  <button onclick="bulkDelete()" style="display:flex;align-items:center;gap:4px;padding:6px 14px;border:1px solid var(--amp-red-50);border-radius:var(--amp-radius-md);background:var(--amp-surface);color:var(--amp-red-600);cursor:pointer;font-size:var(--amp-text-xs);font-weight:500;transition:all .15s" onmouseover="this.style.background='var(--amp-red-50)'" onmouseout="this.style.background='var(--amp-surface)'">&#128465; Delete</button>
  <div style="flex:1"></div>
  <button onclick="clearSelection()" style="background:none;border:none;color:var(--amp-violet-600);cursor:pointer;font-size:var(--amp-text-xs);font-weight:500;text-decoration:underline">Clear selection</button>
</div>`;
});
