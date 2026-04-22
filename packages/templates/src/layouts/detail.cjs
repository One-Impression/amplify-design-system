const { render, renderAll } = require('../registry.cjs');

function getCSS() {
  return `
/* Detail Layout */
.detail-wrapper{min-height:100vh;background:var(--amp-bg)}
.detail-topbar{display:flex;align-items:center;justify-content:space-between;padding:var(--amp-sp-3) var(--amp-sp-6);background:var(--amp-surface);border-bottom:1px solid var(--amp-border);position:sticky;top:0;z-index:50;min-height:56px}
.detail-back{display:flex;align-items:center;gap:var(--amp-sp-2);background:none;border:none;cursor:pointer;color:var(--amp-text-secondary);font-size:var(--amp-text-sm);font-weight:500;padding:6px 12px;border-radius:var(--amp-radius-md);transition:all .15s}
.detail-back:hover{background:var(--amp-stone-50);color:var(--amp-text)}
.detail-content{max-width:1100px;margin:0 auto;padding:var(--amp-sp-6)}
.detail-grid{display:grid;grid-template-columns:1fr 340px;gap:var(--amp-sp-6);align-items:flex-start}
.detail-main{min-width:0}
.detail-sidebar{position:sticky;top:80px}
.detail-tab{transition:all .15s}
.detail-tab:hover{color:var(--amp-text) !important}
.detail-tab-panel{display:none;animation:fadeSlideIn .3s ease-out}
.detail-tab-panel.active{display:block}
.section-body{transition:max-height .3s ease,opacity .2s;overflow:hidden}
.section-body.collapsed{max-height:0 !important;opacity:0;border-top:none !important}
@media(max-width:900px){.detail-grid{grid-template-columns:1fr}.detail-sidebar{position:static}}
`;
}

function renderLayout(config, context) {
  const { screens, data, meta } = config;
  const entityName = meta?.entityName || data?.product?.name || 'Campaign Detail';
  const backLabel = meta?.backLabel || 'Campaigns';

  // Split components: first screen = main, second screen (if any) = sidebar
  const mainComponents = [];
  const sidebarComponents = [];
  (screens || []).forEach((s, i) => {
    (s.components || []).forEach(c => {
      if (i === 0 || !screens[1]) mainComponents.push(c);
      else sidebarComponents.push(c);
    });
  });

  let html = `
<div class="detail-wrapper">
  <div class="detail-topbar">
    <div style="display:flex;align-items:center;gap:var(--amp-sp-3)">
      <button class="detail-back" onclick="goBack()">&#8592; ${backLabel}</button>
      <div style="width:1px;height:20px;background:var(--amp-border)"></div>
      <span style="font-size:var(--amp-text-md);font-weight:600;color:var(--amp-text)">${entityName}</span>
    </div>
    <div style="display:flex;align-items:center;gap:var(--amp-sp-2)">
      <button style="padding:6px 12px;border:1px solid var(--amp-border);border-radius:var(--amp-radius-md);background:var(--amp-surface);cursor:pointer;font-size:var(--amp-text-sm);color:var(--amp-text-secondary);transition:all .15s" onmouseover="this.style.background='var(--amp-stone-50)'" onmouseout="this.style.background='var(--amp-surface)'">&#8943; More</button>
    </div>
  </div>
  <div class="detail-content">
    <div class="detail-grid">
      <div class="detail-main">
        ${renderAll(mainComponents, context)}
      </div>
      ${sidebarComponents.length > 0 ? `
      <div class="detail-sidebar">
        ${renderAll(sidebarComponents, context)}
      </div>` : ''}
    </div>
  </div>
</div>`;

  // JavaScript
  html += `<script>
function goBack() {
  window.history.length > 1 ? window.history.back() : (window.location.href = '/');
}

function switchDetailTab(el, idx) {
  document.querySelectorAll('.detail-tab').forEach(t => {
    t.classList.remove('active');
    t.style.fontWeight = '500';
    t.style.color = 'var(--amp-text-muted)';
    t.style.borderBottomColor = 'transparent';
  });
  el.classList.add('active');
  el.style.fontWeight = '600';
  el.style.color = 'var(--amp-accent)';
  el.style.borderBottomColor = 'var(--amp-accent)';
  document.querySelectorAll('.detail-tab-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('tabPanel' + idx);
  if (panel) panel.classList.add('active');
}

function toggleSection(header, idx) {
  const body = document.getElementById('sectionBody' + idx);
  const chevron = header.querySelector('.section-chevron');
  if (!body) return;
  if (body.classList.contains('collapsed')) {
    body.classList.remove('collapsed');
    body.style.maxHeight = body.scrollHeight + 'px';
    if (chevron) chevron.style.transform = 'rotate(0deg)';
  } else {
    body.style.maxHeight = body.scrollHeight + 'px';
    requestAnimationFrame(() => {
      body.classList.add('collapsed');
      body.style.maxHeight = '0';
    });
    if (chevron) chevron.style.transform = 'rotate(-90deg)';
  }
}

function editEntity() { /* placeholder */ }
function shareEntity() { /* placeholder */ }
function archiveEntity() { /* placeholder */ }
</script>`;

  return html;
}

renderLayout.getCSS = getCSS;
module.exports = renderLayout;
