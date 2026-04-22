const { register } = require('../../registry.cjs');

register('entity-header', (props, ctx) => {
  const name = props.name || 'Glow Serum Launch';
  const subtitle = props.subtitle || 'Luminara Beauty';
  const status = props.status || 'active';
  const avatar = props.avatar || null;
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const metadata = props.metadata || [
    { label: 'Creators', value: '24/30' },
    { label: 'Budget', value: '\u20B91.2L' },
    { label: 'Timeline', value: 'Apr 15 - May 15' },
    { label: 'Category', value: 'Beauty & Skincare' }
  ];

  const statusColors = {
    active: { bg: 'var(--amp-green-50)', text: 'var(--amp-green-600)' },
    completed: { bg: 'var(--amp-blue-50)', text: 'var(--amp-blue-600)' },
    draft: { bg: 'var(--amp-stone-100)', text: 'var(--amp-stone-500)' },
    paused: { bg: 'var(--amp-amber-50)', text: 'var(--amp-amber-600)' }
  };
  const sc = statusColors[status] || statusColors.draft;

  return `
<div style="display:flex;align-items:flex-start;gap:var(--amp-sp-5);margin-bottom:var(--amp-sp-6)">
  <div style="width:72px;height:72px;border-radius:var(--amp-radius-xl);background:linear-gradient(135deg,var(--amp-violet-100),var(--amp-violet-200));display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;color:var(--amp-violet-600);flex-shrink:0">${avatar ? '<img src="' + avatar + '" style="width:100%;height:100%;object-fit:cover;border-radius:var(--amp-radius-xl)" />' : initials}</div>
  <div style="flex:1;min-width:0">
    <div style="display:flex;align-items:center;gap:var(--amp-sp-3);margin-bottom:var(--amp-sp-1)">
      <h1 style="font-size:24px;font-weight:700;color:var(--amp-text);margin:0;line-height:1.2">${name}</h1>
      <span style="display:inline-block;padding:3px 12px;border-radius:var(--amp-radius-full);font-size:var(--amp-text-xs);font-weight:600;background:${sc.bg};color:${sc.text};text-transform:capitalize">${status}</span>
    </div>
    <div style="font-size:var(--amp-text-sm);color:var(--amp-text-muted);margin-bottom:var(--amp-sp-3)">${subtitle}</div>
    <div style="display:flex;gap:var(--amp-sp-5);flex-wrap:wrap">
      ${metadata.map(m => `
      <div>
        <div style="font-size:var(--amp-text-xs);color:var(--amp-text-muted);text-transform:uppercase;letter-spacing:.05em">${m.label}</div>
        <div style="font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-text)">${m.value}</div>
      </div>`).join('')}
    </div>
  </div>
  <div style="display:flex;gap:var(--amp-sp-2);flex-shrink:0">
    <button onclick="editEntity()" class="amp-btn amp-btn-primary" style="font-size:var(--amp-text-sm);padding:8px 16px">Edit</button>
    <button onclick="shareEntity()" class="amp-btn amp-btn-outline" style="font-size:var(--amp-text-sm);padding:8px 16px">Share</button>
    <button onclick="archiveEntity()" class="amp-btn amp-btn-text" style="font-size:var(--amp-text-sm);padding:8px 16px;color:var(--amp-stone-400)">Archive</button>
  </div>
</div>`;
});
