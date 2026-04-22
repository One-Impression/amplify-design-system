#!/usr/bin/env node
/**
 * DEFINITIVE Ordering Flow — Final Design
 * 7 steps (0-6), all decisions finalized.
 * Light + Dark = 2 HTML files.
 */
const fs = require('fs');
const path = require('path');
const os = require('os');

const baseCSSFile = fs.readFileSync(path.join(__dirname, 'packages/templates/src/base-css.ts'), 'utf-8');
const baseCSS = baseCSSFile.match(/return `([\s\S]*?)`;/)?.[1] || '';

const tokens = `:root{--amp-violet-50:#F5F0FF;--amp-violet-100:#EDEAFC;--amp-violet-200:#DBD2F6;--amp-violet-300:#C4B5FD;--amp-violet-400:#9B6BFF;--amp-violet-500:#7C5CFF;--amp-violet-600:#6531FF;--amp-violet-700:#752AD4;--amp-violet-800:#4A1FA8;--amp-violet-900:#3B1785;--amp-stone-50:#f8f9fd;--amp-stone-100:#f1f6fe;--amp-stone-200:#d0d1d3;--amp-stone-300:#b8bcc0;--amp-stone-400:#8e939b;--amp-stone-500:#6b7280;--amp-stone-600:#4b5563;--amp-stone-700:#374151;--amp-stone-800:#1f2937;--amp-stone-900:#1D252D;--amp-green-50:#E8FAF3;--amp-green-600:#21C179;--amp-amber-50:#fff8e1;--amp-amber-600:#ffc107;--amp-red-50:#FFEBEF;--amp-red-600:#fd5154;--amp-bg:#f8f9fd;--amp-surface:#ffffff;--amp-surface-overlay:rgba(29,37,45,0.07);--amp-text:#1D252D;--amp-text-secondary:rgba(29,37,45,0.58);--amp-text-muted:#6b7280;--amp-border:rgba(29,37,45,0.08);--amp-border-strong:rgba(29,37,45,0.16);--amp-border-brand:#DBD2F6;--amp-accent:#6531FF;--amp-accent-hover:#752AD4;--amp-accent-light:#EDEAFC;--amp-sp-1:4px;--amp-sp-2:8px;--amp-sp-3:12px;--amp-sp-4:16px;--amp-sp-5:20px;--amp-sp-6:24px;--amp-sp-8:32px;--amp-sp-10:40px;--amp-radius-sm:4px;--amp-radius-md:8px;--amp-radius-lg:12px;--amp-radius-xl:16px;--amp-radius-2xl:24px;--amp-radius-full:9999px;--amp-shadow-sm:0 1px 3px rgba(28,25,23,0.04);--amp-shadow-md:0 2px 8px rgba(28,25,23,0.06);--amp-shadow-lg:0 8px 24px rgba(28,25,23,0.08);--amp-shadow-brand:0 4px 20px rgba(101,49,255,0.24);--amp-gradient-brand:linear-gradient(96deg,#F55DC1 3.78%,#495AF4 97.89%);--amp-gradient-brand-soft:linear-gradient(135deg,#6531ff 0%,#9b6bff 100%);--amp-font:'Inter',system-ui,-apple-system,sans-serif;--amp-text-xs:11px;--amp-text-sm:13px;--amp-text-base:14px;--amp-text-md:15px;--amp-text-lg:18px;--amp-text-xl:24px;--amp-text-2xl:32px;--amp-transition:150ms ease}`;
const dark = `body.dark{--amp-bg:#0c0c12;--amp-surface:#161620;--amp-surface-overlay:rgba(255,255,255,0.06);--amp-text:#ededf2;--amp-text-secondary:rgba(237,237,242,0.62);--amp-text-muted:rgba(237,237,242,0.38);--amp-border:rgba(255,255,255,0.08);--amp-border-strong:rgba(255,255,255,0.14);--amp-border-brand:rgba(101,49,255,0.3);--amp-accent:#7C5CFF;--amp-accent-hover:#9B6BFF;--amp-accent-light:rgba(101,49,255,0.15);--amp-stone-50:#1a1a24;--amp-stone-100:#22222e;--amp-stone-200:#2e2e3a;--amp-stone-300:#3a3a48;--amp-stone-400:#5a5a68;--amp-stone-500:#7a7a88;--amp-stone-600:#9a9aa8;--amp-stone-700:#babac8;--amp-green-50:rgba(33,193,121,0.12);--amp-green-600:#34d98c;--amp-amber-50:rgba(255,193,7,0.12);--amp-amber-600:#ffd54f;--amp-red-50:rgba(253,81,84,0.12);--amp-red-600:#ff7a7c;--amp-shadow-sm:0 1px 3px rgba(0,0,0,.3);--amp-shadow-md:0 2px 8px rgba(0,0,0,.4);--amp-shadow-lg:0 8px 24px rgba(0,0,0,.5);--amp-shadow-brand:0 4px 20px rgba(124,92,255,.35);--amp-gradient-brand-soft:linear-gradient(135deg,#7C5CFF 0%,#b794ff 100%)}`;

const css = `
.progress{position:fixed;top:0;left:0;right:0;height:3px;background:var(--amp-stone-200);z-index:300}.progress-fill{height:100%;background:var(--amp-gradient-brand-soft);transition:width .4s;width:0}
.topbar{position:fixed;top:3px;left:0;right:0;z-index:200;background:rgba(248,249,253,.92);backdrop-filter:blur(12px);border-bottom:1px solid var(--amp-border);padding:var(--amp-sp-3) var(--amp-sp-6)}body.dark .topbar{background:rgba(12,12,18,.92)}.topbar-inner{max-width:820px;margin:0 auto;display:flex;align-items:center;justify-content:space-between}.topbar.hidden{display:none}
.pills{display:flex;gap:var(--amp-sp-2);flex-wrap:wrap}.pill{display:flex;align-items:center;gap:4px;padding:var(--amp-sp-1) var(--amp-sp-3);border-radius:var(--amp-radius-full);font-size:var(--amp-text-xs);font-weight:500;cursor:pointer;transition:all .2s;border:1px solid var(--amp-border);color:var(--amp-text-muted);background:transparent;font-family:var(--amp-font)}.pill.active{background:var(--amp-accent);border-color:var(--amp-accent);color:#fff;font-weight:600}.pill.done{background:var(--amp-green-50);border-color:var(--amp-green-600);color:var(--amp-green-600)}
.slide{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;padding:80px var(--amp-sp-6) 100px;opacity:0;pointer-events:none;transition:all .35s ease;transform:translateY(30px);overflow-y:auto}.slide.active{opacity:1;pointer-events:auto;transform:translateY(0)}.slide.exiting{opacity:0;transform:translateY(-30px)}.slide-c{width:100%;max-width:820px;margin:0 auto}
.slide.entry{padding:0;align-items:center}.entry-inner{text-align:center;max-width:680px;margin:0 auto;padding:var(--amp-sp-10) var(--amp-sp-6)}
.ai-badge{display:inline-flex;align-items:center;gap:6px;padding:6px 16px;border-radius:var(--amp-radius-full);background:var(--amp-accent);color:#fff;font-size:var(--amp-text-sm);font-weight:600;margin-bottom:var(--amp-sp-6)}
.entry-h{font-size:clamp(28px,5vw,48px);font-weight:800;color:var(--amp-text);line-height:1.1;letter-spacing:-.03em;margin-bottom:var(--amp-sp-3)}
.entry-sub{font-size:var(--amp-text-md);color:var(--amp-text-muted);margin-bottom:var(--amp-sp-8);line-height:1.5}
.url-bar{display:flex;align-items:center;gap:var(--amp-sp-2);background:var(--amp-surface);border:1px solid var(--amp-border);border-radius:var(--amp-radius-2xl);padding:6px 6px 6px 16px;box-shadow:var(--amp-shadow-lg);max-width:600px;margin:0 auto var(--amp-sp-8)}.url-bar svg{color:var(--amp-stone-400);flex-shrink:0}.url-bar input{flex:1;border:none;outline:none;font-size:var(--amp-text-base);font-family:var(--amp-font);color:var(--amp-text);background:transparent}.url-bar input::placeholder{color:var(--amp-stone-400)}.url-bar .gs{height:40px;padding:0 20px;border-radius:var(--amp-radius-xl);background:var(--amp-accent);color:#fff;border:none;font-weight:600;font-size:var(--amp-text-base);cursor:pointer;font-family:var(--amp-font);transition:background .15s;white-space:nowrap}.url-bar .gs:hover{background:var(--amp-accent-hover)}
.goal-label{font-size:var(--amp-text-sm);color:var(--amp-text-muted);margin-bottom:var(--amp-sp-4)}
.goal-grid{display:flex;gap:var(--amp-sp-4);justify-content:center;flex-wrap:wrap}
.goal-group{display:flex;gap:var(--amp-sp-3);flex:1}
.goal-divider{width:1px;background:var(--amp-border);margin:0 var(--amp-sp-2);flex-shrink:0}
.gc{background:var(--amp-surface);border:1px solid var(--amp-border);border-radius:var(--amp-radius-xl);padding:var(--amp-sp-5);cursor:pointer;transition:all .2s;text-align:center;flex:1;min-width:160px}.gc:hover{box-shadow:var(--amp-shadow-lg)}.gc.selected{border-color:var(--amp-accent);background:var(--amp-accent-light);box-shadow:var(--amp-shadow-brand)}.gc .gi{font-size:28px;margin-bottom:var(--amp-sp-2)}.gc .gt{font-size:var(--amp-text-md);font-weight:600;color:var(--amp-text)}.gc .gs2{font-size:var(--amp-text-xs);color:var(--amp-text-muted);margin-top:var(--amp-sp-1)}.gc .gtag{display:inline-block;padding:1px 6px;border-radius:4px;font-size:9px;font-weight:600;margin-top:var(--amp-sp-2)}
.repeat{background:var(--amp-accent-light);border:1px solid var(--amp-border-brand);border-radius:var(--amp-radius-xl);padding:var(--amp-sp-4) var(--amp-sp-5);margin-bottom:var(--amp-sp-6);display:flex;align-items:center;justify-content:space-between;cursor:pointer;transition:all .2s;max-width:500px;margin-left:auto;margin-right:auto;text-align:left}.repeat:hover{box-shadow:var(--amp-shadow-brand)}
.heading{font-size:var(--amp-text-2xl);font-weight:700;color:var(--amp-text);line-height:1.2;letter-spacing:-.02em;margin-bottom:var(--amp-sp-2)}.sub{font-size:var(--amp-text-md);color:var(--amp-text-muted);margin-bottom:var(--amp-sp-5);line-height:1.5}
.scrape-step{display:flex;align-items:center;gap:var(--amp-sp-3);padding:var(--amp-sp-2) 0;font-size:var(--amp-text-sm);color:var(--amp-text-secondary)}.scrape-step .ck{color:var(--amp-green-600);font-weight:700;width:20px;text-align:center}.scrape-step .sp{width:16px;height:16px;border:2px solid var(--amp-stone-200);border-top-color:var(--amp-accent);border-radius:var(--amp-radius-full);animation:spin .6s linear infinite;margin:0 2px}@keyframes spin{to{transform:rotate(360deg)}}
.insight{display:flex;align-items:flex-start;gap:var(--amp-sp-3);padding:var(--amp-sp-4);background:var(--amp-accent-light);border-radius:var(--amp-radius-lg);margin-top:var(--amp-sp-5);border:1px solid var(--amp-border-brand)}.insight .ic{font-size:16px;flex-shrink:0}.insight .tx{font-size:var(--amp-text-sm);color:var(--amp-accent);line-height:1.5}.insight b{font-weight:700}
.ct-grid{display:grid;grid-template-columns:1fr 1fr;gap:var(--amp-sp-5);margin-top:var(--amp-sp-6)}.ct{background:var(--amp-surface);border:1px solid var(--amp-border);border-radius:var(--amp-radius-xl);padding:var(--amp-sp-6);cursor:pointer;transition:all .2s;position:relative}.ct:hover{box-shadow:var(--amp-shadow-lg)}.ct.selected{border-color:var(--amp-accent);background:var(--amp-accent-light);box-shadow:var(--amp-shadow-brand)}.ct.disabled{opacity:.45;cursor:not-allowed;pointer-events:none}.ct .ctb{display:inline-flex;padding:2px 8px;border-radius:var(--amp-radius-full);font-size:10px;font-weight:600;margin-bottom:var(--amp-sp-3)}.ct .ctt{font-size:var(--amp-text-lg);font-weight:700;color:var(--amp-text);margin-bottom:var(--amp-sp-1)}.ct .ctp{font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-accent);margin-bottom:var(--amp-sp-3)}.ct .pros{list-style:none;margin-bottom:var(--amp-sp-3)}.ct .pros li{font-size:var(--amp-text-xs);color:var(--amp-text-secondary);padding:3px 0 3px 18px;position:relative}.ct .pros li::before{content:'✓';color:var(--amp-green-600);position:absolute;left:0;font-weight:700}.ct .cons{list-style:none;border-top:1px solid var(--amp-border);padding-top:var(--amp-sp-3)}.ct .cons li{font-size:var(--amp-text-xs);color:var(--amp-text-muted);padding:2px 0 2px 18px;position:relative}.ct .cons li::before{content:'⚠';position:absolute;left:0;font-size:10px}.ct .cancel{font-size:var(--amp-text-xs);color:var(--amp-text-muted);margin-top:var(--amp-sp-3);padding-top:var(--amp-sp-3);border-top:1px solid var(--amp-border)}
.compare{margin-top:var(--amp-sp-5);border:1px solid var(--amp-border);border-radius:var(--amp-radius-lg);overflow:hidden}.compare-row{display:grid;grid-template-columns:140px 1fr 1fr;font-size:var(--amp-text-xs)}.compare-row.hd{background:var(--amp-stone-50);font-weight:600;color:var(--amp-text)}.compare-row>div{padding:var(--amp-sp-2) var(--amp-sp-3);border-bottom:1px solid var(--amp-border)}.compare-row>div:not(:first-child){border-left:1px solid var(--amp-border)}.compare-row .lbl{color:var(--amp-text-muted);font-weight:500}.compare-row .val{color:var(--amp-text-secondary)}
.influencer-card{background:var(--amp-surface);border:1px solid var(--amp-accent);border-radius:var(--amp-radius-xl);padding:var(--amp-sp-6);box-shadow:var(--amp-shadow-brand)}.influencer-card .ctb{display:inline-flex;padding:2px 8px;border-radius:var(--amp-radius-full);font-size:10px;font-weight:600;margin-bottom:var(--amp-sp-3);background:var(--amp-green-50);color:var(--amp-green-600)}.influencer-card .ctt{font-size:var(--amp-text-lg);font-weight:700;color:var(--amp-text);margin-bottom:var(--amp-sp-2)}.influencer-card .pros{list-style:none}.influencer-card .pros li{font-size:var(--amp-text-sm);color:var(--amp-text-secondary);padding:4px 0 4px 20px;position:relative}.influencer-card .pros li::before{content:'✓';color:var(--amp-green-600);position:absolute;left:0;font-weight:700}
.flexi-wrap{margin-top:var(--amp-sp-4)}.flexi-def{background:var(--amp-accent-light);border:1px solid var(--amp-border-brand);border-radius:var(--amp-radius-xl);padding:var(--amp-sp-4);cursor:pointer;transition:all .2s}.flexi-def.active{border-color:var(--amp-accent);box-shadow:var(--amp-shadow-brand)}.flexi-def .ft{font-size:var(--amp-text-md);font-weight:600;color:var(--amp-text)}.flexi-def .fd{font-size:var(--amp-text-sm);color:var(--amp-text-muted);margin-top:2px}.flexi-exp{font-size:var(--amp-text-sm);color:var(--amp-accent);cursor:pointer;margin-top:var(--amp-sp-2);font-weight:500;border:none;background:none;font-family:var(--amp-font);padding:0}.flexi-opts{display:none;margin-top:var(--amp-sp-3);grid-template-columns:repeat(3,1fr);gap:var(--amp-sp-3)}.flexi-opts.show{display:grid}.fo{background:var(--amp-surface);border:1px solid var(--amp-border);border-radius:var(--amp-radius-lg);padding:var(--amp-sp-4);cursor:pointer;transition:all .2s;text-align:center}.fo:hover{border-color:var(--amp-border-strong)}.fo.sel{border-color:var(--amp-accent);background:var(--amp-accent-light)}.fo .fol{font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-text)}.fo .fos{font-size:var(--amp-text-xs);color:var(--amp-text-muted);margin-top:2px}.fo .fop{font-size:var(--amp-text-xs);font-weight:600;color:var(--amp-accent);margin-top:var(--amp-sp-1)}
.section-t{font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-text);margin-bottom:var(--amp-sp-2)}.section-s{font-size:var(--amp-text-xs);color:var(--amp-text-muted);margin-bottom:var(--amp-sp-3)}
.len-grid{display:flex;gap:var(--amp-sp-2);flex-wrap:wrap;margin-top:var(--amp-sp-3)}.lo{padding:var(--amp-sp-2) var(--amp-sp-4);border-radius:var(--amp-radius-full);border:1px solid var(--amp-border);font-size:var(--amp-text-sm);font-weight:500;cursor:pointer;transition:all .15s;color:var(--amp-text-secondary);background:var(--amp-surface);font-family:var(--amp-font)}.lo:hover{border-color:var(--amp-border-strong)}.lo.act{background:var(--amp-accent);border-color:var(--amp-accent);color:#fff}.lo.soon{opacity:.4;cursor:not-allowed;position:relative}.lo.soon::after{content:'Soon';font-size:9px;position:absolute;top:-6px;right:-4px;background:var(--amp-amber-50);color:var(--amp-amber-600);padding:0 4px;border-radius:4px;font-weight:600}
.sc{background:var(--amp-surface);border:1px solid var(--amp-border);border-radius:var(--amp-radius-xl);padding:var(--amp-sp-5);margin-bottom:var(--amp-sp-3)}.sc-label{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--amp-sp-3)}.sc-concept{font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-accent)}.sc-dur{font-size:var(--amp-text-xs);color:var(--amp-stone-400)}.sc-sec{margin-bottom:var(--amp-sp-2)}.sc-sec-l{font-size:10px;font-weight:700;color:var(--amp-text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px}.sc-sec-t{font-size:var(--amp-text-sm);color:var(--amp-text-secondary);line-height:1.5}
.think-step{display:flex;align-items:center;gap:var(--amp-sp-3);padding:var(--amp-sp-2) 0;font-size:var(--amp-text-sm);color:var(--amp-text-secondary)}.think-step .sp{width:14px;height:14px;border:2px solid var(--amp-stone-200);border-top-color:var(--amp-accent);border-radius:var(--amp-radius-full);animation:spin .6s linear infinite}.think-step .ck{color:var(--amp-green-600);font-weight:700;width:16px}
.pkg-grid{display:flex;flex-direction:column;gap:var(--amp-sp-3);margin-top:var(--amp-sp-5)}.pkg{background:var(--amp-surface);border:1px solid var(--amp-border);border-radius:var(--amp-radius-xl);padding:var(--amp-sp-5);cursor:pointer;transition:all .2s;display:flex;justify-content:space-between;align-items:center}.pkg:hover{box-shadow:var(--amp-shadow-md)}.pkg.sel{border-color:var(--amp-accent);background:var(--amp-accent-light);box-shadow:var(--amp-shadow-brand)}.pkg-n{font-size:var(--amp-text-md);font-weight:700;color:var(--amp-text);text-transform:capitalize}.pkg-d{font-size:var(--amp-text-sm);color:var(--amp-text-muted);margin-top:2px}.pkg-p{font-size:var(--amp-text-xl);font-weight:800;color:var(--amp-text)}.pkg.sel .pkg-p{color:var(--amp-accent)}
.wallet{background:var(--amp-accent-light);border:1px solid var(--amp-border-brand);border-radius:var(--amp-radius-xl);padding:var(--amp-sp-5);margin-top:var(--amp-sp-5)}.wallet-r{display:flex;justify-content:space-between;align-items:center}.wallet-l{font-size:var(--amp-text-sm);font-weight:600}.wallet-a{font-size:var(--amp-text-lg);font-weight:700;color:var(--amp-accent)}.wallet-bar{height:4px;border-radius:var(--amp-radius-full);background:var(--amp-violet-200);margin-top:var(--amp-sp-2);overflow:hidden}.wallet-fill{height:100%;border-radius:var(--amp-radius-full);background:var(--amp-accent)}.wallet-n{font-size:var(--amp-text-xs);color:var(--amp-text-muted);margin-top:var(--amp-sp-2)}
.price-pill{position:fixed;bottom:68px;left:50%;transform:translateX(-50%);background:var(--amp-surface);border:1px solid var(--amp-border);border-radius:var(--amp-radius-full);padding:var(--amp-sp-2) var(--amp-sp-5);box-shadow:var(--amp-shadow-lg);font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-accent);z-index:150;display:none;transition:all .3s}.price-pill.show{display:flex;align-items:center;gap:var(--amp-sp-2)}.price-pill .pp-label{color:var(--amp-text-muted);font-weight:400}
.footer{position:fixed;bottom:0;left:0;right:0;display:flex;justify-content:space-between;align-items:center;padding:var(--amp-sp-3) var(--amp-sp-8);background:rgba(248,249,253,.92);backdrop-filter:blur(8px);border-top:1px solid var(--amp-border);z-index:200}body.dark .footer{background:rgba(12,12,18,.92)}.footer-hint{font-size:var(--amp-text-xs);color:var(--amp-text-muted)}.footer-hint kbd{display:inline-block;padding:1px 5px;border-radius:3px;background:var(--amp-surface);border:1px solid var(--amp-border);font-size:10px;font-family:var(--amp-font)}.footer.hidden{display:none}
.note{font-size:var(--amp-text-xs);color:var(--amp-text-muted);background:var(--amp-stone-50);border-radius:var(--amp-radius-md);padding:var(--amp-sp-3);margin-top:var(--amp-sp-4);line-height:1.5}
@media(max-width:768px){.pills{gap:4px}.pill{padding:2px 8px;font-size:10px}.ct-grid{grid-template-columns:1fr}.flexi-opts{grid-template-columns:1fr}.slide{padding:70px var(--amp-sp-4) 100px}.footer-hint{display:none}.goal-grid{flex-direction:column}.goal-group{flex-direction:column}.goal-divider{width:auto;height:1px;margin:var(--amp-sp-2) 0}.compare-row{grid-template-columns:100px 1fr 1fr;font-size:10px}}
`;

function step0() {
  return `
<div class="entry-inner">
  <div class="repeat" onclick="quickCheckout()"><div><div style="font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-text)">↻ Repeat last campaign</div><div style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">Glow Radiance Serum · AI Video · Starter · ₹6,000</div></div><span style="font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-accent)">Review & Pay →</span></div>
  <div class="ai-badge">✦ Powered by AI</div>
  <h1 class="entry-h">Get your next ad-ready video</h1>
  <p class="entry-sub">Paste a product URL, Instagram link, or website — we'll set up your campaign in seconds.</p>
  <div class="url-bar"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg><input id="urlInput" placeholder="https://yourproduct.com/product-page" onkeydown="if(event.key==='Enter')startScrape()"><button class="gs" onclick="startScrape()">Get Started</button></div>
  <div class="goal-label">What's your campaign goal?</div>
  <div class="goal-grid">
    <div class="goal-group">
      <div class="gc selected" onclick="selectGoal(this,'ads')"><div class="gi">🎬</div><div class="gt">Ad-Ready Videos</div><div class="gs2">Performance content for paid ads</div><div class="gtag" style="background:var(--amp-accent-light);color:var(--amp-accent)">UGC</div></div>
      <div class="gc" onclick="selectGoal(this,'brand')"><div class="gi">✨</div><div class="gt">Brand Content</div><div class="gs2">Storytelling for brand recall</div><div class="gtag" style="background:var(--amp-violet-100);color:var(--amp-violet-700)">Branding</div></div>
    </div>
    <div class="goal-divider"></div>
    <div class="goal-group" style="max-width:200px">
      <div class="gc" onclick="selectGoal(this,'influencer')"><div class="gi">📱</div><div class="gt">Influencer Marketing</div><div class="gs2">Creators post to their audience</div><div class="gtag" style="background:var(--amp-green-50);color:var(--amp-green-600)">Distribution</div></div>
    </div>
  </div>
</div>`;
}

function step1() {
  return `<div class="heading">Your product details</div><div class="sub">We've auto-filled from your URL. Edit anything that's off.</div>
<div id="scrapeArea"><div id="scrapeAnim">
  <div class="scrape-step" id="ss1"><span class="sp"></span> Scanning product page...</div>
  <div class="scrape-step" id="ss2" style="opacity:.3"><span class="ck">○</span> Checking Instagram & social profiles</div>
  <div class="scrape-step" id="ss3" style="opacity:.3"><span class="ck">○</span> Analyzing marketplace listings</div>
  <div class="scrape-step" id="ss4" style="opacity:.3"><span class="ck">○</span> Reading reviews & Meta Ads library</div>
  <div class="scrape-step" id="ss5" style="opacity:.3"><span class="ck">○</span> Generating recommendations</div>
</div><div id="productCard" style="display:none">
  <div class="amp-card" style="padding:var(--amp-sp-5)"><div style="display:flex;gap:var(--amp-sp-4);align-items:flex-start"><div style="width:72px;height:72px;border-radius:var(--amp-radius-lg);background:var(--amp-gradient-brand-soft);flex-shrink:0"></div><div style="flex:1"><div style="font-size:var(--amp-text-md);font-weight:600">Glow Radiance Serum</div><div style="font-size:var(--amp-text-sm);color:var(--amp-text-muted)">Luminara Beauty · ₹1,299</div><div style="display:flex;gap:var(--amp-sp-2);margin-top:var(--amp-sp-2);flex-wrap:wrap"><span class="amp-badge amp-badge-violet">Beauty</span><span class="amp-badge amp-badge-violet">Skincare</span></div></div><span class="amp-badge amp-badge-green">Verified ✓</span></div></div>
  <div style="margin-top:var(--amp-sp-4)"><div class="section-t">Shipping required?</div><div style="display:flex;gap:var(--amp-sp-3)"><button class="amp-btn amp-btn-primary" id="shipYes" onclick="setShipping(true)" style="flex:1">Yes, physical product</button><button class="amp-btn amp-btn-outline" id="shipNo" onclick="setShipping(false)" style="flex:1">No shipping needed</button></div></div>
  <div class="insight"><span class="ic">💡</span><div class="tx">We found <b>847 campaigns</b> in Beauty/Skincare. Top format: 30s videos (62%). <b>Avg. campaign size: ₹35K.</b></div></div>
</div></div>`;
}

function step2() {
  return `<div class="heading">How should your content be created?</div><div class="sub">Choose the creation method that fits your goal.</div>
<div id="ctChoice">
  <div class="ct-grid">
    <div class="ct selected" id="ctAi" onclick="selectCT('ai')"><div class="ctb" style="background:var(--amp-accent);color:#fff">✦ AI-Powered</div><div class="ctt">AI Video</div><div class="ctp">From ₹2,000/video</div><ul class="pros"><li>Instant delivery — ready in hours</li><li>No shipping required</li><li>Unlimited revisions</li><li>Full content ownership</li></ul><ul class="cons"><li>No social proof / audience reach</li><li>24s video length only (more coming)</li></ul><div class="cancel">Cancel anytime. Full refund before delivery.</div></div>
    <div class="ct" id="ctHuman" onclick="selectCT('human')"><div class="ctb" style="background:var(--amp-green-50);color:var(--amp-green-600)">👤 Human Creator</div><div class="ctt">Human Creator</div><div class="ctp">From ₹5,000/creator</div><ul class="pros"><li>Authentic, relatable content</li><li>Content ownership included</li><li>AI-matched for your category</li></ul><ul class="cons"><li>7-14 day delivery</li><li>Shipping for physical products</li><li>No refund for shipped items</li></ul><div class="cancel">Partial refund. No refund for shipped products.</div></div>
  </div>
  <div class="compare"><div class="compare-row hd"><div></div><div>AI Video</div><div>Human Creator</div></div><div class="compare-row"><div class="lbl">Delivery</div><div class="val">Hours</div><div class="val">7-14 days</div></div><div class="compare-row"><div class="lbl">Cost</div><div class="val">From ₹2K/video</div><div class="val">From ₹5K/creator</div></div><div class="compare-row"><div class="lbl">Shipping</div><div class="val">Not needed</div><div class="val">Required for products</div></div><div class="compare-row"><div class="lbl">Revisions</div><div class="val">Unlimited</div><div class="val">Limited</div></div><div class="compare-row"><div class="lbl">Cancellation</div><div class="val">Full refund</div><div class="val">Partial refund</div></div></div>
</div>
<div id="ctInfluencer" style="display:none">
  <div class="influencer-card"><div class="ctb">📱 Influencer Campaign</div><div class="ctt">Human Creator + Mandatory Posting</div><p style="font-size:var(--amp-text-sm);color:var(--amp-text-secondary);margin-bottom:var(--amp-sp-4)">Creators produce content AND post it to their own Instagram profile. Your brand gets authentic reach to their audience.</p><ul class="pros"><li>Content posted on creator's profile — authentic social proof</li><li>Organic audience reach & engagement included</li><li>AI-matched creators for your category & target audience</li><li>Collab tag & partnership ad codes available</li><li>Content ownership included</li></ul><div style="margin-top:var(--amp-sp-4);font-size:var(--amp-text-sm);font-weight:600;color:var(--amp-accent)">From ₹8,000/creator (includes posting)</div><div class="note">Want content without creator posting? <a href="#" onclick="selectGoal(document.querySelector('.gc'),&quot;ads&quot;);goToStep(0);return false" style="color:var(--amp-accent)">Change to Ad-Ready Videos</a></div></div>
</div>
<div class="note">⚠ Creators will not travel to physical locations. Location-based campaigns are not supported.</div>`;
}

function step3() {
  return `<div class="heading">Content brief</div><div class="sub">We've pre-filled from your product scan. Adjust anything.</div>

<div id="fameSection">
  <div class="section-t">Creator fame level</div><div class="section-s">How recognizable should the creators be?</div>
  <div class="flexi-wrap"><div class="flexi-def active" id="fameFlexi" onclick="setFlexi('fame')"><div class="ft">🎯 I'm flexible</div><div class="fd">Pay base price. We match the best across all tiers.</div></div><button class="flexi-exp" onclick="toggleFlexi('fame')">Pick specific fame? →</button><div class="flexi-opts" id="fameOpts"><div class="fo" onclick="selFO(this,'fame')"><div class="fol">Micro</div><div class="fos">5K-50K followers</div><div class="fop">Base price</div></div><div class="fo" onclick="selFO(this,'fame')"><div class="fol">Medium</div><div class="fos">50K-100K</div><div class="fop">+₹2,900</div></div><div class="fo" onclick="selFO(this,'fame')"><div class="fol">Large</div><div class="fos">100K-250K</div><div class="fop">+₹8,700</div></div></div></div>
  <div style="height:var(--amp-sp-6)"></div>
</div>

<div class="section-t">Target audience</div>
<div id="audienceTags" style="display:flex;flex-wrap:wrap;gap:var(--amp-sp-2);margin-bottom:var(--amp-sp-2)"><span class="amp-chip active" onclick="this.remove()">Women 25-35 ×</span><span class="amp-chip active" onclick="this.remove()">Skincare enthusiasts ×</span><span class="amp-chip active" onclick="this.remove()">Urban India ×</span></div>
<div style="display:flex;gap:var(--amp-sp-2)"><input class="amp-input" placeholder="Add audience..." id="newAud" style="flex:1"><button class="amp-btn amp-btn-secondary" onclick="addChip('audienceTags',document.getElementById('newAud'))">Add</button></div>

<div style="height:var(--amp-sp-6)"></div>
<div class="section-t">Language</div>
<div style="display:flex;gap:var(--amp-sp-2);flex-wrap:wrap"><span class="amp-chip active" onclick="toggleChip(this)">Hindi</span><span class="amp-chip" onclick="toggleChip(this)">English</span><span class="amp-chip" onclick="toggleChip(this)">Hinglish</span><span class="amp-chip" onclick="toggleChip(this)">Tamil</span><span class="amp-chip" onclick="toggleChip(this)">Telugu</span><span class="amp-chip" onclick="toggleChip(this)">Marathi</span><span class="amp-chip" onclick="toggleChip(this)">Bengali</span><span class="amp-chip" onclick="toggleChip(this)">Punjabi</span></div>

<div style="height:var(--amp-sp-6)"></div>
<div class="section-t">Video length</div>
<div id="lenHuman" class="len-grid"><span class="lo" onclick="selLen(this)">15s</span><span class="lo act" onclick="selLen(this)">30s</span><span class="lo" onclick="selLen(this)">45s</span><span class="lo" onclick="selLen(this)">60s</span><span class="lo" onclick="selLen(this)">3 min</span></div>
<div id="lenAI" class="len-grid" style="display:none"><span class="lo act">24s</span><span class="lo soon">10s</span><span class="lo soon">15s</span><span class="lo soon">30s</span></div>

<div class="insight"><span class="ic">💡</span><div class="tx">For skincare audiences 25-35, <b>Hindi + English mix gets 34% more engagement</b> than single-language content.</div></div>`;
}

function step4() {
  return `<div class="heading">Script preview</div><div class="sub">AI-generated from your product. Edit freely after payment.</div>

<div style="display:flex;gap:var(--amp-sp-3);margin-bottom:var(--amp-sp-5)"><button class="amp-btn amp-btn-primary" id="tAi" onclick="switchST('ai')">✦ AI Scripts</button><button class="amp-btn amp-btn-outline" id="tCustom" onclick="switchST('custom')">Custom Scripts</button></div>

<div id="aiPanel">
  <div id="thinkingAnim">
    <div class="think-step" id="t1"><span class="sp"></span> Understanding product positioning...</div>
    <div class="think-step" id="t2" style="opacity:.3"><span class="ck">○</span> Analyzing top hooks for Skincare</div>
    <div class="think-step" id="t3" style="opacity:.3"><span class="ck">○</span> Generating Problem → Solution script</div>
    <div class="think-step" id="t4" style="opacity:.3"><span class="ck">○</span> Crafting Day 1 vs Day 7 narrative</div>
    <div class="think-step" id="t5" style="opacity:.3"><span class="ck">○</span> Optimizing CTAs for conversion</div>
  </div>
  <div id="scriptsReady" style="display:none">
    <div class="sc"><div class="sc-label"><span class="sc-concept">Problem → Solution</span><span class="sc-dur">24s · 9:16</span></div><div class="sc-sec"><div class="sc-sec-l">⚡ Hook (0-3s)</div><div class="sc-sec-t">"Tired of dull skin? I tried everything..."</div></div><div class="sc-sec"><div class="sc-sec-l">✏ Body (3-20s)</div><div class="sc-sec-t">"Until I found this serum. Within a week, my skin was literally glowing. Vitamin C + Hyaluronic Acid — absorbs in seconds."</div></div><div class="sc-sec"><div class="sc-sec-l">🏁 CTA (20-24s)</div><div class="sc-sec-t">"Link in bio — your glow-up starts today."</div></div></div>
    <div class="sc"><div class="sc-label"><span class="sc-concept">Day 1 vs Day 7</span><span class="sc-dur">24s · 9:16</span></div><div class="sc-sec"><div class="sc-sec-l">⚡ Hook (0-3s)</div><div class="sc-sec-t">"POV: You finally find a serum that works."</div></div><div class="sc-sec"><div class="sc-sec-l">✏ Body (3-20s)</div><div class="sc-sec-t">"Day 1 — skeptical. Day 3 — is that a glow? Day 7 — my skin has never looked this good. ₹1,299 well spent."</div></div><div class="sc-sec"><div class="sc-sec-l">🏁 CTA (20-24s)</div><div class="sc-sec-t">"Don't just take my word for it — try it yourself."</div></div></div>
    <div class="note">Scripts use a proven <b>Hook → Body → CTA</b> framework optimized from 12,000+ campaigns. Fully editable after payment.</div>
  </div>
  <div style="text-align:center;margin-top:var(--amp-sp-4)"><button class="amp-btn amp-btn-text" id="skipScripts" onclick="nextStep()" style="font-size:var(--amp-text-xs)">Skip scripts — generate after payment →</button></div>
</div>
<div id="customPanel" style="display:none"><div class="amp-card" style="padding:var(--amp-sp-5)"><div class="section-t">Write your own scripts</div><textarea class="amp-input" placeholder="Use Hook → Body → CTA structure for best results..." style="min-height:120px"></textarea><div class="note" style="margin-top:var(--amp-sp-2)">You can also upload scripts after payment.</div></div></div>

<div style="height:var(--amp-sp-5)"></div><div class="section-t">Talking points</div>
<div id="talkPts" style="display:flex;flex-wrap:wrap;gap:var(--amp-sp-2);margin-bottom:var(--amp-sp-2)"><span class="amp-chip active" onclick="this.remove()">Lightweight formula ×</span><span class="amp-chip active" onclick="this.remove()">Glow in 7 days ×</span><span class="amp-chip active" onclick="this.remove()">Vitamin C + HA ×</span></div>
<div style="display:flex;gap:var(--amp-sp-2)"><input class="amp-input" placeholder="Add talking point..." id="newTP" style="flex:1"><button class="amp-btn amp-btn-secondary" onclick="addChip('talkPts',document.getElementById('newTP'))">Add</button></div>`;
}

function step5() {
  return `<div id="budgetHuman"><div class="heading">Campaign size</div><div class="sub">Set your budget or choose how many content pieces you need.</div>
  <div class="amp-card" style="padding:var(--amp-sp-5);text-align:center;margin-bottom:var(--amp-sp-5)"><div style="font-size:var(--amp-text-2xl);font-weight:800;color:var(--amp-accent)" id="cPieces">5 content pieces</div><div style="font-size:var(--amp-text-sm);color:var(--amp-text-muted)" id="cTotal">₹32,500 total (excl. tax)</div></div>
  <div class="amp-tabs" style="margin-bottom:var(--amp-sp-4)"><button class="amp-tab active" onclick="setBM(this,'budget')">Set by budget</button><button class="amp-tab" onclick="setBM(this,'pieces')">Set by pieces</button></div>
  <div id="bSlider"><div style="display:flex;justify-content:space-between;margin-bottom:var(--amp-sp-1)"><span style="font-size:var(--amp-text-sm);color:var(--amp-text-muted)">Budget (excl. tax)</span><span style="font-size:var(--amp-text-xl);font-weight:700;color:var(--amp-accent)" id="bDisp">₹30,000</span></div><input type="range" min="5000" max="250000" value="30000" step="5000" oninput="updateB(this.value)"><div class="amp-slider-marks"><span>₹5K</span><span>₹25K</span><span>₹50K</span><span>₹1L</span><span>₹2.5L</span></div></div>
  <div class="insight"><span class="ic">📈</span><div class="tx">Brands with <b>8+ video variations</b> see 3× better ad performance. Consider upgrading your budget for more creative options.</div></div>
</div>
<div id="budgetAI" style="display:none"><div class="heading">Choose your AI video package</div><div class="sub">Select the package that fits your campaign goals.</div>
  <div class="pkg-grid"><div class="pkg sel" onclick="selPkg(this,'starter')"><div><div class="pkg-n">Starter</div><div class="pkg-d">3 videos · 24s · 3-month rights · ₹2,000/video</div></div><div class="pkg-p">₹6,000</div></div><div class="pkg" onclick="selPkg(this,'growth')"><div><div class="pkg-n">Growth</div><div class="pkg-d">8 videos · 24s · 3-month rights · ₹1,750/video</div></div><div class="pkg-p">₹14,000</div></div><div class="pkg" onclick="selPkg(this,'scale')"><div><div class="pkg-n">Scale</div><div class="pkg-d">15 videos · 24s · 6-month rights · ₹1,500/video</div></div><div class="pkg-p">₹22,500</div></div></div>
  <div class="insight"><span class="ic">📈</span><div class="tx">Brands in Beauty typically order <b>8+ videos</b> for enough ad variations to A/B test. Growth package recommended.</div></div>
</div>
<div class="wallet"><div class="wallet-r"><div><div class="wallet-l">OI Money Balance</div><div class="wallet-n">Auto-applied at checkout</div></div><div class="wallet-a">₹12,400</div></div><div class="wallet-bar"><div class="wallet-fill" style="width:41%"></div></div><div class="wallet-n" style="margin-top:var(--amp-sp-3)">💰 <b>Add ₹7,600 to wallet</b> and save 5% on your next 3 campaigns</div></div>`;
}

function step6() {
  return `<div class="heading">Review & place order</div><div class="sub">Verify your campaign details before payment.</div>
<div class="amp-two-col"><div>
  <div class="amp-card" style="padding:var(--amp-sp-5)">
    <div style="padding:var(--amp-sp-3) 0;border-bottom:1px solid var(--amp-stone-100)"><div style="display:flex;justify-content:space-between"><div class="section-t">Goal & Product</div><span style="font-size:var(--amp-text-xs);color:var(--amp-accent);cursor:pointer" onclick="goToStep(0)">Change</span></div><div style="display:flex;gap:var(--amp-sp-3);align-items:center;margin-top:var(--amp-sp-2)"><div style="width:40px;height:40px;border-radius:var(--amp-radius-md);background:var(--amp-gradient-brand-soft);flex-shrink:0"></div><div><div style="font-weight:600;font-size:var(--amp-text-sm)">Glow Radiance Serum</div><div style="font-size:var(--amp-text-xs);color:var(--amp-text-muted)">Ad-Ready Videos · Luminara Beauty</div></div></div></div>
    <div style="padding:var(--amp-sp-3) 0;border-bottom:1px solid var(--amp-stone-100)"><div style="display:flex;justify-content:space-between"><div class="section-t">Content Type</div><span style="font-size:var(--amp-text-xs);color:var(--amp-accent);cursor:pointer" onclick="goToStep(2)">Change</span></div><div style="font-size:var(--amp-text-sm);color:var(--amp-text-secondary)" id="sumCT">AI Video</div></div>
    <div style="padding:var(--amp-sp-3) 0;border-bottom:1px solid var(--amp-stone-100)"><div style="display:flex;justify-content:space-between"><div class="section-t">Brief</div><span style="font-size:var(--amp-text-xs);color:var(--amp-accent);cursor:pointer" onclick="goToStep(3)">Change</span></div><div style="font-size:var(--amp-text-sm);color:var(--amp-text-secondary)">Hindi · 30s · Women 25-35</div></div>
    <div style="padding:var(--amp-sp-3) 0"><div style="display:flex;justify-content:space-between"><div class="section-t">Scripts</div><span style="font-size:var(--amp-text-xs);color:var(--amp-accent);cursor:pointer" onclick="goToStep(4)">Change</span></div><div style="font-size:var(--amp-text-sm);color:var(--amp-text-secondary)">2 AI scripts · Hook → Body → CTA</div></div>
  </div>
</div><div>
  <div class="amp-card" style="padding:var(--amp-sp-5);position:sticky;top:80px">
    <div style="font-size:var(--amp-text-md);font-weight:600;margin-bottom:var(--amp-sp-4)">Order summary</div>
    <div style="display:flex;flex-direction:column;gap:var(--amp-sp-2)"><div class="amp-price-row"><span>Package</span><span style="font-weight:500;color:var(--amp-text)">Starter · 3 videos</span></div><div class="amp-price-row"><span>Subtotal</span><span>₹6,000</span></div><div class="amp-price-row"><span>Tax (18%)</span><span>₹1,080</span></div><div class="amp-price-row amp-price-total"><span>Total</span><span>₹7,080</span></div><div class="amp-price-row amp-price-credit"><span>OI Money</span><span>−₹7,080</span></div><div class="amp-price-row amp-price-due"><span>Due</span><span style="color:var(--amp-green-600)">₹0 — Covered ✓</span></div></div>
    <button class="amp-btn amp-btn-primary amp-btn-lg amp-btn-full" style="margin-top:var(--amp-sp-4)" onclick="placeOrder()">Place Order — Covered by OI Money ✓</button>
    <p style="text-align:center;font-size:11px;color:var(--amp-stone-400);margin-top:var(--amp-sp-2)">🔒 Secured by Razorpay</p>
    <div style="text-align:center;margin-top:var(--amp-sp-3)"><button class="amp-btn amp-btn-text" style="font-size:var(--amp-text-xs)" onclick="alert('Share link copied! Send to your team for approval.')">📤 Share for Approval</button></div>
  </div>
</div></div>`;
}

function successModal() {
  return `<div class="amp-modal-bg" id="successModal"><div class="amp-modal" style="text-align:center"><svg class="amp-success-check" viewBox="0 0 72 72"><circle cx="36" cy="36" r="32"/><path d="M22 36 l10 10 l18 -20"/></svg><div class="heading" style="margin-bottom:var(--amp-sp-2)">Campaign Created!</div><p style="color:var(--amp-text-muted);margin-bottom:var(--amp-sp-5)">Your AI videos will be ready within hours.</p><button class="amp-btn amp-btn-primary amp-btn-lg amp-btn-full">View Campaign Dashboard</button></div></div>`;
}

const JS = `
var cur=0,ct='ai',goal='ads';
var pillLabels=['Product','Content Type','Brief','Scripts','Budget','Checkout'];
var stepOrder=[0,1,2,3,4,5,6];

function goToStep(s){var p=document.getElementById('s'+cur),n=document.getElementById('s'+s);if(!p||!n)return;p.classList.add('exiting');p.classList.remove('active');setTimeout(function(){p.classList.remove('exiting')},350);setTimeout(function(){n.classList.add('active')},50);cur=s;
var vi=stepOrder.indexOf(s),pct=vi<=0?0:(vi/(stepOrder.length-1))*100;document.getElementById('pFill').style.width=pct+'%';
document.getElementById('topbar').className=s===0?'topbar hidden':'topbar';document.getElementById('footer').className=s===0?'footer hidden':'footer';
document.querySelectorAll('.pill').forEach(function(p,i){p.classList.remove('active','done');if(i+1<s)p.classList.add('done');else if(i+1===s)p.classList.add('active')});
var bb=document.getElementById('backBtn');bb.style.opacity=s>0?'1':'0';bb.style.pointerEvents=s>0?'auto':'none';
var nb=document.getElementById('nextBtn');nb.style.display=s===6?'none':'';nb.textContent='Save & Continue →';
// Content type visibility
if(s===2){var isInf=goal==='influencer';document.getElementById('ctChoice').style.display=isInf?'none':'block';document.getElementById('ctInfluencer').style.display=isInf?'block':'none'}
if(s===3){document.getElementById('fameSection').style.display=ct==='human'?'block':'none';document.getElementById('lenHuman').style.display=ct==='human'?'flex':'none';document.getElementById('lenAI').style.display=ct==='ai'?'flex':'none'}
if(s===5){document.getElementById('budgetHuman').style.display=ct==='human'?'block':'none';document.getElementById('budgetAI').style.display=ct==='ai'?'block':'none'}
// Price pill
var pp=document.getElementById('pricePill');pp.className=s>=2&&s<6?'price-pill show':'price-pill';
}
function nextStep(){var ci=stepOrder.indexOf(cur);if(ci<stepOrder.length-1)goToStep(stepOrder[ci+1])}
function prevStep(){var ci=stepOrder.indexOf(cur);if(ci>0)goToStep(stepOrder[ci-1])}

function selectGoal(el,id){document.querySelectorAll('.gc').forEach(function(c){c.classList.remove('selected')});el.classList.add('selected');goal=id;if(id==='influencer'){ct='human'}}
function startScrape(){var i=document.getElementById('urlInput');if(!i.value)i.value='https://luminara.com/glow-radiance-serum';goToStep(1);var ss=['ss1','ss2','ss3','ss4','ss5'],si=0;var iv=setInterval(function(){if(si>0){var p=document.getElementById(ss[si-1]);p.innerHTML='<span class="ck">✓</span> '+p.textContent.replace(/[○]/g,'').trim();p.style.opacity='1';p.style.color='var(--amp-green-600)'}if(si<ss.length){document.getElementById(ss[si]).style.opacity='1'}si++;if(si>ss.length){clearInterval(iv);document.getElementById('scrapeAnim').style.display='none';document.getElementById('productCard').style.display='block'}},700)}
function quickCheckout(){goToStep(6)}
function setShipping(y){document.getElementById('shipYes').className=y?'amp-btn amp-btn-primary':'amp-btn amp-btn-outline';document.getElementById('shipNo').className=y?'amp-btn amp-btn-outline':'amp-btn amp-btn-primary'}
function selectCT(type){if(goal==='influencer'&&type==='ai')return;ct=type;document.getElementById('ctAi').classList.toggle('selected',type==='ai');document.getElementById('ctHuman').classList.toggle('selected',type==='human');document.getElementById('sumCT').textContent=type==='ai'?'AI Video':'Human Creator';document.getElementById('pricePillAmt').textContent=type==='ai'?'~₹6,000':'~₹32,500'}
function setFlexi(t){document.getElementById(t+'Opts').style.display='none';document.getElementById(t+'Flexi').classList.add('active');document.getElementById(t+'Opts').querySelectorAll('.fo').forEach(function(o){o.classList.remove('sel')})}
function toggleFlexi(t){var o=document.getElementById(t+'Opts');var f=document.getElementById(t+'Flexi');if(o.style.display==='none'||!o.style.display){o.style.display='grid';f.classList.remove('active')}else{o.style.display='none';f.classList.add('active')}}
function selFO(el,t){el.parentElement.querySelectorAll('.fo').forEach(function(o){o.classList.remove('sel')});el.classList.add('sel');document.getElementById(t+'Flexi').classList.remove('active')}
function addChip(cid,inp){if(!inp||!inp.value.trim())return;var c=document.getElementById(cid),s=document.createElement('span');s.className='amp-chip active';s.textContent=inp.value.trim()+' ×';s.onclick=function(){this.remove()};c.appendChild(s);inp.value=''}
function toggleChip(el){el.classList.toggle('active')}
function selLen(el){el.parentElement.querySelectorAll('.lo:not(.soon)').forEach(function(l){l.classList.remove('act')});el.classList.add('act')}
function switchST(t){document.getElementById('aiPanel').style.display=t==='ai'?'block':'none';document.getElementById('customPanel').style.display=t==='custom'?'block':'none';document.getElementById('tAi').className=t==='ai'?'amp-btn amp-btn-primary':'amp-btn amp-btn-outline';document.getElementById('tCustom').className=t==='custom'?'amp-btn amp-btn-primary':'amp-btn amp-btn-outline'}
function updateB(v){var d=v>=100000?'₹'+(v/100000).toFixed(1).replace('.0','')+'L':'₹'+Number(v).toLocaleString('en-IN');document.getElementById('bDisp').textContent=d;var p=Math.max(1,Math.round(v/6500));document.getElementById('cPieces').textContent=p+' content piece'+(p!==1?'s':'');document.getElementById('cTotal').textContent=d+' total (excl. tax)';document.getElementById('pricePillAmt').textContent='~'+d}
function setBM(el,m){el.parentElement.querySelectorAll('.amp-tab').forEach(function(t){t.classList.remove('active')});el.classList.add('active')}
function selPkg(el,p){el.parentElement.querySelectorAll('.pkg').forEach(function(c){c.classList.remove('sel')});el.classList.add('sel');var prices={starter:'₹6,000',growth:'₹14,000',scale:'₹22,500'};document.getElementById('pricePillAmt').textContent='~'+prices[p]}
function placeOrder(){document.getElementById('successModal').classList.add('show')}

// Script thinking animation
setTimeout(function(){if(cur===4||true){var ts=['t1','t2','t3','t4','t5'],ti=0;var iv=setInterval(function(){if(ti>0){var p=document.getElementById(ts[ti-1]);p.innerHTML='<span class="ck">✓</span> '+p.textContent.replace(/[○]/g,'').trim();p.style.opacity='1';p.style.color='var(--amp-green-600)'}if(ti<ts.length){document.getElementById(ts[ti]).style.opacity='1'}ti++;if(ti>ts.length){clearInterval(iv);document.getElementById('thinkingAnim').style.display='none';document.getElementById('scriptsReady').style.display='block';document.getElementById('skipScripts').style.display='none'}},800)}},100);

document.getElementById('nextBtn').onclick=nextStep;document.getElementById('backBtn').onclick=prevStep;
document.addEventListener('keydown',function(e){if(e.target.matches('input,textarea,select'))return;if(e.key==='Enter')nextStep();if(e.key==='ArrowDown'){e.preventDefault();nextStep()}if(e.key==='ArrowUp'){e.preventDefault();prevStep()}var n=parseInt(e.key);if(n>=0&&n<=6)goToStep(n)});
`;

function build(isDark) {
  const pills = ['Product','Content Type','Brief','Scripts','Budget','Checkout'];
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Amplify — New Campaign${isDark?' (Dark)':''}</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"><style>${tokens}${dark}${baseCSS}${css}</style></head><body${isDark?' class="dark"':''}>
<div class="progress"><div class="progress-fill" id="pFill"></div></div>
<div class="topbar hidden" id="topbar"><div class="topbar-inner"><div class="amp-logo">amplify</div><div class="pills">${pills.map((l,i)=>`<div class="pill" onclick="goToStep(${i+1})">${l}</div>`).join('')}</div></div></div>
<div class="slide entry active" id="s0">${step0()}</div>
<div class="slide" id="s1"><div class="slide-c">${step1()}</div></div>
<div class="slide" id="s2"><div class="slide-c">${step2()}</div></div>
<div class="slide" id="s3"><div class="slide-c">${step3()}</div></div>
<div class="slide" id="s4"><div class="slide-c">${step4()}</div></div>
<div class="slide" id="s5"><div class="slide-c">${step5()}</div></div>
<div class="slide" id="s6"><div class="slide-c">${step6()}</div></div>
${successModal()}
<div class="price-pill" id="pricePill"><span class="pp-label">Est.</span><span id="pricePillAmt">~₹6,000</span></div>
<div class="footer hidden" id="footer"><div class="footer-hint"><kbd>Enter</kbd> Continue · <kbd>↑</kbd><kbd>↓</kbd> Navigate</div><div style="display:flex;gap:var(--amp-sp-2)"><button class="amp-btn amp-btn-text" id="backBtn" style="opacity:0;pointer-events:none">← Back</button><button class="amp-btn amp-btn-primary amp-btn-lg" id="nextBtn">Save & Continue →</button></div></div>
<script>${JS}</script></body></html>`;
}

const outDir = process.argv[2] || path.join(os.homedir(), 'Desktop');
const start = Date.now();
[['v2-ordering-light.html',build(false)],['v2-ordering-dark.html',build(true)]].forEach(([n,h])=>{
  fs.writeFileSync(path.join(outDir,n),h);
  const oc=(h.match(/onclick/gi)||[]).length,fn=(h.match(/function /g)||[]).length;
  console.log(`  ✓ ${n.padEnd(26)} ${(h.length/1024).toFixed(1).padStart(5)}KB | onclick:${String(oc).padStart(2)} | fn:${fn}`);
});
console.log(`\nDone in ${Date.now()-start}ms — ${outDir}`);
