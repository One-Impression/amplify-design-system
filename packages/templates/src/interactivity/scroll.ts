export const scrollJS = `
var visibleSections = 1;
var totalSections = document.querySelectorAll('.amp-section').length;

function revealSection(n) {
  var sec = document.getElementById('sec' + n);
  if (!sec || sec.classList.contains('visible')) return;
  sec.classList.add('visible');
  visibleSections = Math.max(visibleSections, n);
  updateProgress();
  setTimeout(function() { sec.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
}

function updateProgress() {
  var pct = Math.min(100, ((visibleSections - 1) / (totalSections - 1)) * 100);
  var fill = document.getElementById('progressFill');
  if (fill) fill.style.height = pct + '%';
  for (var i = 1; i <= totalSections; i++) {
    var dot = document.getElementById('dot' + i);
    if (!dot) continue;
    dot.classList.remove('active', 'done');
    if (i < visibleSections) dot.classList.add('done');
    else if (i === visibleSections) dot.classList.add('active');
  }
}

function selectGoal(el, goalId) {
  document.querySelectorAll('.goal-card').forEach(function(c) { c.classList.remove('selected', 'faded'); });
  el.classList.add('selected');
  var ck = el.querySelector('.card-check'); if (ck) ck.style.opacity = '1';
  document.querySelectorAll('.goal-card').forEach(function(c) { if (!c.classList.contains('selected')) c.classList.add('faded'); });
  setTimeout(function() { revealSection(2); }, 500);
}

function scanProduct() {
  var input = document.getElementById('productUrl');
  if (!input.value) input.value = 'https://luminara.com/glow-radiance-serum';
  var area = document.getElementById('productArea');
  var intel = document.getElementById('intelligenceScrape');
  if (intel) {
    intel.style.display = 'block';
    area.style.display = 'none';
    var steps = ['Analyzing your product...', 'Learning from 12,000+ campaigns...', 'Identifying top-performing formats...', 'Optimizing for your category...'];
    var si = 0;
    var stepEl = document.getElementById('scrapeStep');
    var barEl = document.getElementById('scrapeBar');
    var interval = setInterval(function() {
      si++;
      if (si < steps.length) { stepEl.textContent = steps[si]; barEl.style.width = (si / steps.length * 100) + '%'; }
      else { clearInterval(interval); intel.style.display = 'none'; area.style.display = 'block'; area.innerHTML = document.getElementById('productCardTemplate').innerHTML; }
    }, 600);
  } else {
    area.style.display = 'block';
    area.innerHTML = '<div class="amp-shimmer" style="height:140px;border-radius:var(--amp-radius-xl);margin-top:var(--amp-sp-4)"></div>';
    setTimeout(function() { area.innerHTML = document.getElementById('productCardTemplate').innerHTML; }, 2000);
  }
}

function selectRecentProduct(el) {
  document.querySelectorAll('.amp-card.clickable').forEach(function(c) { c.classList.remove('selected'); });
  el.classList.add('selected');
  var area = document.getElementById('productArea');
  if (area) { area.style.display = 'block'; area.innerHTML = document.getElementById('productCardTemplate').innerHTML; }
}

function selectContentType(type) {
  var aiCard = document.getElementById('cardAi');
  var humanCard = document.getElementById('cardHuman');
  var btnAi = document.getElementById('btnAi');
  var btnHuman = document.getElementById('btnHuman');
  var humanOpts = document.getElementById('humanOptions');
  var aiBudget = document.getElementById('aiBudget');
  var humanBudget = document.getElementById('humanBudget');

  if (type === 'ai') {
    aiCard.classList.add('selected'); aiCard.classList.remove('faded');
    humanCard.classList.remove('selected'); humanCard.classList.add('faded');
    btnAi.className = 'amp-btn amp-btn-primary amp-btn-full'; btnAi.textContent = 'Selected \\u2713';
    btnHuman.className = 'amp-btn amp-btn-outline amp-btn-full'; btnHuman.textContent = 'Select Human Creator';
    if (humanOpts) humanOpts.style.display = 'none';
    if (aiBudget) aiBudget.style.display = 'block';
    if (humanBudget) humanBudget.style.display = 'none';
  } else {
    humanCard.classList.add('selected'); humanCard.classList.remove('faded');
    aiCard.classList.remove('selected'); aiCard.classList.add('faded');
    btnHuman.className = 'amp-btn amp-btn-primary amp-btn-full'; btnHuman.textContent = 'Selected \\u2713';
    btnAi.className = 'amp-btn amp-btn-outline amp-btn-full'; btnAi.textContent = 'Select AI Video';
    if (humanOpts) humanOpts.style.display = 'block';
    if (aiBudget) aiBudget.style.display = 'none';
    if (humanBudget) humanBudget.style.display = 'block';
  }
  var nextSec = aiCard.closest('.amp-section');
  if (nextSec) {
    var secNum = parseInt(nextSec.id.replace('sec', ''));
    setTimeout(function() { revealSection(secNum + 1); }, 600);
  }
}

function selectPackage(el, pkgId) {
  el.parentElement.querySelectorAll('.amp-card').forEach(function(c) { c.classList.remove('selected'); });
  el.classList.add('selected');
}

function updateBudget(val) {
  var display = val >= 100000 ? '\\u20B9' + (val/100000).toFixed(1).replace('.0','') + 'L' : '\\u20B9' + val.toLocaleString('en-IN');
  var el = document.getElementById('budgetDisplay');
  if (el) el.textContent = display;
  var c = Math.max(1, Math.round(val / 6500));
  var eC = document.getElementById('estCreators'); if (eC) eC.textContent = c;
  var eV = document.getElementById('estVideos'); if (eV) eV.textContent = c;
  var eD = document.getElementById('estDays'); if (eD) eD.textContent = Math.min(14, Math.max(7, Math.round(c * 1.2)));
}

function selectLength(el) {
  el.parentElement.querySelectorAll('.amp-chip').forEach(function(c) { c.classList.remove('active'); });
  el.classList.add('active');
}

function switchTab(el, idx) {
  el.parentElement.querySelectorAll('.amp-tab').forEach(function(t) { t.classList.remove('active'); });
  el.classList.add('active');
  for (var i = 0; i < 3; i++) {
    var tab = document.getElementById('payTab' + i);
    if (tab) tab.style.display = i === idx ? 'block' : 'none';
  }
}

function addListItem(containerId, text) {
  var container = document.getElementById(containerId);
  if (!container) return;
  var div = document.createElement('div');
  div.style.cssText = 'display:flex;align-items:center;gap:var(--amp-sp-2);margin-bottom:var(--amp-sp-1)';
  div.innerHTML = '<span style="flex:1;font-size:var(--amp-text-sm);color:var(--amp-text-secondary);background:var(--amp-stone-50);padding:var(--amp-sp-2) var(--amp-sp-3);border-radius:var(--amp-radius-md)">' + text + '</span><button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--amp-stone-400);cursor:pointer;font-size:16px">\\u00D7</button>';
  container.appendChild(div);
}

function addAudienceTag(text) {
  var container = document.getElementById('audienceTags');
  if (!container) return;
  var span = document.createElement('span');
  span.className = 'amp-chip active';
  span.textContent = text + ' \\u00D7';
  span.onclick = function() { this.remove(); };
  container.appendChild(span);
}

function goToStep(n) { revealSection(n); document.getElementById('sec' + n).scrollIntoView({ behavior: 'smooth' }); }
function quickReorder() { for (var i = 2; i <= totalSections; i++) revealSection(i); setTimeout(function() { document.getElementById('sec' + totalSections).scrollIntoView({ behavior: 'smooth' }); }, 200); }
function placeOrder() { document.getElementById('successModal').classList.add('show'); }
function openDrawer() { document.getElementById('drawerBg').classList.add('show'); }
function closeDrawer() { document.getElementById('drawerBg').classList.remove('show'); }
function openQuiz() { alert('Quiz: Based on your answers, we recommend Content for Ads!'); }

updateProgress();
`;
