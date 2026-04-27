/**
 * Base CSS for standalone HTML rendering.
 * Provides styles for all amp-* utility classes used by template components.
 */
export function getBaseCSS(): string {
  return `
/* Reset */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:var(--amp-font);background:var(--amp-bg);color:var(--amp-text);font-size:var(--amp-text-base);line-height:1.5;min-height:100vh;-webkit-font-smoothing:antialiased}

/* ═══ Card — matches @one-impression/ui Card component ═══ */
/* Default: rounded-[16px] border border-[border-default] bg-[bg-surface] */
.amp-card{background:var(--amp-surface);border-radius:var(--amp-radius-xl);border:1px solid var(--amp-border);transition:all var(--amp-transition);overflow:hidden}
/* Interactive variant: hover:shadow-lg */
.amp-card.clickable{cursor:pointer}
.amp-card.clickable:hover{box-shadow:var(--amp-shadow-lg)}
/* Selected: brand border + light bg + brand shadow */
.amp-card.selected{border-color:var(--amp-accent);background:var(--amp-accent-light);box-shadow:var(--amp-shadow-brand)}
/* Faded (deselected in A/B comparison) */
.amp-card.faded{opacity:.5;transform:scale(.98)}
/* Elevated variant */
.amp-card.elevated{box-shadow:var(--amp-shadow-lg)}

/* ═══ Button — matches @one-impression/ui Button component ═══ */
/* Base: inline-flex items-center justify-center font-medium transition-all duration-150 */
.amp-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:40px;padding:0 16px;border-radius:6px;font-size:var(--amp-text-base);font-weight:500;border:none;cursor:pointer;transition:all 150ms ease;font-family:var(--amp-font);outline:none}
.amp-btn:focus-visible{outline:none;box-shadow:0 0 0 2px var(--amp-surface),0 0 0 4px rgba(101,49,255,0.4)}
.amp-btn:active{transform:scale(.98)}
.amp-btn:disabled{opacity:.5;cursor:not-allowed;transform:none}

/* Primary: bg-brand text-white hover:bg-brand-dark shadow-sm */
.amp-btn-primary{background:var(--amp-accent);color:#fff;box-shadow:var(--amp-shadow-sm)}
.amp-btn-primary:hover{background:var(--amp-accent-hover)}
.amp-btn-primary:disabled{background:var(--amp-stone-300);box-shadow:none}

/* Secondary: bg-brand-light text-brand hover:bg-brand-light/80 */
.amp-btn-secondary{background:var(--amp-accent-light);color:var(--amp-accent)}
.amp-btn-secondary:hover{background:var(--amp-violet-200)}

/* Outline: border border-border bg-transparent text-neutral-900 hover:bg-surface-overlay */
.amp-btn-outline{background:transparent;color:var(--amp-text);border:1px solid var(--amp-border)}
.amp-btn-outline:hover{background:var(--amp-surface-overlay)}

/* Ghost: bg-transparent text-neutral-900 hover:bg-surface-overlay */
.amp-btn-text{background:none;color:var(--amp-text-muted);padding:0 16px}
.amp-btn-text:hover{color:var(--amp-text);background:var(--amp-surface-overlay)}

/* Size lg: h-12 px-6 text-base rounded-lg */
.amp-btn-lg{height:48px;padding:0 24px;font-size:var(--amp-text-md);border-radius:var(--amp-radius-md);font-weight:600}
/* Size sm: h-8 px-3 text-sm rounded-md */
.amp-btn-sm{height:32px;padding:0 12px;font-size:var(--amp-text-sm);gap:6px}
/* Full width */
.amp-btn-full{width:100%}

/* ═══ Input — matches @one-impression/ui Input component ═══ */
/* h-10 px-3 rounded-[16px] text-[14px] border border-[border-default] */
.amp-input{width:100%;height:40px;padding:0 12px;border:1px solid var(--amp-border);border-radius:var(--amp-radius-xl);font-size:var(--amp-text-base);font-family:var(--amp-font);background:var(--amp-surface);color:var(--amp-text);outline:none;transition:colors 150ms ease}
.amp-input::placeholder{color:var(--amp-text-muted)}
.amp-input:focus{border-color:var(--amp-accent);box-shadow:0 0 0 2px rgba(101,49,255,.15)}
textarea.amp-input{height:auto;min-height:80px;padding:var(--amp-sp-3) 12px;resize:vertical}
select.amp-input{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px}

/* ═══ Chip — matches @one-impression/ui chip-like patterns ═══ */
.amp-chip{display:inline-flex;align-items:center;gap:6px;padding:var(--amp-sp-1) var(--amp-sp-3);border-radius:var(--amp-radius-full);font-size:var(--amp-text-sm);font-weight:500;border:1px solid var(--amp-border);background:var(--amp-surface);color:var(--amp-text-secondary);cursor:pointer;transition:all 150ms ease;user-select:none}
.amp-chip:hover{border-color:var(--amp-border-strong);background:var(--amp-surface-overlay)}
.amp-chip.active{background:var(--amp-accent);border-color:var(--amp-accent);color:#fff}

/* ═══ Badge — matches @one-impression/ui Badge component ═══ */
/* Base: inline-flex items-center gap-1.5 font-medium whitespace-nowrap */
.amp-badge{display:inline-flex;align-items:center;gap:6px;padding:2px 10px;border-radius:6px;font-size:var(--amp-text-sm);font-weight:500;white-space:nowrap}
/* Brand: bg-brand-light text-brand border border-brand/20 */
.amp-badge-violet{background:var(--amp-accent-light);color:var(--amp-accent);border:1px solid rgba(101,49,255,.2)}
/* Positive: bg-positive-light text-positive border border-positive/20 */
.amp-badge-green{background:var(--amp-green-50);color:var(--amp-green-600);border:1px solid rgba(33,193,121,.2)}
/* Negative */
.amp-badge-red{background:var(--amp-red-50);color:var(--amp-red-600);border:1px solid rgba(253,81,84,.2)}
/* Warning */
.amp-badge-amber{background:var(--amp-amber-50);color:var(--amp-amber-600);border:1px solid rgba(255,193,7,.2)}
/* Neutral: bg-neutral-100 text-neutral-700 border border-border */
.amp-badge-neutral{background:var(--amp-stone-100);color:var(--amp-stone-600);border:1px solid var(--amp-border)}

/* ═══ Headings — matches preset fontSize ═══ */
.amp-h1{font-size:var(--amp-text-xl);font-weight:700;color:var(--amp-text);line-height:1.2;letter-spacing:-0.025em}
.amp-h2{font-size:var(--amp-text-lg);font-weight:600;color:var(--amp-text);line-height:1.3}
.amp-h3{font-size:var(--amp-text-md);font-weight:600;color:var(--amp-text)}
.amp-sub{font-size:var(--amp-text-base);color:var(--amp-text-muted);margin-top:var(--amp-sp-1)}

/* ═══ Layout ═══ */
.amp-container{max-width:880px;margin:0 auto;padding:var(--amp-sp-8) var(--amp-sp-6) 80px}
.amp-container-narrow{max-width:720px;margin:0 auto;padding:var(--amp-sp-8) var(--amp-sp-6) 80px}
.amp-two-col{display:grid;grid-template-columns:55fr 45fr;gap:var(--amp-sp-8)}
.amp-nav-buttons{display:flex;justify-content:space-between;margin-top:var(--amp-sp-8)}

/* ═══ Price table ═══ */
.amp-price-row{display:flex;justify-content:space-between;padding:var(--amp-sp-1) 0;font-size:var(--amp-text-base);color:var(--amp-text-secondary)}
.amp-price-total{font-weight:700;font-size:16px;color:var(--amp-text);border-top:1px solid var(--amp-border-strong);padding-top:var(--amp-sp-3);margin-top:var(--amp-sp-1)}
.amp-price-credit{color:var(--amp-green-600)}
.amp-price-due{font-weight:700;font-size:var(--amp-text-lg);color:var(--amp-accent);border-top:1px solid var(--amp-border-brand);padding-top:var(--amp-sp-3);margin-top:var(--amp-sp-1)}

/* ═══ Payment tabs — segmented control pattern ═══ */
.amp-tabs{display:flex;gap:2px;background:var(--amp-stone-100);border-radius:var(--amp-radius-lg);padding:3px;margin:var(--amp-sp-4) 0}
.amp-tab{flex:1;text-align:center;padding:var(--amp-sp-2);border-radius:10px;font-size:var(--amp-text-sm);font-weight:500;color:var(--amp-text-muted);cursor:pointer;transition:all 150ms ease;border:none;background:none;font-family:var(--amp-font)}
.amp-tab:hover{color:var(--amp-text-secondary)}
.amp-tab.active{background:var(--amp-surface);color:var(--amp-accent);font-weight:600;box-shadow:var(--amp-shadow-sm)}

/* ═══ Slider ═══ */
input[type=range]{-webkit-appearance:none;width:100%;height:6px;border-radius:var(--amp-radius-full);background:var(--amp-stone-200);outline:none;margin:var(--amp-sp-4) 0}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:var(--amp-radius-full);background:var(--amp-accent);cursor:pointer;border:3px solid #fff;box-shadow:0 2px 8px rgba(101,49,255,.3)}
.amp-slider-marks{display:flex;justify-content:space-between}
.amp-slider-marks span{font-size:var(--amp-text-xs);color:var(--amp-stone-400)}

/* ═══ Wallet card ═══ */
.amp-wallet{background:var(--amp-accent-light);border:1px solid var(--amp-border-brand);border-radius:var(--amp-radius-xl);padding:var(--amp-sp-5)}
.amp-wallet-bar{height:6px;border-radius:var(--amp-radius-full);background:var(--amp-violet-200);margin-top:var(--amp-sp-2);overflow:hidden}
.amp-wallet-fill{height:100%;border-radius:var(--amp-radius-full);background:var(--amp-accent);transition:width .6s}

/* ═══ Animations ═══ */
@keyframes fadeSlideIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
@keyframes drawCircle{to{stroke-dashoffset:0}}
@keyframes drawCheck{to{stroke-dashoffset:0}}
.amp-shimmer{background:linear-gradient(90deg,var(--amp-stone-100) 25%,var(--amp-stone-50) 50%,var(--amp-stone-100) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite}
.amp-fade-in{animation:fadeSlideIn .3s ease-out}

/* ═══ Topbar ═══ */
.amp-topbar{background:var(--amp-surface);border-bottom:1px solid var(--amp-border);padding:var(--amp-sp-3) var(--amp-sp-6);position:sticky;top:0;z-index:100}
.amp-topbar-inner{max-width:880px;margin:0 auto;display:flex;align-items:center;justify-content:space-between}
.amp-logo{font-size:22px;font-weight:700;background:var(--amp-gradient-brand-soft);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:-.5px}
.amp-avatar{width:32px;height:32px;border-radius:var(--amp-radius-full);background:var(--amp-gradient-brand-soft);display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:600}

/* ═══ Modal ═══ */
.amp-modal-bg{position:fixed;inset:0;background:rgba(29,37,45,.4);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)}
.amp-modal-bg.show{display:flex}
.amp-modal{background:var(--amp-surface);border-radius:var(--amp-radius-2xl);padding:var(--amp-sp-8);max-width:440px;width:90%;box-shadow:var(--amp-shadow-lg);animation:fadeSlideIn .3s ease-out}

/* ═══ Success check ═══ */
.amp-success-check{width:72px;height:72px;margin:0 auto var(--amp-sp-5)}
.amp-success-check circle{stroke:var(--amp-green-600);stroke-width:3;fill:none;stroke-dasharray:200;stroke-dashoffset:200;animation:drawCircle .6s ease-out forwards}
.amp-success-check path{stroke:var(--amp-green-600);stroke-width:3;fill:none;stroke-dasharray:50;stroke-dashoffset:50;animation:drawCheck .4s ease-out .3s forwards}

/* ═══ Responsive ═══ */
@media(max-width:768px){
  .amp-two-col{grid-template-columns:1fr}
  .amp-nav-buttons{flex-direction:column-reverse;gap:var(--amp-sp-2)}
  .amp-nav-buttons .amp-btn{width:100%}
}
`;
}
