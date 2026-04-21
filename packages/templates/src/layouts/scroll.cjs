const { render } = require('../registry.cjs');

function getCSS() {
  return `
/* Scroll Layout */
.amp-progress-line{position:fixed;left:40px;top:80px;bottom:80px;width:3px;background:var(--amp-stone-200);border-radius:var(--amp-radius-full);z-index:50}
.amp-progress-fill{width:100%;background:var(--amp-accent);border-radius:var(--amp-radius-full);transition:height .6s;position:absolute;top:0}
.amp-progress-dot{width:12px;height:12px;border-radius:var(--amp-radius-full);background:var(--amp-stone-200);position:absolute;left:-4.5px;transition:all .3s}
.amp-progress-dot.active{background:var(--amp-accent);box-shadow:0 0 0 4px rgba(124,58,237,.15)}
.amp-progress-dot.done{background:var(--amp-green-600)}
.amp-section{margin-bottom:var(--amp-sp-12);opacity:0;transform:translateY(40px);transition:all .5s ease-out;pointer-events:none}
.amp-section.visible{opacity:1;transform:translateY(0);pointer-events:auto}
.amp-section-num{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:var(--amp-radius-full);background:var(--amp-accent);color:#fff;font-size:12px;font-weight:700;margin-bottom:var(--amp-sp-3)}
.amp-section-num.final{background:var(--amp-green-600)}
.amp-fab{position:fixed;bottom:32px;right:32px;width:56px;height:56px;border-radius:var(--amp-radius-full);background:var(--amp-accent);color:#fff;border:none;cursor:pointer;box-shadow:0 4px 12px rgba(124,58,237,.3);font-size:20px;display:flex;align-items:center;justify-content:center;z-index:90;transition:all .2s}
.amp-fab:hover{transform:scale(1.1)}
.amp-drawer-bg{position:fixed;inset:0;background:rgba(28,25,23,.3);z-index:150;display:none;backdrop-filter:blur(2px)}
.amp-drawer-bg.show{display:block}
.amp-drawer{position:fixed;top:0;right:0;width:380px;height:100%;background:var(--amp-surface);z-index:160;transform:translateX(100%);transition:transform .3s ease-out;overflow-y:auto;box-shadow:-4px 0 24px rgba(0,0,0,.08)}
.amp-drawer-bg.show .amp-drawer{transform:translateX(0)}
@media(max-width:768px){
  .amp-progress-line{display:none}
  .amp-drawer{width:100%;border-radius:var(--amp-radius-xl) var(--amp-radius-xl) 0 0;top:auto;bottom:0;height:80vh;transform:translateY(100%)}
  .amp-drawer-bg.show .amp-drawer{transform:translateY(0)}
}
`;
}

function renderLayout(config, context) {
  const { screens, data, meta } = config;
  const brandName = data?.brand?.name || 'Brand Co.';

  // Topbar
  let html = `
<div class="amp-topbar"><div style="max-width:720px;margin:0 auto;display:flex;align-items:center;justify-content:space-between">
  <div class="amp-logo">amplify</div>
  <div style="padding:var(--amp-sp-1) var(--amp-sp-3);border-radius:var(--amp-radius-full);background:var(--amp-accent-light);color:var(--amp-accent);font-size:var(--amp-text-sm);font-weight:600">New Campaign</div>
</div></div>`;

  // Progress line
  const dotSpacing = screens.length > 1 ? 85 / (screens.length - 1) : 0;
  html += `<div class="amp-progress-line" id="progressLine"><div class="amp-progress-fill" id="progressFill" style="height:0%"></div>`;
  screens.forEach((_, i) => {
    const top = i * dotSpacing;
    html += `<div class="amp-progress-dot${i === 0 ? ' active' : ''}" style="top:${top}%" id="dot${i + 1}"></div>`;
  });
  html += `</div>`;

  // Content
  html += `<div class="amp-container-narrow">`;

  // Repeat banner
  if (data?.returning) {
    html += render('repeat-banner', { lastProduct: data.product?.name, completion: '92%' }, context);
  }

  // Sections
  screens.forEach((screen, i) => {
    const isLast = i === screens.length - 1;
    html += `<div class="amp-section${i === 0 ? ' visible' : ''}" id="sec${i + 1}">`;
    html += `<div class="amp-section-num${isLast ? ' final' : ''}">${i + 1}</div>`;

    (screen.components || []).forEach(comp => {
      html += render(comp.component, comp.props || {}, context);
    });

    // Continue button (not on last screen)
    if (!isLast) {
      html += `<div style="text-align:center;margin-top:var(--amp-sp-6)"><button class="amp-btn amp-btn-primary amp-btn-lg" onclick="revealSection(${i + 2})">Continue →</button></div>`;
    }
    html += `</div>`;
  });

  // Success modal
  html += render('success-modal', {}, context);
  html += `</div>`;

  // Customize FAB + Drawer
  html += `
<button class="amp-fab" onclick="openDrawer()">⚙️</button>
<div class="amp-drawer-bg" id="drawerBg" onclick="closeDrawer()">
  <div class="amp-drawer" onclick="event.stopPropagation()">
    <div style="padding:var(--amp-sp-5) var(--amp-sp-6);border-bottom:1px solid var(--amp-stone-100);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:var(--amp-surface);z-index:1">
      <div class="amp-h2">Fine-tune your campaign</div>
      <button onclick="closeDrawer()" style="width:32px;height:32px;border:none;background:var(--amp-stone-100);border-radius:var(--amp-radius-md);cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center">×</button>
    </div>
    <div style="padding:var(--amp-sp-6)">
      <div style="margin-bottom:var(--amp-sp-6)"><div class="amp-h3">Creator Preferences</div>
        <div style="margin-top:var(--amp-sp-2)"><div style="font-size:var(--amp-text-xs);color:var(--amp-text-muted);margin-bottom:var(--amp-sp-1)">Size</div><div style="display:flex;gap:var(--amp-sp-1);flex-wrap:wrap"><span class="amp-chip active">Flexi</span><span class="amp-chip" onclick="this.classList.toggle('active')">Micro</span><span class="amp-chip" onclick="this.classList.toggle('active')">Mid</span><span class="amp-chip" onclick="this.classList.toggle('active')">Large</span></div></div>
        <div style="margin-top:var(--amp-sp-3)"><div style="font-size:var(--amp-text-xs);color:var(--amp-text-muted);margin-bottom:var(--amp-sp-1)">Gender</div><div style="display:flex;gap:var(--amp-sp-1)"><span class="amp-chip active">All</span><span class="amp-chip" onclick="this.classList.toggle('active')">Male</span><span class="amp-chip" onclick="this.classList.toggle('active')">Female</span></div></div>
        <div style="margin-top:var(--amp-sp-3)"><div style="font-size:var(--amp-text-xs);color:var(--amp-text-muted);margin-bottom:var(--amp-sp-1)">Language</div><div style="display:flex;gap:var(--amp-sp-1);flex-wrap:wrap"><span class="amp-chip active">Hindi</span><span class="amp-chip active">English</span><span class="amp-chip" onclick="this.classList.toggle('active')">Tamil</span><span class="amp-chip" onclick="this.classList.toggle('active')">Telugu</span></div></div>
      </div>
      <div style="margin-bottom:var(--amp-sp-6)"><div class="amp-h3">Content Settings</div>
        <div style="margin-top:var(--amp-sp-2)"><div style="font-size:var(--amp-text-xs);color:var(--amp-text-muted);margin-bottom:var(--amp-sp-1)">Video Length</div><div style="display:flex;gap:var(--amp-sp-1)"><span class="amp-chip">15s</span><span class="amp-chip active">24s</span><span class="amp-chip">30s</span><span class="amp-chip">45s</span><span class="amp-chip">60s</span></div></div>
        <div style="margin-top:var(--amp-sp-3)"><div style="font-size:var(--amp-text-xs);color:var(--amp-text-muted);margin-bottom:var(--amp-sp-1)">Quality</div>
          <div style="display:flex;flex-direction:column;gap:var(--amp-sp-2)">
            <div class="amp-card selected" style="padding:var(--amp-sp-3) var(--amp-sp-4);cursor:pointer"><div style="display:flex;justify-content:space-between"><strong style="font-size:var(--amp-text-sm)">Flexi (Recommended)</strong><span style="font-size:var(--amp-text-xs);color:var(--amp-green-600);font-weight:600">Default</span></div></div>
            <div class="amp-card" style="padding:var(--amp-sp-3) var(--amp-sp-4);cursor:pointer"><div style="display:flex;justify-content:space-between"><strong style="font-size:var(--amp-text-sm)">Premium ★★★★★</strong><span style="font-size:var(--amp-text-xs);color:var(--amp-violet-700);font-weight:600">+₹5,800</span></div></div>
          </div>
        </div>
      </div>
      <button class="amp-btn amp-btn-primary amp-btn-full" onclick="closeDrawer()">Apply Changes</button>
    </div>
  </div>
</div>`;

  // JavaScript
  html += `<script>
let visibleSections = 1;
const totalSections = ${screens.length};

function revealSection(n) {
  const sec = document.getElementById('sec' + n);
  if (!sec || sec.classList.contains('visible')) return;
  sec.classList.add('visible');
  visibleSections = Math.max(visibleSections, n);
  updateProgress();
  setTimeout(() => sec.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
}

function updateProgress() {
  const pct = Math.min(100, ((visibleSections - 1) / (totalSections - 1)) * 100);
  const fill = document.getElementById('progressFill');
  if (fill) fill.style.height = pct + '%';
  for (let i = 1; i <= totalSections; i++) {
    const dot = document.getElementById('dot' + i);
    if (!dot) continue;
    dot.classList.remove('active', 'done');
    if (i < visibleSections) dot.classList.add('done');
    else if (i === visibleSections) dot.classList.add('active');
  }
}

function selectGoal(el, goalId) {
  document.querySelectorAll('.goal-card').forEach(c => { c.classList.remove('selected', 'faded'); });
  el.classList.add('selected');
  el.querySelector('.card-check').style.opacity = '1';
  document.querySelectorAll('.goal-card').forEach(c => { if (!c.classList.contains('selected')) c.classList.add('faded'); });
  setTimeout(() => revealSection(2), 500);
}

function scanProduct() {
  const input = document.getElementById('productUrl');
  if (!input.value) input.value = 'https://luminara.com/glow-radiance-serum';
  const area = document.getElementById('productArea');
  const intel = document.getElementById('intelligenceScrape');
  if (intel) {
    intel.style.display = 'block';
    area.style.display = 'none';
    const steps = ['Analyzing your product...', 'Learning from 12,000+ campaigns...', 'Identifying top-performing formats...', 'Optimizing for your category...'];
    let si = 0;
    const stepEl = document.getElementById('scrapeStep');
    const barEl = document.getElementById('scrapeBar');
    const interval = setInterval(() => {
      si++;
      if (si < steps.length) { stepEl.textContent = steps[si]; barEl.style.width = (si / steps.length * 100) + '%'; }
      else { clearInterval(interval); intel.style.display = 'none'; area.style.display = 'block'; area.innerHTML = document.getElementById('productCardTemplate').innerHTML; }
    }, 600);
  } else {
    area.style.display = 'block';
    area.innerHTML = '<div class="amp-shimmer" style="height:140px;border-radius:var(--amp-radius-xl);margin-top:var(--amp-sp-4)"></div>';
    setTimeout(() => { area.innerHTML = document.getElementById('productCardTemplate').innerHTML; }, 2000);
  }
}

function selectRecentProduct(el) {
  document.querySelectorAll('.amp-card.clickable').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  const area = document.getElementById('productArea');
  if (area) { area.style.display = 'block'; area.innerHTML = document.getElementById('productCardTemplate').innerHTML; }
}

function selectContentType(type) {
  const aiCard = document.getElementById('cardAi');
  const humanCard = document.getElementById('cardHuman');
  const btnAi = document.getElementById('btnAi');
  const btnHuman = document.getElementById('btnHuman');
  const humanOpts = document.getElementById('humanOptions');
  const aiBudget = document.getElementById('aiBudget');
  const humanBudget = document.getElementById('humanBudget');

  if (type === 'ai') {
    aiCard.classList.add('selected'); aiCard.classList.remove('faded');
    humanCard.classList.remove('selected'); humanCard.classList.add('faded');
    btnAi.className = 'amp-btn amp-btn-primary amp-btn-full'; btnAi.textContent = 'Selected ✓';
    btnHuman.className = 'amp-btn amp-btn-outline amp-btn-full'; btnHuman.textContent = 'Select Human Creator';
    if (humanOpts) humanOpts.style.display = 'none';
    if (aiBudget) aiBudget.style.display = 'block';
    if (humanBudget) humanBudget.style.display = 'none';
  } else {
    humanCard.classList.add('selected'); humanCard.classList.remove('faded');
    aiCard.classList.remove('selected'); aiCard.classList.add('faded');
    btnHuman.className = 'amp-btn amp-btn-primary amp-btn-full'; btnHuman.textContent = 'Selected ✓';
    btnAi.className = 'amp-btn amp-btn-outline amp-btn-full'; btnAi.textContent = 'Select AI Video';
    if (humanOpts) humanOpts.style.display = 'block';
    if (aiBudget) aiBudget.style.display = 'none';
    if (humanBudget) humanBudget.style.display = 'block';
  }
  // Reveal next section if in scroll mode
  const nextSec = aiCard.closest('.amp-section');
  if (nextSec) {
    const secNum = parseInt(nextSec.id.replace('sec', ''));
    setTimeout(() => revealSection(secNum + 1), 600);
  }
}

function selectPackage(el, pkgId) {
  el.parentElement.querySelectorAll('.amp-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

function updateBudget(val) {
  const display = val >= 100000 ? '₹' + (val/100000).toFixed(1).replace('.0','') + 'L' : '₹' + val.toLocaleString('en-IN');
  const el = document.getElementById('budgetDisplay');
  if (el) el.textContent = display;
  const c = Math.max(1, Math.round(val / 6500));
  const eC = document.getElementById('estCreators'); if (eC) eC.textContent = c;
  const eV = document.getElementById('estVideos'); if (eV) eV.textContent = c;
  const eD = document.getElementById('estDays'); if (eD) eD.textContent = Math.min(14, Math.max(7, Math.round(c * 1.2)));
}

function selectLength(el) {
  el.parentElement.querySelectorAll('.amp-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

function switchTab(el, idx) {
  el.parentElement.querySelectorAll('.amp-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  for (let i = 0; i < 3; i++) {
    const tab = document.getElementById('payTab' + i);
    if (tab) tab.style.display = i === idx ? 'block' : 'none';
  }
}

function addListItem(containerId, text) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const div = document.createElement('div');
  div.style.cssText = 'display:flex;align-items:center;gap:var(--amp-sp-2);margin-bottom:var(--amp-sp-1)';
  div.innerHTML = '<span style="flex:1;font-size:var(--amp-text-sm);color:var(--amp-text-secondary);background:var(--amp-stone-50);padding:var(--amp-sp-2) var(--amp-sp-3);border-radius:var(--amp-radius-md)">' + text + '</span><button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--amp-stone-400);cursor:pointer;font-size:16px">×</button>';
  container.appendChild(div);
}

function addAudienceTag(text) {
  const container = document.getElementById('audienceTags');
  if (!container) return;
  const span = document.createElement('span');
  span.className = 'amp-chip active';
  span.textContent = text + ' ×';
  span.onclick = function() { this.remove(); };
  container.appendChild(span);
}

function goToStep(n) { /* For edit links in checkout */ revealSection(n); document.getElementById('sec' + n).scrollIntoView({ behavior: 'smooth' }); }
function quickReorder() { for (let i = 2; i <= totalSections; i++) revealSection(i); setTimeout(() => document.getElementById('sec' + totalSections).scrollIntoView({ behavior: 'smooth' }), 200); }
function placeOrder() { document.getElementById('successModal').classList.add('show'); }
function openDrawer() { document.getElementById('drawerBg').classList.add('show'); }
function closeDrawer() { document.getElementById('drawerBg').classList.remove('show'); }
function openQuiz() { alert('Quiz: Based on your answers, we recommend Content for Ads!'); }

updateProgress();
</script>`;

  return html;
}

renderLayout.getCSS = getCSS;
module.exports = renderLayout;
