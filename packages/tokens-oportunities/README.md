# @amplify-ai/tokens-oportunities

Oportunities design tokens — the Studio direction (Geist + apricot period) for the creator-intent intelligence platform.

> Note the single-P spelling: **Oportunities**, never *Opportunities*.

## What this is

Token package for **Oportunities**, the creator-intent platform spanning three surfaces (brand platform, internal tool, creator app). These tokens encode the locked **Studio direction**:

- **Apricot** (`#E68F47`) as the signature brand color — wordmark, primary actions
- **AI purple** (`#7B5BFF`) paired with apricot in the brand gradient and on AI surfaces
- **Geist** for display (wordmark + headers) at `weight 600` with `-0.04em` tracking — the wordmark's signature
- **Inter** for body, **JetBrains Mono** for code/numbers
- **Effort palette** (organic / sample / sponsor / paid) for creator-intent classification
- **Light + dark themes** — cream-on-warm in light, warm-black-on-bright-apricot in dark

## Locked Studio DNA

These are **not negotiable** at the package level:

| Element | Value |
|---|---|
| Wordmark color | `#E68F47` apricot |
| Wordmark period (`.`) | Apricot, slightly oversized — part of the mark |
| Sweep animation | Apricot → purple → apricot gradient sweep across letters |
| Display font | `'Geist', 'Inter Tight', sans-serif` |
| Display weight | `600` |
| Display tracking | `-0.04em` |
| Brand gradient | `linear-gradient(135deg, #E68F47 0%, #7B5BFF 100%)` |
| Brand voice marker | `Heads up —` (em-dash prefix, casual) |

## Consume

Install:

```bash
npm install @amplify-ai/tokens-oportunities
```

### Tailwind v4

```css
/* globals.css */
@import "@amplify-ai/tokens-oportunities/tailwind";
```

### Plain CSS

```css
/* globals.css */
@import "@amplify-ai/tokens-oportunities/css";

.button {
  background: var(--amp-oportunities-theme-color-accent);
  color: var(--amp-oportunities-theme-color-text-primary);
  font-family: var(--amp-oportunities-font-display);
  font-weight: var(--amp-oportunities-weight-display);
  letter-spacing: var(--amp-oportunities-letter-spacing-tight);
}
```

### JS / TS

```ts
import * as tokens from '@amplify-ai/tokens-oportunities/js';

console.log(tokens.themeColorAccent); // '#E68F47'
```

### SCSS

```scss
@use '@amplify-ai/tokens-oportunities/scss' as oportunities;

.button {
  background: oportunities.$amp-oportunities-theme-color-accent;
}
```

### JSON

```ts
import tokens from '@amplify-ai/tokens-oportunities/json';
```

## Foundation dependency

This package depends on `@amplify-ai/tokens-foundation` for the primitive scales (spacing, radius, shadow, typography scale). Foundation primitives are **inherited as-is** — Oportunities only overrides semantic + cockpit layers.

## Build

```bash
npm run build
```

Generates in `dist/`:

- `variables.css` — CSS custom properties (light + dark via `[data-theme="dark"]`)
- `variables.scss` — SCSS variables
- `tailwind.css` — Tailwind v4 `@theme` preset
- `tokens.json` — flat key-value JSON
- `tokens.js` — ES module with named exports

## Brand voice marker

Oportunities-surfaced copy opens with `Heads up —` (em-dash, lowercase). This is encoded in product copy, not tokens, but listed here as the canonical brand-voice anchor.
