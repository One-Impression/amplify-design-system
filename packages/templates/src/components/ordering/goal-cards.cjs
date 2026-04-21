const { register } = require('../../registry.cjs');

register('goal-cards', (props, ctx) => {
  const goals = props.goals || [
    { id: 'ads', icon: '🎬', title: 'Content for Ads', tagline: 'Scroll-stopping UGC for paid campaigns', bullets: ['Full content ownership & rights', 'Optimized for Meta, Google, YouTube', 'Multiple format variations'], price: 'From ₹5,000/video', timeline: '7-10 days' },
    { id: 'influencer', icon: '📱', title: 'Influencer Marketing', tagline: 'Creators post about you to their audience', bullets: ['Content on creator\'s own profile', 'Organic reach & engagement', 'Authentic social proof'], price: 'From ₹8,000/creator', timeline: '10-14 days' },
    { id: 'launch', icon: '🚀', title: 'Product Launch', tagline: 'Coordinated buzz from multiple creators', bullets: ['Multiple creators, same timeline', 'Build pre-launch excitement', 'Coordinated posting schedule'], price: 'From ₹25,000/campaign', timeline: '5-7 days' }
  ];

  return `
<div class="amp-h1">${props.heading || 'What would you like to achieve?'}</div>
<p class="amp-sub">${props.subheading || 'Pick a goal — we\'ll configure the best campaign setup for you'}</p>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--amp-sp-5);margin-top:var(--amp-sp-6)">
  ${goals.map((g, i) => `
  <div class="amp-card clickable goal-card${i === 0 ? ' selected' : ''}" onclick="selectGoal(this,'${g.id}')" data-goal="${g.id}" style="padding:var(--amp-sp-6);position:relative">
    <div class="card-check" style="position:absolute;top:var(--amp-sp-3);right:var(--amp-sp-3);width:24px;height:24px;border-radius:var(--amp-radius-full);background:var(--amp-accent);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;opacity:${i === 0 ? '1' : '0'};transition:opacity .2s">✓</div>
    <div style="font-size:36px;margin-bottom:var(--amp-sp-3)">${g.icon}</div>
    <div class="amp-h3">${g.title}</div>
    <p style="font-size:var(--amp-text-sm);color:var(--amp-text-muted);margin:var(--amp-sp-1) 0 var(--amp-sp-3)">${g.tagline}</p>
    <ul style="list-style:none;margin-bottom:var(--amp-sp-4)">
      ${g.bullets.map(b => `<li style="font-size:var(--amp-text-xs);color:var(--amp-text-secondary);padding:2px 0 2px 18px;position:relative"><span style="color:var(--amp-violet-500);position:absolute;left:0;font-weight:700">•</span>${b}</li>`).join('')}
    </ul>
    <div style="display:flex;justify-content:space-between;align-items:center;padding-top:var(--amp-sp-3);border-top:1px solid var(--amp-stone-100)">
      <span style="font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-violet-700)">${g.price}</span>
      <span style="font-size:11px;color:var(--amp-stone-400)">${g.timeline}</span>
    </div>
  </div>`).join('')}
</div>
${props.showQuiz !== false ? '<div style="text-align:center;margin-top:var(--amp-sp-5)"><a href="#" onclick="openQuiz();return false" style="font-size:var(--amp-text-sm);color:var(--amp-text-muted);text-decoration:none">Not sure which to pick? Take a quick quiz →</a></div>' : ''}`;
});
