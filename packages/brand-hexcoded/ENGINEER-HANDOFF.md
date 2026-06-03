# Hexcoded — Engineer Handoff

Quick reference for engineers consuming `@one-impression/brand-hexcoded`.
Companion to [`BRAND-DECISIONS.md`](BRAND-DECISIONS.md) (the "why")
and [`README.md`](README.md) (the "how to use each asset").

---

## TL;DR

- Install `@one-impression/brand-hexcoded` for assets, `@one-impression/tokens-hexcoded` for tokens. They are **independent** — install both.
- All asset paths are exported from `index.js`. Resolve with your bundler's asset loader or `import.meta.resolve`.
- Phantom motion is **CSS keyframe-based** in `wordmark-with-phantom.svg` (`<style>` block + `@keyframes`). No JS required. Respects `prefers-reduced-motion`.
- `favicon-{16,32,180}.png` files are SVG sources — **render to PNG before deploy** (Sharp / Resvg / `sharp-cli`).
- All SVGs include `viewBox` and are responsive. No fixed-size raster anywhere.

---

## Web favicon link tags

```html
<link rel="icon"             type="image/svg+xml" href="/favicon-light.svg">
<link rel="icon"             type="image/png" sizes="32x32"   href="/favicon-32.png">
<link rel="icon"             type="image/png" sizes="16x16"   href="/favicon-16.png">
<link rel="apple-touch-icon"                    sizes="180x180" href="/favicon-180.png">
<link rel="mask-icon"        color="#22C55E"                  href="/safari-pinned-tab.svg">
<link rel="manifest"                                           href="/site.webmanifest">
<meta name="theme-color"     content="#22C55E">
```

---

## Phantom animation — replicate in CSS

If you need the Phantom effect on text other than the wordmark SVG (e.g., a hero headline), use this CSS pattern:

```css
.phantom {
  position: relative;
  color: #FFFFFF;
}
.phantom::before,
.phantom::after,
.phantom > .phantom-layer {
  content: attr(data-text);
  position: absolute;
  top: 0; left: 0;
  color: #22C55E;
  animation: phantom-breath 3s ease-in-out infinite;
}
.phantom::before        { transform: translate(1px, 1px); opacity: 0.85; }
.phantom > .phantom-layer { transform: translate(2px, 2px); opacity: 0.55; animation-delay: 100ms; }
.phantom::after         { transform: translate(3px, 3px); opacity: 0.32; animation-delay: 200ms; }

@keyframes phantom-breath {
  0%, 100% { opacity: var(--phantom-opacity, 0.85); }
  50%      { opacity: calc(var(--phantom-opacity, 0.85) * 0.4); }
}

@media (prefers-reduced-motion: reduce) {
  .phantom::before,
  .phantom::after,
  .phantom > .phantom-layer { animation: none; }
}
```

---

## Importing into React

```tsx
import wordmarkUrl from '@one-impression/brand-hexcoded/assets/logo/wordmark-with-phantom.svg';

export function HexcodedLogo() {
  return <img src={wordmarkUrl} alt="HEXCODED" width={240} />;
}
```

For inline SVG (if you need to style fills via `currentColor` etc.), import the source:

```tsx
import { ReactComponent as Wordmark } from '@one-impression/brand-hexcoded/assets/logo/wordmark-monochrome.svg';

<Wordmark style={{ color: '#22C55E' }} />
```

(Configure SVGR in your bundler.)

---

## Render PNG favicons before deploy

```sh
# install sharp once
npm i -D sharp

# convert SVG → PNG
node -e "require('sharp')('assets/favicons/favicon-32.png').png().toFile('public/favicon-32.png')"
```

Or via the `sharp-cli` one-liner per size. Wire into the static-site build step.

---

## CSP-safe usage

The Phantom animated SVG (`wordmark-with-phantom.svg`) uses a `<style>` block inside the SVG. If your CSP is `style-src 'self'`, this is allowed when the SVG is loaded via `<img src=...>` (the SVG is its own document). If you inline-render the SVG (`<svg>...</svg>` in HTML), you need `style-src 'self' 'unsafe-inline'` OR move the styles to an external stylesheet.

---

## Token wiring — see `@one-impression/tokens-hexcoded`

```css
@import "@one-impression/tokens-hexcoded/css";

.hero {
  background: var(--amp-hexcoded-theme-color-bg);
  color: var(--amp-hexcoded-theme-color-text-primary);
  font-family: var(--amp-hexcoded-font-display);
}
```

---

## Validation

```sh
npm run -w @one-impression/brand-hexcoded validate
```

CI runs this on every PR. Failures block merge.
