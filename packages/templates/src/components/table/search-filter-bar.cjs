const { register } = require('../../registry.cjs');

register('search-filter-bar', (props, ctx) => {
  const filters = props.filters || ['Status: All', 'Brand: All', 'Date: Last 30 days'];

  return `
<div style="display:flex;align-items:center;gap:var(--amp-sp-3);margin-bottom:var(--amp-sp-4);flex-wrap:wrap">
  <div style="position:relative;flex:1;min-width:240px">
    <input type="text" placeholder="Search by name, brand, or ID..." style="width:100%;padding:var(--amp-sp-3) var(--amp-sp-4) var(--amp-sp-3) 40px;border:1px solid var(--amp-border);border-radius:var(--amp-radius-lg);font-size:var(--amp-text-sm);color:var(--amp-text);background:var(--amp-surface);outline:none;transition:border-color .15s" onfocus="this.style.borderColor='var(--amp-accent)'" onblur="this.style.borderColor='var(--amp-border)'" />
    <span style="position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:15px;color:var(--amp-stone-400)">&#128269;</span>
  </div>
  <div style="display:flex;gap:var(--amp-sp-2);align-items:center">
    ${filters.map(f => `
    <button class="amp-chip" onclick="toggleFilter(this)" style="cursor:pointer;border:1px solid var(--amp-border);padding:6px 14px;border-radius:var(--amp-radius-full);font-size:var(--amp-text-xs);font-weight:500;background:var(--amp-surface);color:var(--amp-text-secondary);display:flex;align-items:center;gap:4px;transition:all .15s">
      ${f} <span style="font-size:10px;color:var(--amp-stone-400)">&#9660;</span>
    </button>`).join('')}
    <button onclick="addFilter()" style="cursor:pointer;border:1px dashed var(--amp-border);padding:6px 14px;border-radius:var(--amp-radius-full);font-size:var(--amp-text-xs);font-weight:500;background:transparent;color:var(--amp-accent);transition:all .15s">+ Add Filter</button>
  </div>
</div>`;
});
