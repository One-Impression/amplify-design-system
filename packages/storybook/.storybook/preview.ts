import type { Preview } from '@storybook/react';

/**
 * Theme switcher.
 *
 * Each entry maps a theme id to the published CSS module of its
 * @one-impression/tokens-* package. The CSS is loaded lazily via a
 * <link rel="stylesheet"> tag pointing at the package's exported
 * /css entry — so Vite does NOT need to resolve it at build time.
 *
 * If a token package isn't installed/published yet, the <link> 404s
 * silently and Storybook keeps rendering (no crash). When the package
 * publishes, the theme starts working with no preview.ts changes.
 */
const THEMES = {
  brand:        { label: 'Brand',        href: '/_themes/brand.css' },
  atmosphere:   { label: 'Atmosphere',   href: '/_themes/atmosphere.css' },
  creator:      { label: 'Creator',      href: '/_themes/creator.css' },
  studio:       { label: 'Studio',       href: '/_themes/studio.css' },
  marketing:    { label: 'Marketing',    href: '/_themes/marketing.css' },
  oportunities: { label: 'Oportunities', href: '/_themes/oportunities.css' },
} as const;

type ThemeId = keyof typeof THEMES;

const linked = new Set<ThemeId>();
function ensureThemeLink(id: ThemeId) {
  if (linked.has(id) || typeof document === 'undefined') return;
  linked.add(id);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = THEMES[id].href;
  link.dataset.theme = id;
  link.onerror = () => {
    // Token package not yet built/published — keep going.
    link.remove();
  };
  document.head.appendChild(link);
}

function applyTheme(id: ThemeId, mode: 'light' | 'dark') {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-theme', id);
  root.setAttribute('data-mode', mode);
  root.classList.toggle('dark', mode === 'dark');
  ensureThemeLink(id);
}

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Active product theme (loads the matching tokens-* CSS)',
      defaultValue: 'brand',
      toolbar: {
        icon: 'paintbrush',
        items: (Object.keys(THEMES) as ThemeId[]).map((id) => ({
          value: id,
          title: THEMES[id].label,
        })),
        dynamicTitle: true,
      },
    },
    mode: {
      name: 'Mode',
      description: 'Light / dark mode',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const id = (context.globals.theme as ThemeId) ?? 'brand';
      const mode = (context.globals.mode as 'light' | 'dark') ?? 'light';
      applyTheme(id, mode);
      return Story(context);
    },
  ],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0a0a0a' },
        { name: 'brand', value: '#f5f3ff' },
        { name: 'oportunities-cream', value: '#FDF8F3' },
        { name: 'oportunities-ink', value: '#0F0D0B' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          'Oportunities',
          ['Brand', 'Logo', 'Color', 'Typography', 'Components', 'Voice', 'AppIcon', 'Favicon'],
          'Components',
        ],
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;
