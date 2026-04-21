const { render } = require('../registry.cjs');

function getCSS() {
  return `
/* Stepper Layout */
.amp-stepper{max-width:560px;margin:var(--amp-sp-6) auto 0;padding:0 var(--amp-sp-6);display:flex;align-items:center;justify-content:center}
.amp-step{display:flex;align-items:center;gap:var(--amp-sp-2);cursor:pointer}
.amp-step-circle{width:32px;height:32px;border-radius:var(--amp-radius-full);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;border:2px solid var(--amp-stone-300);color:var(--amp-stone-400);background:var(--amp-surface);transition:all var(--amp-transition);flex-shrink:0}
.amp-step.active .amp-step-circle{border-color:var(--amp-accent);background:var(--amp-accent);color:#fff}
.amp-step.done .amp-step-circle{border-color:var(--amp-green-600);background:var(--amp-green-600);color:#fff}
.amp-step-label{font-size:var(--amp-text-sm);color:var(--amp-stone-400);font-weight:500;white-space:nowrap;transition:color var(--amp-transition)}
.amp-step.active .amp-step-label{color:var(--amp-violet-700);font-weight:600}
.amp-step.done .amp-step-label{color:var(--amp-green-600)}
.amp-step-line{width:48px;height:2px;background:var(--amp-stone-200);margin:0 var(--amp-sp-1);flex-shrink:0;overflow:hidden;position:relative}
.amp-step-line-fill{height:100%;background:var(--amp-green-600);width:0;transition:width .4s;position:absolute;left:0;top:0}
.amp-screen{display:none;animation:fadeSlideIn .35s ease-out}
.amp-screen.active{display:block}
@media(max-width:768px){.amp-step-label{display:none}.amp-step.active .amp-step-label{display:inline}}
`;
}

function renderLayout(config, context) {
  const { screens, data, meta } = config;
  const stepLabels = screens.map(s => s.label);
  const brandName = data?.brand?.name || 'Brand Co.';
  const brandInitials = brandName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  // Topbar
  let html = `
<div class="amp-topbar"><div class="amp-topbar-inner">
  <div style="display:flex;align-items:center;gap:var(--amp-sp-4)">
    <div class="amp-logo">amplify</div>
    <div style="width:1px;height:22px;background:var(--amp-border)"></div>
    <div style="font-size:var(--amp-text-md);font-weight:600;color:var(--amp-stone-700)">New Campaign</div>
  </div>
  <div style="display:flex;align-items:center;gap:var(--amp-sp-3)">
    <span style="font-size:var(--amp-text-sm);color:var(--amp-text-secondary);font-weight:500">${brandName}</span>
    <div class="amp-avatar">${brandInitials}</div>
  </div>
</div></div>`;

  // Stepper
  html += `<div class="amp-stepper">`;
  stepLabels.forEach((label, i) => {
    if (i > 0) html += `<div class="amp-step-line"><div class="amp-step-line-fill"></div></div>`;
    html += `<div class="amp-step${i === 0 ? ' active' : ''}" onclick="goToStep(${i + 1})"><div class="amp-step-circle">${i + 1}</div><span class="amp-step-label">${label}</span></div>`;
  });
  html += `</div>`;

  // Screens
  html += `<div class="amp-container">`;
  screens.forEach((screen, i) => {
    html += `<div class="amp-screen${i === 0 ? ' active' : ''}" id="screen${i + 1}">`;
    // Repeat banner on first screen
    if (i === 0 && data?.returning) {
      html += render('repeat-banner', { lastProduct: data.product?.name, completion: '92%' }, context);
    }
    // Render each component in the screen
    (screen.components || []).forEach(comp => {
      html += render(comp.component, comp.props || {}, context);
    });
    // Navigation buttons
    html += `<div class="amp-nav-buttons">`;
    if (i > 0) html += `<button class="amp-btn amp-btn-text" onclick="goToStep(${i})">← Back</button>`;
    else html += `<div></div>`;
    if (i < screens.length - 1) {
      html += `<button class="amp-btn amp-btn-primary amp-btn-lg" id="nextBtn${i + 1}" onclick="goToStep(${i + 2})">Continue →</button>`;
    }
    html += `</div></div>`;
  });
  // Success modal
  html += render('success-modal', {}, context);
  html += `</div>`;

  // JavaScript
  html += `<script>
let currentStep = 1;
const totalSteps = ${screens.length};

function goToStep(step) {
  if (step < 1 || step > totalSteps) return;
  document.querySelectorAll('.amp-screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen' + step).classList.add('active');
  document.querySelectorAll('.amp-step').forEach((s, i) => {
    s.classList.remove('active', 'done');
    if (i + 1 < step) { s.classList.add('done'); s.querySelector('.amp-step-circle').textContent = '✓'; }
    else if (i + 1 === step) { s.classList.add('active'); s.querySelector('.amp-step-circle').textContent = i + 1; }
    else { s.querySelector('.amp-step-circle').textContent = i + 1; }
  });
  document.querySelectorAll('.amp-step-line-fill').forEach((f, i) => {
    f.style.width = (i < step - 1) ? '100%' : '0';
  });
  currentStep = step;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selectGoal(el, goalId) {
  document.querySelectorAll('.goal-card').forEach(c => { c.classList.remove('selected'); c.querySelector('.card-check').style.opacity = '0'; });
  el.classList.add('selected');
  el.querySelector('.card-check').style.opacity = '1';
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
      else {
        clearInterval(interval);
        intel.style.display = 'none';
        area.style.display = 'block';
        area.innerHTML = document.getElementById('productCardTemplate').innerHTML;
      }
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

function quickReorder() { goToStep(totalSteps); }

function placeOrder() {
  document.getElementById('successModal').classList.add('show');
}

function openQuiz() { /* placeholder */ alert('Quiz: Based on your answers, we recommend Content for Ads!'); }
</script>`;

  return html;
}

renderLayout.getCSS = getCSS;
module.exports = renderLayout;
