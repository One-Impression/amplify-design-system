const { render, renderAll } = require('../registry.cjs');

function getCSS() {
  return `
/* Dashboard Layout */
.dash-wrapper{display:flex;min-height:100vh;background:var(--amp-bg)}
.dash-sidebar{width:240px;background:var(--amp-surface);border-right:1px solid var(--amp-border);display:flex;flex-direction:column;transition:width .25s ease;overflow:hidden;flex-shrink:0;z-index:60}
.dash-sidebar.collapsed{width:64px}
.dash-sidebar.collapsed .dash-nav-label,.dash-sidebar.collapsed .dash-section-title,.dash-sidebar.collapsed .dash-logo-text{display:none}
.dash-sidebar.collapsed .dash-nav-item{justify-content:center;padding-left:0;padding-right:0}
.dash-sidebar-header{display:flex;align-items:center;justify-content:space-between;padding:var(--amp-sp-4) var(--amp-sp-4);border-bottom:1px solid var(--amp-border);min-height:56px}
.dash-logo-text{font-size:18px;font-weight:800;letter-spacing:-.03em;background:linear-gradient(135deg,var(--amp-violet-600),var(--amp-violet-400));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.dash-toggle{width:28px;height:28px;border:none;background:var(--amp-stone-100);border-radius:var(--amp-radius-md);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--amp-stone-500);transition:background .15s;flex-shrink:0}
.dash-toggle:hover{background:var(--amp-stone-200)}
.dash-nav{flex:1;padding:var(--amp-sp-3) var(--amp-sp-2);overflow-y:auto}
.dash-section-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--amp-stone-400);padding:var(--amp-sp-3) var(--amp-sp-3) var(--amp-sp-1)}
.dash-nav-item{display:flex;align-items:center;gap:var(--amp-sp-3);padding:8px var(--amp-sp-3);border-radius:var(--amp-radius-md);cursor:pointer;font-size:var(--amp-text-sm);color:var(--amp-text-secondary);font-weight:500;transition:all .15s;border:none;background:none;width:100%;text-align:left}
.dash-nav-item:hover{background:var(--amp-stone-50);color:var(--amp-text)}
.dash-nav-item.active{background:var(--amp-violet-50);color:var(--amp-violet-700);font-weight:600}
.dash-nav-icon{width:20px;text-align:center;flex-shrink:0;font-size:15px}
.dash-main{flex:1;display:flex;flex-direction:column;min-width:0}
.dash-topbar{display:flex;align-items:center;justify-content:space-between;padding:var(--amp-sp-3) var(--amp-sp-6);background:var(--amp-surface);border-bottom:1px solid var(--amp-border);min-height:56px}
.dash-content{flex:1;padding:var(--amp-sp-6);overflow-y:auto}
.dash-page-title{font-size:22px;font-weight:700;color:var(--amp-text);margin-bottom:var(--amp-sp-1)}
.dash-page-sub{font-size:var(--amp-text-sm);color:var(--amp-text-muted);margin-bottom:var(--amp-sp-6)}
@media(max-width:768px){.dash-sidebar{position:fixed;left:-240px;top:0;bottom:0;z-index:100;box-shadow:4px 0 24px rgba(0,0,0,.1)}.dash-sidebar.mobile-open{left:0}}
`;
}

function renderLayout(config, context) {
  const { screens, data, meta } = config;
  const pageTitle = meta?.pageTitle || 'Dashboard';
  const pageSubtitle = meta?.pageSubtitle || 'Overview of your campaigns and performance';
  const brandName = data?.brand?.name || 'Brand Co.';
  const brandInitials = brandName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const navItems = meta?.navItems || [
    { section: 'Main', items: [
      { icon: '&#9632;', label: 'Dashboard', active: true },
      { icon: '&#9881;', label: 'Campaigns' },
      { icon: '&#9733;', label: 'Creators' },
      { icon: '&#9993;', label: 'Content' }
    ]},
    { section: 'Analytics', items: [
      { icon: '&#9650;', label: 'Performance' },
      { icon: '&#8364;', label: 'Revenue' }
    ]},
    { section: 'Settings', items: [
      { icon: '&#9881;', label: 'Settings' },
      { icon: '&#9899;', label: 'Help' }
    ]}
  ];

  // Collect all components from all screens
  const allComponents = [];
  (screens || []).forEach(s => {
    (s.components || []).forEach(c => allComponents.push(c));
  });

  let html = `
<div class="dash-wrapper">
  <aside class="dash-sidebar" id="dashSidebar">
    <div class="dash-sidebar-header">
      <span class="dash-logo-text">amplify</span>
      <button class="dash-toggle" onclick="toggleSidebar()" title="Toggle sidebar">&#9776;</button>
    </div>
    <nav class="dash-nav">
      ${navItems.map(section => `
      <div class="dash-section-title">${section.section}</div>
      ${section.items.map(item => `
      <button class="dash-nav-item${item.active ? ' active' : ''}" onclick="navTo(this,'${item.label}')">
        <span class="dash-nav-icon">${item.icon}</span>
        <span class="dash-nav-label">${item.label}</span>
      </button>`).join('')}`).join('')}
    </nav>
  </aside>
  <div class="dash-main">
    <div class="dash-topbar">
      <div style="display:flex;align-items:center;gap:var(--amp-sp-3)">
        <button class="dash-toggle" onclick="toggleSidebar()" style="display:none" id="mobileMenuBtn">&#9776;</button>
        <div style="font-size:var(--amp-text-md);font-weight:600;color:var(--amp-text)">${pageTitle}</div>
      </div>
      <div style="display:flex;align-items:center;gap:var(--amp-sp-3)">
        <button style="position:relative;background:none;border:none;cursor:pointer;font-size:18px;color:var(--amp-stone-400)">&#128276;<span style="position:absolute;top:-2px;right:-2px;width:8px;height:8px;border-radius:var(--amp-radius-full);background:var(--amp-red-600)"></span></button>
        <span style="font-size:var(--amp-text-sm);color:var(--amp-text-secondary);font-weight:500">${brandName}</span>
        <div class="amp-avatar" style="width:32px;height:32px;border-radius:var(--amp-radius-full);background:var(--amp-violet-100);color:var(--amp-violet-600);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;cursor:pointer">${brandInitials}</div>
      </div>
    </div>
    <div class="dash-content">
      <div class="dash-page-title">${pageTitle}</div>
      <div class="dash-page-sub">${pageSubtitle}</div>
      ${renderAll(allComponents, context)}
    </div>
  </div>
</div>`;

  // JavaScript
  html += `<script>
let sidebarCollapsed = false;

function toggleSidebar() {
  const sidebar = document.getElementById('dashSidebar');
  sidebarCollapsed = !sidebarCollapsed;
  sidebar.classList.toggle('collapsed', sidebarCollapsed);
  if (window.innerWidth <= 768) {
    sidebar.classList.toggle('mobile-open');
  }
}

function navTo(el, label) {
  document.querySelectorAll('.dash-nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
}

function selectFilter(el, filter) {
  el.parentElement.querySelectorAll('.amp-chip').forEach(c => {
    c.classList.remove('active');
    c.style.background = 'var(--amp-stone-100)';
    c.style.color = 'var(--amp-text-secondary)';
  });
  el.classList.add('active');
  el.style.background = 'var(--amp-accent)';
  el.style.color = '#fff';
}

function selectChartRange(el, range) {
  el.parentElement.querySelectorAll('.amp-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

function toggleDatePicker() { /* placeholder */ }
function sortTable(th) { /* placeholder */ }
</script>`;

  return html;
}

renderLayout.getCSS = getCSS;
module.exports = renderLayout;
