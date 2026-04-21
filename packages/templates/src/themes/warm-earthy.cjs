// Theme: Warm Earthy — Warm tones, serif headings, rounded organic feel
module.exports = function() {
  return `
/* Theme: Warm Earthy */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap');
:root {
  --amp-bg: #FFFCF7;
  --amp-surface: #FFFFFF;
  --amp-accent: #B45309;
  --amp-accent-light: #FEF3C7;
  --amp-text: #451A03;
  --amp-text-secondary: #92400E;
  --amp-text-muted: #B45309;
  --amp-border: #FDE68A;
  --amp-violet-50: #FEF3C7;
  --amp-violet-100: #FDE68A;
  --amp-violet-200: #FCD34D;
  --amp-violet-300: #FBBF24;
  --amp-violet-400: #F59E0B;
  --amp-violet-500: #D97706;
  --amp-violet-600: #B45309;
  --amp-violet-700: #92400E;
  --amp-stone-50: #FFFDF5;
  --amp-stone-100: #FEF9EE;
  --amp-stone-200: #FDE68A;
  --amp-stone-300: #FCD34D;
  --amp-stone-400: #92400E;
  --amp-radius-xl: 20px;
  --amp-radius-lg: 16px;
  --amp-radius-md: 12px;
  --amp-radius-full: 9999px;
  --amp-shadow-sm: 0 1px 3px rgba(180,83,9,0.06);
  --amp-shadow-md: 0 4px 12px rgba(180,83,9,0.08);
  --amp-shadow-lg: 0 8px 24px rgba(180,83,9,0.1);
}
body { background: linear-gradient(180deg, #FFFCF7 0%, #FEF9EE 100%); }
.amp-h1, .amp-h2 { font-family: 'Playfair Display', Georgia, serif; letter-spacing: -0.02em; }
.amp-h1 { font-size: 30px; font-weight: 800; color: #451A03; }
.amp-h2 { font-weight: 700; }
.amp-card { border: 1px solid rgba(253,211,77,0.4); border-radius: 20px; }
.amp-card:hover { box-shadow: 0 6px 20px rgba(180,83,9,0.08); }
.amp-card.selected { border-color: var(--amp-accent); background: #FEF3C7; }
.amp-btn-primary { background: linear-gradient(135deg, #B45309, #D97706); border-radius: 14px; }
.amp-btn-primary:hover { background: linear-gradient(135deg, #92400E, #B45309); }
.amp-btn-outline { border-color: rgba(180,83,9,0.25); color: var(--amp-accent); border-radius: 14px; }
.amp-btn-outline:hover { background: #FEF3C7; border-color: var(--amp-accent); }
.amp-topbar { background: #FFFCF7; border-bottom: 1px solid rgba(253,211,77,0.3); }
.amp-logo { color: var(--amp-accent); font-family: 'Playfair Display', serif; font-weight: 800; }
.amp-input { border-color: rgba(253,211,77,0.4); border-radius: 14px; }
.amp-input:focus { border-color: var(--amp-accent); box-shadow: 0 0 0 3px rgba(180,83,9,0.1); }
.amp-chip { border-radius: 12px; }
.amp-chip.active { background: var(--amp-accent); border-color: var(--amp-accent); }
.amp-badge-violet { background: #FEF3C7; color: #92400E; }
.amp-badge-green { background: #ECFDF5; color: #059669; }
.amp-wallet { background: #FEF3C7; border-color: #FCD34D; }
.amp-wallet-fill { background: linear-gradient(90deg, #B45309, #D97706); }
.amp-avatar { background: linear-gradient(135deg, #D97706, #B45309); }
.amp-step.active .amp-step-circle { background: var(--amp-accent); border-color: var(--amp-accent); }
.amp-step.done .amp-step-circle { background: #059669; border-color: #059669; }
.amp-tab.active { color: var(--amp-accent); }
.amp-tabs { background: #FEF9EE; }
.amp-price-due { color: #92400E; border-color: #FCD34D; }
.amp-price-credit { color: #059669; }
.amp-section-num { background: var(--amp-accent); }
.amp-fab { background: var(--amp-accent); }
.amp-progress-fill { background: var(--amp-accent); }
.amp-progress-dot.active { background: var(--amp-accent); box-shadow: 0 0 0 4px rgba(180,83,9,0.15); }
input[type=range]::-webkit-slider-thumb { background: var(--amp-accent); box-shadow: 0 2px 6px rgba(180,83,9,0.3); }
`;
};
