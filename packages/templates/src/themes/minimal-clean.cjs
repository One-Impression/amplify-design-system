// Theme: Minimal Clean — Maximum whitespace, subtle borders, light and airy
module.exports = function() {
  return `
/* Theme: Minimal Clean */
:root {
  --amp-bg: #FFFFFF;
  --amp-surface: #FFFFFF;
  --amp-accent: #18181B;
  --amp-accent-light: #F4F4F5;
  --amp-text: #18181B;
  --amp-text-secondary: #71717A;
  --amp-text-muted: #A1A1AA;
  --amp-border: #F4F4F5;
  --amp-violet-50: #F4F4F5;
  --amp-violet-100: #E4E4E7;
  --amp-violet-200: #D4D4D8;
  --amp-violet-300: #A1A1AA;
  --amp-violet-400: #71717A;
  --amp-violet-500: #52525B;
  --amp-violet-600: #18181B;
  --amp-violet-700: #09090B;
  --amp-stone-50: #FAFAFA;
  --amp-stone-100: #F4F4F5;
  --amp-stone-200: #E4E4E7;
  --amp-radius-xl: 8px;
  --amp-radius-lg: 6px;
  --amp-radius-md: 4px;
  --amp-shadow-sm: none;
  --amp-shadow-md: 0 1px 2px rgba(0,0,0,0.04);
  --amp-shadow-lg: 0 2px 8px rgba(0,0,0,0.06);
}
body { letter-spacing: -0.01em; }
.amp-card { border: 1px solid var(--amp-border); box-shadow: none; }
.amp-card:hover { box-shadow: none; transform: none; border-color: var(--amp-stone-200); }
.amp-card.selected { border-color: var(--amp-accent); background: var(--amp-accent-light); }
.amp-btn-primary { border-radius: 6px; font-weight: 500; letter-spacing: -0.01em; }
.amp-topbar { border-bottom: none; box-shadow: none; }
.amp-logo { color: var(--amp-accent); font-weight: 800; letter-spacing: -1px; }
.amp-h1 { font-weight: 800; letter-spacing: -0.03em; font-size: 28px; }
.amp-h2 { font-weight: 700; letter-spacing: -0.02em; }
.amp-chip.active { background: var(--amp-accent); border-color: var(--amp-accent); }
.amp-badge-violet { background: var(--amp-accent-light); color: var(--amp-accent); }
.amp-badge-green { background: #ECFDF5; color: #059669; }
.amp-wallet { background: #F8FAFC; border-color: #E2E8F0; }
.amp-wallet-fill { background: var(--amp-accent); }
.amp-avatar { background: var(--amp-accent); }
.amp-step.active .amp-step-circle { background: var(--amp-accent); border-color: var(--amp-accent); }
.amp-section-num { background: var(--amp-accent); }
.amp-fab { background: var(--amp-accent); box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
.amp-input:focus { border-color: var(--amp-accent); box-shadow: 0 0 0 2px rgba(24,24,27,0.08); }
.amp-tab.active { color: var(--amp-accent); }
`;
};
