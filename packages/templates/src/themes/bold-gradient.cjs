// Theme: Bold Gradient — Deep purple gradients, glass cards, vibrant accents
module.exports = function() {
  return `
/* Theme: Bold Gradient */
:root {
  --amp-bg: #0F0A1A;
  --amp-surface: rgba(255,255,255,0.06);
  --amp-accent: #A855F7;
  --amp-accent-light: rgba(168,85,247,0.12);
  --amp-text: #F5F3FF;
  --amp-text-secondary: #C4B5FD;
  --amp-text-muted: #8B5CF6;
  --amp-border: rgba(255,255,255,0.08);
  --amp-violet-50: rgba(168,85,247,0.08);
  --amp-violet-100: rgba(168,85,247,0.12);
  --amp-violet-200: rgba(168,85,247,0.2);
  --amp-violet-300: #C084FC;
  --amp-violet-400: #A855F7;
  --amp-violet-500: #9333EA;
  --amp-violet-600: #A855F7;
  --amp-violet-700: #C084FC;
  --amp-stone-50: rgba(255,255,255,0.03);
  --amp-stone-100: rgba(255,255,255,0.06);
  --amp-stone-200: rgba(255,255,255,0.08);
  --amp-stone-300: rgba(255,255,255,0.12);
  --amp-stone-400: rgba(255,255,255,0.3);
  --amp-green-50: rgba(5,150,105,0.12);
  --amp-green-600: #34D399;
  --amp-shadow-sm: 0 2px 8px rgba(0,0,0,0.3);
  --amp-shadow-md: 0 4px 16px rgba(0,0,0,0.4);
  --amp-shadow-lg: 0 8px 32px rgba(0,0,0,0.5);
}
body { background: linear-gradient(135deg, #0F0A1A 0%, #1A0B2E 50%, #16082A 100%); min-height: 100vh; }
.amp-card { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); }
.amp-card:hover { background: rgba(255,255,255,0.09); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(168,85,247,0.15); }
.amp-card.selected { border-color: var(--amp-accent); background: rgba(168,85,247,0.12); }
.amp-card.faded { opacity: 0.4; }
.amp-btn-primary { background: linear-gradient(135deg, #9333EA, #A855F7, #C084FC); border: none; color: #fff; }
.amp-btn-primary:hover { background: linear-gradient(135deg, #7C3AED, #9333EA, #A855F7); box-shadow: 0 4px 16px rgba(168,85,247,0.4); }
.amp-btn-outline { background: transparent; border-color: rgba(168,85,247,0.3); color: var(--amp-accent); }
.amp-btn-outline:hover { background: rgba(168,85,247,0.1); border-color: var(--amp-accent); }
.amp-btn-text { color: var(--amp-text-muted); }
.amp-topbar { background: rgba(15,10,26,0.8); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.06); }
.amp-logo { color: var(--amp-accent); }
.amp-input { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); color: var(--amp-text); }
.amp-input:focus { border-color: var(--amp-accent); box-shadow: 0 0 0 3px rgba(168,85,247,0.2); background: rgba(255,255,255,0.06); }
.amp-input::placeholder { color: rgba(255,255,255,0.25); }
.amp-chip { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); color: var(--amp-text-secondary); }
.amp-chip.active { background: var(--amp-accent); border-color: var(--amp-accent); color: #fff; }
.amp-badge-violet { background: rgba(168,85,247,0.15); color: #C084FC; }
.amp-badge-green { background: rgba(52,211,153,0.12); color: #34D399; }
.amp-wallet { background: rgba(168,85,247,0.08); border-color: rgba(168,85,247,0.2); }
.amp-wallet-fill { background: linear-gradient(90deg, #9333EA, #C084FC); }
.amp-shimmer { background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%); }
.amp-tabs { background: rgba(255,255,255,0.04); }
.amp-tab { color: rgba(255,255,255,0.4); }
.amp-tab.active { background: rgba(255,255,255,0.08); color: var(--amp-accent); }
.amp-modal { background: #1A0B2E; border: 1px solid rgba(255,255,255,0.1); }
.amp-modal-bg { background: rgba(0,0,0,0.6); }
input[type=range] { background: rgba(255,255,255,0.08); }
input[type=range]::-webkit-slider-thumb { background: linear-gradient(135deg, #9333EA, #C084FC); box-shadow: 0 2px 8px rgba(168,85,247,0.4); }
.amp-avatar { background: linear-gradient(135deg, #9333EA, #C084FC); }
.amp-price-row { color: var(--amp-text-secondary); }
.amp-price-total { color: var(--amp-text); border-color: rgba(255,255,255,0.1); }
.amp-price-due { color: #C084FC; border-color: rgba(168,85,247,0.3); }
.amp-price-credit { color: #34D399; }
.amp-success-check circle { stroke: #34D399; }
.amp-success-check path { stroke: #34D399; }
select.amp-input { background: rgba(255,255,255,0.04); color: var(--amp-text); }
select.amp-input option { background: #1A0B2E; color: var(--amp-text); }
.amp-progress-line { background: rgba(255,255,255,0.06); }
.amp-progress-fill { background: linear-gradient(180deg, #9333EA, #C084FC); }
.amp-progress-dot.active { background: var(--amp-accent); box-shadow: 0 0 0 4px rgba(168,85,247,0.2); }
.amp-section-num { background: linear-gradient(135deg, #9333EA, #C084FC); }
.amp-fab { background: linear-gradient(135deg, #9333EA, #C084FC); box-shadow: 0 4px 16px rgba(168,85,247,0.3); }
.amp-drawer { background: #1A0B2E; }
.amp-drawer button[onclick="closeDrawer()"] { background: rgba(255,255,255,0.06); color: var(--amp-text); }
`;
};
