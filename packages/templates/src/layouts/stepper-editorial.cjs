const { render } = require('../registry.cjs');

function getCSS() {
  return `
/* Editorial Layout — Spacious, centered, magazine-style sections with large type */
.ed-stepper{max-width:480px;margin:var(--amp-sp-10) auto 0;display:flex;align-items:center;gap:0}
.ed-step{flex:1;text-align:center;position:relative;cursor:pointer}
.ed-step-bar{height:3px;background:var(--amp-stone-200);margin-bottom:var(--amp-sp-3);transition:background .3s}
.ed-step.active .ed-step-bar{background:var(--amp-accent)}
.ed-step.done .ed-step-bar{background:var(--amp-green-600)}
.ed-step-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--amp-stone-400);transition:color .3s}
.ed-step.active .ed-step-label{color:var(--amp-accent)}
.ed-step.done .ed-step-label{color:var(--amp-green-600)}

.ed-screen{display:none;animation:fadeSlideIn .4s ease-out}
.ed-screen.active{display:block}

.ed-hero{text-align:center;max-width:640px;margin:var(--amp-sp-16) auto var(--amp-sp-10)}
.ed-hero h1{font-size:36px;font-weight:800;letter-spacing:-.03em;line-height:1.1;color:var(--amp-text);margin-bottom:var(--amp-sp-3)}
.ed-hero p{font-size:var(--amp-text-lg);color:var(--amp-text-muted);line-height:1.6}

.ed-section{max-width:720px;margin:0 auto var(--amp-sp-12);padding:0 var(--amp-sp-6)}
.ed-section-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--amp-accent);margin-bottom:var(--amp-sp-4)}
.ed-divider{width:48px;height:3px;background:var(--amp-accent);margin:var(--amp-sp-8) auto;border-radius:2px}

.ed-grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--amp-sp-5)}
.ed-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:var(--amp-sp-6)}
.ed-grid-2-wide{display:grid;grid-template-columns:60fr 40fr;gap:var(--amp-sp-8)}

.ed-card{background:var(--amp-surface);border:1px solid var(--amp-border);border-radius:var(--amp-radius-xl);padding:var(--amp-sp-8);transition:all var(--amp-transition);cursor:pointer;position:relative}
.ed-card:hover{border-color:var(--amp-stone-300);box-shadow:var(--amp-shadow-md)}
.ed-card.selected{border-color:var(--amp-accent);background:var(--amp-accent-light)}
.ed-card .check{position:absolute;top:var(--amp-sp-4);right:var(--amp-sp-4);width:28px;height:28px;border-radius:var(--amp-radius-full);background:var(--amp-accent);color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;opacity:0;transition:opacity .2s}
.ed-card.selected .check{opacity:1}

.ed-footer{max-width:720px;margin:0 auto;padding:var(--amp-sp-6);display:flex;justify-content:space-between;align-items:center}

@media(max-width:768px){
  .ed-grid-3{grid-template-columns:1fr}
  .ed-grid-2,.ed-grid-2-wide{grid-template-columns:1fr}
  .ed-hero h1{font-size:28px}
  .ed-footer{flex-direction:column-reverse;gap:var(--amp-sp-3)}
}
`;
}

function renderLayout(config, context) {
  const { screens, data, meta } = config;
  const brandName = data?.brand?.name || 'Brand Co.';
  const brandInitials = brandName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  let html = `
<div class="amp-topbar"><div style="max-width:880px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:0 var(--amp-sp-6)">
  <div class="amp-logo">amplify</div>
  <div style="display:flex;align-items:center;gap:var(--amp-sp-3)">
    <span style="font-size:var(--amp-text-sm);color:var(--amp-text-secondary)">${brandName}</span>
    <div class="amp-avatar">${brandInitials}</div>
  </div>
</div></div>`;

  // Stepper — progress bar style
  html += `<div class="ed-stepper">`;
  screens.forEach((s, i) => {
    html += `<div class="ed-step${i === 0 ? ' active' : ''}" onclick="goToStep(${i + 1})"><div class="ed-step-bar"></div><div class="ed-step-label">${s.label}</div></div>`;
  });
  html += `</div>`;

  // Screens
  screens.forEach((screen, i) => {
    html += `<div class="ed-screen${i === 0 ? ' active' : ''}" id="screen${i + 1}">`;

    // Repeat banner on first screen
    if (i === 0 && data?.returning) {
      html += `<div style="max-width:640px;margin:var(--amp-sp-8) auto 0;padding:0 var(--amp-sp-6)">`;
      html += render('repeat-banner', { lastProduct: data.product?.name, completion: '92%' }, context);
      html += `</div>`;
    }

    // Hero heading per screen
    const heroMap = [
      { h: 'What\'s the goal of<br>your campaign?', p: 'This shapes everything — content type, creator selection, and script strategy.' },
      { h: 'Tell us about<br>your product', p: 'Paste a link and we\'ll extract everything automatically.' },
      { h: 'How should we<br>create your content?', p: 'AI is our default — trained on 50,000+ campaigns to outperform generic scripts.' },
      { h: 'Let\'s craft your<br>content brief', p: 'We\'ve auto-configured this based on your goal. Customize as needed.' },
      { h: 'Set your<br>investment', p: 'Choose a package that fits your goals.' },
      { h: 'Review &<br>place your order', p: 'Everything looks good? Let\'s launch your campaign.' }
    ];
    const hero = heroMap[i] || heroMap[0];
    html += `<div class="ed-hero"><h1>${hero.h}</h1><p>${hero.p}</p></div>`;

    // Components
    (screen.components || []).forEach(comp => {
      html += `<div class="ed-section">`;
      html += render(comp.component, comp.props || {}, context);
      html += `</div>`;
    });

    // Navigation
    html += `<div class="ed-divider"></div><div class="ed-footer">`;
    if (i > 0) html += `<button class="amp-btn amp-btn-text" onclick="goToStep(${i})">← Back</button>`;
    else html += `<div></div>`;
    if (i < screens.length - 1) html += `<button class="amp-btn amp-btn-primary amp-btn-lg" onclick="goToStep(${i + 2})">Continue →</button>`;
    html += `</div></div>`;
  });

  html += render('success-modal', {}, context);

  // JavaScript (same logic, different selectors)
  html += `<script>
let currentStep = 1;
const totalSteps = ${screens.length};

function goToStep(step) {
  if (step < 1 || step > totalSteps) return;
  document.querySelectorAll('.ed-screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen' + step).classList.add('active');
  document.querySelectorAll('.ed-step').forEach((s, i) => {
    s.classList.remove('active', 'done');
    if (i + 1 < step) s.classList.add('done');
    else if (i + 1 === step) s.classList.add('active');
  });
  currentStep = step;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selectGoal(el) {
  document.querySelectorAll('.ed-card.goal-card, .goal-card').forEach(c => { c.classList.remove('selected'); var ck = c.querySelector('.check, .card-check'); if(ck) ck.style.opacity='0'; });
  el.classList.add('selected');
  var ck = el.querySelector('.check, .card-check'); if(ck) ck.style.opacity='1';
}

function scanProduct() {
  var input = document.getElementById('productUrl');
  if (!input.value) input.value = 'https://luminara.com/glow-radiance-serum';
  var area = document.getElementById('productArea');
  var intel = document.getElementById('intelligenceScrape');
  if (intel) {
    intel.style.display = 'block'; if(area) area.style.display = 'none';
    var steps = ['Analyzing your product...', 'Learning from 12,000+ campaigns...', 'Identifying top formats...', 'Optimizing for your category...'];
    var si = 0, stepEl = document.getElementById('scrapeStep'), barEl = document.getElementById('scrapeBar');
    var iv = setInterval(function() {
      si++; if (si < steps.length) { stepEl.textContent = steps[si]; barEl.style.width = (si/steps.length*100)+'%'; }
      else { clearInterval(iv); intel.style.display = 'none'; if(area){area.style.display='block'; area.innerHTML = document.getElementById('productCardTemplate').innerHTML;} }
    }, 600);
  } else if(area) {
    area.style.display = 'block';
    area.innerHTML = '<div class="amp-shimmer" style="height:140px;border-radius:var(--amp-radius-xl);margin-top:var(--amp-sp-4)"></div>';
    setTimeout(function() { area.innerHTML = document.getElementById('productCardTemplate').innerHTML; }, 2000);
  }
}

function selectRecentProduct(el) {
  document.querySelectorAll('.amp-card.clickable').forEach(function(c){c.classList.remove('selected')});
  el.classList.add('selected');
  var area = document.getElementById('productArea');
  if(area){area.style.display='block';area.innerHTML=document.getElementById('productCardTemplate').innerHTML;}
}

function selectContentType(type) {
  var ai=document.getElementById('cardAi'),hu=document.getElementById('cardHuman'),bA=document.getElementById('btnAi'),bH=document.getElementById('btnHuman'),hO=document.getElementById('humanOptions'),aB=document.getElementById('aiBudget'),hB=document.getElementById('humanBudget');
  if(type==='ai'){ai.classList.add('selected');ai.classList.remove('faded');hu.classList.remove('selected');hu.classList.add('faded');bA.className='amp-btn amp-btn-primary amp-btn-full';bA.textContent='Selected ✓';bH.className='amp-btn amp-btn-outline amp-btn-full';bH.textContent='Select Human Creator';if(hO)hO.style.display='none';if(aB)aB.style.display='block';if(hB)hB.style.display='none';}
  else{hu.classList.add('selected');hu.classList.remove('faded');ai.classList.remove('selected');ai.classList.add('faded');bH.className='amp-btn amp-btn-primary amp-btn-full';bH.textContent='Selected ✓';bA.className='amp-btn amp-btn-outline amp-btn-full';bA.textContent='Select AI Video';if(hO)hO.style.display='block';if(aB)aB.style.display='none';if(hB)hB.style.display='block';}
}

function selectPackage(el){el.parentElement.querySelectorAll('.amp-card').forEach(function(c){c.classList.remove('selected')});el.classList.add('selected');}
function updateBudget(v){var d=v>=100000?'₹'+(v/100000).toFixed(1).replace('.0','')+'L':'₹'+v.toLocaleString('en-IN');var el=document.getElementById('budgetDisplay');if(el)el.textContent=d;var c=Math.max(1,Math.round(v/6500));var eC=document.getElementById('estCreators');if(eC)eC.textContent=c;var eV=document.getElementById('estVideos');if(eV)eV.textContent=c;var eD=document.getElementById('estDays');if(eD)eD.textContent=Math.min(14,Math.max(7,Math.round(c*1.2)));}
function selectLength(el){el.parentElement.querySelectorAll('.amp-chip').forEach(function(c){c.classList.remove('active')});el.classList.add('active');}
function switchTab(el,idx){el.parentElement.querySelectorAll('.amp-tab').forEach(function(t){t.classList.remove('active')});el.classList.add('active');for(var i=0;i<3;i++){var tab=document.getElementById('payTab'+i);if(tab)tab.style.display=i===idx?'block':'none';}}
function addListItem(id,txt){var c=document.getElementById(id);if(!c)return;var d=document.createElement('div');d.style.cssText='display:flex;align-items:center;gap:var(--amp-sp-2);margin-bottom:var(--amp-sp-1)';d.innerHTML='<span style="flex:1;font-size:var(--amp-text-sm);color:var(--amp-text-secondary);background:var(--amp-stone-50);padding:var(--amp-sp-2) var(--amp-sp-3);border-radius:var(--amp-radius-md)">'+txt+'</span><button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--amp-stone-400);cursor:pointer;font-size:16px">×</button>';c.appendChild(d);}
function addAudienceTag(txt){var c=document.getElementById('audienceTags');if(!c)return;var s=document.createElement('span');s.className='amp-chip active';s.textContent=txt+' ×';s.onclick=function(){this.remove()};c.appendChild(s);}
function quickReorder(){goToStep(totalSteps);}
function placeOrder(){document.getElementById('successModal').classList.add('show');}
function openQuiz(){alert('Based on your answers, we recommend Content for Ads!');}
</script>`;

  return html;
}

renderLayout.getCSS = getCSS;
module.exports = renderLayout;
