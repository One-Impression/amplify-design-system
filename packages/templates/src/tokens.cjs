module.exports = function getTokensCSS(product = 'brand') {
  // Core tokens shared across all products
  return `
:root {
  /* Colors - Violet (Primary) */
  --amp-violet-50: #FAF5FF; --amp-violet-100: #F3E8FF; --amp-violet-200: #E9D5FF;
  --amp-violet-300: #D8B4FE; --amp-violet-400: #C084FC; --amp-violet-500: #A855F7;
  --amp-violet-600: #7C3AED; --amp-violet-700: #6D28D9; --amp-violet-800: #5B21B6;
  --amp-violet-900: #4C1D95;

  /* Colors - Stone (Neutral) */
  --amp-stone-50: #FAFAF9; --amp-stone-100: #F5F5F4; --amp-stone-200: #E7E5E4;
  --amp-stone-300: #D6D3D1; --amp-stone-400: #A8A29E; --amp-stone-500: #78716C;
  --amp-stone-600: #57534E; --amp-stone-700: #44403C; --amp-stone-800: #292524;
  --amp-stone-900: #1C1917;

  /* Colors - Status */
  --amp-green-50: #ECFDF5; --amp-green-600: #059669;
  --amp-amber-50: #FFFBEB; --amp-amber-600: #D97706;
  --amp-red-50: #FEF2F2; --amp-red-600: #DC2626;
  --amp-blue-50: #EFF6FF; --amp-blue-600: #2563EB;

  /* Semantic */
  --amp-bg: var(--amp-stone-50);
  --amp-surface: #FFFFFF;
  --amp-text: var(--amp-stone-900);
  --amp-text-secondary: var(--amp-stone-600);
  --amp-text-muted: var(--amp-stone-500);
  --amp-border: var(--amp-stone-200);
  --amp-accent: var(--amp-violet-600);
  --amp-accent-light: var(--amp-violet-50);

  /* Spacing */
  --amp-sp-1: 4px; --amp-sp-2: 8px; --amp-sp-3: 12px; --amp-sp-4: 16px;
  --amp-sp-5: 20px; --amp-sp-6: 24px; --amp-sp-8: 32px; --amp-sp-10: 40px;
  --amp-sp-12: 48px; --amp-sp-16: 64px;

  /* Radius */
  --amp-radius-sm: 4px; --amp-radius-md: 8px; --amp-radius-lg: 12px;
  --amp-radius-xl: 16px; --amp-radius-2xl: 24px; --amp-radius-full: 9999px;

  /* Shadows */
  --amp-shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --amp-shadow-md: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05);
  --amp-shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04);

  /* Typography */
  --amp-font: 'Inter', system-ui, -apple-system, sans-serif;
  --amp-text-xs: 12px; --amp-text-sm: 13px; --amp-text-base: 14px;
  --amp-text-md: 15px; --amp-text-lg: 18px; --amp-text-xl: 24px; --amp-text-2xl: 34px;

  /* Transitions */
  --amp-transition: 250ms ease-out;
}`;
};
