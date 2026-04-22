/**
 * Base CSS for standalone HTML rendering.
 * Provides styles for all amp-* utility classes used by template components.
 */
export function getBaseCSS(): string {
  return `
/* Reset */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:var(--amp-font);background:var(--amp-bg);color:var(--amp-text);font-size:var(--amp-text-base);line-height:1.5;min-height:100vh;-webkit-font-smoothing:antialiased}

/* Card */
.amp-card{background:var(--amp-surface);border-radius:var(--amp-radius-xl);border:2px solid transparent;box-shadow:var(--amp-shadow-sm);transition:all var(--amp-transition);overflow:hidden}
.amp-card:hover{box-shadow:var(--amp-shadow-md);transform:translateY(-2px)}
.amp-card.selected{border-color:var(--amp-accent);background:var(--amp-accent-light)}
.amp-card.faded{opacity:.5;transform:scale(.98)}
.amp-card.clickable{cursor:pointer}

/* Button */
.amp-btn{display:inline-flex;align-items:center;justify-content:center;gap:var(--amp-sp-2);padding:var(--amp-sp-3) var(--amp-sp-6);border-radius:var(--amp-radius-lg);font-size:var(--amp-text-base);font-weight:600;border:none;cursor:pointer;transition:all .2s;font-family:var(--amp-font)}
.amp-btn:active{transform:scale(.98)}
.amp-btn-primary{background:var(--amp-accent);color:#fff}
.amp-btn-primary:hover{background:var(--amp-violet-700)}
.amp-btn-primary:disabled{background:var(--amp-stone-300);cursor:not-allowed;transform:none}
.amp-btn-outline{background:var(--amp-surface);color:var(--amp-accent);border:2px solid var(--amp-violet-200)}
.amp-btn-outline:hover{border-color:var(--amp-accent);background:var(--amp-accent-light)}
.amp-btn-text{background:none;color:var(--amp-text-muted);padding:var(--amp-sp-3) var(--amp-sp-4)}
.amp-btn-text:hover{color:var(--amp-text)}
.amp-btn-lg{padding:var(--amp-sp-4) var(--amp-sp-8);font-size:var(--amp-text-md);border-radius:var(--amp-radius-xl)}
.amp-btn-full{width:100%}

/* Input */
.amp-input{width:100%;padding:var(--amp-sp-3) var(--amp-sp-4);border:2px solid var(--amp-border);border-radius:var(--amp-radius-lg);font-size:var(--amp-text-base);font-family:var(--amp-font);background:var(--amp-surface);color:var(--amp-text);outline:none;transition:border-color .2s}
.amp-input:focus{border-color:var(--amp-accent);box-shadow:0 0 0 3px rgba(124,58,237,.1)}
textarea.amp-input{resize:vertical;min-height:60px}

/* Chip */
.amp-chip{display:inline-flex;align-items:center;padding:var(--amp-sp-1) var(--amp-sp-3);border-radius:var(--amp-radius-full);font-size:var(--amp-text-xs);font-weight:500;border:1.5px solid var(--amp-border);background:var(--amp-surface);color:var(--amp-text-secondary);cursor:pointer;transition:all .2s;user-select:none}
.amp-chip.active{background:var(--amp-accent);border-color:var(--amp-accent);color:#fff}

/* Badge */
.amp-badge{display:inline-flex;align-items:center;padding:var(--amp-sp-1) var(--amp-sp-3);border-radius:var(--amp-radius-full);font-size:11px;font-weight:600}
.amp-badge-violet{background:var(--amp-accent-light);color:var(--amp-violet-700)}
.amp-badge-green{background:var(--amp-green-50);color:var(--amp-green-600)}

/* Headings */
.amp-h1{font-size:var(--amp-text-xl);font-weight:700;color:var(--amp-text);line-height:1.2}
.amp-h2{font-size:var(--amp-text-lg);font-weight:600;color:var(--amp-text);line-height:1.3}
.amp-h3{font-size:var(--amp-text-md);font-weight:600;color:var(--amp-text)}
.amp-sub{font-size:var(--amp-text-base);color:var(--amp-text-muted);margin-top:var(--amp-sp-1)}

/* Layout */
.amp-container{max-width:880px;margin:0 auto;padding:var(--amp-sp-8) var(--amp-sp-6) 80px}
.amp-container-narrow{max-width:720px;margin:0 auto;padding:var(--amp-sp-8) var(--amp-sp-6) 80px}
.amp-two-col{display:grid;grid-template-columns:55fr 45fr;gap:var(--amp-sp-8)}
.amp-nav-buttons{display:flex;justify-content:space-between;margin-top:var(--amp-sp-8)}

/* Price table */
.amp-price-row{display:flex;justify-content:space-between;padding:var(--amp-sp-1) 0;font-size:var(--amp-text-base);color:var(--amp-text-secondary)}
.amp-price-total{font-weight:700;font-size:16px;color:var(--amp-text);border-top:2px solid var(--amp-border);padding-top:var(--amp-sp-3);margin-top:var(--amp-sp-1)}
.amp-price-credit{color:var(--amp-green-600)}
.amp-price-due{font-weight:700;font-size:var(--amp-text-lg);color:var(--amp-violet-700);border-top:2px solid var(--amp-violet-200);padding-top:var(--amp-sp-3);margin-top:var(--amp-sp-1)}

/* Payment tabs */
.amp-tabs{display:flex;gap:2px;background:var(--amp-stone-100);border-radius:10px;padding:3px;margin:var(--amp-sp-4) 0}
.amp-tab{flex:1;text-align:center;padding:var(--amp-sp-2);border-radius:8px;font-size:var(--amp-text-sm);font-weight:500;color:var(--amp-text-muted);cursor:pointer;transition:all .2s;border:none;background:none;font-family:var(--amp-font)}
.amp-tab.active{background:var(--amp-surface);color:var(--amp-violet-700);font-weight:600;box-shadow:var(--amp-shadow-sm)}

/* Slider */
input[type=range]{-webkit-appearance:none;width:100%;height:6px;border-radius:var(--amp-radius-full);background:var(--amp-stone-200);outline:none;margin:var(--amp-sp-4) 0}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:var(--amp-radius-full);background:var(--amp-accent);cursor:pointer;border:3px solid #fff;box-shadow:0 2px 6px rgba(124,58,237,.3)}
.amp-slider-marks{display:flex;justify-content:space-between}
.amp-slider-marks span{font-size:11px;color:var(--amp-stone-400)}

/* Wallet card */
.amp-wallet{background:var(--amp-accent-light);border:1.5px solid var(--amp-violet-200);border-radius:var(--amp-radius-xl);padding:var(--amp-sp-5)}
.amp-wallet-bar{height:6px;border-radius:var(--amp-radius-full);background:var(--amp-violet-100);margin-top:var(--amp-sp-2);overflow:hidden}
.amp-wallet-fill{height:100%;border-radius:var(--amp-radius-full);background:var(--amp-accent);transition:width .6s}

/* Animations */
@keyframes fadeSlideIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
@keyframes drawCircle{to{stroke-dashoffset:0}}
@keyframes drawCheck{to{stroke-dashoffset:0}}
.amp-shimmer{background:linear-gradient(90deg,var(--amp-stone-100) 25%,var(--amp-stone-50) 50%,var(--amp-stone-100) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite}
.amp-fade-in{animation:fadeSlideIn .35s ease-out}

/* Topbar */
.amp-topbar{background:var(--amp-surface);border-bottom:1px solid var(--amp-border);padding:var(--amp-sp-3) var(--amp-sp-6);position:sticky;top:0;z-index:100}
.amp-topbar-inner{max-width:880px;margin:0 auto;display:flex;align-items:center;justify-content:space-between}
.amp-logo{font-size:22px;font-weight:700;color:var(--amp-accent);letter-spacing:-.5px}
.amp-avatar{width:32px;height:32px;border-radius:var(--amp-radius-full);background:linear-gradient(135deg,var(--amp-violet-400),var(--amp-accent));display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:600}

/* Modal */
.amp-modal-bg{position:fixed;inset:0;background:rgba(28,25,23,.4);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)}
.amp-modal-bg.show{display:flex}
.amp-modal{background:var(--amp-surface);border-radius:20px;padding:var(--amp-sp-8);max-width:440px;width:90%;box-shadow:var(--amp-shadow-lg);animation:fadeSlideIn .3s ease-out}

/* Success check */
.amp-success-check{width:72px;height:72px;margin:0 auto var(--amp-sp-5)}
.amp-success-check circle{stroke:var(--amp-green-600);stroke-width:3;fill:none;stroke-dasharray:200;stroke-dashoffset:200;animation:drawCircle .6s ease-out forwards}
.amp-success-check path{stroke:var(--amp-green-600);stroke-width:3;fill:none;stroke-dasharray:50;stroke-dashoffset:50;animation:drawCheck .4s ease-out .3s forwards}

/* Responsive */
@media(max-width:768px){
  .amp-two-col{grid-template-columns:1fr}
  .amp-nav-buttons{flex-direction:column-reverse;gap:var(--amp-sp-2)}
  .amp-nav-buttons .amp-btn{width:100%}
}
`;
}
