#!/usr/bin/env node
/**
 * Build 3 alternative ordering paradigms as standalone HTML.
 * Uses raw HTML strings (not React SSR) to preserve onclick interactivity.
 * Imports tokens + base CSS from the TS modules via a shim.
 */
const fs = require('fs');
const path = require('path');
const os = require('os');

// ── Token + CSS inline (from tokens.ts and base-css.ts, production values) ──
// We inline these to avoid needing tsx runtime for a simple build script.

const tokensCSS = `
:root {
  --amp-violet-50: #F5F0FF; --amp-violet-100: #EDEAFC; --amp-violet-200: #DBD2F6;
  --amp-violet-300: #C4B5FD; --amp-violet-400: #9B6BFF; --amp-violet-500: #7C5CFF;
  --amp-violet-600: #6531FF; --amp-violet-700: #752AD4; --amp-violet-800: #4A1FA8;
  --amp-violet-900: #3B1785;
  --amp-stone-50: #f8f9fd; --amp-stone-100: #f1f6fe; --amp-stone-200: #d0d1d3;
  --amp-stone-300: #b8bcc0; --amp-stone-400: #8e939b; --amp-stone-500: #6b7280;
  --amp-stone-600: #4b5563; --amp-stone-700: #374151; --amp-stone-800: #1f2937;
  --amp-stone-900: #1D252D;
  --amp-green-50: #E8FAF3; --amp-green-600: #21C179;
  --amp-amber-50: #fff8e1; --amp-amber-600: #ffc107;
  --amp-red-50: #FFEBEF; --amp-red-600: #fd5154;
  --amp-blue-50: #EFF6FF; --amp-blue-600: #2563EB;
  --amp-bg: #f8f9fd; --amp-surface: #ffffff;
  --amp-surface-overlay: rgba(29, 37, 45, 0.07);
  --amp-text: #1D252D; --amp-text-secondary: rgba(29, 37, 45, 0.58);
  --amp-text-muted: #6b7280;
  --amp-border: rgba(29, 37, 45, 0.08);
  --amp-border-strong: rgba(29, 37, 45, 0.16);
  --amp-border-brand: #DBD2F6;
  --amp-accent: #6531FF; --amp-accent-hover: #752AD4; --amp-accent-light: #EDEAFC;
  --amp-sp-1: 4px; --amp-sp-2: 8px; --amp-sp-3: 12px; --amp-sp-4: 16px;
  --amp-sp-5: 20px; --amp-sp-6: 24px; --amp-sp-8: 32px; --amp-sp-10: 40px;
  --amp-sp-12: 48px; --amp-sp-16: 64px;
  --amp-radius-sm: 4px; --amp-radius-md: 8px; --amp-radius-lg: 12px;
  --amp-radius-xl: 16px; --amp-radius-2xl: 24px; --amp-radius-full: 9999px;
  --amp-shadow-sm: 0 1px 3px rgba(28,25,23,0.04);
  --amp-shadow-md: 0 2px 8px rgba(28,25,23,0.06);
  --amp-shadow-lg: 0 8px 24px rgba(28,25,23,0.08);
  --amp-shadow-brand: 0 4px 20px rgba(101, 49, 255, 0.24);
  --amp-gradient-brand: linear-gradient(96deg, #F55DC1 3.78%, #495AF4 97.89%);
  --amp-gradient-brand-soft: linear-gradient(135deg, #6531ff 0%, #9b6bff 100%);
  --amp-font: 'Inter', system-ui, -apple-system, sans-serif;
  --amp-text-xs: 11px; --amp-text-sm: 13px; --amp-text-base: 14px;
  --amp-text-md: 15px; --amp-text-lg: 18px; --amp-text-xl: 24px; --amp-text-2xl: 32px;
  --amp-transition: 150ms ease;
}`;

// Base CSS (from base-css.ts)
const baseCSS = fs.readFileSync(path.join(__dirname, 'packages/templates/src/base-css.ts'), 'utf-8')
  .match(/return `([\s\S]*?)`;/)?.[1] || '';

// ── Shared components (raw HTML with onclick) ──
const goals = [
  { id: 'ads', icon: '🎬', title: 'Content for Ads', tagline: 'Scroll-stopping UGC for paid campaigns', bullets: ['Full content ownership & rights', 'Optimized for Meta, Google, YouTube', 'Multiple format variations'], price: 'From ₹5,000/video', timeline: '7-10 days' },
  { id: 'influencer', icon: '📱', title: 'Influencer Marketing', tagline: 'Creators post about you to their audience', bullets: ["Content on creator's own profile", 'Organic reach & engagement', 'Authentic social proof'], price: 'From ₹8,000/creator', timeline: '10-14 days' },
  { id: 'launch', icon: '🚀', title: 'Product Launch', tagline: 'Coordinated buzz from multiple creators', bullets: ['Multiple creators, same timeline', 'Build pre-launch excitement', 'Coordinated posting schedule'], price: 'From ₹25,000/campaign', timeline: '5-7 days' },
];

function goalCardsHTML(heading = 'What would you like to achieve?') {
  return `
<div class="amp-h1">${heading}</div>
<p class="amp-sub">Pick a goal — we'll configure the best campaign setup for you</p>
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
<div style="text-align:center;margin-top:var(--amp-sp-5)"><a href="#" onclick="openQuiz();return false" style="font-size:var(--amp-text-sm);color:var(--amp-text-muted);text-decoration:none">Not sure which to pick? Take a quick quiz →</a></div>`;
}

function productScannerHTML() {
  return `
<div class="amp-h1" style="margin-top:var(--amp-sp-8)">What product are you promoting?</div>
<p class="amp-sub">Paste a product URL — we'll extract everything automatically</p>
<div style="display:flex;gap:var(--amp-sp-2);margin-top:var(--amp-sp-4)">
  <input class="amp-input" id="productUrl" placeholder="https://your-store.com/product-name" style="flex:1">
  <button class="amp-btn amp-btn-primary" onclick="scanProduct()">Scan Product</button>
</div>
<div id="intelligenceScrape" style="display:none;margin-top:var(--amp-sp-5)">
  <div class="amp-card" style="padding:var(--amp-sp-5)">
    <div style="display:flex;align-items:center;gap:var(--amp-sp-3);margin-bottom:var(--amp-sp-3)">
      <div class="amp-shimmer" style="width:40px;height:40px;border-radius:var(--amp-radius-full)"></div>
      <div><div style="font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-text)">AI Product Intelligence</div><div id="scrapeStep" style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">Analyzing your product...</div></div>
    </div>
    <div style="height:4px;border-radius:var(--amp-radius-full);background:var(--amp-stone-200);overflow:hidden"><div id="scrapeBar" style="height:100%;width:0;background:var(--amp-accent);transition:width .4s;border-radius:var(--amp-radius-full)"></div></div>
  </div>
</div>
<div id="productArea" style="display:none"></div>
<template id="productCardTemplate"><div class="amp-card" style="padding:var(--amp-sp-5);margin-top:var(--amp-sp-4)">
  <div style="display:flex;gap:var(--amp-sp-4);align-items:center">
    <div style="width:64px;height:64px;border-radius:var(--amp-radius-lg);background:var(--amp-gradient-brand-soft);flex-shrink:0"></div>
    <div style="flex:1"><div style="font-weight:600;font-size:var(--amp-text-md)">Glow Radiance Serum</div><div style="font-size:var(--amp-text-sm);color:var(--amp-text-muted)">Luminara Beauty · ₹1,299 · Beauty, Skincare</div>
    <div style="display:flex;gap:var(--amp-sp-2);margin-top:var(--amp-sp-2)"><span class="amp-badge amp-badge-violet">Beauty</span><span class="amp-badge amp-badge-violet">Skincare</span></div></div>
    <span class="amp-badge amp-badge-green">Scanned ✓</span>
  </div>
</div></template>`;
}

function contentTypeHTML() {
  return `
<div class="amp-h1">How should your content be created?</div>
<p class="amp-sub">AI is faster, cheaper, and you own everything. Human creators add authentic reach.</p>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--amp-sp-5);margin-top:var(--amp-sp-6)">
  <div class="amp-card selected" id="cardAi" style="padding:var(--amp-sp-6)">
    <div style="font-size:28px;margin-bottom:var(--amp-sp-3)">🤖</div>
    <div class="amp-h2">AI Video</div>
    <p style="font-size:var(--amp-text-sm);color:var(--amp-text-muted);margin:var(--amp-sp-1) 0 var(--amp-sp-4)">Studio-quality video generated in minutes</p>
    <div style="display:flex;flex-direction:column;gap:var(--amp-sp-2);margin-bottom:var(--amp-sp-4)">
      <div style="font-size:var(--amp-text-xs);color:var(--amp-text-secondary)">✓ Ready in 24 hours</div>
      <div style="font-size:var(--amp-text-xs);color:var(--amp-text-secondary)">✓ Full content ownership</div>
      <div style="font-size:var(--amp-text-xs);color:var(--amp-text-secondary)">✓ Unlimited revisions</div>
    </div>
    <span style="font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-accent)">From ₹2,000/video</span>
    <button class="amp-btn amp-btn-primary amp-btn-full" id="btnAi" onclick="selectContentType('ai')" style="margin-top:var(--amp-sp-4)">Selected ✓</button>
  </div>
  <div class="amp-card faded" id="cardHuman" style="padding:var(--amp-sp-6)">
    <div style="font-size:28px;margin-bottom:var(--amp-sp-3)">👤</div>
    <div class="amp-h2">Human Creator</div>
    <p style="font-size:var(--amp-text-sm);color:var(--amp-text-muted);margin:var(--amp-sp-1) 0 var(--amp-sp-4)">Real creators post to their audience</p>
    <div style="display:flex;flex-direction:column;gap:var(--amp-sp-2);margin-bottom:var(--amp-sp-4)">
      <div style="font-size:var(--amp-text-xs);color:var(--amp-text-secondary)">✓ Authentic social proof</div>
      <div style="font-size:var(--amp-text-xs);color:var(--amp-text-secondary)">✓ Audience reach included</div>
      <div style="font-size:var(--amp-text-xs);color:var(--amp-text-secondary)">✓ AI-matched creators</div>
    </div>
    <span style="font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-accent)">From ₹8,000/creator</span>
    <button class="amp-btn amp-btn-outline amp-btn-full" id="btnHuman" onclick="selectContentType('human')" style="margin-top:var(--amp-sp-4)">Select Human Creator</button>
  </div>
</div>`;
}

function briefEditorHTML() {
  return `
<div class="amp-h1">Craft your brief</div>
<p class="amp-sub">Tell creators what makes this product special. We'll generate scripts from your brief.</p>
<div style="margin-top:var(--amp-sp-5)">
  <label style="font-size:var(--amp-text-sm);font-weight:600;display:block;margin-bottom:var(--amp-sp-2)">Key selling points</label>
  <div id="sellingPoints" style="margin-bottom:var(--amp-sp-2)">
    <div style="display:flex;align-items:center;gap:var(--amp-sp-2);margin-bottom:var(--amp-sp-1)"><span style="flex:1;font-size:var(--amp-text-sm);color:var(--amp-text-secondary);background:var(--amp-stone-50);padding:var(--amp-sp-2) var(--amp-sp-3);border-radius:var(--amp-radius-md)">Lightweight formula absorbs in seconds</span><button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--amp-stone-400);cursor:pointer;font-size:16px">×</button></div>
    <div style="display:flex;align-items:center;gap:var(--amp-sp-2);margin-bottom:var(--amp-sp-1)"><span style="flex:1;font-size:var(--amp-text-sm);color:var(--amp-text-secondary);background:var(--amp-stone-50);padding:var(--amp-sp-2) var(--amp-sp-3);border-radius:var(--amp-radius-md)">Visible glow in 7 days</span><button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--amp-stone-400);cursor:pointer;font-size:16px">×</button></div>
  </div>
  <div style="display:flex;gap:var(--amp-sp-2)"><input class="amp-input" placeholder="Add another selling point..." id="newSP" style="flex:1"><button class="amp-btn amp-btn-secondary" onclick="addListItem('sellingPoints',document.getElementById('newSP').value);document.getElementById('newSP').value=''">Add</button></div>
</div>
<div style="margin-top:var(--amp-sp-5)">
  <label style="font-size:var(--amp-text-sm);font-weight:600;display:block;margin-bottom:var(--amp-sp-2)">Target audience</label>
  <div id="audienceTags" style="display:flex;flex-wrap:wrap;gap:var(--amp-sp-2);margin-bottom:var(--amp-sp-2)">
    <span class="amp-chip active" onclick="this.remove()">Women 25-35 ×</span>
    <span class="amp-chip active" onclick="this.remove()">Skincare enthusiasts ×</span>
  </div>
  <div style="display:flex;gap:var(--amp-sp-2)"><input class="amp-input" placeholder="Add audience tag..." id="newTag" style="flex:1"><button class="amp-btn amp-btn-secondary" onclick="addAudienceTag(document.getElementById('newTag').value);document.getElementById('newTag').value=''">Add</button></div>
</div>
<div style="margin-top:var(--amp-sp-5)">
  <label style="font-size:var(--amp-text-sm);font-weight:600;display:block;margin-bottom:var(--amp-sp-2)">Tone & style</label>
  <div style="display:flex;gap:var(--amp-sp-2);flex-wrap:wrap">
    <span class="amp-chip active" onclick="selectLength(this)">Friendly & relatable</span>
    <span class="amp-chip" onclick="selectLength(this)">Professional</span>
    <span class="amp-chip" onclick="selectLength(this)">Funny & playful</span>
    <span class="amp-chip" onclick="selectLength(this)">Aspirational</span>
    <span class="amp-chip" onclick="selectLength(this)">Educational</span>
  </div>
</div>`;
}

function scriptPreviewHTML() {
  return `
<div style="margin-top:var(--amp-sp-6)">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--amp-sp-4)">
    <div class="amp-h2">Script Samples</div>
    <span class="amp-badge amp-badge-violet">AI-generated</span>
  </div>
  <div class="amp-card" style="padding:var(--amp-sp-5);margin-bottom:var(--amp-sp-3)">
    <div style="display:flex;justify-content:space-between;margin-bottom:var(--amp-sp-2)"><span style="font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-accent)">Concept 1: Problem → Solution</span><span style="font-size:var(--amp-text-xs);color:var(--amp-stone-400)">24s · 9:16</span></div>
    <p style="font-size:var(--amp-text-sm);color:var(--amp-text-secondary);line-height:1.6">"Tired of dull skin? I tried everything until I found this serum. Within a week, my skin was literally glowing. The Vitamin C + Hyaluronic Acid combo is *chef's kiss*. Link in bio!"</p>
  </div>
  <div class="amp-card" style="padding:var(--amp-sp-5)">
    <div style="display:flex;justify-content:space-between;margin-bottom:var(--amp-sp-2)"><span style="font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-accent)">Concept 2: Trend Story</span><span style="font-size:var(--amp-text-xs);color:var(--amp-stone-400)">24s · 9:16</span></div>
    <p style="font-size:var(--amp-text-sm);color:var(--amp-text-secondary);line-height:1.6">"POV: You finally find the serum that actually does what it promises. Day 1 vs Day 7 — the glow-up is real. ₹1,299 well spent."</p>
  </div>
  <p style="font-size:var(--amp-text-xs);color:var(--amp-stone-400);margin-top:var(--amp-sp-2);text-align:center">Scripts are samples — you can edit them after payment</p>
</div>`;
}

function budgetSectionHTML() {
  return `
<div class="amp-h1">Set your budget</div>
<p class="amp-sub">Drag to adjust — we'll optimize creator selection for your budget</p>
<div style="margin-top:var(--amp-sp-6)">
  <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:var(--amp-sp-1)">
    <span style="font-size:var(--amp-text-sm);font-weight:500;color:var(--amp-text-muted)">Campaign Budget</span>
    <span id="budgetDisplay" style="font-size:var(--amp-text-xl);font-weight:700;color:var(--amp-accent)">₹30,000</span>
  </div>
  <input type="range" min="5000" max="200000" value="30000" step="1000" oninput="updateBudget(this.value)">
  <div class="amp-slider-marks"><span>₹5K</span><span>₹50K</span><span>₹1L</span><span>₹2L</span></div>
</div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--amp-sp-4);margin-top:var(--amp-sp-6)">
  <div class="amp-card" style="padding:var(--amp-sp-4);text-align:center"><div style="font-size:var(--amp-text-2xl);font-weight:700;color:var(--amp-accent)" id="estCreators">5</div><div style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">Estimated creators</div></div>
  <div class="amp-card" style="padding:var(--amp-sp-4);text-align:center"><div style="font-size:var(--amp-text-2xl);font-weight:700;color:var(--amp-accent)" id="estVideos">5</div><div style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">Videos</div></div>
  <div class="amp-card" style="padding:var(--amp-sp-4);text-align:center"><div style="font-size:var(--amp-text-2xl);font-weight:700;color:var(--amp-accent)" id="estDays">8</div><div style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">Days delivery</div></div>
</div>`;
}

function walletCardHTML() {
  return `
<div class="amp-wallet" style="margin-top:var(--amp-sp-5)">
  <div style="display:flex;justify-content:space-between;align-items:center">
    <div><div style="font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-text)">OI Money Balance</div><div style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">Auto-applied at checkout</div></div>
    <div style="font-size:var(--amp-text-lg);font-weight:700;color:var(--amp-accent)">₹12,400</div>
  </div>
  <div class="amp-wallet-bar"><div class="amp-wallet-fill" style="width:41%"></div></div>
</div>`;
}

function checkoutHTML() {
  const total = 30000, gst = 5400, grand = 35400, wallet = 12400, due = 23000;
  return `
<div class="amp-two-col">
  <div>
    <div class="amp-card" style="padding:var(--amp-sp-6)">
      <div style="padding:var(--amp-sp-4) 0;border-bottom:1px solid var(--amp-stone-100)">
        <div style="display:flex;justify-content:space-between;margin-bottom:var(--amp-sp-3)"><div class="amp-h3">Goal & Product</div><span style="font-size:var(--amp-text-xs);color:var(--amp-accent);cursor:pointer" onclick="goToStep(1)">Edit</span></div>
        <div style="display:flex;gap:var(--amp-sp-3);align-items:center">
          <div style="width:48px;height:48px;border-radius:var(--amp-radius-md);background:var(--amp-gradient-brand-soft);flex-shrink:0"></div>
          <div><div style="font-size:var(--amp-text-base);font-weight:600">Glow Radiance Serum</div><div style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">Luminara Beauty · ₹1,299 · 🎬 Content for Ads</div></div>
        </div>
      </div>
      <div style="padding:var(--amp-sp-4) 0;border-bottom:1px solid var(--amp-stone-100)">
        <div style="display:flex;justify-content:space-between;margin-bottom:var(--amp-sp-2)"><div class="amp-h3">Content & Budget</div><span style="font-size:var(--amp-text-xs);color:var(--amp-accent);cursor:pointer" onclick="goToStep(3)">Edit</span></div>
        <div class="amp-price-row"><span>Type</span><span style="color:var(--amp-text);font-weight:500">AI Video — Growth Package</span></div>
        <div class="amp-price-row"><span>Videos</span><span style="color:var(--amp-text);font-weight:500">15 videos · 24s · 9:16 vertical</span></div>
      </div>
      <div style="padding:var(--amp-sp-4) 0">
        <div style="display:flex;justify-content:space-between;margin-bottom:var(--amp-sp-2)"><div class="amp-h3">Brief & Scripts</div><span style="font-size:var(--amp-text-xs);color:var(--amp-accent);cursor:pointer" onclick="goToStep(4)">Edit</span></div>
        <div class="amp-price-row"><span>Concepts</span><span style="color:var(--amp-text);font-weight:500">Problem → Solution, Trend Story</span></div>
        <div class="amp-price-row"><span>Scripts</span><span style="color:var(--amp-text);font-weight:500">2 samples (edit after payment)</span></div>
      </div>
    </div>
  </div>
  <div>
    <div class="amp-card" style="padding:var(--amp-sp-6);position:sticky;top:100px">
      <div class="amp-h2" style="margin-bottom:var(--amp-sp-5)">Payment</div>
      <div style="display:flex;flex-direction:column;gap:var(--amp-sp-2)">
        <div class="amp-price-row"><span>Campaign cost</span><span>₹${total.toLocaleString('en-IN')}</span></div>
        <div class="amp-price-row"><span>GST (18%)</span><span>₹${gst.toLocaleString('en-IN')}</span></div>
        <div class="amp-price-row amp-price-total"><span>Total</span><span>₹${grand.toLocaleString('en-IN')}</span></div>
        <div class="amp-price-row amp-price-credit"><span>OI Money</span><span>−₹${wallet.toLocaleString('en-IN')}</span></div>
        <div class="amp-price-row amp-price-due"><span>Amount Due</span><span>₹${due.toLocaleString('en-IN')}</span></div>
      </div>
      <div class="amp-tabs">
        <button class="amp-tab active" onclick="switchTab(this,0)">UPI</button>
        <button class="amp-tab" onclick="switchTab(this,1)">Card</button>
        <button class="amp-tab" onclick="switchTab(this,2)">Net Banking</button>
      </div>
      <div id="payTab0"><input class="amp-input" placeholder="Enter UPI ID (e.g., name@upi)"><p style="font-size:var(--amp-text-xs);color:var(--amp-stone-400);text-align:center;margin-top:var(--amp-sp-1)">Or scan QR on next screen</p></div>
      <div id="payTab1" style="display:none"><input class="amp-input" placeholder="Card Number" style="margin-bottom:var(--amp-sp-2)"><div style="display:flex;gap:var(--amp-sp-2)"><input class="amp-input" placeholder="MM/YY"><input class="amp-input" placeholder="CVV" style="max-width:100px"></div></div>
      <div id="payTab2" style="display:none"><select class="amp-input"><option>Select your bank</option><option>HDFC Bank</option><option>ICICI Bank</option><option>SBI</option><option>Axis Bank</option></select></div>
      <button class="amp-btn amp-btn-primary amp-btn-lg amp-btn-full" style="margin-top:var(--amp-sp-5)" onclick="placeOrder()">Place Order — Pay ₹${due.toLocaleString('en-IN')}</button>
      <p style="text-align:center;font-size:11px;color:var(--amp-stone-400);margin-top:var(--amp-sp-2)">🔒 Secured by Razorpay</p>
    </div>
  </div>
</div>`;
}

function successModalHTML() {
  return `
<div class="amp-modal-bg" id="successModal">
  <div class="amp-modal" style="text-align:center">
    <svg class="amp-success-check" viewBox="0 0 72 72"><circle cx="36" cy="36" r="32"/><path d="M22 36 l10 10 l18 -20"/></svg>
    <div class="amp-h1" style="margin-bottom:var(--amp-sp-2)">Campaign Created!</div>
    <p style="color:var(--amp-text-muted);margin-bottom:var(--amp-sp-6)">Your AI videos will be ready in 24 hours. We'll notify you when they're done.</p>
    <button class="amp-btn amp-btn-primary amp-btn-lg amp-btn-full">View Campaign Dashboard</button>
  </div>
</div>`;
}

// ── Shared interaction JS ──
const sharedJS = `
function selectGoal(el, goalId) {
  document.querySelectorAll('.goal-card').forEach(c => { c.classList.remove('selected'); var ck = c.querySelector('.card-check'); if (ck) ck.style.opacity = '0'; });
  el.classList.add('selected');
  var ck = el.querySelector('.card-check'); if (ck) ck.style.opacity = '1';
}
function scanProduct() {
  var input = document.getElementById('productUrl');
  if (!input.value) input.value = 'https://luminara.com/glow-radiance-serum';
  var area = document.getElementById('productArea');
  var intel = document.getElementById('intelligenceScrape');
  if (intel) {
    intel.style.display = 'block'; if (area) area.style.display = 'none';
    var steps = ['Analyzing your product...', 'Learning from 12,000+ campaigns...', 'Identifying top-performing formats...', 'Optimizing for your category...'];
    var si = 0, stepEl = document.getElementById('scrapeStep'), barEl = document.getElementById('scrapeBar');
    var interval = setInterval(function() {
      si++;
      if (si < steps.length) { stepEl.textContent = steps[si]; barEl.style.width = (si / steps.length * 100) + '%'; }
      else { clearInterval(interval); intel.style.display = 'none'; if (area) { area.style.display = 'block'; area.innerHTML = document.getElementById('productCardTemplate').innerHTML; } }
    }, 600);
  }
}
function selectRecentProduct(el) {
  document.querySelectorAll('.amp-card.clickable').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}
function selectContentType(type) {
  var aiCard = document.getElementById('cardAi'), humanCard = document.getElementById('cardHuman');
  var btnAi = document.getElementById('btnAi'), btnHuman = document.getElementById('btnHuman');
  if (type === 'ai') {
    if (aiCard) { aiCard.classList.add('selected'); aiCard.classList.remove('faded'); }
    if (humanCard) { humanCard.classList.remove('selected'); humanCard.classList.add('faded'); }
    if (btnAi) { btnAi.className = 'amp-btn amp-btn-primary amp-btn-full'; btnAi.textContent = 'Selected ✓'; }
    if (btnHuman) { btnHuman.className = 'amp-btn amp-btn-outline amp-btn-full'; btnHuman.textContent = 'Select Human Creator'; }
  } else {
    if (humanCard) { humanCard.classList.add('selected'); humanCard.classList.remove('faded'); }
    if (aiCard) { aiCard.classList.remove('selected'); aiCard.classList.add('faded'); }
    if (btnHuman) { btnHuman.className = 'amp-btn amp-btn-primary amp-btn-full'; btnHuman.textContent = 'Selected ✓'; }
    if (btnAi) { btnAi.className = 'amp-btn amp-btn-outline amp-btn-full'; btnAi.textContent = 'Select AI Video'; }
  }
}
function selectPackage(el) { el.parentElement.querySelectorAll('.amp-card').forEach(c => c.classList.remove('selected')); el.classList.add('selected'); }
function updateBudget(val) {
  var display = val >= 100000 ? '₹' + (val/100000).toFixed(1).replace('.0','') + 'L' : '₹' + val.toLocaleString('en-IN');
  var el = document.getElementById('budgetDisplay'); if (el) el.textContent = display;
  var c = Math.max(1, Math.round(val / 6500));
  var eC = document.getElementById('estCreators'); if (eC) eC.textContent = c;
  var eV = document.getElementById('estVideos'); if (eV) eV.textContent = c;
  var eD = document.getElementById('estDays'); if (eD) eD.textContent = Math.min(14, Math.max(7, Math.round(c * 1.2)));
}
function selectLength(el) { el.parentElement.querySelectorAll('.amp-chip').forEach(c => c.classList.remove('active')); el.classList.add('active'); }
function switchTab(el, idx) {
  el.parentElement.querySelectorAll('.amp-tab').forEach(t => t.classList.remove('active')); el.classList.add('active');
  for (var i = 0; i < 3; i++) { var tab = document.getElementById('payTab' + i); if (tab) tab.style.display = i === idx ? 'block' : 'none'; }
}
function addListItem(containerId, text) {
  var container = document.getElementById(containerId); if (!container || !text) return;
  var div = document.createElement('div');
  div.style.cssText = 'display:flex;align-items:center;gap:var(--amp-sp-2);margin-bottom:var(--amp-sp-1)';
  div.innerHTML = '<span style="flex:1;font-size:var(--amp-text-sm);color:var(--amp-text-secondary);background:var(--amp-stone-50);padding:var(--amp-sp-2) var(--amp-sp-3);border-radius:var(--amp-radius-md)">' + text + '</span><button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--amp-stone-400);cursor:pointer;font-size:16px">×</button>';
  container.appendChild(div);
}
function addAudienceTag(text) {
  var container = document.getElementById('audienceTags'); if (!container || !text) return;
  var span = document.createElement('span'); span.className = 'amp-chip active'; span.textContent = text + ' ×'; span.onclick = function() { this.remove(); }; container.appendChild(span);
}
function placeOrder() { document.getElementById('successModal').classList.add('show'); }
function openQuiz() { alert('Quiz: Based on your answers, we recommend Content for Ads!'); }
`;

// ── 6-step screen data ──
const screens = [
  { label: 'Goal', html: goalCardsHTML() },
  { label: 'Product', html: productScannerHTML() },
  { label: 'Content Type', html: contentTypeHTML() },
  { label: 'Brief & Scripts', html: briefEditorHTML() + scriptPreviewHTML() },
  { label: 'Budget', html: budgetSectionHTML() + walletCardHTML() },
  { label: 'Checkout', html: checkoutHTML() },
];

// ── HTML wrapper ──
function htmlDoc(title, layoutCSS, body, layoutJS) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
${tokensCSS}
${baseCSS}
${layoutCSS}
</style>
</head>
<body>
${body}
${successModalHTML()}
<script>
${sharedJS}
${layoutJS}
</script>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════════
// PARADIGM 1: TYPEFORM — One full-screen question at a time
// ═══════════════════════════════════════════════════════════
function buildTypeform() {
  const css = `
.tf-progress{position:fixed;top:0;left:0;right:0;height:4px;background:var(--amp-stone-200);z-index:200}
.tf-progress-fill{height:100%;background:var(--amp-gradient-brand-soft);transition:width .4s ease;width:0}
.tf-topbar{position:fixed;top:4px;left:0;right:0;z-index:100;display:flex;justify-content:space-between;align-items:center;padding:var(--amp-sp-4) var(--amp-sp-8);background:rgba(248,249,253,.85);backdrop-filter:blur(12px)}
.tf-step-count{font-size:var(--amp-text-sm);color:var(--amp-text-muted);font-weight:500}
.tf-slide{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;padding:80px var(--amp-sp-8) 80px;opacity:0;pointer-events:none;transition:opacity .4s ease,transform .4s ease;transform:translateY(40px);overflow-y:auto}
.tf-slide.active{opacity:1;pointer-events:auto;transform:translateY(0)}
.tf-slide.exiting{opacity:0;transform:translateY(-40px)}
.tf-content{width:100%;max-width:820px;margin:0 auto}
.tf-question-num{font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-accent);margin-bottom:var(--amp-sp-3);letter-spacing:.05em;text-transform:uppercase}
.tf-nav{position:fixed;bottom:0;left:0;right:0;display:flex;justify-content:space-between;align-items:center;padding:var(--amp-sp-4) var(--amp-sp-8);background:rgba(248,249,253,.9);backdrop-filter:blur(8px);border-top:1px solid var(--amp-border);z-index:100}
.tf-nav-hint{font-size:var(--amp-text-xs);color:var(--amp-text-muted)}
.tf-nav-hint kbd{display:inline-block;padding:2px 6px;border-radius:4px;background:var(--amp-surface);border:1px solid var(--amp-border);font-family:var(--amp-font);font-size:11px;margin:0 2px}
.tf-slide .amp-h1{font-size:var(--amp-text-2xl);margin-bottom:var(--amp-sp-2)}
.tf-slide .amp-sub{font-size:var(--amp-text-md);margin-bottom:var(--amp-sp-6)}
@media(max-width:768px){.tf-slide{padding:72px var(--amp-sp-4) 80px}.tf-nav-hint{display:none}}`;

  const body = `
<div class="tf-progress"><div class="tf-progress-fill" id="tfProgress"></div></div>
<div class="tf-topbar">
  <div class="amp-logo">amplify</div>
  <div class="tf-step-count"><span id="tfCurrent">1</span> of ${screens.length}</div>
</div>
${screens.map((s, i) => `
<div class="tf-slide${i === 0 ? ' active' : ''}" id="tfSlide${i + 1}">
  <div class="tf-content">
    <div class="tf-question-num">Step ${i + 1} — ${s.label}</div>
    ${s.html}
  </div>
</div>`).join('')}
<div class="tf-nav">
  <div class="tf-nav-hint">Press <kbd>Enter</kbd> to continue · <kbd>↑</kbd><kbd>↓</kbd> to navigate</div>
  <div style="display:flex;gap:var(--amp-sp-2)">
    <button class="amp-btn amp-btn-text" id="tfBackBtn" style="opacity:0;pointer-events:none" onclick="tfGoTo(tfCurrent-1)">← Back</button>
    <button class="amp-btn amp-btn-primary amp-btn-lg" id="tfNextBtn" onclick="tfGoTo(tfCurrent+1)">Continue →</button>
  </div>
</div>`;

  const js = `
var tfCurrent = 1, tfTotal = ${screens.length};
function tfGoTo(step) {
  if (step < 1 || step > tfTotal) return;
  var cur = document.getElementById('tfSlide' + tfCurrent);
  var nxt = document.getElementById('tfSlide' + step);
  cur.classList.add('exiting'); cur.classList.remove('active');
  setTimeout(function() { cur.classList.remove('exiting'); }, 400);
  setTimeout(function() { nxt.classList.add('active'); }, 50);
  tfCurrent = step;
  document.getElementById('tfProgress').style.width = ((step - 1) / (tfTotal - 1) * 100) + '%';
  document.getElementById('tfCurrent').textContent = step;
  var bb = document.getElementById('tfBackBtn'); bb.style.opacity = step > 1 ? '1' : '0'; bb.style.pointerEvents = step > 1 ? 'auto' : 'none';
  var nb = document.getElementById('tfNextBtn'); nb.style.display = step === tfTotal ? 'none' : '';
}
function goToStep(s) { tfGoTo(s); }
function quickReorder() { tfGoTo(tfTotal); }
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.target.matches('input,textarea,select')) tfGoTo(tfCurrent + 1);
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); tfGoTo(tfCurrent + 1); }
  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); tfGoTo(tfCurrent - 1); }
});`;

  return htmlDoc('Amplify — New Campaign (Typeform)', css, body, js);
}

// ═══════════════════════════════════════════════════════════
// PARADIGM 2: SPLIT PANEL — Live preview + config
// ═══════════════════════════════════════════════════════════
function buildSplitPanel() {
  const css = `
.sp-wrapper{display:grid;grid-template-columns:400px 1fr;min-height:100vh}
.sp-preview{position:sticky;top:0;height:100vh;background:var(--amp-stone-50);border-right:1px solid var(--amp-border);display:flex;flex-direction:column;overflow:hidden}
.sp-preview-header{padding:var(--amp-sp-5) var(--amp-sp-6);border-bottom:1px solid var(--amp-border)}
.sp-preview-body{flex:1;padding:var(--amp-sp-6);display:flex;flex-direction:column;gap:var(--amp-sp-4);overflow-y:auto}
.sp-card{background:var(--amp-surface);border-radius:var(--amp-radius-xl);border:1px solid var(--amp-border);overflow:hidden}
.sp-hero{height:120px;background:var(--amp-gradient-brand-soft);padding:var(--amp-sp-4);display:flex;align-items:flex-end}
.sp-hero-title{font-size:var(--amp-text-lg);color:#fff;font-weight:700}
.sp-hero-sub{font-size:var(--amp-text-xs);color:rgba(255,255,255,.7)}
.sp-body{padding:var(--amp-sp-5)}
.sp-row{display:flex;justify-content:space-between;padding:var(--amp-sp-2) 0;font-size:var(--amp-text-sm)}
.sp-row-l{color:var(--amp-text-muted)}
.sp-row-v{color:var(--amp-text);font-weight:500}
.sp-row-v.pending{color:var(--amp-stone-400);font-style:italic;font-weight:400}
.sp-div{height:1px;background:var(--amp-border);margin:var(--amp-sp-2) 0}
.sp-status{display:inline-flex;align-items:center;gap:6px;padding:var(--amp-sp-1) var(--amp-sp-3);border-radius:var(--amp-radius-full);font-size:var(--amp-text-xs);font-weight:600;background:var(--amp-amber-50);color:var(--amp-amber-600);border:1px solid rgba(255,193,7,.2)}
.sp-status.ready{background:var(--amp-green-50);color:var(--amp-green-600);border-color:rgba(33,193,121,.2)}
.sp-tip{margin-top:auto;padding:var(--amp-sp-4);background:var(--amp-surface);border-radius:var(--amp-radius-lg);border:1px solid var(--amp-border);font-size:var(--amp-text-xs);color:var(--amp-text-muted);line-height:1.5}
.sp-config{background:var(--amp-surface);min-height:100vh}
.sp-topbar{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.92);backdrop-filter:blur(8px);border-bottom:1px solid var(--amp-border);padding:var(--amp-sp-3) var(--amp-sp-6);display:flex;align-items:center;justify-content:space-between}
.sp-dots{display:flex;gap:var(--amp-sp-1)}
.sp-dot{width:8px;height:8px;border-radius:var(--amp-radius-full);background:var(--amp-stone-200);transition:all .2s}
.sp-dot.active{width:24px;background:var(--amp-accent)}
.sp-dot.done{background:var(--amp-green-600)}
.sp-configbody{padding:var(--amp-sp-8) var(--amp-sp-6) 100px;max-width:640px}
.sp-screen{display:none;animation:fadeSlideIn .3s ease-out}
.sp-screen.active{display:block}
.sp-seclabel{font-size:var(--amp-text-xs);font-weight:600;color:var(--amp-accent);text-transform:uppercase;letter-spacing:.05em;margin-bottom:var(--amp-sp-3)}
.sp-nav{position:fixed;bottom:0;right:0;width:calc(100% - 400px);display:flex;justify-content:space-between;padding:var(--amp-sp-4) var(--amp-sp-6);background:rgba(255,255,255,.92);backdrop-filter:blur(8px);border-top:1px solid var(--amp-border);z-index:50}
@media(max-width:900px){.sp-wrapper{grid-template-columns:1fr}.sp-preview{display:none}.sp-nav{width:100%}}`;

  const body = `
<div class="sp-wrapper">
  <div class="sp-preview">
    <div class="sp-preview-header">
      <div style="display:flex;align-items:center;gap:var(--amp-sp-3)">
        <div class="amp-avatar">LB</div>
        <div><div style="font-size:var(--amp-text-sm);font-weight:600">Luminara Beauty</div><div style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">Campaign preview</div></div>
      </div>
    </div>
    <div class="sp-preview-body">
      <div class="sp-card">
        <div class="sp-hero"><div><div class="sp-hero-sub">New Campaign</div><div class="sp-hero-title" id="spTitle">Glow Radiance Serum</div></div></div>
        <div class="sp-body">
          <div class="sp-row"><span class="sp-row-l">Goal</span><span class="sp-row-v pending" id="spGoal">Select a goal...</span></div>
          <div class="sp-div"></div>
          <div class="sp-row"><span class="sp-row-l">Content</span><span class="sp-row-v pending" id="spContent">Choose type...</span></div>
          <div class="sp-div"></div>
          <div class="sp-row"><span class="sp-row-l">Brief</span><span class="sp-row-v pending" id="spBrief">Write brief...</span></div>
          <div class="sp-div"></div>
          <div class="sp-row"><span class="sp-row-l">Budget</span><span class="sp-row-v pending" id="spBudget">Set budget...</span></div>
          <div class="sp-div"></div>
          <div class="sp-row"><span class="sp-row-l">Status</span><span class="sp-status" id="spStatus">Draft</span></div>
        </div>
      </div>
      <div style="padding:0 var(--amp-sp-1)">
        <div style="display:flex;justify-content:space-between;margin-bottom:var(--amp-sp-1)"><span style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">Completeness</span><span style="font-size:var(--amp-text-xs);font-weight:600;color:var(--amp-accent)" id="spPct">0%</span></div>
        <div style="height:4px;border-radius:var(--amp-radius-full);background:var(--amp-stone-200);overflow:hidden"><div id="spBar" style="height:100%;border-radius:var(--amp-radius-full);background:var(--amp-accent);width:0;transition:width .4s"></div></div>
      </div>
      <div class="sp-tip">This is how your campaign appears in the Atmosphere dashboard. Fields update as you configure.</div>
    </div>
  </div>
  <div class="sp-config">
    <div class="sp-topbar">
      <div class="amp-logo">amplify</div>
      <div class="sp-dots">${screens.map((_, i) => `<div class="sp-dot${i === 0 ? ' active' : ''}"></div>`).join('')}</div>
    </div>
    <div class="sp-configbody">
      ${screens.map((s, i) => `<div class="sp-screen${i === 0 ? ' active' : ''}" id="spScreen${i + 1}"><div class="sp-seclabel">Step ${i + 1} — ${s.label}</div>${s.html}</div>`).join('')}
    </div>
    <div class="sp-nav">
      <button class="amp-btn amp-btn-text" id="spBack" style="opacity:0;pointer-events:none" onclick="spGo(spCur-1)">← Back</button>
      <button class="amp-btn amp-btn-primary amp-btn-lg" id="spNext" onclick="spGo(spCur+1)">Continue →</button>
    </div>
  </div>
</div>`;

  const js = `
var spCur = 1, spTotal = ${screens.length};
function spGo(step) {
  if (step < 1 || step > spTotal) return;
  document.querySelectorAll('.sp-screen').forEach(s => s.classList.remove('active'));
  document.getElementById('spScreen' + step).classList.add('active');
  document.querySelectorAll('.sp-dot').forEach((d, i) => { d.classList.remove('active','done'); if (i+1<step) d.classList.add('done'); else if (i+1===step) d.classList.add('active'); });
  spCur = step;
  var bb = document.getElementById('spBack'); bb.style.opacity = step > 1 ? '1' : '0'; bb.style.pointerEvents = step > 1 ? 'auto' : 'none';
  document.getElementById('spNext').style.display = step === spTotal ? 'none' : '';
  var pct = Math.round((step-1)/(spTotal-1)*100);
  document.getElementById('spPct').textContent = pct + '%';
  document.getElementById('spBar').style.width = pct + '%';
  document.querySelector('.sp-configbody').scrollTo({top:0,behavior:'smooth'});
}
function spUp(field, val) {
  var el = document.getElementById('sp' + field); if (el) { el.textContent = val; el.classList.remove('pending'); }
  var fields = ['Goal','Content','Brief','Budget'];
  var filled = fields.filter(f => { var e = document.getElementById('sp'+f); return e && !e.classList.contains('pending'); }).length;
  if (filled === fields.length) { var st = document.getElementById('spStatus'); st.textContent = 'Ready'; st.className = 'sp-status ready'; }
}
function goToStep(s) { spGo(s); }
function quickReorder() { spGo(spTotal); }
// Wrap original handlers to also update preview
var _origSelectGoal = selectGoal;
selectGoal = function(el, goalId) { _origSelectGoal(el, goalId); var t = {ads:'Content for Ads',influencer:'Influencer Marketing',launch:'Product Launch'}; spUp('Goal', t[goalId]||goalId); };
var _origSelectContentType = selectContentType;
selectContentType = function(type) { _origSelectContentType(type); spUp('Content', type === 'ai' ? 'AI Video' : 'Human Creator'); };
var _origUpdateBudget = updateBudget;
updateBudget = function(val) { _origUpdateBudget(val); var d = val >= 100000 ? '₹'+(val/100000).toFixed(1).replace('.0','')+'L' : '₹'+Number(val).toLocaleString('en-IN'); spUp('Budget', d); };
var _origAddListItem = addListItem;
addListItem = function(cid, txt) { _origAddListItem(cid, txt); spUp('Brief', 'Configured'); };`;

  return htmlDoc('Amplify — New Campaign (Split Panel)', css, body, js);
}

// ═══════════════════════════════════════════════════════════
// PARADIGM 3: CONVERSATIONAL — Chat-guided setup
// ═══════════════════════════════════════════════════════════
function buildConversational() {
  const css = `
.chat-wrapper{min-height:100vh;background:var(--amp-bg)}
.chat-topbar{position:sticky;top:0;z-index:100;background:rgba(248,249,253,.92);backdrop-filter:blur(12px);border-bottom:1px solid var(--amp-border);padding:var(--amp-sp-3) var(--amp-sp-6)}
.chat-topbar-inner{max-width:680px;margin:0 auto;display:flex;align-items:center;justify-content:space-between}
.chat-agent{display:flex;align-items:center;gap:var(--amp-sp-3)}
.chat-avatar{width:36px;height:36px;border-radius:var(--amp-radius-full);background:var(--amp-gradient-brand-soft);display:flex;align-items:center;justify-content:center;font-size:16px;color:#fff;position:relative}
.chat-avatar::after{content:'';position:absolute;bottom:0;right:0;width:10px;height:10px;border-radius:var(--amp-radius-full);background:var(--amp-green-600);border:2px solid var(--amp-bg)}
.chat-dots{display:flex;gap:6px}
.chat-dot{width:8px;height:8px;border-radius:var(--amp-radius-full);background:var(--amp-stone-200);transition:all .2s}
.chat-dot.active{background:var(--amp-accent);transform:scale(1.2)}
.chat-dot.done{background:var(--amp-green-600)}
.chat-container{max-width:680px;margin:0 auto;padding:var(--amp-sp-6) var(--amp-sp-6) 100px}
.chat-group{margin-bottom:var(--amp-sp-6);display:none}
.chat-group.visible{display:block;animation:fadeSlideIn .4s ease-out}
.chat-msg{display:flex;gap:var(--amp-sp-3);margin-bottom:var(--amp-sp-4);align-items:flex-start}
.chat-msg-av{width:28px;height:28px;border-radius:var(--amp-radius-full);background:var(--amp-gradient-brand-soft);display:flex;align-items:center;justify-content:center;font-size:12px;color:#fff;flex-shrink:0;margin-top:2px}
.chat-bubble{background:var(--amp-surface);border:1px solid var(--amp-border);border-radius:var(--amp-radius-xl);border-top-left-radius:var(--amp-radius-sm);padding:var(--amp-sp-4) var(--amp-sp-5);max-width:85%;box-shadow:var(--amp-shadow-sm)}
.chat-bubble p{font-size:var(--amp-text-base);color:var(--amp-text);line-height:1.6;margin-bottom:var(--amp-sp-2)}
.chat-bubble p:last-child{margin-bottom:0}
.chat-time{font-size:var(--amp-text-xs);color:var(--amp-text-muted);margin-top:var(--amp-sp-1);margin-left:40px}
.chat-response{margin-left:40px;margin-bottom:var(--amp-sp-4)}
.chat-typing{display:none;gap:var(--amp-sp-3);align-items:flex-start;margin-bottom:var(--amp-sp-4)}
.chat-typing.show{display:flex}
.chat-typing-dots{display:flex;gap:4px;padding:var(--amp-sp-3) var(--amp-sp-4);background:var(--amp-surface);border:1px solid var(--amp-border);border-radius:var(--amp-radius-xl);border-top-left-radius:var(--amp-radius-sm)}
.chat-td{width:8px;height:8px;border-radius:var(--amp-radius-full);background:var(--amp-stone-300);animation:chatBounce 1.2s infinite}
.chat-td:nth-child(2){animation-delay:.2s}
.chat-td:nth-child(3){animation-delay:.4s}
@keyframes chatBounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}
.chat-input-bar{position:fixed;bottom:0;left:0;right:0;background:rgba(248,249,253,.95);backdrop-filter:blur(8px);border-top:1px solid var(--amp-border);padding:var(--amp-sp-3) var(--amp-sp-6);z-index:100}
.chat-input-inner{max-width:680px;margin:0 auto;display:flex;gap:var(--amp-sp-3);align-items:center}
.chat-input-field{flex:1;height:44px;padding:0 var(--amp-sp-4);border-radius:var(--amp-radius-2xl);border:1px solid var(--amp-border);background:var(--amp-surface);font-size:var(--amp-text-base);font-family:var(--amp-font);color:var(--amp-text);outline:none}
.chat-input-field:focus{border-color:var(--amp-accent);box-shadow:0 0 0 2px rgba(101,49,255,.15)}
.chat-send{width:44px;height:44px;border-radius:var(--amp-radius-full);background:var(--amp-accent);color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px}
.chat-send:hover{background:var(--amp-accent-hover)}
@media(max-width:768px){.chat-container{padding:var(--amp-sp-4) var(--amp-sp-4) 100px}.chat-bubble{max-width:92%}}`;

  const prompts = {
    'Goal': ['What would you like to achieve with this campaign?', "Pick a goal below and I'll configure the best setup for you."],
    'Product': ['Which product are we promoting?', 'Paste a link or pick from your recent products.'],
    'Content Type': ['Now for the fun part — what kind of content do you want?', 'AI-generated video is faster and cheaper. Human creators add authentic reach.'],
    'Brief & Scripts': ["Let's craft your brief.", "Tell me what makes this product special, and I'll generate scripts you can edit."],
    'Budget': ['Almost there! How much would you like to invest?', "I'll optimize creator selection and content volume for your budget."],
    'Checkout': ["Here's your campaign summary. Everything look good?", 'Review the details below and place your order when ready.'],
  };

  const body = `
<div class="chat-wrapper">
  <div class="chat-topbar"><div class="chat-topbar-inner">
    <div class="chat-agent">
      <div class="chat-avatar">✦</div>
      <div><div style="font-size:var(--amp-text-base);font-weight:600;color:var(--amp-text)">Amplify Assistant</div><div style="font-size:var(--amp-text-xs);color:var(--amp-green-600)">Online</div></div>
    </div>
    <div class="chat-dots">${screens.map((_, i) => `<div class="chat-dot${i === 0 ? ' active' : ''}"></div>`).join('')}</div>
  </div></div>
  <div class="chat-container">
    <div class="chat-group visible" id="chatWelcome">
      <div class="chat-msg"><div class="chat-msg-av">✦</div><div class="chat-bubble"><p>Hey Luminara Beauty! I'm your campaign assistant. Let's set up something great together.</p><p>Your last campaign had a 92% completion rate — let's keep that momentum! 🚀</p></div></div>
      <div class="chat-time">Just now</div>
    </div>
    ${screens.map((s, i) => {
      const p = prompts[s.label] || [`Let's configure: ${s.label}`];
      return `
    <div class="chat-group${i === 0 ? ' visible' : ''}" id="chatGroup${i + 1}">
      <div class="chat-msg"><div class="chat-msg-av">✦</div><div class="chat-bubble">${p.map(t => `<p>${t}</p>`).join('')}</div></div>
      <div class="chat-response">${s.html}</div>
    </div>`;
    }).join('')}
    <div class="chat-typing" id="chatTyping"><div class="chat-msg-av">✦</div><div class="chat-typing-dots"><div class="chat-td"></div><div class="chat-td"></div><div class="chat-td"></div></div></div>
  </div>
  <div class="chat-input-bar"><div class="chat-input-inner">
    <input class="chat-input-field" placeholder="Type a message or pick an option above...">
    <button class="chat-send" onclick="chatAdvance()">↑</button>
  </div></div>
</div>`;

  const js = `
var chatCur = 1, chatTotal = ${screens.length};
function chatAdvance() {
  if (chatCur >= chatTotal) return;
  var typing = document.getElementById('chatTyping');
  typing.classList.add('show');
  document.querySelector('.chat-container').scrollTo({top:999999,behavior:'smooth'});
  setTimeout(function() {
    typing.classList.remove('show');
    var next = document.getElementById('chatGroup' + (chatCur + 1));
    if (next) { next.classList.add('visible'); setTimeout(function() { next.scrollIntoView({behavior:'smooth',block:'start'}); }, 100); }
    document.querySelectorAll('.chat-dot').forEach(function(d, i) { d.classList.remove('active','done'); if (i+1 < chatCur+1) d.classList.add('done'); else if (i+1 === chatCur+1) d.classList.add('active'); });
    chatCur++;
  }, 800 + Math.random() * 400);
}
function goToStep(s) { if (s > chatCur) chatAdvance(); }
function quickReorder() { chatAdvance(); }`;

  return htmlDoc('Amplify — New Campaign (Conversational)', css, body, js);
}

// ── Build all 3 ──
const outDir = process.argv[2] || path.join(os.homedir(), 'Desktop');
const start = Date.now();
const builds = [
  ['paradigm-typeform.html', buildTypeform()],
  ['paradigm-splitpanel.html', buildSplitPanel()],
  ['paradigm-conversational.html', buildConversational()],
];

for (const [name, html] of builds) {
  const fp = path.join(outDir, name);
  fs.writeFileSync(fp, html);
  const onclicks = (html.match(/onclick/gi) || []).length;
  const fns = (html.match(/function /g) || []).length;
  console.log(`  ✓ ${name} — ${(html.length / 1024).toFixed(1)}KB | onclicks:${onclicks} | functions:${fns}`);
}
console.log(`\nDone in ${Date.now() - start}ms — saved to ${outDir}`);
