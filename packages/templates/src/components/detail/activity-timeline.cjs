const { register } = require('../../registry.cjs');

register('activity-timeline', (props, ctx) => {
  const events = props.events || [
    { date: 'Apr 18, 2026', title: 'Content review completed', description: '24 of 30 deliverables approved. 6 pending revision.', icon: 'check', color: 'var(--amp-green-600)' },
    { date: 'Apr 16, 2026', title: 'Creators started posting', description: 'First 8 creators published Instagram Reels.', icon: 'play', color: 'var(--amp-violet-600)' },
    { date: 'Apr 15, 2026', title: 'Campaign went live', description: 'All 30 creators confirmed and briefed.', icon: 'rocket', color: 'var(--amp-blue-600)' },
    { date: 'Apr 12, 2026', title: 'Creator matching complete', description: '30 creators selected from 145 applications.', icon: 'users', color: 'var(--amp-amber-600)' },
    { date: 'Apr 10, 2026', title: 'Campaign created', description: 'Glow Serum Launch campaign set up by Priya Sharma.', icon: 'create', color: 'var(--amp-stone-400)' }
  ];

  const iconMap = {
    check: '&#10003;',
    play: '&#9654;',
    rocket: '&#9889;',
    users: '&#9679;',
    create: '&#43;'
  };

  return `
<div class="amp-card" style="padding:var(--amp-sp-5);background:var(--amp-surface);border-radius:var(--amp-radius-xl)">
  <div style="font-size:var(--amp-text-md);font-weight:600;color:var(--amp-text);margin-bottom:var(--amp-sp-5)">Activity</div>
  <div style="position:relative;padding-left:32px">
    <div style="position:absolute;left:11px;top:12px;bottom:12px;width:2px;background:var(--amp-stone-200)"></div>
    ${events.map((evt, i) => `
    <div style="position:relative;padding-bottom:${i < events.length - 1 ? 'var(--amp-sp-6)' : '0'}">
      <div style="position:absolute;left:-32px;top:2px;width:24px;height:24px;border-radius:var(--amp-radius-full);background:${evt.color || 'var(--amp-stone-400)'};color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;z-index:1">${iconMap[evt.icon] || '&#9679;'}</div>
      <div style="font-size:var(--amp-text-xs);color:var(--amp-text-muted);margin-bottom:2px">${evt.date}</div>
      <div style="font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-text);margin-bottom:2px">${evt.title}</div>
      <div style="font-size:var(--amp-text-sm);color:var(--amp-text-secondary);line-height:1.5">${evt.description}</div>
    </div>`).join('')}
  </div>
</div>`;
});
