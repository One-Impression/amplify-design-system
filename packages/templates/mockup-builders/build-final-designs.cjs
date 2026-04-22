#!/usr/bin/env node
/**
 * Final Typeform-style ordering flow designs.
 * 4 variations × 2 themes (light/dark) = 8 files.
 * All fully interactive with 25+ onclick handlers.
 */
const fs = require('fs');
const path = require('path');
const os = require('os');

// ═══════════════════════════════════════════════════════════
// TOKENS
// ═══════════════════════════════════════════════════════════
const lightTokens = `
:root {
  --amp-violet-50:#F5F0FF;--amp-violet-100:#EDEAFC;--amp-violet-200:#DBD2F6;
  --amp-violet-300:#C4B5FD;--amp-violet-400:#9B6BFF;--amp-violet-500:#7C5CFF;
  --amp-violet-600:#6531FF;--amp-violet-700:#752AD4;--amp-violet-800:#4A1FA8;--amp-violet-900:#3B1785;
  --amp-stone-50:#f8f9fd;--amp-stone-100:#f1f6fe;--amp-stone-200:#d0d1d3;
  --amp-stone-300:#b8bcc0;--amp-stone-400:#8e939b;--amp-stone-500:#6b7280;
  --amp-stone-600:#4b5563;--amp-stone-700:#374151;--amp-stone-800:#1f2937;--amp-stone-900:#1D252D;
  --amp-green-50:#E8FAF3;--amp-green-600:#21C179;
  --amp-amber-50:#fff8e1;--amp-amber-600:#ffc107;
  --amp-red-50:#FFEBEF;--amp-red-600:#fd5154;
  --amp-bg:#f8f9fd;--amp-surface:#ffffff;--amp-surface-overlay:rgba(29,37,45,0.07);
  --amp-text:#1D252D;--amp-text-secondary:rgba(29,37,45,0.58);--amp-text-muted:#6b7280;
  --amp-border:rgba(29,37,45,0.08);--amp-border-strong:rgba(29,37,45,0.16);--amp-border-brand:#DBD2F6;
  --amp-accent:#6531FF;--amp-accent-hover:#752AD4;--amp-accent-light:#EDEAFC;
  --amp-sp-1:4px;--amp-sp-2:8px;--amp-sp-3:12px;--amp-sp-4:16px;--amp-sp-5:20px;--amp-sp-6:24px;--amp-sp-8:32px;--amp-sp-10:40px;
  --amp-radius-sm:4px;--amp-radius-md:8px;--amp-radius-lg:12px;--amp-radius-xl:16px;--amp-radius-2xl:24px;--amp-radius-full:9999px;
  --amp-shadow-sm:0 1px 3px rgba(28,25,23,0.04);--amp-shadow-md:0 2px 8px rgba(28,25,23,0.06);
  --amp-shadow-lg:0 8px 24px rgba(28,25,23,0.08);--amp-shadow-brand:0 4px 20px rgba(101,49,255,0.24);
  --amp-gradient-brand:linear-gradient(96deg,#F55DC1 3.78%,#495AF4 97.89%);
  --amp-gradient-brand-soft:linear-gradient(135deg,#6531ff 0%,#9b6bff 100%);
  --amp-font:'Inter',system-ui,-apple-system,sans-serif;
  --amp-text-xs:11px;--amp-text-sm:13px;--amp-text-base:14px;--amp-text-md:15px;--amp-text-lg:18px;--amp-text-xl:24px;--amp-text-2xl:32px;
  --amp-transition:150ms ease;
}`;

const darkOverride = `
body.dark {
  --amp-bg:#0c0c12;--amp-surface:#161620;--amp-surface-overlay:rgba(255,255,255,0.06);
  --amp-text:#ededf2;--amp-text-secondary:rgba(237,237,242,0.62);--amp-text-muted:rgba(237,237,242,0.38);
  --amp-border:rgba(255,255,255,0.08);--amp-border-strong:rgba(255,255,255,0.14);--amp-border-brand:rgba(101,49,255,0.3);
  --amp-accent:#7C5CFF;--amp-accent-hover:#9B6BFF;--amp-accent-light:rgba(101,49,255,0.15);
  --amp-stone-50:#1a1a24;--amp-stone-100:#22222e;--amp-stone-200:#2e2e3a;--amp-stone-300:#3a3a48;
  --amp-stone-400:#5a5a68;--amp-stone-500:#7a7a88;--amp-stone-600:#9a9aa8;--amp-stone-700:#babac8;
  --amp-green-50:rgba(33,193,121,0.12);--amp-green-600:#34d98c;
  --amp-amber-50:rgba(255,193,7,0.12);--amp-amber-600:#ffd54f;
  --amp-red-50:rgba(253,81,84,0.12);--amp-red-600:#ff7a7c;
  --amp-shadow-sm:0 1px 3px rgba(0,0,0,0.3);--amp-shadow-md:0 2px 8px rgba(0,0,0,0.4);
  --amp-shadow-lg:0 8px 24px rgba(0,0,0,0.5);--amp-shadow-brand:0 4px 20px rgba(124,92,255,0.35);
  --amp-gradient-brand-soft:linear-gradient(135deg,#7C5CFF 0%,#b794ff 100%);
}`;

// ── Base CSS (from base-css.ts) ──
const baseCSSFile = fs.readFileSync(path.join(__dirname, 'packages/templates/src/base-css.ts'), 'utf-8');
const baseCSS = baseCSSFile.match(/return `([\s\S]*?)`;/)?.[1] || '';

// ═══════════════════════════════════════════════════════════
// SHARED COMPONENTS (raw HTML with onclick)
// ═══════════════════════════════════════════════════════════
const goals = [
  { id:'ads', icon:'🎬', title:'Content for Ads', tagline:'Scroll-stopping UGC for paid campaigns', bullets:['Full content ownership & rights','Optimized for Meta, Google, YouTube','Multiple format variations'], price:'From ₹5,000/video', timeline:'7-10 days' },
  { id:'influencer', icon:'📱', title:'Influencer Marketing', tagline:'Creators post about you to their audience', bullets:["Content on creator's own profile",'Organic reach & engagement','Authentic social proof'], price:'From ₹8,000/creator', timeline:'10-14 days' },
  { id:'launch', icon:'🚀', title:'Product Launch', tagline:'Coordinated buzz from multiple creators', bullets:['Multiple creators, same timeline','Build pre-launch excitement','Coordinated posting schedule'], price:'From ₹25,000/campaign', timeline:'5-7 days' },
];

// Component renderers — accept a "variant" param to adjust density
function goalCards(variant) {
  if (variant === 'breathe') {
    // Minimal: icon + title only, tagline on hover
    return `
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--amp-sp-5);margin-top:var(--amp-sp-8)">
  ${goals.map((g,i) => `
  <div class="amp-card clickable goal-card${i===0?' selected':''}" onclick="selectGoal(this,'${g.id}')" style="padding:var(--amp-sp-8);text-align:center;position:relative">
    <div class="card-check" style="position:absolute;top:var(--amp-sp-3);right:var(--amp-sp-3);width:24px;height:24px;border-radius:var(--amp-radius-full);background:var(--amp-accent);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;opacity:${i===0?'1':'0'};transition:opacity .2s">✓</div>
    <div style="font-size:48px;margin-bottom:var(--amp-sp-4)">${g.icon}</div>
    <div style="font-size:var(--amp-text-lg);font-weight:600;color:var(--amp-text)">${g.title}</div>
    <p style="font-size:var(--amp-text-sm);color:var(--amp-text-muted);margin-top:var(--amp-sp-2);opacity:.7">${g.tagline}</p>
  </div>`).join('')}
</div>`;
  }
  if (variant === 'command') {
    // Dense: includes price, timeline, badges
    return `
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--amp-sp-4);margin-top:var(--amp-sp-4)">
  ${goals.map((g,i) => `
  <div class="amp-card clickable goal-card${i===0?' selected':''}" onclick="selectGoal(this,'${g.id}')" style="padding:var(--amp-sp-5);position:relative">
    <div class="card-check" style="position:absolute;top:var(--amp-sp-2);right:var(--amp-sp-2);width:20px;height:20px;border-radius:var(--amp-radius-full);background:var(--amp-accent);color:#fff;display:flex;align-items:center;justify-content:center;font-size:10px;opacity:${i===0?'1':'0'};transition:opacity .2s">✓</div>
    <div style="display:flex;align-items:center;gap:var(--amp-sp-2);margin-bottom:var(--amp-sp-3)"><span style="font-size:24px">${g.icon}</span><span class="amp-h3">${g.title}</span></div>
    <p style="font-size:var(--amp-text-xs);color:var(--amp-text-muted);margin-bottom:var(--amp-sp-3)">${g.tagline}</p>
    <ul style="list-style:none;margin-bottom:var(--amp-sp-3)">${g.bullets.map(b=>`<li style="font-size:var(--amp-text-xs);color:var(--amp-text-secondary);padding:1px 0 1px 14px;position:relative"><span style="color:var(--amp-violet-500);position:absolute;left:0;font-weight:700">•</span>${b}</li>`).join('')}</ul>
    <div style="display:flex;justify-content:space-between;align-items:center;padding-top:var(--amp-sp-2);border-top:1px solid var(--amp-stone-100)">
      <span style="font-size:var(--amp-text-xs);font-weight:600;color:var(--amp-violet-700)">${g.price}</span>
      <span class="amp-badge amp-badge-neutral" style="font-size:10px;padding:1px 6px">${g.timeline}</span>
    </div>
  </div>`).join('')}
</div>
<div style="margin-top:var(--amp-sp-3);padding:var(--amp-sp-3);background:var(--amp-accent-light);border-radius:var(--amp-radius-md);display:flex;align-items:center;gap:var(--amp-sp-2)">
  <span style="font-size:14px">💡</span>
  <span style="font-size:var(--amp-text-xs);color:var(--amp-accent);font-weight:500">Based on 12,000+ campaigns in Beauty, Content for Ads has 4.2x average ROI</span>
</div>`;
  }
  // Default (studio, journey)
  return `
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--amp-sp-5);margin-top:var(--amp-sp-6)">
  ${goals.map((g,i) => `
  <div class="amp-card clickable goal-card${i===0?' selected':''}" onclick="selectGoal(this,'${g.id}')" style="padding:var(--amp-sp-6);position:relative">
    <div class="card-check" style="position:absolute;top:var(--amp-sp-3);right:var(--amp-sp-3);width:24px;height:24px;border-radius:var(--amp-radius-full);background:var(--amp-accent);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;opacity:${i===0?'1':'0'};transition:opacity .2s">✓</div>
    <div style="font-size:36px;margin-bottom:var(--amp-sp-3)">${g.icon}</div>
    <div class="amp-h3">${g.title}</div>
    <p style="font-size:var(--amp-text-sm);color:var(--amp-text-muted);margin:var(--amp-sp-1) 0 var(--amp-sp-3)">${g.tagline}</p>
    <ul style="list-style:none;margin-bottom:var(--amp-sp-4)">${g.bullets.map(b=>`<li style="font-size:var(--amp-text-xs);color:var(--amp-text-secondary);padding:2px 0 2px 18px;position:relative"><span style="color:var(--amp-violet-500);position:absolute;left:0;font-weight:700">•</span>${b}</li>`).join('')}</ul>
    <div style="display:flex;justify-content:space-between;align-items:center;padding-top:var(--amp-sp-3);border-top:1px solid var(--amp-stone-100)">
      <span style="font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-violet-700)">${g.price}</span>
      <span style="font-size:11px;color:var(--amp-stone-400)">${g.timeline}</span>
    </div>
  </div>`).join('')}
</div>`;
}

function productScanner() {
  return `
<div style="display:flex;gap:var(--amp-sp-2);margin-top:var(--amp-sp-4)">
  <input class="amp-input" id="productUrl" placeholder="https://your-store.com/product-name" style="flex:1">
  <button class="amp-btn amp-btn-primary" onclick="scanProduct()">Scan</button>
</div>
<div id="intelligenceScrape" style="display:none;margin-top:var(--amp-sp-4)">
  <div class="amp-card" style="padding:var(--amp-sp-4)">
    <div style="display:flex;align-items:center;gap:var(--amp-sp-3);margin-bottom:var(--amp-sp-3)">
      <div class="amp-shimmer" style="width:32px;height:32px;border-radius:var(--amp-radius-full)"></div>
      <div><div style="font-size:var(--amp-text-sm);font-weight:600">AI Product Intelligence</div><div id="scrapeStep" style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">Analyzing...</div></div>
    </div>
    <div style="height:4px;border-radius:var(--amp-radius-full);background:var(--amp-stone-200);overflow:hidden"><div id="scrapeBar" style="height:100%;width:0;background:var(--amp-accent);transition:width .4s;border-radius:var(--amp-radius-full)"></div></div>
  </div>
</div>
<div id="productArea" style="display:none"></div>
<template id="productCardTemplate"><div class="amp-card" style="padding:var(--amp-sp-4);margin-top:var(--amp-sp-3)">
  <div style="display:flex;gap:var(--amp-sp-3);align-items:center">
    <div style="width:56px;height:56px;border-radius:var(--amp-radius-lg);background:var(--amp-gradient-brand-soft);flex-shrink:0"></div>
    <div style="flex:1"><div style="font-weight:600;font-size:var(--amp-text-md)">Glow Radiance Serum</div><div style="font-size:var(--amp-text-sm);color:var(--amp-text-muted)">Luminara Beauty · ₹1,299</div>
    <div style="display:flex;gap:var(--amp-sp-2);margin-top:var(--amp-sp-1)"><span class="amp-badge amp-badge-violet">Beauty</span><span class="amp-badge amp-badge-violet">Skincare</span></div></div>
    <span class="amp-badge amp-badge-green">✓</span>
  </div>
</div></template>`;
}

function contentType() {
  return `
<div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--amp-sp-5);margin-top:var(--amp-sp-5)">
  <div class="amp-card selected" id="cardAi" style="padding:var(--amp-sp-5)">
    <div style="display:flex;align-items:center;gap:var(--amp-sp-2);margin-bottom:var(--amp-sp-3)"><span style="font-size:24px">🤖</span><span class="amp-h3">AI Video</span></div>
    <p style="font-size:var(--amp-text-sm);color:var(--amp-text-muted);margin-bottom:var(--amp-sp-3)">Studio-quality video in minutes</p>
    <div style="font-size:var(--amp-text-xs);color:var(--amp-text-secondary);margin-bottom:var(--amp-sp-1)">✓ Ready in 24 hours</div>
    <div style="font-size:var(--amp-text-xs);color:var(--amp-text-secondary);margin-bottom:var(--amp-sp-1)">✓ Full ownership</div>
    <div style="font-size:var(--amp-text-xs);color:var(--amp-text-secondary);margin-bottom:var(--amp-sp-3)">✓ Unlimited revisions</div>
    <span style="font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-accent)">From ₹2,000/video</span>
    <button class="amp-btn amp-btn-primary amp-btn-full" id="btnAi" onclick="selectContentType('ai')" style="margin-top:var(--amp-sp-3)">Selected ✓</button>
  </div>
  <div class="amp-card faded" id="cardHuman" style="padding:var(--amp-sp-5)">
    <div style="display:flex;align-items:center;gap:var(--amp-sp-2);margin-bottom:var(--amp-sp-3)"><span style="font-size:24px">👤</span><span class="amp-h3">Human Creator</span></div>
    <p style="font-size:var(--amp-text-sm);color:var(--amp-text-muted);margin-bottom:var(--amp-sp-3)">Real creators, real audience</p>
    <div style="font-size:var(--amp-text-xs);color:var(--amp-text-secondary);margin-bottom:var(--amp-sp-1)">✓ Authentic social proof</div>
    <div style="font-size:var(--amp-text-xs);color:var(--amp-text-secondary);margin-bottom:var(--amp-sp-1)">✓ Audience reach included</div>
    <div style="font-size:var(--amp-text-xs);color:var(--amp-text-secondary);margin-bottom:var(--amp-sp-3)">✓ AI-matched creators</div>
    <span style="font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-accent)">From ₹8,000/creator</span>
    <button class="amp-btn amp-btn-outline amp-btn-full" id="btnHuman" onclick="selectContentType('human')" style="margin-top:var(--amp-sp-3)">Select Human</button>
  </div>
</div>`;
}

function briefEditor() {
  return `
<div style="margin-top:var(--amp-sp-4)">
  <label style="font-size:var(--amp-text-sm);font-weight:600;display:block;margin-bottom:var(--amp-sp-2)">Key selling points</label>
  <div id="sellingPoints">
    <div style="display:flex;align-items:center;gap:var(--amp-sp-2);margin-bottom:var(--amp-sp-1)"><span style="flex:1;font-size:var(--amp-text-sm);color:var(--amp-text-secondary);background:var(--amp-stone-50);padding:var(--amp-sp-2) var(--amp-sp-3);border-radius:var(--amp-radius-md)">Lightweight formula absorbs in seconds</span><button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--amp-stone-400);cursor:pointer;font-size:16px">×</button></div>
    <div style="display:flex;align-items:center;gap:var(--amp-sp-2);margin-bottom:var(--amp-sp-1)"><span style="flex:1;font-size:var(--amp-text-sm);color:var(--amp-text-secondary);background:var(--amp-stone-50);padding:var(--amp-sp-2) var(--amp-sp-3);border-radius:var(--amp-radius-md)">Visible glow in 7 days</span><button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--amp-stone-400);cursor:pointer;font-size:16px">×</button></div>
  </div>
  <div style="display:flex;gap:var(--amp-sp-2);margin-top:var(--amp-sp-1)"><input class="amp-input" placeholder="Add selling point..." id="newSP" style="flex:1"><button class="amp-btn amp-btn-secondary" onclick="addListItem('sellingPoints',document.getElementById('newSP').value);document.getElementById('newSP').value=''">Add</button></div>
</div>
<div style="margin-top:var(--amp-sp-4)">
  <label style="font-size:var(--amp-text-sm);font-weight:600;display:block;margin-bottom:var(--amp-sp-2)">Target audience</label>
  <div id="audienceTags" style="display:flex;flex-wrap:wrap;gap:var(--amp-sp-2);margin-bottom:var(--amp-sp-2)">
    <span class="amp-chip active" onclick="this.remove()">Women 25-35 ×</span>
    <span class="amp-chip active" onclick="this.remove()">Skincare enthusiasts ×</span>
  </div>
  <div style="display:flex;gap:var(--amp-sp-2)"><input class="amp-input" placeholder="Add tag..." id="newTag" style="flex:1"><button class="amp-btn amp-btn-secondary" onclick="addAudienceTag(document.getElementById('newTag').value);document.getElementById('newTag').value=''">Add</button></div>
</div>
<div style="margin-top:var(--amp-sp-4)">
  <label style="font-size:var(--amp-text-sm);font-weight:600;display:block;margin-bottom:var(--amp-sp-2)">Tone</label>
  <div style="display:flex;gap:var(--amp-sp-2);flex-wrap:wrap">
    <span class="amp-chip active" onclick="selectLength(this)">Friendly</span>
    <span class="amp-chip" onclick="selectLength(this)">Professional</span>
    <span class="amp-chip" onclick="selectLength(this)">Funny</span>
    <span class="amp-chip" onclick="selectLength(this)">Aspirational</span>
    <span class="amp-chip" onclick="selectLength(this)">Educational</span>
  </div>
</div>`;
}

function scriptPreview() {
  return `
<div style="margin-top:var(--amp-sp-4)">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--amp-sp-3)">
    <div class="amp-h3">AI Script Samples</div><span class="amp-badge amp-badge-violet">Auto-generated</span>
  </div>
  <div class="amp-card" style="padding:var(--amp-sp-4);margin-bottom:var(--amp-sp-3)">
    <div style="display:flex;justify-content:space-between;margin-bottom:var(--amp-sp-2)"><span style="font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-accent)">Problem → Solution</span><span style="font-size:var(--amp-text-xs);color:var(--amp-stone-400)">24s · 9:16</span></div>
    <p style="font-size:var(--amp-text-sm);color:var(--amp-text-secondary);line-height:1.6">"Tired of dull skin? I tried everything until I found this serum. Within a week, literally glowing. The Vitamin C + Hyaluronic Acid combo is *chef's kiss*."</p>
  </div>
  <div class="amp-card" style="padding:var(--amp-sp-4)">
    <div style="display:flex;justify-content:space-between;margin-bottom:var(--amp-sp-2)"><span style="font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-accent)">Trend Story</span><span style="font-size:var(--amp-text-xs);color:var(--amp-stone-400)">24s · 9:16</span></div>
    <p style="font-size:var(--amp-text-sm);color:var(--amp-text-secondary);line-height:1.6">"POV: You finally find the serum that actually does what it promises. Day 1 vs Day 7 — the glow-up is real."</p>
  </div>
  <p style="font-size:var(--amp-text-xs);color:var(--amp-stone-400);margin-top:var(--amp-sp-2);text-align:center">Edit scripts after payment</p>
</div>`;
}

function budgetSection() {
  return `
<div style="margin-top:var(--amp-sp-4)">
  <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:var(--amp-sp-1)">
    <span style="font-size:var(--amp-text-sm);color:var(--amp-text-muted)">Campaign Budget</span>
    <span id="budgetDisplay" style="font-size:var(--amp-text-xl);font-weight:700;color:var(--amp-accent)">₹30,000</span>
  </div>
  <input type="range" min="5000" max="200000" value="30000" step="1000" oninput="updateBudget(this.value)">
  <div class="amp-slider-marks"><span>₹5K</span><span>₹50K</span><span>₹1L</span><span>₹2L</span></div>
</div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--amp-sp-3);margin-top:var(--amp-sp-4)">
  <div class="amp-card" style="padding:var(--amp-sp-3);text-align:center"><div style="font-size:var(--amp-text-xl);font-weight:700;color:var(--amp-accent)" id="estCreators">5</div><div style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">Creators</div></div>
  <div class="amp-card" style="padding:var(--amp-sp-3);text-align:center"><div style="font-size:var(--amp-text-xl);font-weight:700;color:var(--amp-accent)" id="estVideos">5</div><div style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">Videos</div></div>
  <div class="amp-card" style="padding:var(--amp-sp-3);text-align:center"><div style="font-size:var(--amp-text-xl);font-weight:700;color:var(--amp-accent)" id="estDays">8</div><div style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">Days</div></div>
</div>
<div class="amp-wallet" style="margin-top:var(--amp-sp-4)">
  <div style="display:flex;justify-content:space-between;align-items:center">
    <div><div style="font-size:var(--amp-text-sm);font-weight:600">OI Money</div><div style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">Auto-applied</div></div>
    <div style="font-size:var(--amp-text-lg);font-weight:700;color:var(--amp-accent)">₹12,400</div>
  </div>
  <div class="amp-wallet-bar"><div class="amp-wallet-fill" style="width:41%"></div></div>
</div>`;
}

function checkout() {
  return `
<div class="amp-two-col">
  <div>
    <div class="amp-card" style="padding:var(--amp-sp-5)">
      <div style="padding:var(--amp-sp-3) 0;border-bottom:1px solid var(--amp-stone-100)"><div style="display:flex;justify-content:space-between"><div class="amp-h3">Goal & Product</div><span style="font-size:var(--amp-text-xs);color:var(--amp-accent);cursor:pointer" onclick="goToStep(1)">Edit</span></div>
      <div style="display:flex;gap:var(--amp-sp-3);align-items:center;margin-top:var(--amp-sp-2)"><div style="width:40px;height:40px;border-radius:var(--amp-radius-md);background:var(--amp-gradient-brand-soft);flex-shrink:0"></div><div><div style="font-weight:600;font-size:var(--amp-text-sm)">Glow Radiance Serum</div><div style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">Content for Ads</div></div></div></div>
      <div style="padding:var(--amp-sp-3) 0;border-bottom:1px solid var(--amp-stone-100)"><div style="display:flex;justify-content:space-between"><div class="amp-h3">Content</div><span style="font-size:var(--amp-text-xs);color:var(--amp-accent);cursor:pointer" onclick="goToStep(3)">Edit</span></div>
      <div class="amp-price-row"><span>Type</span><span style="color:var(--amp-text);font-weight:500">AI Video</span></div></div>
      <div style="padding:var(--amp-sp-3) 0"><div style="display:flex;justify-content:space-between"><div class="amp-h3">Brief</div><span style="font-size:var(--amp-text-xs);color:var(--amp-accent);cursor:pointer" onclick="goToStep(4)">Edit</span></div>
      <div class="amp-price-row"><span>Scripts</span><span style="color:var(--amp-text);font-weight:500">2 AI samples</span></div></div>
    </div>
  </div>
  <div>
    <div class="amp-card" style="padding:var(--amp-sp-5);position:sticky;top:80px">
      <div class="amp-h2" style="margin-bottom:var(--amp-sp-4)">Payment</div>
      <div style="display:flex;flex-direction:column;gap:var(--amp-sp-2)">
        <div class="amp-price-row"><span>Campaign</span><span>₹30,000</span></div>
        <div class="amp-price-row"><span>GST (18%)</span><span>₹5,400</span></div>
        <div class="amp-price-row amp-price-total"><span>Total</span><span>₹35,400</span></div>
        <div class="amp-price-row amp-price-credit"><span>OI Money</span><span>−₹12,400</span></div>
        <div class="amp-price-row amp-price-due"><span>Due</span><span>₹23,000</span></div>
      </div>
      <div class="amp-tabs"><button class="amp-tab active" onclick="switchTab(this,0)">UPI</button><button class="amp-tab" onclick="switchTab(this,1)">Card</button><button class="amp-tab" onclick="switchTab(this,2)">Net Banking</button></div>
      <div id="payTab0"><input class="amp-input" placeholder="name@upi"></div>
      <div id="payTab1" style="display:none"><input class="amp-input" placeholder="Card Number" style="margin-bottom:var(--amp-sp-2)"><div style="display:flex;gap:var(--amp-sp-2)"><input class="amp-input" placeholder="MM/YY"><input class="amp-input" placeholder="CVV" style="max-width:100px"></div></div>
      <div id="payTab2" style="display:none"><select class="amp-input"><option>Select bank</option><option>HDFC</option><option>ICICI</option><option>SBI</option></select></div>
      <button class="amp-btn amp-btn-primary amp-btn-lg amp-btn-full" style="margin-top:var(--amp-sp-4)" onclick="placeOrder()">Pay ₹23,000</button>
      <p style="text-align:center;font-size:11px;color:var(--amp-stone-400);margin-top:var(--amp-sp-2)">🔒 Secured by Razorpay</p>
    </div>
  </div>
</div>`;
}

function successModal() {
  return `<div class="amp-modal-bg" id="successModal"><div class="amp-modal" style="text-align:center"><svg class="amp-success-check" viewBox="0 0 72 72"><circle cx="36" cy="36" r="32"/><path d="M22 36 l10 10 l18 -20"/></svg><div class="amp-h1" style="margin-bottom:var(--amp-sp-2)">Campaign Created!</div><p style="color:var(--amp-text-muted);margin-bottom:var(--amp-sp-5)">AI videos ready in 24 hours.</p><button class="amp-btn amp-btn-primary amp-btn-lg amp-btn-full">View Dashboard</button></div></div>`;
}

// ═══════════════════════════════════════════════════════════
// SHARED JS
// ═══════════════════════════════════════════════════════════
const sharedJS = `
function selectGoal(el,id){document.querySelectorAll('.goal-card').forEach(c=>{c.classList.remove('selected');var k=c.querySelector('.card-check');if(k)k.style.opacity='0'});el.classList.add('selected');var k=el.querySelector('.card-check');if(k)k.style.opacity='1'}
function scanProduct(){var i=document.getElementById('productUrl');if(!i.value)i.value='https://luminara.com/glow-radiance-serum';var a=document.getElementById('productArea'),n=document.getElementById('intelligenceScrape');if(n){n.style.display='block';if(a)a.style.display='none';var s=['Analyzing...','Learning from 12,000+ campaigns...','Identifying formats...','Optimizing...'],si=0,se=document.getElementById('scrapeStep'),be=document.getElementById('scrapeBar');var iv=setInterval(function(){si++;if(si<s.length){se.textContent=s[si];be.style.width=(si/s.length*100)+'%'}else{clearInterval(iv);n.style.display='none';if(a){a.style.display='block';a.innerHTML=document.getElementById('productCardTemplate').innerHTML}}},600)}}
function selectContentType(t){var ai=document.getElementById('cardAi'),hu=document.getElementById('cardHuman'),ba=document.getElementById('btnAi'),bh=document.getElementById('btnHuman');if(t==='ai'){if(ai){ai.classList.add('selected');ai.classList.remove('faded')}if(hu){hu.classList.remove('selected');hu.classList.add('faded')}if(ba){ba.className='amp-btn amp-btn-primary amp-btn-full';ba.textContent='Selected ✓'}if(bh){bh.className='amp-btn amp-btn-outline amp-btn-full';bh.textContent='Select Human'}}else{if(hu){hu.classList.add('selected');hu.classList.remove('faded')}if(ai){ai.classList.remove('selected');ai.classList.add('faded')}if(bh){bh.className='amp-btn amp-btn-primary amp-btn-full';bh.textContent='Selected ✓'}if(ba){ba.className='amp-btn amp-btn-outline amp-btn-full';ba.textContent='Select AI Video'}}}
function updateBudget(v){var d=v>=100000?'₹'+(v/100000).toFixed(1).replace('.0','')+'L':'₹'+Number(v).toLocaleString('en-IN');var e=document.getElementById('budgetDisplay');if(e)e.textContent=d;var c=Math.max(1,Math.round(v/6500));var ec=document.getElementById('estCreators');if(ec)ec.textContent=c;var ev=document.getElementById('estVideos');if(ev)ev.textContent=c;var ed=document.getElementById('estDays');if(ed)ed.textContent=Math.min(14,Math.max(7,Math.round(c*1.2)))}
function selectLength(el){el.parentElement.querySelectorAll('.amp-chip').forEach(c=>c.classList.remove('active'));el.classList.add('active')}
function switchTab(el,i){el.parentElement.querySelectorAll('.amp-tab').forEach(t=>t.classList.remove('active'));el.classList.add('active');for(var x=0;x<3;x++){var t=document.getElementById('payTab'+x);if(t)t.style.display=x===i?'block':'none'}}
function addListItem(cid,txt){var c=document.getElementById(cid);if(!c||!txt)return;var d=document.createElement('div');d.style.cssText='display:flex;align-items:center;gap:var(--amp-sp-2);margin-bottom:var(--amp-sp-1)';d.innerHTML='<span style="flex:1;font-size:var(--amp-text-sm);color:var(--amp-text-secondary);background:var(--amp-stone-50);padding:var(--amp-sp-2) var(--amp-sp-3);border-radius:var(--amp-radius-md)">'+txt+'</span><button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--amp-stone-400);cursor:pointer;font-size:16px">×</button>';c.appendChild(d)}
function addAudienceTag(txt){var c=document.getElementById('audienceTags');if(!c||!txt)return;var s=document.createElement('span');s.className='amp-chip active';s.textContent=txt+' ×';s.onclick=function(){this.remove()};c.appendChild(s)}
function placeOrder(){document.getElementById('successModal').classList.add('show')}
function openQuiz(){alert('Based on your answers, we recommend Content for Ads!')}
`;

// ═══════════════════════════════════════════════════════════
// STEP STRUCTURES
// ═══════════════════════════════════════════════════════════
function sixStepScreens(variant) {
  return [
    { label: 'Goal', heading: 'What would you like to achieve?', sub: "Pick a goal — we'll configure the best setup", html: goalCards(variant) },
    { label: 'Product', heading: 'Which product are we promoting?', sub: 'Paste a link or pick a recent product', html: productScanner() },
    { label: 'Content', heading: 'How should content be created?', sub: 'AI is faster and cheaper. Human adds authentic reach.', html: contentType() },
    { label: 'Brief & Scripts', heading: 'Craft your brief', sub: "Tell us what's special — we'll generate scripts", html: briefEditor() + scriptPreview() },
    { label: 'Budget', heading: 'Set your investment', sub: "We'll optimize for your budget", html: budgetSection() },
    { label: 'Checkout', heading: 'Review & pay', sub: 'Everything look good?', html: checkout() },
  ];
}

function sevenStepScreens(variant) {
  return [
    { label: 'Goal', heading: 'What would you like to achieve?', sub: "Pick a goal — we'll configure the best setup", html: goalCards(variant) },
    { label: 'Product', heading: 'Which product?', sub: 'Paste a link — we extract everything automatically', html: productScanner() },
    { label: 'Content', heading: 'How should content be created?', sub: 'Choose your creation method', html: contentType() },
    { label: 'Brief', heading: 'Craft your brief', sub: "What makes this product special?", html: briefEditor() },
    { label: 'Scripts', heading: 'Review AI scripts', sub: 'Generated from your brief — edit after payment', html: scriptPreview() },
    { label: 'Budget', heading: 'Set your investment', sub: 'Drag to adjust — we optimize for you', html: budgetSection() },
    { label: 'Checkout', heading: 'Review & pay', sub: 'Place your order when ready', html: checkout() },
  ];
}

// ═══════════════════════════════════════════════════════════
// TYPEFORM NAVIGATION JS (shared by all variations)
// ═══════════════════════════════════════════════════════════
function tfNavJS(total) {
  return `
var tfCur=1,tfTotal=${total};
function tfGo(s){if(s<1||s>tfTotal)return;var c=document.getElementById('tfSlide'+tfCur),n=document.getElementById('tfSlide'+s);c.classList.add('exiting');c.classList.remove('active');setTimeout(function(){c.classList.remove('exiting')},400);setTimeout(function(){n.classList.add('active')},50);tfCur=s;document.getElementById('tfProgress').style.width=((s-1)/(tfTotal-1)*100)+'%';document.getElementById('tfCurrent').textContent=s;var b=document.getElementById('tfBack');b.style.opacity=s>1?'1':'0';b.style.pointerEvents=s>1?'auto':'none';var nb=document.getElementById('tfNext');if(s===tfTotal){nb.textContent='';nb.style.display='none'}else{nb.style.display='';nb.textContent='Continue →'}}
function goToStep(s){tfGo(s)}
function quickReorder(){tfGo(tfTotal)}
document.getElementById('tfNext').onclick=function(){tfGo(tfCur+1)};
document.getElementById('tfBack').onclick=function(){tfGo(tfCur-1)};
document.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.target.matches('input,textarea,select'))tfGo(tfCur+1);if(e.key==='ArrowDown'){e.preventDefault();tfGo(tfCur+1)}if(e.key==='ArrowUp'){e.preventDefault();tfGo(tfCur-1)}});
`;
}

// ═══════════════════════════════════════════════════════════
// VARIATION BUILDERS
// ═══════════════════════════════════════════════════════════

// ── A: BREATHE — 7-step, maximum whitespace, minimal info ──
function buildBreathe(dark) {
  const screens = sevenStepScreens('breathe');
  const css = `
.tf-progress{position:fixed;top:0;left:0;right:0;height:3px;background:var(--amp-stone-200);z-index:200}
.tf-progress-fill{height:100%;background:var(--amp-gradient-brand-soft);transition:width .5s ease;width:0}
.tf-topbar{position:fixed;top:3px;left:0;right:0;z-index:100;display:flex;justify-content:space-between;align-items:center;padding:var(--amp-sp-5) var(--amp-sp-10);background:transparent}
.tf-step-count{font-size:var(--amp-text-sm);color:var(--amp-text-muted)}
.tf-slide{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;padding:100px var(--amp-sp-10) 100px;opacity:0;pointer-events:none;transition:opacity .5s ease,transform .5s ease;transform:translateY(50px);overflow-y:auto}
.tf-slide.active{opacity:1;pointer-events:auto;transform:translateY(0)}
.tf-slide.exiting{opacity:0;transform:translateY(-50px)}
.tf-content{width:100%;max-width:860px;margin:0 auto}
.tf-label{font-size:var(--amp-text-xs);font-weight:500;color:var(--amp-text-muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:var(--amp-sp-6)}
.tf-heading{font-size:40px;font-weight:700;color:var(--amp-text);line-height:1.15;letter-spacing:-.03em;margin-bottom:var(--amp-sp-2)}
.tf-sub{font-size:var(--amp-text-lg);color:var(--amp-text-muted);font-weight:400;margin-bottom:var(--amp-sp-8);line-height:1.5}
.tf-nav{position:fixed;bottom:0;left:0;right:0;display:flex;justify-content:center;padding:var(--amp-sp-5);z-index:100}
.tf-nav-pill{display:flex;align-items:center;gap:var(--amp-sp-2);background:var(--amp-surface);border:1px solid var(--amp-border);border-radius:var(--amp-radius-full);padding:var(--amp-sp-2);box-shadow:var(--amp-shadow-lg)}
@media(max-width:768px){.tf-slide{padding:80px var(--amp-sp-4) 80px}.tf-heading{font-size:28px}}`;

  let body = `<div class="tf-progress"><div class="tf-progress-fill" id="tfProgress"></div></div>
<div class="tf-topbar"><div class="amp-logo">amplify</div><div class="tf-step-count"><span id="tfCurrent">1</span> / ${screens.length}</div></div>
${screens.map((s,i) => `<div class="tf-slide${i===0?' active':''}" id="tfSlide${i+1}"><div class="tf-content"><div class="tf-label">${s.label}</div><div class="tf-heading">${s.heading}</div><div class="tf-sub">${s.sub}</div>${s.html}</div></div>`).join('')}
${successModal()}
<div class="tf-nav"><div class="tf-nav-pill"><button class="amp-btn amp-btn-text amp-btn-sm" id="tfBack" style="opacity:0;pointer-events:none">←</button><button class="amp-btn amp-btn-primary" id="tfNext">Continue →</button></div></div>`;

  return htmlDoc('Amplify — Breathe' + (dark ? ' (Dark)' : ''), dark, css, body, tfNavJS(screens.length));
}

// ── B: STUDIO — 6-step, immersive editorial with gradient accent ──
function buildStudio(dark) {
  const screens = sixStepScreens('studio');
  const gradients = [
    'linear-gradient(135deg,rgba(101,49,255,.08) 0%,rgba(245,93,193,.05) 100%)',
    'linear-gradient(135deg,rgba(73,90,244,.08) 0%,rgba(101,49,255,.05) 100%)',
    'linear-gradient(135deg,rgba(155,107,255,.08) 0%,rgba(33,193,121,.05) 100%)',
    'linear-gradient(135deg,rgba(245,93,193,.08) 0%,rgba(73,90,244,.05) 100%)',
    'linear-gradient(135deg,rgba(33,193,121,.08) 0%,rgba(101,49,255,.05) 100%)',
    'linear-gradient(135deg,rgba(101,49,255,.06) 0%,rgba(155,107,255,.04) 100%)',
  ];
  const darkGradients = [
    'linear-gradient(135deg,rgba(101,49,255,.15) 0%,rgba(245,93,193,.08) 100%)',
    'linear-gradient(135deg,rgba(73,90,244,.15) 0%,rgba(101,49,255,.08) 100%)',
    'linear-gradient(135deg,rgba(155,107,255,.15) 0%,rgba(33,193,121,.08) 100%)',
    'linear-gradient(135deg,rgba(245,93,193,.15) 0%,rgba(73,90,244,.08) 100%)',
    'linear-gradient(135deg,rgba(33,193,121,.15) 0%,rgba(101,49,255,.08) 100%)',
    'linear-gradient(135deg,rgba(101,49,255,.12) 0%,rgba(155,107,255,.06) 100%)',
  ];
  const grads = dark ? darkGradients : gradients;

  const css = `
.tf-progress{position:fixed;top:0;left:0;right:0;height:4px;background:var(--amp-stone-200);z-index:200}
.tf-progress-fill{height:100%;background:var(--amp-gradient-brand);transition:width .4s ease;width:0}
.tf-topbar{position:fixed;top:4px;left:0;right:0;z-index:100;display:flex;justify-content:space-between;align-items:center;padding:var(--amp-sp-4) var(--amp-sp-8);background:rgba(${dark?'12,12,18,.85':'248,249,253,.85'});backdrop-filter:blur(16px)}
.tf-slide{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;padding:80px var(--amp-sp-6) 90px;opacity:0;pointer-events:none;transition:all .4s ease;transform:translateY(30px);overflow-y:auto}
.tf-slide.active{opacity:1;pointer-events:auto;transform:translateY(0)}
.tf-slide.exiting{opacity:0;transform:translateY(-30px)}
.tf-inner{display:grid;grid-template-columns:280px 1fr;gap:var(--amp-sp-8);max-width:960px;width:100%;align-items:start}
.tf-aside{padding:var(--amp-sp-8) var(--amp-sp-6);border-radius:var(--amp-radius-2xl);min-height:300px;display:flex;flex-direction:column;justify-content:flex-end}
.tf-aside-step{font-size:var(--amp-text-xs);font-weight:600;color:var(--amp-accent);text-transform:uppercase;letter-spacing:.1em;margin-bottom:var(--amp-sp-3)}
.tf-aside-heading{font-size:var(--amp-text-2xl);font-weight:700;color:var(--amp-text);line-height:1.2;letter-spacing:-.02em}
.tf-aside-sub{font-size:var(--amp-text-base);color:var(--amp-text-muted);margin-top:var(--amp-sp-2);line-height:1.5}
.tf-main{padding-top:var(--amp-sp-4)}
.tf-nav{position:fixed;bottom:0;left:0;right:0;display:flex;justify-content:space-between;align-items:center;padding:var(--amp-sp-4) var(--amp-sp-8);background:rgba(${dark?'12,12,18,.9':'248,249,253,.9'});backdrop-filter:blur(8px);border-top:1px solid var(--amp-border);z-index:100}
.tf-nav-hint{font-size:var(--amp-text-xs);color:var(--amp-text-muted)}
@media(max-width:800px){.tf-inner{grid-template-columns:1fr}.tf-aside{min-height:auto;padding:var(--amp-sp-5)}}`;

  let body = `<div class="tf-progress"><div class="tf-progress-fill" id="tfProgress"></div></div>
<div class="tf-topbar"><div class="amp-logo">amplify</div><div style="font-size:var(--amp-text-sm);color:var(--amp-text-muted)"><span id="tfCurrent">1</span> of ${screens.length}</div></div>
${screens.map((s,i) => `<div class="tf-slide${i===0?' active':''}" id="tfSlide${i+1}"><div class="tf-inner"><div class="tf-aside" style="background:${grads[i]}"><div class="tf-aside-step">Step ${i+1}</div><div class="tf-aside-heading">${s.heading}</div><div class="tf-aside-sub">${s.sub}</div></div><div class="tf-main">${s.html}</div></div></div>`).join('')}
${successModal()}
<div class="tf-nav"><div class="tf-nav-hint">↑↓ Navigate · Enter Continue</div><div style="display:flex;gap:var(--amp-sp-2)"><button class="amp-btn amp-btn-text" id="tfBack" style="opacity:0;pointer-events:none">← Back</button><button class="amp-btn amp-btn-primary amp-btn-lg" id="tfNext">Continue →</button></div></div>`;

  return htmlDoc('Amplify — Studio' + (dark ? ' (Dark)' : ''), dark, css, body, tfNavJS(screens.length));
}

// ── C: COMMAND — 7-step, dense, power-user, keyboard shortcuts ──
function buildCommand(dark) {
  const screens = sevenStepScreens('command');
  const css = `
.tf-progress{position:fixed;top:0;left:0;right:0;height:2px;background:var(--amp-stone-200);z-index:200}
.tf-progress-fill{height:100%;background:var(--amp-accent);transition:width .3s ease;width:0}
.tf-topbar{position:fixed;top:2px;left:0;right:0;z-index:100;display:flex;justify-content:space-between;align-items:center;padding:var(--amp-sp-2) var(--amp-sp-6);background:rgba(${dark?'12,12,18,.92':'248,249,253,.92'});backdrop-filter:blur(12px);border-bottom:1px solid var(--amp-border)}
.tf-shortcuts{display:flex;gap:var(--amp-sp-1)}
.tf-sc{width:24px;height:24px;border-radius:var(--amp-radius-sm);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;border:1px solid var(--amp-border);color:var(--amp-text-muted);cursor:pointer;transition:all .15s}
.tf-sc.active{background:var(--amp-accent);border-color:var(--amp-accent);color:#fff}
.tf-sc.done{background:var(--amp-green-600);border-color:var(--amp-green-600);color:#fff}
.tf-slide{position:fixed;inset:0;display:flex;align-items:flex-start;justify-content:center;padding:60px var(--amp-sp-6) 60px;opacity:0;pointer-events:none;transition:all .25s ease;transform:translateX(20px);overflow-y:auto}
.tf-slide.active{opacity:1;pointer-events:auto;transform:translateX(0)}
.tf-slide.exiting{opacity:0;transform:translateX(-20px)}
.tf-content{width:100%;max-width:640px;margin:0 auto;padding-top:var(--amp-sp-4)}
.tf-label{font-size:var(--amp-text-xs);font-weight:600;color:var(--amp-accent);margin-bottom:var(--amp-sp-1)}
.tf-heading{font-size:var(--amp-text-xl);font-weight:700;color:var(--amp-text);margin-bottom:var(--amp-sp-1)}
.tf-sub{font-size:var(--amp-text-sm);color:var(--amp-text-muted);margin-bottom:var(--amp-sp-3)}
.tf-nav{position:fixed;bottom:0;left:0;right:0;display:flex;justify-content:space-between;align-items:center;padding:var(--amp-sp-2) var(--amp-sp-6);background:rgba(${dark?'12,12,18,.92':'248,249,253,.92'});backdrop-filter:blur(8px);border-top:1px solid var(--amp-border);z-index:100}
.tf-nav kbd{display:inline-block;padding:1px 5px;border-radius:3px;background:var(--amp-surface);border:1px solid var(--amp-border);font-size:10px;font-family:var(--amp-font);margin:0 2px}`;

  let body = `<div class="tf-progress"><div class="tf-progress-fill" id="tfProgress"></div></div>
<div class="tf-topbar"><div style="display:flex;align-items:center;gap:var(--amp-sp-3)"><div class="amp-logo" style="font-size:18px">amplify</div><span style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">New Campaign</span></div>
<div class="tf-shortcuts">${screens.map((_,i)=>`<div class="tf-sc${i===0?' active':''}" onclick="tfGo(${i+1})">${i+1}</div>`).join('')}</div></div>
${screens.map((s,i)=>`<div class="tf-slide${i===0?' active':''}" id="tfSlide${i+1}"><div class="tf-content"><div class="tf-label">Step ${i+1}/${screens.length} — ${s.label}</div><div class="tf-heading">${s.heading}</div><div class="tf-sub">${s.sub}</div>${s.html}</div></div>`).join('')}
${successModal()}
<div class="tf-nav"><div style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)"><kbd>1</kbd>-<kbd>${screens.length}</kbd> Jump · <kbd>Enter</kbd> Next · <kbd>↑</kbd><kbd>↓</kbd> Navigate</div><div style="display:flex;gap:var(--amp-sp-2)"><button class="amp-btn amp-btn-text amp-btn-sm" id="tfBack" style="opacity:0;pointer-events:none">←</button><button class="amp-btn amp-btn-primary" id="tfNext">Continue →</button></div></div>`;

  // Extra JS: numbered keyboard shortcuts + shortcut dot updates
  const extraJS = `
document.addEventListener('keydown',function(e){if(e.target.matches('input,textarea,select'))return;var n=parseInt(e.key);if(n>=1&&n<=${screens.length})tfGo(n)});
var _origTfGo=tfGo;
tfGo=function(s){_origTfGo(s);document.querySelectorAll('.tf-sc').forEach(function(d,i){d.classList.remove('active','done');if(i+1<s)d.classList.add('done');else if(i+1===s)d.classList.add('active')})};`;

  return htmlDoc('Amplify — Command' + (dark ? ' (Dark)' : ''), dark, css, body, tfNavJS(screens.length) + extraJS);
}

// ── D: JOURNEY — 6-step, progressive context with summary pills ──
function buildJourney(dark) {
  const screens = sixStepScreens('journey');
  const css = `
.tf-progress{position:fixed;top:0;left:0;right:0;height:3px;background:var(--amp-stone-200);z-index:200}
.tf-progress-fill{height:100%;background:var(--amp-gradient-brand-soft);transition:width .4s ease;width:0}
.tf-topbar{position:fixed;top:3px;left:0;right:0;z-index:100;background:rgba(${dark?'12,12,18,.9':'248,249,253,.9'});backdrop-filter:blur(12px);border-bottom:1px solid var(--amp-border);padding:var(--amp-sp-3) var(--amp-sp-6)}
.tf-topbar-inner{max-width:780px;margin:0 auto;display:flex;align-items:center;justify-content:space-between}
.tf-pills{display:flex;gap:var(--amp-sp-2);flex-wrap:wrap}
.tf-pill{display:flex;align-items:center;gap:var(--amp-sp-1);padding:var(--amp-sp-1) var(--amp-sp-3);border-radius:var(--amp-radius-full);font-size:var(--amp-text-xs);font-weight:500;cursor:pointer;transition:all .2s;border:1px solid var(--amp-border);color:var(--amp-text-muted);background:transparent}
.tf-pill.active{background:var(--amp-accent);border-color:var(--amp-accent);color:#fff;font-weight:600}
.tf-pill.done{background:var(--amp-green-50);border-color:var(--amp-green-600);color:var(--amp-green-600)}
.tf-pill-check{font-size:10px}
.tf-slide{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;padding:90px var(--amp-sp-6) 80px;opacity:0;pointer-events:none;transition:all .35s ease;transform:translateY(30px);overflow-y:auto}
.tf-slide.active{opacity:1;pointer-events:auto;transform:translateY(0)}
.tf-slide.exiting{opacity:0;transform:translateY(-30px)}
.tf-content{width:100%;max-width:780px;margin:0 auto}
.tf-heading{font-size:var(--amp-text-2xl);font-weight:700;color:var(--amp-text);letter-spacing:-.02em;margin-bottom:var(--amp-sp-2)}
.tf-sub{font-size:var(--amp-text-base);color:var(--amp-text-muted);margin-bottom:var(--amp-sp-5)}
.tf-nav{position:fixed;bottom:0;left:0;right:0;display:flex;justify-content:space-between;align-items:center;padding:var(--amp-sp-4) var(--amp-sp-8);background:rgba(${dark?'12,12,18,.9':'248,249,253,.9'});backdrop-filter:blur(8px);border-top:1px solid var(--amp-border);z-index:100}
@media(max-width:768px){.tf-pills{display:none}}`;

  const pillLabels = screens.map(s => s.label);
  let body = `<div class="tf-progress"><div class="tf-progress-fill" id="tfProgress"></div></div>
<div class="tf-topbar"><div class="tf-topbar-inner"><div class="amp-logo">amplify</div>
<div class="tf-pills">${pillLabels.map((l,i)=>`<div class="tf-pill${i===0?' active':''}" onclick="tfGo(${i+1})">${i===0?'':''}<span>${l}</span></div>`).join('')}</div>
<div id="tfCurrent" style="display:none">1</div></div></div>
${screens.map((s,i)=>`<div class="tf-slide${i===0?' active':''}" id="tfSlide${i+1}"><div class="tf-content"><div class="tf-heading">${s.heading}</div><div class="tf-sub">${s.sub}</div>${s.html}</div></div>`).join('')}
${successModal()}
<div class="tf-nav"><button class="amp-btn amp-btn-text" id="tfBack" style="opacity:0;pointer-events:none">← Back</button><button class="amp-btn amp-btn-primary amp-btn-lg" id="tfNext">Continue →</button></div>`;

  const extraJS = `
var _origTfGo2=tfGo;
tfGo=function(s){_origTfGo2(s);document.querySelectorAll('.tf-pill').forEach(function(p,i){p.classList.remove('active','done');if(i+1<s){p.classList.add('done');p.querySelector('span').textContent='✓ '+${JSON.stringify(pillLabels)}[i]}else if(i+1===s){p.classList.add('active');p.querySelector('span').textContent=${JSON.stringify(pillLabels)}[i]}else{p.querySelector('span').textContent=${JSON.stringify(pillLabels)}[i]}})};`;

  return htmlDoc('Amplify — Journey' + (dark ? ' (Dark)' : ''), dark, css, body, tfNavJS(screens.length) + extraJS);
}

// ═══════════════════════════════════════════════════════════
// HTML DOC WRAPPER
// ═══════════════════════════════════════════════════════════
function htmlDoc(title, dark, layoutCSS, body, layoutJS) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
${lightTokens}
${darkOverride}
${baseCSS}
${layoutCSS}
</style>
</head>
<body${dark ? ' class="dark"' : ''}>
${body}
<script>
${sharedJS}
${layoutJS}
</script>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════════
// BUILD
// ═══════════════════════════════════════════════════════════
const outDir = process.argv[2] || path.join(os.homedir(), 'Desktop');
const start = Date.now();

const builds = [
  ['breathe-light.html', () => buildBreathe(false)],
  ['breathe-dark.html',  () => buildBreathe(true)],
  ['studio-light.html',  () => buildStudio(false)],
  ['studio-dark.html',   () => buildStudio(true)],
  ['command-light.html',  () => buildCommand(false)],
  ['command-dark.html',   () => buildCommand(true)],
  ['journey-light.html',  () => buildJourney(false)],
  ['journey-dark.html',   () => buildJourney(true)],
];

console.log(`Building ${builds.length} designs...\n`);
for (const [name, builder] of builds) {
  const html = builder();
  const fp = path.join(outDir, name);
  fs.writeFileSync(fp, html);
  const onclicks = (html.match(/onclick/gi) || []).length;
  const fns = (html.match(/function /g) || []).length;
  const kb = (html.length / 1024).toFixed(1);
  console.log(`  ✓ ${name.padEnd(22)} ${kb.padStart(5)}KB | onclick:${String(onclicks).padStart(2)} | fn:${fns}`);
}
console.log(`\nDone in ${Date.now() - start}ms — ${outDir}`);
