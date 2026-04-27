/**
 * Token CSS generator — produces all --amp-* CSS custom properties
 * for standalone HTML rendering.
 */
export function getTokensCSS(_product = 'brand'): string {
  return `
:root {
  /* Brand (primary accent) — from tailwind-preset colors.brand */
  --amp-violet-50: #F5F0FF;
  --amp-violet-100: #EDEAFC;
  --amp-violet-200: #DBD2F6;
  --amp-violet-300: #C4B5FD;
  --amp-violet-400: #9B6BFF;
  --amp-violet-500: #7C5CFF;
  --amp-violet-600: #6531FF;
  --amp-violet-700: #752AD4;
  --amp-violet-800: #4A1FA8;
  --amp-violet-900: #3B1785;

  /* Neutral — from tailwind-preset colors.neutral + surface */
  --amp-stone-50: #f8f9fd;
  --amp-stone-100: #f1f6fe;
  --amp-stone-200: #d0d1d3;
  --amp-stone-300: #b8bcc0;
  --amp-stone-400: #8e939b;
  --amp-stone-500: #6b7280;
  --amp-stone-600: #4b5563;
  --amp-stone-700: #374151;
  --amp-stone-800: #1f2937;
  --amp-stone-900: #1D252D;

  /* Status — from tailwind-preset colors.positive/negative/warning */
  --amp-green-50: #E8FAF3;
  --amp-green-600: #21C179;
  --amp-amber-50: #fff8e1;
  --amp-amber-600: #ffc107;
  --amp-red-50: #FFEBEF;
  --amp-red-600: #fd5154;
  --amp-blue-50: #EFF6FF;
  --amp-blue-600: #2563EB;

  /* Semantic — mapped to preset values */
  --amp-bg: #f8f9fd;
  --amp-surface: #ffffff;
  --amp-surface-overlay: rgba(29, 37, 45, 0.07);
  --amp-text: #1D252D;
  --amp-text-secondary: rgba(29, 37, 45, 0.58);
  --amp-text-muted: #6b7280;
  --amp-border: rgba(29, 37, 45, 0.08);
  --amp-border-strong: rgba(29, 37, 45, 0.16);
  --amp-border-brand: #DBD2F6;
  --amp-accent: #6531FF;
  --amp-accent-hover: #752AD4;
  --amp-accent-light: #EDEAFC;

  /* Semantic aliases for @one-impression/ui components */
  --amp-semantic-text-primary: var(--amp-stone-900);
  --amp-semantic-text-secondary: var(--amp-stone-600);
  --amp-semantic-text-muted: var(--amp-stone-500);
  --amp-semantic-bg-surface: var(--amp-surface);
  --amp-semantic-bg-sunken: var(--amp-stone-100);
  --amp-semantic-border-default: var(--amp-stone-200);
  --amp-semantic-border-focus: var(--amp-violet-600);
  --amp-semantic-accent: var(--amp-violet-600);
  --amp-semantic-status-error: var(--amp-red-600);

  /* Spacing — from tokens-foundation spacing.json */
  --amp-sp-1: 4px; --amp-sp-2: 8px; --amp-sp-3: 12px; --amp-sp-4: 16px;
  --amp-sp-5: 20px; --amp-sp-6: 24px; --amp-sp-8: 32px; --amp-sp-10: 40px;
  --amp-sp-12: 48px; --amp-sp-16: 64px;

  /* Radius — from tokens-foundation radii.json */
  --amp-radius-sm: 4px; --amp-radius-md: 8px; --amp-radius-lg: 12px;
  --amp-radius-xl: 16px; --amp-radius-2xl: 24px; --amp-radius-full: 9999px;

  /* Shadows — standard + brand shadow from preset */
  --amp-shadow-sm: 0 1px 3px rgba(28,25,23,0.04);
  --amp-shadow-md: 0 2px 8px rgba(28,25,23,0.06);
  --amp-shadow-lg: 0 8px 24px rgba(28,25,23,0.08);
  --amp-shadow-brand: 0 4px 20px rgba(101, 49, 255, 0.24);

  /* Gradients — from tailwind-preset backgroundImage */
  --amp-gradient-brand: linear-gradient(96deg, #F55DC1 3.78%, #495AF4 97.89%);
  --amp-gradient-brand-soft: linear-gradient(135deg, #6531ff 0%, #9b6bff 100%);

  /* Typography — from tailwind-preset fontSize + foundation */
  --amp-font: 'Inter', system-ui, -apple-system, sans-serif;
  --amp-text-xs: 11px; --amp-text-sm: 13px; --amp-text-base: 14px;
  --amp-text-md: 15px; --amp-text-lg: 18px; --amp-text-xl: 24px; --amp-text-2xl: 32px;
  --amp-font-size-xs: 11px; --amp-font-size-sm: 13px; --amp-font-size-base: 14px;
  --amp-font-size-md: 15px; --amp-font-size-lg: 18px; --amp-font-size-xl: 24px;

  /* Transitions */
  --amp-transition: 150ms ease;

  /* Tailwind-mapped tokens for @one-impression/ui components */
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
