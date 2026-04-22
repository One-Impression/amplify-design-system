const { register } = require('../../registry.cjs');

register('tab-navigation', (props, ctx) => {
  const tabs = props.tabs || ['Overview', 'Creators', 'Content', 'Analytics', 'Settings'];
  const activeTab = props.activeTab || 0;

  return `
<div style="border-bottom:1px solid var(--amp-border);margin-bottom:var(--amp-sp-6)">
  <div style="display:flex;gap:0" id="detailTabs">
    ${tabs.map((tab, i) => `
    <button class="detail-tab${i === activeTab ? ' active' : ''}" onclick="switchDetailTab(this,${i})" style="padding:var(--amp-sp-3) var(--amp-sp-5);font-size:var(--amp-text-sm);font-weight:${i === activeTab ? '600' : '500'};color:${i === activeTab ? 'var(--amp-accent)' : 'var(--amp-text-muted)'};background:none;border:none;border-bottom:2px solid ${i === activeTab ? 'var(--amp-accent)' : 'transparent'};cursor:pointer;transition:all .15s;margin-bottom:-1px" onmouseover="if(!this.classList.contains('active'))this.style.color='var(--amp-text)'" onmouseout="if(!this.classList.contains('active'))this.style.color='var(--amp-text-muted)'">${tab}</button>`).join('')}
  </div>
</div>`;
});
