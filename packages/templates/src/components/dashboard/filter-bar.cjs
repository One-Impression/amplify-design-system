const { register } = require('../../registry.cjs');

register('filter-bar', (props, ctx) => {
  const dateRange = props.dateRange || 'Last 30 days';
  const filters = props.filters || ['All', 'Active', 'Completed', 'Draft'];
  const activeFilter = props.activeFilter || 'All';

  return `
<div style="display:flex;align-items:center;gap:var(--amp-sp-4);margin-bottom:var(--amp-sp-6);flex-wrap:wrap">
  <div style="display:flex;align-items:center;gap:var(--amp-sp-2);padding:var(--amp-sp-2) var(--amp-sp-4);background:var(--amp-surface);border:1px solid var(--amp-border);border-radius:var(--amp-radius-lg);cursor:pointer" onclick="toggleDatePicker()">
    <span style="font-size:14px">&#128197;</span>
    <span style="font-size:var(--amp-text-sm);color:var(--amp-text);font-weight:500">${dateRange}</span>
    <span style="font-size:10px;color:var(--amp-stone-400)">&#9660;</span>
  </div>
  <div style="display:flex;gap:var(--amp-sp-2)">
    ${filters.map(f => `
    <button class="amp-chip${f === activeFilter ? ' active' : ''}" onclick="selectFilter(this,'${f}')" style="cursor:pointer;border:none;padding:6px 14px;border-radius:var(--amp-radius-full);font-size:var(--amp-text-sm);font-weight:500;transition:all .15s;${f === activeFilter ? 'background:var(--amp-accent);color:#fff' : 'background:var(--amp-stone-100);color:var(--amp-text-secondary)'}">${f}</button>`).join('')}
  </div>
  <div style="flex:1"></div>
  <div style="position:relative">
    <input type="text" placeholder="Search campaigns..." style="padding:var(--amp-sp-2) var(--amp-sp-4) var(--amp-sp-2) 36px;border:1px solid var(--amp-border);border-radius:var(--amp-radius-lg);font-size:var(--amp-text-sm);color:var(--amp-text);background:var(--amp-surface);outline:none;width:220px;transition:border-color .15s" onfocus="this.style.borderColor='var(--amp-accent)'" onblur="this.style.borderColor='var(--amp-border)'" />
    <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:14px;color:var(--amp-stone-400)">&#128269;</span>
  </div>
</div>`;
});
