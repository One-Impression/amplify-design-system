// Theme: Modern Teal — Crisp teal accents, sharp geometry, tech-forward
module.exports = function() {
  return `
/* Theme: Modern Teal */
:root {
  --amp-bg: #F0FDFA;
  --amp-surface: #FFFFFF;
  --amp-accent: #0D9488;
  --amp-accent-light: #CCFBF1;
  --amp-text: #042F2E;
  --amp-text-secondary: #115E59;
  --amp-text-muted: #5EEAD4;
  --amp-border: #99F6E4;
  --amp-violet-50: #CCFBF1;
  --amp-violet-100: #99F6E4;
  --amp-violet-200: #5EEAD4;
  --amp-violet-300: #2DD4BF;
  --amp-violet-400: #14B8A6;
  --amp-violet-500: #0D9488;
  --amp-violet-600: #0D9488;
  --amp-violet-700: #0F766E;
  --amp-stone-50: #F7FFFE;
  --amp-stone-100: #F0FDFA;
  --amp-stone-200: #CCFBF1;
  --amp-stone-300: #99F6E4;
  --amp-stone-400: #115E59;
  --amp-green-50: #ECFDF5;
  --amp-green-600: #059669;
  --amp-radius-xl: 12px;
  --amp-radius-lg: 10px;
  --amp-radius-md: 8px;
  --amp-radius-full: 9999px;
  --amp-shadow-sm: 0 1px 3px rgba(13,148,136,0.06);
  --amp-shadow-md: 0 4px 12px rgba(13,148,136,0.08);
  --amp-shadow-lg: 0 8px 24px rgba(13,148,136,0.1);
}
body { background: linear-gradient(180deg, #F0FDFA 0%, #F7FFFE 100%); }
.amp-card { border: 1px solid rgba(153,246,228,0.5); }
.amp-card:hover { box-shadow: 0 4px 16px rgba(13,148,136,0.08); border-color: #5EEAD4; }
.amp-card.selected { border-color: var(--amp-accent); background: #CCFBF1; }
.amp-btn-primary { background: linear-gradient(135deg, #0D9488, #14B8A6); }
.amp-btn-primary:hover { background: linear-gradient(135deg, #0F766E, #0D9488); box-shadow: 0 4px 12px rgba(13,148,136,0.25); }
.amp-btn-outline { border-color: rgba(13,148,136,0.25); color: var(--amp-accent); }
.amp-btn-outline:hover { background: #CCFBF1; border-color: var(--amp-accent); }
.amp-topbar { background: #FFFFFF; border-bottom: 1px solid rgba(153,246,228,0.4); }
.amp-logo { color: var(--amp-accent); font-weight: 800; }
.amp-h1 { font-weight: 800; letter-spacing: -0.02em; color: #042F2E; }
.amp-input { border-color: rgba(153,246,228,0.5); }
.amp-input:focus { border-color: var(--amp-accent); box-shadow: 0 0 0 3px rgba(13,148,136,0.1); }
.amp-chip.active { background: var(--amp-accent); border-color: var(--amp-accent); }
.amp-badge-violet { background: #CCFBF1; color: #0F766E; }
.amp-badge-green { background: #ECFDF5; color: #059669; }
.amp-wallet { background: #CCFBF1; border-color: #99F6E4; }
.amp-wallet-fill { background: linear-gradient(90deg, #0D9488, #2DD4BF); }
.amp-avatar { background: linear-gradient(135deg, #0D9488, #2DD4BF); }
.amp-step.active .amp-step-circle { background: var(--amp-accent); border-color: var(--amp-accent); }
.amp-tab.active { color: var(--amp-accent); }
.amp-tabs { background: #F0FDFA; }
.amp-price-due { color: #0F766E; border-color: #99F6E4; }
.amp-section-num { background: var(--amp-accent); }
.amp-fab { background: linear-gradient(135deg, #0D9488, #14B8A6); box-shadow: 0 4px 12px rgba(13,148,136,0.25); }
.amp-progress-fill { background: linear-gradient(180deg, #0D9488, #2DD4BF); }
.amp-progress-dot.active { background: var(--amp-accent); box-shadow: 0 0 0 4px rgba(13,148,136,0.15); }
input[type=range]::-webkit-slider-thumb { background: var(--amp-accent); box-shadow: 0 2px 6px rgba(13,148,136,0.3); }
`;
};
