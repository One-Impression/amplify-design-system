#!/usr/bin/env node
/**
 * FINAL Ordering Flow — Design B (Canvas + New Components)
 * Light + Dark = 2 HTML files
 * 8 steps (0-7), dual Human/AI paths, full interactivity
 */
const fs = require('fs');
const path = require('path');
const os = require('os');

// ═══════════════════════════════════════════════════════════
// TOKENS
// ═══════════════════════════════════════════════════════════
const lightTokens = `:root{--amp-violet-50:#F5F0FF;--amp-violet-100:#EDEAFC;--amp-violet-200:#DBD2F6;--amp-violet-300:#C4B5FD;--amp-violet-400:#9B6BFF;--amp-violet-500:#7C5CFF;--amp-violet-600:#6531FF;--amp-violet-700:#752AD4;--amp-violet-800:#4A1FA8;--amp-violet-900:#3B1785;--amp-stone-50:#f8f9fd;--amp-stone-100:#f1f6fe;--amp-stone-200:#d0d1d3;--amp-stone-300:#b8bcc0;--amp-stone-400:#8e939b;--amp-stone-500:#6b7280;--amp-stone-600:#4b5563;--amp-stone-700:#374151;--amp-stone-800:#1f2937;--amp-stone-900:#1D252D;--amp-green-50:#E8FAF3;--amp-green-600:#21C179;--amp-amber-50:#fff8e1;--amp-amber-600:#ffc107;--amp-red-50:#FFEBEF;--amp-red-600:#fd5154;--amp-bg:#f8f9fd;--amp-surface:#ffffff;--amp-surface-overlay:rgba(29,37,45,0.07);--amp-text:#1D252D;--amp-text-secondary:rgba(29,37,45,0.58);--amp-text-muted:#6b7280;--amp-border:rgba(29,37,45,0.08);--amp-border-strong:rgba(29,37,45,0.16);--amp-border-brand:#DBD2F6;--amp-accent:#6531FF;--amp-accent-hover:#752AD4;--amp-accent-light:#EDEAFC;--amp-sp-1:4px;--amp-sp-2:8px;--amp-sp-3:12px;--amp-sp-4:16px;--amp-sp-5:20px;--amp-sp-6:24px;--amp-sp-8:32px;--amp-sp-10:40px;--amp-radius-sm:4px;--amp-radius-md:8px;--amp-radius-lg:12px;--amp-radius-xl:16px;--amp-radius-2xl:24px;--amp-radius-full:9999px;--amp-shadow-sm:0 1px 3px rgba(28,25,23,0.04);--amp-shadow-md:0 2px 8px rgba(28,25,23,0.06);--amp-shadow-lg:0 8px 24px rgba(28,25,23,0.08);--amp-shadow-brand:0 4px 20px rgba(101,49,255,0.24);--amp-gradient-brand:linear-gradient(96deg,#F55DC1 3.78%,#495AF4 97.89%);--amp-gradient-brand-soft:linear-gradient(135deg,#6531ff 0%,#9b6bff 100%);--amp-font:'Inter',system-ui,-apple-system,sans-serif;--amp-text-xs:11px;--amp-text-sm:13px;--amp-text-base:14px;--amp-text-md:15px;--amp-text-lg:18px;--amp-text-xl:24px;--amp-text-2xl:32px;--amp-transition:150ms ease}`;

const darkOverride = `body.dark{--amp-bg:#0c0c12;--amp-surface:#161620;--amp-surface-overlay:rgba(255,255,255,0.06);--amp-text:#ededf2;--amp-text-secondary:rgba(237,237,242,0.62);--amp-text-muted:rgba(237,237,242,0.38);--amp-border:rgba(255,255,255,0.08);--amp-border-strong:rgba(255,255,255,0.14);--amp-border-brand:rgba(101,49,255,0.3);--amp-accent:#7C5CFF;--amp-accent-hover:#9B6BFF;--amp-accent-light:rgba(101,49,255,0.15);--amp-stone-50:#1a1a24;--amp-stone-100:#22222e;--amp-stone-200:#2e2e3a;--amp-stone-300:#3a3a48;--amp-stone-400:#5a5a68;--amp-stone-500:#7a7a88;--amp-stone-600:#9a9aa8;--amp-stone-700:#babac8;--amp-green-50:rgba(33,193,121,0.12);--amp-green-600:#34d98c;--amp-amber-50:rgba(255,193,7,0.12);--amp-amber-600:#ffd54f;--amp-red-50:rgba(253,81,84,0.12);--amp-red-600:#ff7a7c;--amp-shadow-sm:0 1px 3px rgba(0,0,0,0.3);--amp-shadow-md:0 2px 8px rgba(0,0,0,0.4);--amp-shadow-lg:0 8px 24px rgba(0,0,0,0.5);--amp-shadow-brand:0 4px 20px rgba(124,92,255,0.35);--amp-gradient-brand-soft:linear-gradient(135deg,#7C5CFF 0%,#b794ff 100%)}`;

// Base CSS
const baseCSSFile = fs.readFileSync(path.join(__dirname, 'packages/templates/src/base-css.ts'), 'utf-8');
const baseCSS = baseCSSFile.match(/return `([\s\S]*?)`;/)?.[1] || '';

// ═══════════════════════════════════════════════════════════
// LAYOUT CSS
// ═══════════════════════════════════════════════════════════
const layoutCSS = `
/* Progress bar */
.progress{position:fixed;top:0;left:0;right:0;height:3px;background:var(--amp-stone-200);z-index:300}
.progress-fill{height:100%;background:var(--amp-gradient-brand-soft);transition:width .4s ease;width:0}

/* Topbar */
.topbar{position:fixed;top:3px;left:0;right:0;z-index:200;background:rgba(248,249,253,.92);backdrop-filter:blur(12px);border-bottom:1px solid var(--amp-border);padding:var(--amp-sp-3) var(--amp-sp-6)}
body.dark .topbar{background:rgba(12,12,18,.92)}
.topbar-inner{max-width:820px;margin:0 auto;display:flex;align-items:center;justify-content:space-between}
.topbar.hidden{display:none}

/* Step pills */
.pills{display:flex;gap:var(--amp-sp-2);flex-wrap:wrap}
.pill{display:flex;align-items:center;gap:4px;padding:var(--amp-sp-1) var(--amp-sp-3);border-radius:var(--amp-radius-full);font-size:var(--amp-text-xs);font-weight:500;cursor:pointer;transition:all .2s;border:1px solid var(--amp-border);color:var(--amp-text-muted);background:transparent;font-family:var(--amp-font)}
.pill.active{background:var(--amp-accent);border-color:var(--amp-accent);color:#fff;font-weight:600}
.pill.done{background:var(--amp-green-50);border-color:var(--amp-green-600);color:var(--amp-green-600)}
.pill.skip{display:none}

/* Slides */
.slide{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;padding:80px var(--amp-sp-6) 80px;opacity:0;pointer-events:none;transition:all .35s ease;transform:translateY(30px);overflow-y:auto}
.slide.active{opacity:1;pointer-events:auto;transform:translateY(0)}
.slide.exiting{opacity:0;transform:translateY(-30px)}
.slide-content{width:100%;max-width:820px;margin:0 auto}

/* Entry screen (step 0) — no topbar */
.slide.entry-slide{padding:0;align-items:center}
.entry-inner{text-align:center;max-width:680px;margin:0 auto;padding:var(--amp-sp-10) var(--amp-sp-6)}
.ai-badge{display:inline-flex;align-items:center;gap:6px;padding:6px 16px;border-radius:var(--amp-radius-full);background:var(--amp-accent);color:#fff;font-size:var(--amp-text-sm);font-weight:600;margin-bottom:var(--amp-sp-6)}
.entry-heading{font-size:clamp(28px,5vw,48px);font-weight:800;color:var(--amp-text);line-height:1.1;letter-spacing:-.03em;margin-bottom:var(--amp-sp-3)}
.entry-sub{font-size:var(--amp-text-md);color:var(--amp-text-muted);margin-bottom:var(--amp-sp-8);line-height:1.5}
.url-bar{display:flex;align-items:center;gap:var(--amp-sp-2);background:var(--amp-surface);border:1px solid var(--amp-border);border-radius:var(--amp-radius-2xl);padding:6px 6px 6px 16px;box-shadow:var(--amp-shadow-lg);max-width:600px;margin:0 auto var(--amp-sp-10)}
.url-bar svg{color:var(--amp-stone-400);flex-shrink:0}
.url-bar input{flex:1;border:none;outline:none;font-size:var(--amp-text-base);font-family:var(--amp-font);color:var(--amp-text);background:transparent}
.url-bar input::placeholder{color:var(--amp-stone-400)}
.url-bar .get-started{height:40px;padding:0 20px;border-radius:var(--amp-radius-xl);background:var(--amp-accent);color:#fff;border:none;font-weight:600;font-size:var(--amp-text-base);cursor:pointer;font-family:var(--amp-font);transition:background .15s;white-space:nowrap}
.url-bar .get-started:hover{background:var(--amp-accent-hover)}
.goal-section{margin-top:var(--amp-sp-4)}
.goal-label{font-size:var(--amp-text-sm);color:var(--amp-text-muted);margin-bottom:var(--amp-sp-4)}
.goal-grid{display:flex;gap:var(--amp-sp-4);justify-content:center;flex-wrap:wrap}
.goal-card{background:var(--amp-surface);border:1px solid var(--amp-border);border-radius:var(--amp-radius-xl);padding:var(--amp-sp-5) var(--amp-sp-6);cursor:pointer;transition:all .2s;text-align:center;min-width:180px;flex:1;max-width:220px;position:relative}
.goal-card:hover{box-shadow:var(--amp-shadow-lg)}
.goal-card.selected{border-color:var(--amp-accent);background:var(--amp-accent-light);box-shadow:var(--amp-shadow-brand)}
.goal-card .g-icon{font-size:32px;margin-bottom:var(--amp-sp-2)}
.goal-card .g-title{font-size:var(--amp-text-md);font-weight:600;color:var(--amp-text)}
.goal-card .g-sub{font-size:var(--amp-text-xs);color:var(--amp-text-muted);margin-top:var(--amp-sp-1)}

/* Returning brand shortcut */
.repeat-banner{background:var(--amp-accent-light);border:1px solid var(--amp-border-brand);border-radius:var(--amp-radius-xl);padding:var(--amp-sp-4) var(--amp-sp-5);margin-bottom:var(--amp-sp-6);display:flex;align-items:center;justify-content:space-between;cursor:pointer;transition:all .2s}
.repeat-banner:hover{box-shadow:var(--amp-shadow-brand)}

/* Scrape animation */
.scrape-animation{margin-top:var(--amp-sp-6)}
.scrape-step{display:flex;align-items:center;gap:var(--amp-sp-3);padding:var(--amp-sp-2) 0;font-size:var(--amp-text-sm);color:var(--amp-text-secondary)}
.scrape-step .check{color:var(--amp-green-600);font-weight:700;width:20px;text-align:center}
.scrape-step .spinner{width:16px;height:16px;border:2px solid var(--amp-stone-200);border-top-color:var(--amp-accent);border-radius:var(--amp-radius-full);animation:spin .6s linear infinite;margin:0 2px}
@keyframes spin{to{transform:rotate(360deg)}}

/* Insight banner */
.insight{display:flex;align-items:flex-start;gap:var(--amp-sp-3);padding:var(--amp-sp-4);background:var(--amp-accent-light);border-radius:var(--amp-radius-lg);margin-top:var(--amp-sp-5);border:1px solid var(--amp-border-brand)}
.insight .icon{font-size:16px;flex-shrink:0;margin-top:1px}
.insight .text{font-size:var(--amp-text-sm);color:var(--amp-accent);line-height:1.5}
.insight .highlight{font-weight:700}

/* Content type cards */
.ct-grid{display:grid;grid-template-columns:1fr 1fr;gap:var(--amp-sp-5);margin-top:var(--amp-sp-6)}
.ct-card{background:var(--amp-surface);border:1px solid var(--amp-border);border-radius:var(--amp-radius-xl);padding:var(--amp-sp-6);cursor:pointer;transition:all .2s;position:relative}
.ct-card:hover{box-shadow:var(--amp-shadow-lg)}
.ct-card.selected{border-color:var(--amp-accent);background:var(--amp-accent-light);box-shadow:var(--amp-shadow-brand)}
.ct-card.disabled{opacity:.5;cursor:not-allowed;pointer-events:none}
.ct-card .ct-badge{display:inline-flex;padding:2px 8px;border-radius:var(--amp-radius-full);font-size:10px;font-weight:600;margin-bottom:var(--amp-sp-3)}
.ct-card .ct-title{font-size:var(--amp-text-lg);font-weight:700;color:var(--amp-text);margin-bottom:var(--amp-sp-1)}
.ct-card .ct-price{font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-accent);margin-bottom:var(--amp-sp-4)}
.ct-card .ct-pros{list-style:none;margin-bottom:var(--amp-sp-4)}
.ct-card .ct-pros li{font-size:var(--amp-text-xs);color:var(--amp-text-secondary);padding:3px 0 3px 18px;position:relative}
.ct-card .ct-pros li::before{content:'✓';color:var(--amp-green-600);position:absolute;left:0;font-weight:700}
.ct-card .ct-cons{list-style:none;border-top:1px solid var(--amp-border);padding-top:var(--amp-sp-3)}
.ct-card .ct-cons li{font-size:var(--amp-text-xs);color:var(--amp-text-muted);padding:2px 0 2px 18px;position:relative}
.ct-card .ct-cons li::before{content:'⚠';position:absolute;left:0;font-size:10px}
.ct-coming-soon{position:absolute;top:var(--amp-sp-3);right:var(--amp-sp-3);font-size:10px;padding:2px 8px;border-radius:var(--amp-radius-full);background:var(--amp-amber-50);color:var(--amp-amber-600);font-weight:600}
.ct-cancel{font-size:var(--amp-text-xs);color:var(--amp-text-muted);margin-top:var(--amp-sp-3);padding-top:var(--amp-sp-3);border-top:1px solid var(--amp-border)}

/* FlexiSelector */
.flexi-wrap{margin-top:var(--amp-sp-4)}
.flexi-default{background:var(--amp-accent-light);border:1px solid var(--amp-border-brand);border-radius:var(--amp-radius-xl);padding:var(--amp-sp-5);cursor:pointer;transition:all .2s}
.flexi-default.active{border-color:var(--amp-accent);box-shadow:var(--amp-shadow-brand)}
.flexi-default .flexi-title{font-size:var(--amp-text-md);font-weight:600;color:var(--amp-text)}
.flexi-default .flexi-desc{font-size:var(--amp-text-sm);color:var(--amp-text-muted);margin-top:var(--amp-sp-1)}
.flexi-expand{font-size:var(--amp-text-sm);color:var(--amp-accent);cursor:pointer;margin-top:var(--amp-sp-3);font-weight:500;border:none;background:none;font-family:var(--amp-font);padding:0}
.flexi-options{display:none;margin-top:var(--amp-sp-3);display:grid;grid-template-columns:repeat(3,1fr);gap:var(--amp-sp-3)}
.flexi-options.show{display:grid}
.flexi-opt{background:var(--amp-surface);border:1px solid var(--amp-border);border-radius:var(--amp-radius-lg);padding:var(--amp-sp-4);cursor:pointer;transition:all .2s;text-align:center}
.flexi-opt:hover{border-color:var(--amp-border-strong)}
.flexi-opt.selected{border-color:var(--amp-accent);background:var(--amp-accent-light)}
.flexi-opt .fo-label{font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-text)}
.flexi-opt .fo-sub{font-size:var(--amp-text-xs);color:var(--amp-text-muted);margin-top:2px}
.flexi-opt .fo-price{font-size:var(--amp-text-xs);font-weight:600;color:var(--amp-accent);margin-top:var(--amp-sp-1)}

/* Script cards */
.script-card{background:var(--amp-surface);border:1px solid var(--amp-border);border-radius:var(--amp-radius-xl);padding:var(--amp-sp-5);margin-bottom:var(--amp-sp-3)}
.script-label{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--amp-sp-3)}
.script-concept{font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-accent)}
.script-dur{font-size:var(--amp-text-xs);color:var(--amp-stone-400)}
.script-section{margin-bottom:var(--amp-sp-2)}
.script-section-label{font-size:10px;font-weight:700;color:var(--amp-text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px}
.script-section-text{font-size:var(--amp-text-sm);color:var(--amp-text-secondary);line-height:1.5}

/* Package cards (AI video) */
.pkg-grid{display:flex;flex-direction:column;gap:var(--amp-sp-3);margin-top:var(--amp-sp-5)}
.pkg-card{background:var(--amp-surface);border:1px solid var(--amp-border);border-radius:var(--amp-radius-xl);padding:var(--amp-sp-5);cursor:pointer;transition:all .2s;display:flex;justify-content:space-between;align-items:center}
.pkg-card:hover{box-shadow:var(--amp-shadow-md)}
.pkg-card.selected{border-color:var(--amp-accent);background:var(--amp-accent-light);box-shadow:var(--amp-shadow-brand)}
.pkg-name{font-size:var(--amp-text-md);font-weight:700;color:var(--amp-text);text-transform:capitalize}
.pkg-details{font-size:var(--amp-text-sm);color:var(--amp-text-muted);margin-top:2px}
.pkg-price{font-size:var(--amp-text-xl);font-weight:800;color:var(--amp-text)}
.pkg-card.selected .pkg-price{color:var(--amp-accent)}

/* Wallet */
.wallet{background:var(--amp-accent-light);border:1px solid var(--amp-border-brand);border-radius:var(--amp-radius-xl);padding:var(--amp-sp-5);margin-top:var(--amp-sp-5)}
.wallet-row{display:flex;justify-content:space-between;align-items:center}
.wallet-label{font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-text)}
.wallet-amount{font-size:var(--amp-text-lg);font-weight:700;color:var(--amp-accent)}
.wallet-bar{height:4px;border-radius:var(--amp-radius-full);background:var(--amp-violet-200);margin-top:var(--amp-sp-2);overflow:hidden}
.wallet-fill{height:100%;border-radius:var(--amp-radius-full);background:var(--amp-accent);transition:width .4s}
.wallet-note{font-size:var(--amp-text-xs);color:var(--amp-text-muted);margin-top:var(--amp-sp-2)}

/* Section headers */
.section-title{font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-text);margin-bottom:var(--amp-sp-2)}
.section-sub{font-size:var(--amp-text-xs);color:var(--amp-text-muted);margin-bottom:var(--amp-sp-3)}
.heading{font-size:var(--amp-text-2xl);font-weight:700;color:var(--amp-text);line-height:1.2;letter-spacing:-.02em;margin-bottom:var(--amp-sp-2)}
.sub{font-size:var(--amp-text-md);color:var(--amp-text-muted);margin-bottom:var(--amp-sp-5);line-height:1.5}

/* Footer */
.footer{position:fixed;bottom:0;left:0;right:0;display:flex;justify-content:space-between;align-items:center;padding:var(--amp-sp-3) var(--amp-sp-8);background:rgba(248,249,253,.92);backdrop-filter:blur(8px);border-top:1px solid var(--amp-border);z-index:200}
body.dark .footer{background:rgba(12,12,18,.92)}
.footer-hint{font-size:var(--amp-text-xs);color:var(--amp-text-muted)}
.footer-hint kbd{display:inline-block;padding:1px 5px;border-radius:3px;background:var(--amp-surface);border:1px solid var(--amp-border);font-size:10px;font-family:var(--amp-font)}
.footer.hidden{display:none}

/* Note banner */
.note{font-size:var(--amp-text-xs);color:var(--amp-text-muted);background:var(--amp-stone-50);border-radius:var(--amp-radius-md);padding:var(--amp-sp-3);margin-top:var(--amp-sp-4);line-height:1.5}

/* Video length picker */
.len-grid{display:flex;gap:var(--amp-sp-2);flex-wrap:wrap;margin-top:var(--amp-sp-3)}
.len-opt{padding:var(--amp-sp-2) var(--amp-sp-4);border-radius:var(--amp-radius-full);border:1px solid var(--amp-border);font-size:var(--amp-text-sm);font-weight:500;cursor:pointer;transition:all .15s;color:var(--amp-text-secondary);background:var(--amp-surface);font-family:var(--amp-font)}
.len-opt:hover{border-color:var(--amp-border-strong)}
.len-opt.active{background:var(--amp-accent);border-color:var(--amp-accent);color:#fff}
.len-opt.coming{opacity:.4;cursor:not-allowed;position:relative}
.len-opt.coming::after{content:'Soon';font-size:9px;position:absolute;top:-6px;right:-4px;background:var(--amp-amber-50);color:var(--amp-amber-600);padding:0 4px;border-radius:4px;font-weight:600}

@media(max-width:768px){
  .pills{gap:4px}.pill{padding:2px 8px;font-size:10px}
  .ct-grid{grid-template-columns:1fr}
  .flexi-options{grid-template-columns:1fr}
  .slide{padding:70px var(--amp-sp-4) 70px}
  .footer-hint{display:none}
  .goal-grid{flex-direction:column;align-items:stretch}.goal-card{max-width:none}
}
`;

// ═══════════════════════════════════════════════════════════
// STEP HTML GENERATORS
// ═══════════════════════════════════════════════════════════

function step0_GoalAndURL() {
  return `
<div class="entry-inner">
  <div class="repeat-banner" onclick="quickReorder()" style="text-align:left;max-width:500px;margin:0 auto var(--amp-sp-8)">
    <div><div style="font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-text)">↻ Repeat last campaign</div><div style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">Glow Radiance Serum · Ad-Ready Video · AI · ₹15,000</div></div>
    <span style="font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-accent)">Review & Pay →</span>
  </div>
  <div class="ai-badge">✦ Powered by AI</div>
  <h1 class="entry-heading">Get your next ad-ready video</h1>
  <p class="entry-sub">Paste a product URL, Instagram link, or website — we'll set up your entire campaign in seconds.</p>
  <div class="url-bar">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
    <input id="urlInput" placeholder="https://yourproduct.com/product-page" onkeydown="if(event.key==='Enter')startScrape()">
    <button class="get-started" onclick="startScrape()">Get Started</button>
  </div>
  <div class="goal-section">
    <div class="goal-label">What's your campaign goal?</div>
    <div class="goal-grid">
      <div class="goal-card selected" onclick="selectGoal(this,'ads')"><div class="g-icon">🎬</div><div class="g-title">Ad-Ready Videos</div><div class="g-sub">Performance content for paid ads</div></div>
      <div class="goal-card" onclick="selectGoal(this,'influencer')"><div class="g-icon">📱</div><div class="g-title">Influencer Marketing</div><div class="g-sub">Creators post to their audience</div></div>
      <div class="goal-card" onclick="selectGoal(this,'brand')"><div class="g-icon">✨</div><div class="g-title">Brand Content</div><div class="g-sub">Storytelling for brand recall</div></div>
    </div>
  </div>
</div>`;
}

function step1_ProductServices() {
  return `
<div class="heading">Your product details</div>
<div class="sub">We've auto-filled from your URL. Edit anything that's off.</div>
<div id="scrapeArea">
  <div class="scrape-animation" id="scrapeAnim">
    <div class="scrape-step" id="ss1"><span class="spinner"></span> Scanning product page...</div>
    <div class="scrape-step" id="ss2" style="opacity:.3"><span class="check">○</span> Checking Instagram & social profiles</div>
    <div class="scrape-step" id="ss3" style="opacity:.3"><span class="check">○</span> Analyzing marketplace listings (Amazon, Flipkart)</div>
    <div class="scrape-step" id="ss4" style="opacity:.3"><span class="check">○</span> Reading Reddit reviews & Meta Ads library</div>
    <div class="scrape-step" id="ss5" style="opacity:.3"><span class="check">○</span> Generating campaign recommendations</div>
  </div>
  <div id="productCard" style="display:none">
    <div class="amp-card" style="padding:var(--amp-sp-5)">
      <div style="display:flex;gap:var(--amp-sp-4);align-items:flex-start">
        <div style="width:72px;height:72px;border-radius:var(--amp-radius-lg);background:var(--amp-gradient-brand-soft);flex-shrink:0"></div>
        <div style="flex:1">
          <div style="font-size:var(--amp-text-md);font-weight:600">Glow Radiance Serum</div>
          <div style="font-size:var(--amp-text-sm);color:var(--amp-text-muted)">Luminara Beauty · ₹1,299</div>
          <div style="display:flex;gap:var(--amp-sp-2);margin-top:var(--amp-sp-2);flex-wrap:wrap">
            <span class="amp-badge amp-badge-violet">Beauty</span>
            <span class="amp-badge amp-badge-violet">Skincare</span>
          </div>
        </div>
        <span class="amp-badge amp-badge-green">Verified ✓</span>
      </div>
    </div>
    <div style="margin-top:var(--amp-sp-4)">
      <div class="section-title">Shipping required?</div>
      <div style="display:flex;gap:var(--amp-sp-3)">
        <button class="amp-btn amp-btn-primary" id="shipYes" onclick="setShipping(true)" style="flex:1">Yes, physical product</button>
        <button class="amp-btn amp-btn-outline" id="shipNo" onclick="setShipping(false)" style="flex:1">No shipping needed</button>
      </div>
    </div>
    <div class="insight"><span class="icon">💡</span><div class="text">Based on <span class="highlight">2,400 Beauty campaigns</span>, 30s videos outperform 60s by 2.3× for skincare products in the 25-35 demographic.</div></div>
  </div>
</div>`;
}

function step2_ContentType() {
  return `
<div class="heading">How should your content be created?</div>
<div class="sub">Choose the creation method that fits your campaign goal.</div>
<div class="ct-grid">
  <div class="ct-card selected" id="ctAi" onclick="selectContentType('ai')">
    <div class="ct-badge" style="background:var(--amp-accent);color:#fff">✦ AI-Powered</div>
    <div class="ct-title">AI Video</div>
    <div class="ct-price">From ₹2,000/video</div>
    <ul class="ct-pros">
      <li>Instant delivery — ready in hours</li>
      <li>No shipping required</li>
      <li>Unlimited revisions</li>
      <li>Full content ownership</li>
      <li>Cancel anytime, full refund</li>
    </ul>
    <ul class="ct-cons">
      <li>No social proof / audience reach</li>
      <li>24s video length only (more coming soon)</li>
    </ul>
    <div class="ct-cancel">Cancellation: Full refund anytime before delivery</div>
  </div>
  <div class="ct-card" id="ctHuman" onclick="selectContentType('human')">
    <span id="ctHumanBadge" class="ct-coming-soon" style="display:none">Influencer only</span>
    <div class="ct-badge" style="background:var(--amp-green-50);color:var(--amp-green-600)">👤 Human Creator</div>
    <div class="ct-title">Human Creator</div>
    <div class="ct-price">From ₹5,000/creator</div>
    <ul class="ct-pros">
      <li>Authentic social proof</li>
      <li>Posted on creator's profile</li>
      <li>Real audience reach & engagement</li>
      <li>AI-matched for your category</li>
    </ul>
    <ul class="ct-cons">
      <li>7-14 day delivery (shipping time for physical products)</li>
      <li>Creator cancellation risk</li>
      <li>No refund for shipped products</li>
    </ul>
    <div class="ct-cancel">Cancellation: Partial refund. No refund for shipped products.</div>
  </div>
</div>
<div class="insight" id="ctInsight"><span class="icon">💡</span><div class="text">Based on Beauty category, <span class="highlight">73% of brands choose AI Video</span> for ad-ready content. Faster delivery and lower cost per video.</div></div>
<div class="note">⚠ Creators will not travel to physical locations. Location-based campaigns are not supported at this time.</div>`;
}

function step3_CreatorPrefs() {
  return `
<div class="heading">Creator preferences</div>
<div class="sub">We've pre-selected based on your product. Change anything.</div>

<div class="section-title">How famous should creators be?</div>
<div class="section-sub">Fame reflects the brand value and trust a creator's face brings to content.</div>
<div class="flexi-wrap">
  <div class="flexi-default active" id="fameFlexi" onclick="setFlexi('fame')">
    <div class="flexi-title">🎯 I'm flexible</div>
    <div class="flexi-desc">Pay the base price. We'll match the best creators across all tiers.</div>
  </div>
  <button class="flexi-expand" id="fameExpand" onclick="toggleFlexi('fame')">Specific fame level? →</button>
  <div class="flexi-options" id="fameOptions" style="display:none">
    <div class="flexi-opt" onclick="selectFameOpt(this,'micro')"><div class="fo-label">Micro</div><div class="fo-sub">5K-50K followers</div><div class="fo-price">Base price</div></div>
    <div class="flexi-opt" onclick="selectFameOpt(this,'medium')"><div class="fo-label">Medium</div><div class="fo-sub">50K-100K followers</div><div class="fo-price">+₹3,000</div></div>
    <div class="flexi-opt" onclick="selectFameOpt(this,'large')"><div class="fo-label">Large</div><div class="fo-sub">100K-250K followers</div><div class="fo-price">+₹8,000</div></div>
  </div>
</div>

<div style="height:var(--amp-sp-8)"></div>

<div class="section-title">Content quality</div>
<div class="section-sub">Quality is evaluated by our AI based on camera, audio, editing, and storytelling.</div>
<div class="flexi-wrap">
  <div class="flexi-default active" id="qualFlexi" onclick="setFlexi('qual')">
    <div class="flexi-title">🎯 I'm flexible</div>
    <div class="flexi-desc">No additional cost. Match creators across all quality tiers.</div>
  </div>
  <button class="flexi-expand" id="qualExpand" onclick="toggleFlexi('qual')">Specific quality? →</button>
  <div class="flexi-options" id="qualOptions" style="display:none">
    <div class="flexi-opt" onclick="selectQualOpt(this,'regular')"><div class="fo-label">Regular</div><div class="fo-sub">Authentic content</div><div class="fo-price">No extra cost</div></div>
    <div class="flexi-opt" onclick="selectQualOpt(this,'premium')"><div class="fo-label">Premium</div><div class="fo-sub">Better lighting & editing</div><div class="fo-price">+₹5,000</div></div>
    <div class="flexi-opt" onclick="selectQualOpt(this,'ultra')"><div class="fo-label">Ultra Premium</div><div class="fo-sub">Studio-quality</div><div class="fo-price">+₹18,000</div></div>
  </div>
</div>`;
}

function step4_ContentBrief() {
  return `
<div class="heading">Content brief</div>
<div class="sub">We've pre-filled based on your product scan. Adjust anything.</div>

<div class="section-title">Target audience</div>
<div id="audienceTags" style="display:flex;flex-wrap:wrap;gap:var(--amp-sp-2);margin-bottom:var(--amp-sp-2)">
  <span class="amp-chip active" onclick="this.remove()">Women 25-35 ×</span>
  <span class="amp-chip active" onclick="this.remove()">Skincare enthusiasts ×</span>
  <span class="amp-chip active" onclick="this.remove()">Urban India ×</span>
</div>
<div style="display:flex;gap:var(--amp-sp-2)"><input class="amp-input" placeholder="Add audience..." id="newAud" style="flex:1"><button class="amp-btn amp-btn-secondary" onclick="addChip('audienceTags',document.getElementById('newAud'))">Add</button></div>

<div style="height:var(--amp-sp-6)"></div>
<div class="section-title">Language</div>
<div style="display:flex;gap:var(--amp-sp-2);flex-wrap:wrap">
  <span class="amp-chip active" onclick="selectLength(this)">Hindi</span>
  <span class="amp-chip" onclick="selectLength(this)">English</span>
  <span class="amp-chip" onclick="selectLength(this)">Hinglish</span>
  <span class="amp-chip" onclick="selectLength(this)">Tamil</span>
  <span class="amp-chip" onclick="selectLength(this)">Telugu</span>
</div>

<div style="height:var(--amp-sp-6)"></div>
<div class="section-title">Video length</div>
<div id="lenHuman" class="len-grid">
  <span class="len-opt active" onclick="selectLen(this)">15s</span>
  <span class="len-opt" onclick="selectLen(this)">30s</span>
  <span class="len-opt" onclick="selectLen(this)">45s</span>
  <span class="len-opt" onclick="selectLen(this)">60s</span>
  <span class="len-opt" onclick="selectLen(this)">3 min</span>
</div>
<div id="lenAI" class="len-grid" style="display:none">
  <span class="len-opt active">24s</span>
  <span class="len-opt coming">10s</span>
  <span class="len-opt coming">15s</span>
  <span class="len-opt coming">30s</span>
</div>

<div class="insight" style="margin-top:var(--amp-sp-5)"><span class="icon">💡</span><div class="text">For skincare audiences 25-35, <span class="highlight">Hindi + English mix gets 34% more engagement</span> than single-language content.</div></div>`;
}

function step5_Scripts() {
  return `
<div class="heading">Script preview</div>
<div class="sub">AI-generated from your brief. Scripts can be fully edited after payment.</div>

<div style="display:flex;gap:var(--amp-sp-3);margin-bottom:var(--amp-sp-5)">
  <button class="amp-btn amp-btn-primary" id="tabAiScripts" onclick="switchScriptTab('ai')">✦ AI Scripts</button>
  <button class="amp-btn amp-btn-outline" id="tabCustom" onclick="switchScriptTab('custom')">Custom Scripts</button>
</div>

<div id="aiScriptsPanel">
  <div class="script-card">
    <div class="script-label"><span class="script-concept">Problem → Solution</span><span class="script-dur">24s · 9:16</span></div>
    <div class="script-section"><div class="script-section-label">Hook (0-3s)</div><div class="script-section-text">"Tired of dull skin? I tried everything..."</div></div>
    <div class="script-section"><div class="script-section-label">Body (3-20s)</div><div class="script-section-text">"Until I found this serum. Within a week, my skin was literally glowing. The Vitamin C + Hyaluronic Acid combo absorbs in seconds."</div></div>
    <div class="script-section"><div class="script-section-label">CTA (20-24s)</div><div class="script-section-text">"Link in bio — your glow-up starts today."</div></div>
  </div>
  <div class="script-card">
    <div class="script-label"><span class="script-concept">Day 1 vs Day 7</span><span class="script-dur">24s · 9:16</span></div>
    <div class="script-section"><div class="script-section-label">Hook (0-3s)</div><div class="script-section-text">"POV: You finally find a serum that works."</div></div>
    <div class="script-section"><div class="script-section-label">Body (3-20s)</div><div class="script-section-text">"Day 1 — skeptical but hopeful. Day 3 — is that... a glow? Day 7 — my skin has never looked this good. ₹1,299 well spent."</div></div>
    <div class="script-section"><div class="script-section-label">CTA (20-24s)</div><div class="script-section-text">"Don't just take my word for it — try it yourself."</div></div>
  </div>
  <div class="note">Scripts use a proven <strong>Hook → Body → CTA</strong> framework optimized from 12,000+ campaigns. These are samples — you can fully edit or replace them after payment.</div>
</div>
<div id="customScriptsPanel" style="display:none">
  <div class="amp-card" style="padding:var(--amp-sp-5)">
    <div class="section-title">Write your own scripts</div>
    <textarea class="amp-input" placeholder="Paste or write your script here. Use the Hook → Body → CTA structure for best results." style="min-height:120px"></textarea>
    <div class="note" style="margin-top:var(--amp-sp-2)">You can also upload scripts after payment in the campaign manager.</div>
  </div>
</div>

<div style="height:var(--amp-sp-5)"></div>
<div class="section-title">Talking points</div>
<div id="talkingPts" style="display:flex;flex-wrap:wrap;gap:var(--amp-sp-2);margin-bottom:var(--amp-sp-2)">
  <span class="amp-chip active" onclick="this.remove()">Lightweight formula ×</span>
  <span class="amp-chip active" onclick="this.remove()">Visible glow in 7 days ×</span>
  <span class="amp-chip active" onclick="this.remove()">Vitamin C + Hyaluronic Acid ×</span>
</div>
<div style="display:flex;gap:var(--amp-sp-2)"><input class="amp-input" placeholder="Add talking point..." id="newTP" style="flex:1"><button class="amp-btn amp-btn-secondary" onclick="addChip('talkingPts',document.getElementById('newTP'))">Add</button></div>`;
}

function step6_Budget() {
  return `
<div id="budgetHuman">
  <div class="heading">Campaign size</div>
  <div class="sub">Set your budget or choose how many content pieces you want.</div>
  <div class="amp-card" style="padding:var(--amp-sp-5);text-align:center;margin-bottom:var(--amp-sp-5)">
    <div style="font-size:var(--amp-text-2xl);font-weight:800;color:var(--amp-accent)" id="contentPieces">5 content pieces</div>
    <div style="font-size:var(--amp-text-sm);color:var(--amp-text-muted)" id="totalCost">₹32,500 total (excl. GST)</div>
  </div>
  <div class="amp-tabs" style="margin-bottom:var(--amp-sp-4)">
    <button class="amp-tab active" onclick="setBudgetMode(this,'budget')">Set by budget</button>
    <button class="amp-tab" onclick="setBudgetMode(this,'pieces')">Set by pieces</button>
  </div>
  <div id="budgetSlider">
    <div style="display:flex;justify-content:space-between;margin-bottom:var(--amp-sp-1)"><span style="font-size:var(--amp-text-sm);color:var(--amp-text-muted)">Budget (excl. GST)</span><span style="font-size:var(--amp-text-xl);font-weight:700;color:var(--amp-accent)" id="budgetDisplay">₹30,000</span></div>
    <input type="range" min="5000" max="250000" value="30000" step="5000" oninput="updateBudget(this.value)">
    <div class="amp-slider-marks"><span>₹5K</span><span>₹25K</span><span>₹50K</span><span>₹1L</span><span>₹2.5L</span></div>
  </div>
</div>
<div id="budgetAI" style="display:none">
  <div class="heading">Choose your AI video package</div>
  <div class="sub">Select the package that fits your campaign goals.</div>
  <div class="pkg-grid">
    <div class="pkg-card selected" onclick="selectPkg(this,'starter')"><div><div class="pkg-name">Starter</div><div class="pkg-details">3 videos · 24s · 3-month rights · ₹2,000/video</div></div><div class="pkg-price">₹6,000</div></div>
    <div class="pkg-card" onclick="selectPkg(this,'growth')"><div><div class="pkg-name">Growth</div><div class="pkg-details">8 videos · 24s · 3-month rights · ₹1,750/video</div></div><div class="pkg-price">₹14,000</div></div>
    <div class="pkg-card" onclick="selectPkg(this,'scale')"><div><div class="pkg-name">Scale</div><div class="pkg-details">15 videos · 24s · 6-month rights · ₹1,500/video</div></div><div class="pkg-price">₹22,500</div></div>
  </div>
</div>
<div class="wallet"><div class="wallet-row"><div><div class="wallet-label">OI Money Balance</div><div class="wallet-note">Auto-applied at checkout</div></div><div class="wallet-amount">₹12,400</div></div><div class="wallet-bar"><div class="wallet-fill" style="width:41%"></div></div><div class="wallet-note" style="margin-top:var(--amp-sp-3)">💰 Add ₹17,600 to wallet and save 5% on future campaigns</div></div>`;
}

function step7_Summary() {
  return `
<div class="heading">Review & place order</div>
<div class="sub">Verify your campaign details before payment.</div>
<div class="amp-two-col">
  <div>
    <div class="amp-card" style="padding:var(--amp-sp-5)">
      <div style="padding:var(--amp-sp-3) 0;border-bottom:1px solid var(--amp-stone-100)">
        <div style="display:flex;justify-content:space-between"><div class="section-title">Goal & Product</div><span style="font-size:var(--amp-text-xs);color:var(--amp-accent);cursor:pointer" onclick="goToStep(0)">Change</span></div>
        <div style="display:flex;gap:var(--amp-sp-3);align-items:center;margin-top:var(--amp-sp-2)"><div style="width:40px;height:40px;border-radius:var(--amp-radius-md);background:var(--amp-gradient-brand-soft);flex-shrink:0"></div><div><div style="font-weight:600;font-size:var(--amp-text-sm)">Glow Radiance Serum</div><div style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">Ad-Ready Videos · Luminara Beauty</div></div></div>
      </div>
      <div style="padding:var(--amp-sp-3) 0;border-bottom:1px solid var(--amp-stone-100)">
        <div style="display:flex;justify-content:space-between"><div class="section-title">Content Type</div><span style="font-size:var(--amp-text-xs);color:var(--amp-accent);cursor:pointer" onclick="goToStep(2)">Change</span></div>
        <div style="font-size:var(--amp-text-sm);color:var(--amp-text-secondary)" id="summaryContentType">AI Video</div>
      </div>
      <div style="padding:var(--amp-sp-3) 0;border-bottom:1px solid var(--amp-stone-100)">
        <div style="display:flex;justify-content:space-between"><div class="section-title">Brief</div><span style="font-size:var(--amp-text-xs);color:var(--amp-accent);cursor:pointer" onclick="goToStep(4)">Change</span></div>
        <div style="font-size:var(--amp-text-sm);color:var(--amp-text-secondary)">Hindi · 24s · Women 25-35 · Skincare enthusiasts</div>
      </div>
      <div style="padding:var(--amp-sp-3) 0">
        <div style="display:flex;justify-content:space-between"><div class="section-title">Scripts</div><span style="font-size:var(--amp-text-xs);color:var(--amp-accent);cursor:pointer" onclick="goToStep(5)">Change</span></div>
        <div style="font-size:var(--amp-text-sm);color:var(--amp-text-secondary)">2 AI scripts · Hook → Body → CTA</div>
      </div>
    </div>
  </div>
  <div>
    <div class="amp-card" style="padding:var(--amp-sp-5);position:sticky;top:80px">
      <div style="font-size:var(--amp-text-md);font-weight:600;margin-bottom:var(--amp-sp-4)">Order summary</div>
      <div style="display:flex;flex-direction:column;gap:var(--amp-sp-2)">
        <div class="amp-price-row"><span>Package</span><span style="font-weight:500;color:var(--amp-text)">Starter · 3 videos</span></div>
        <div class="amp-price-row"><span>Subtotal</span><span>₹6,000</span></div>
        <div class="amp-price-row"><span>Tax (18%)</span><span>₹1,080</span></div>
        <div class="amp-price-row amp-price-total"><span>Total</span><span>₹7,080</span></div>
        <div class="amp-price-row amp-price-credit"><span>OI Money</span><span>−₹7,080</span></div>
        <div class="amp-price-row amp-price-due"><span>Amount Due</span><span style="color:var(--amp-green-600)">₹0 — Covered ✓</span></div>
      </div>
      <button class="amp-btn amp-btn-primary amp-btn-lg amp-btn-full" style="margin-top:var(--amp-sp-5)" onclick="placeOrder()">Place Order — Covered by OI Money ✓</button>
      <p style="text-align:center;font-size:11px;color:var(--amp-stone-400);margin-top:var(--amp-sp-2)">🔒 Secured by Razorpay</p>
    </div>
  </div>
</div>`;
}

function successModal() {
  return `<div class="amp-modal-bg" id="successModal"><div class="amp-modal" style="text-align:center"><svg class="amp-success-check" viewBox="0 0 72 72"><circle cx="36" cy="36" r="32"/><path d="M22 36 l10 10 l18 -20"/></svg><div class="heading" style="margin-bottom:var(--amp-sp-2)">Campaign Created!</div><p style="color:var(--amp-text-muted);margin-bottom:var(--amp-sp-5)">Your AI videos will be ready within hours.</p><button class="amp-btn amp-btn-primary amp-btn-lg amp-btn-full">View Campaign Dashboard</button></div></div>`;
}

// ═══════════════════════════════════════════════════════════
// JAVASCRIPT
// ═══════════════════════════════════════════════════════════
const interactivityJS = `
var cur = 0, totalSteps = 8, contentType = 'ai', selectedGoal = 'ads';
var stepOrder = [0,1,2,3,4,5,6,7]; // Human: all 8. AI: skip 3.
var pillLabels = ['Product','Content Type','Creators','Brief','Scripts','Budget','Checkout'];

function updateStepOrder() {
  if (contentType === 'ai') {
    stepOrder = [0,1,2,4,5,6,7]; // Skip step 3 (creator prefs)
  } else {
    stepOrder = [0,1,2,3,4,5,6,7];
  }
  // Update pill visibility
  var pills = document.querySelectorAll('.pill');
  pills.forEach(function(p,i) {
    if (contentType === 'ai' && i === 2) { p.classList.add('skip'); } // Hide "Creators" pill
    else { p.classList.remove('skip'); }
  });
}

function goToStep(step) {
  var prev = document.getElementById('step' + cur);
  var next = document.getElementById('step' + step);
  if (!prev || !next) return;
  prev.classList.add('exiting'); prev.classList.remove('active');
  setTimeout(function() { prev.classList.remove('exiting'); }, 350);
  setTimeout(function() { next.classList.add('active'); }, 50);
  cur = step;

  // Progress bar
  var visibleIdx = stepOrder.indexOf(step);
  var pct = visibleIdx <= 0 ? 0 : (visibleIdx / (stepOrder.length - 1)) * 100;
  document.getElementById('progressFill').style.width = pct + '%';

  // Topbar + footer visibility
  document.getElementById('topbar').className = step === 0 ? 'topbar hidden' : 'topbar';
  document.getElementById('footer').className = step === 0 ? 'footer hidden' : 'footer';

  // Update pills
  document.querySelectorAll('.pill').forEach(function(p, i) {
    var pillStep = i + 1;
    p.classList.remove('active','done');
    if (pillStep < step && pillStep !== 0) p.classList.add('done');
    else if (pillStep === step) p.classList.add('active');
  });

  // Back button
  var backBtn = document.getElementById('backBtn');
  backBtn.style.opacity = step > 0 ? '1' : '0';
  backBtn.style.pointerEvents = step > 0 ? 'auto' : 'none';

  // Next button text
  var nextBtn = document.getElementById('nextBtn');
  if (step === 7) { nextBtn.style.display = 'none'; }
  else { nextBtn.style.display = ''; nextBtn.textContent = 'Save & Continue →'; }

  // Show/hide AI vs Human content
  if (step === 4) { // Content brief
    document.getElementById('lenHuman').style.display = contentType === 'human' ? 'flex' : 'none';
    document.getElementById('lenAI').style.display = contentType === 'ai' ? 'flex' : 'none';
  }
  if (step === 6) { // Budget
    document.getElementById('budgetHuman').style.display = contentType === 'human' ? 'block' : 'none';
    document.getElementById('budgetAI').style.display = contentType === 'ai' ? 'block' : 'none';
  }
}

function nextStep() {
  var currentIdx = stepOrder.indexOf(cur);
  if (currentIdx < stepOrder.length - 1) goToStep(stepOrder[currentIdx + 1]);
}
function prevStep() {
  var currentIdx = stepOrder.indexOf(cur);
  if (currentIdx > 0) goToStep(stepOrder[currentIdx - 1]);
}

// Step 0: Goal & URL
function selectGoal(el, id) {
  document.querySelectorAll('.goal-card').forEach(function(c) { c.classList.remove('selected'); });
  el.classList.add('selected');
  selectedGoal = id;
  // Update content type availability
  if (id === 'influencer') {
    document.getElementById('ctAi').classList.add('disabled');
    document.getElementById('ctHumanBadge').style.display = 'none';
    document.getElementById('ctHuman').classList.add('selected');
    document.getElementById('ctAi').classList.remove('selected');
    contentType = 'human';
    updateStepOrder();
  } else {
    document.getElementById('ctAi').classList.remove('disabled');
  }
}

function startScrape() {
  var input = document.getElementById('urlInput');
  if (!input.value) input.value = 'https://luminara.com/glow-radiance-serum';
  goToStep(1);
  // Animate scrape
  var steps = ['ss1','ss2','ss3','ss4','ss5'];
  var i = 0;
  var interval = setInterval(function() {
    if (i > 0) {
      var prev = document.getElementById(steps[i-1]);
      prev.querySelector('.spinner')?.remove();
      prev.innerHTML = '<span class="check">✓</span> ' + prev.textContent.trim();
      prev.style.opacity = '1';
      prev.style.color = 'var(--amp-green-600)';
    }
    if (i < steps.length) {
      var el = document.getElementById(steps[i]);
      el.style.opacity = '1';
      if (i < steps.length - 1) {
        var next = document.getElementById(steps[i+1]);
        if (next) next.style.opacity = '.5';
      }
    }
    i++;
    if (i > steps.length) {
      clearInterval(interval);
      document.getElementById('scrapeAnim').style.display = 'none';
      document.getElementById('productCard').style.display = 'block';
    }
  }, 700);
}

function quickReorder() { goToStep(7); }

// Step 1: Shipping
function setShipping(yes) {
  document.getElementById('shipYes').className = yes ? 'amp-btn amp-btn-primary' : 'amp-btn amp-btn-outline';
  document.getElementById('shipNo').className = yes ? 'amp-btn amp-btn-outline' : 'amp-btn amp-btn-primary';
}

// Step 2: Content type
function selectContentType(type) {
  if (selectedGoal === 'influencer' && type === 'ai') return;
  contentType = type;
  document.getElementById('ctAi').classList.toggle('selected', type === 'ai');
  document.getElementById('ctHuman').classList.toggle('selected', type === 'human');
  updateStepOrder();
  // Update summary
  document.getElementById('summaryContentType').textContent = type === 'ai' ? 'AI Video' : 'Human Creator';
}

// Step 3: FlexiSelector
function setFlexi(type) {
  var opts = document.getElementById(type + 'Options');
  opts.style.display = 'none';
  var flexi = document.getElementById(type + 'Flexi');
  flexi.classList.add('active');
  opts.querySelectorAll('.flexi-opt').forEach(function(o) { o.classList.remove('selected'); });
}
function toggleFlexi(type) {
  var opts = document.getElementById(type + 'Options');
  var flexi = document.getElementById(type + 'Flexi');
  if (opts.style.display === 'none') { opts.style.display = 'grid'; flexi.classList.remove('active'); }
  else { opts.style.display = 'none'; flexi.classList.add('active'); }
}
function selectFameOpt(el, val) { el.parentElement.querySelectorAll('.flexi-opt').forEach(function(o){o.classList.remove('selected')});el.classList.add('selected');document.getElementById('fameFlexi').classList.remove('active'); }
function selectQualOpt(el, val) { el.parentElement.querySelectorAll('.flexi-opt').forEach(function(o){o.classList.remove('selected')});el.classList.add('selected');document.getElementById('qualFlexi').classList.remove('active'); }

// Step 4: Chips & length
function addChip(containerId, input) {
  if (!input || !input.value.trim()) return;
  var container = document.getElementById(containerId);
  var span = document.createElement('span');
  span.className = 'amp-chip active';
  span.textContent = input.value.trim() + ' ×';
  span.onclick = function() { this.remove(); };
  container.appendChild(span);
  input.value = '';
}
function selectLength(el) { el.parentElement.querySelectorAll('.amp-chip').forEach(function(c){c.classList.remove('active')});el.classList.add('active'); }
function selectLen(el) { el.parentElement.querySelectorAll('.len-opt:not(.coming)').forEach(function(l){l.classList.remove('active')});el.classList.add('active'); }

// Step 5: Script tabs
function switchScriptTab(tab) {
  document.getElementById('aiScriptsPanel').style.display = tab === 'ai' ? 'block' : 'none';
  document.getElementById('customScriptsPanel').style.display = tab === 'custom' ? 'block' : 'none';
  document.getElementById('tabAiScripts').className = tab === 'ai' ? 'amp-btn amp-btn-primary' : 'amp-btn amp-btn-outline';
  document.getElementById('tabCustom').className = tab === 'custom' ? 'amp-btn amp-btn-primary' : 'amp-btn amp-btn-outline';
}

// Step 6: Budget
function updateBudget(val) {
  var display = val >= 100000 ? '₹' + (val/100000).toFixed(1).replace('.0','') + 'L' : '₹' + Number(val).toLocaleString('en-IN');
  document.getElementById('budgetDisplay').textContent = display;
  var pieces = Math.max(1, Math.round(val / 6500));
  document.getElementById('contentPieces').textContent = pieces + ' content piece' + (pieces !== 1 ? 's' : '');
  document.getElementById('totalCost').textContent = display + ' total (excl. GST)';
}
function setBudgetMode(el, mode) {
  el.parentElement.querySelectorAll('.amp-tab').forEach(function(t){t.classList.remove('active')});
  el.classList.add('active');
}
function selectPkg(el, pkg) {
  el.parentElement.querySelectorAll('.pkg-card').forEach(function(c){c.classList.remove('selected')});
  el.classList.add('selected');
}

// Step 7: Payment tabs & order
function switchTab(el, idx) {
  el.parentElement.querySelectorAll('.amp-tab').forEach(function(t){t.classList.remove('active')});
  el.classList.add('active');
  for (var i = 0; i < 3; i++) { var tab = document.getElementById('payTab'+i); if (tab) tab.style.display = i === idx ? 'block' : 'none'; }
}
function placeOrder() { document.getElementById('successModal').classList.add('show'); }

// Navigation
document.getElementById('nextBtn').onclick = nextStep;
document.getElementById('backBtn').onclick = prevStep;
document.addEventListener('keydown', function(e) {
  if (e.target.matches('input,textarea,select')) return;
  if (e.key === 'Enter') nextStep();
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); nextStep(); }
  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); prevStep(); }
  var n = parseInt(e.key);
  if (n >= 0 && n <= 7) goToStep(n);
});
updateStepOrder();
`;

// ═══════════════════════════════════════════════════════════
// ASSEMBLE HTML
// ═══════════════════════════════════════════════════════════
function buildHTML(dark) {
  const title = 'Amplify — New Campaign' + (dark ? ' (Dark)' : '');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
${lightTokens}
${darkOverride}
${baseCSS}
${layoutCSS}
</style>
</head>
<body${dark ? ' class="dark"' : ''}>

<div class="progress"><div class="progress-fill" id="progressFill"></div></div>

<div class="topbar hidden" id="topbar"><div class="topbar-inner">
  <div class="amp-logo">amplify</div>
  <div class="pills">
    <div class="pill" onclick="goToStep(1)">Product</div>
    <div class="pill" onclick="goToStep(2)">Content Type</div>
    <div class="pill" onclick="goToStep(3)">Creators</div>
    <div class="pill" onclick="goToStep(4)">Brief</div>
    <div class="pill" onclick="goToStep(5)">Scripts</div>
    <div class="pill" onclick="goToStep(6)">Budget</div>
    <div class="pill" onclick="goToStep(7)">Checkout</div>
  </div>
</div></div>

<div class="slide entry-slide active" id="step0">${step0_GoalAndURL()}</div>
<div class="slide" id="step1"><div class="slide-content">${step1_ProductServices()}</div></div>
<div class="slide" id="step2"><div class="slide-content">${step2_ContentType()}</div></div>
<div class="slide" id="step3"><div class="slide-content">${step3_CreatorPrefs()}</div></div>
<div class="slide" id="step4"><div class="slide-content">${step4_ContentBrief()}</div></div>
<div class="slide" id="step5"><div class="slide-content">${step5_Scripts()}</div></div>
<div class="slide" id="step6"><div class="slide-content">${step6_Budget()}</div></div>
<div class="slide" id="step7"><div class="slide-content">${step7_Summary()}</div></div>

${successModal()}

<div class="footer hidden" id="footer">
  <div class="footer-hint"><kbd>Enter</kbd> Continue · <kbd>↑</kbd><kbd>↓</kbd> Navigate · <kbd>0</kbd>-<kbd>7</kbd> Jump</div>
  <div style="display:flex;gap:var(--amp-sp-2)">
    <button class="amp-btn amp-btn-text" id="backBtn" style="opacity:0;pointer-events:none">← Back</button>
    <button class="amp-btn amp-btn-primary amp-btn-lg" id="nextBtn">Save & Continue →</button>
  </div>
</div>

<script>
${interactivityJS}
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
  ['final-ordering-light.html', buildHTML(false)],
  ['final-ordering-dark.html', buildHTML(true)],
];

for (const [name, html] of builds) {
  const fp = path.join(outDir, name);
  fs.writeFileSync(fp, html);
  const onclicks = (html.match(/onclick/gi) || []).length;
  const fns = (html.match(/function /g) || []).length;
  console.log(`  ✓ ${name.padEnd(30)} ${(html.length/1024).toFixed(1).padStart(6)}KB | onclick:${String(onclicks).padStart(2)} | fn:${fns}`);
}
console.log(`\nDone in ${Date.now() - start}ms — ${outDir}`);
