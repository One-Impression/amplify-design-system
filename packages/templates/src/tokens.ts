/**
 * Token CSS generator — produces all --amp-* CSS custom properties
 * for standalone HTML rendering.
 */
export function getTokensCSS(_product = 'brand'): string {
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

  /* Semantic aliases for @amplify/ui components */
  --amp-semantic-text-primary: var(--amp-stone-900);
  --amp-semantic-text-secondary: var(--amp-stone-600);
  --amp-semantic-text-muted: var(--amp-stone-500);
  --amp-semantic-bg-surface: var(--amp-surface);
  --amp-semantic-bg-sunken: var(--amp-stone-100);
  --amp-semantic-border-default: var(--amp-stone-200);
  --amp-semantic-border-focus: var(--amp-violet-600);
  --amp-semantic-accent: var(--amp-violet-600);
  --amp-semantic-status-error: var(--amp-red-600);

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
  --amp-font-size-xs: 12px; --amp-font-size-sm: 13px; --amp-font-size-base: 14px;
  --amp-font-size-md: 15px; --amp-font-size-lg: 18px; --amp-font-size-xl: 24px;

  /* Transitions */
  --amp-transition: 250ms ease-out;

  /* Tailwind-mapped tokens for @amplify/ui components */
  --color-brand: var(--amp-violet-600);
  --color-brand-dark: var(--amp-violet-700);
  --color-brand-light: var(--amp-violet-50);
  --color-surface-overlay: var(--amp-stone-100);
  --color-border: var(--amp-stone-200);
  --color-neutral-100: var(--amp-stone-100);
  --color-neutral-200: var(--amp-stone-200);
  --color-neutral-700: var(--amp-stone-700);
  --color-neutral-900: var(--amp-stone-900);
  --color-positive: var(--amp-green-600);
  --color-positive-light: var(--amp-green-50);
  --color-negative: var(--amp-red-600);
  --color-negative-light: var(--amp-red-50);
  --color-warning: var(--amp-amber-600);
  --color-warning-light: var(--amp-amber-50);
}`;
}
