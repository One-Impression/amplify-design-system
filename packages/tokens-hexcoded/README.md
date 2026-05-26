# @one-impression/tokens-hexcoded

Hexcoded design tokens — the Tech Green direction (Outfit + Phantom motion) for the AI content platform.

> Hexcoded is a verb. "Take your brief, hexcode it, ship it."

## What this is

Token package for **Hexcoded**, the AI content platform that turns one brief into multi-format content (reel · static · caption · thumbnail · cutdown). These tokens encode the locked **Tech Green direction** from Brand Book v1.0 Final (2026-05-22):

- **Tech Green** (`#22C55E`) as THE brand colour — wordmark, primary actions, success state
- **Outfit** display (`weight 900` with `-0.025em` tracking) for the HEXCODED wordmark
- **Inter** for body, **JetBrains Mono** for code/numbers
- **Brand-true black** (`#0B0B0F`) as the dark surface — same hex as primary ink
- **Phantom motion** (size-aware breathing shadow) lives in `@one-impression/brand-hexcoded` — not in tokens
- **Light + dark themes** — soft warm white in light, brand-true black in dark; accent unchanged across modes

## Locked DNA

These are **not negotiable** at the package level (24 decisions locked, 1 parked):

| Element | Value |
|---|---|
| Brand colour | `#22C55E` Tech Green (Tailwind green-500 · PANTONE 354 C) |
| Wordmark | UPPERCASE only · no separators / dots / dashes inside HEXCODED |
| Display font | `'Outfit', sans-serif` at weight `900` |
| Display tracking | `-0.025em` |
| Body font | `'Inter', sans-serif` |
| Mono font | `'JetBrains Mono', monospace` |
| Monogram | `HEX` on `#0B0B0F`, breathing green shadow (Phantom) |
| Brand voice | Confident-direct · "Hexcoded turns one brief into…" · no marketing fluff |
| Self-reference | VERB — "Get hexcoded" · "Hexcode it" |

## Consume

Install:

```bash
npm install @one-impression/tokens-hexcoded
```

### Tailwind v4

```css
/* globals.css */
@import "@one-impression/tokens-hexcoded/tailwind";
```

### Plain CSS

```css
/* globals.css */
@import "@one-impression/tokens-hexcoded/css";

.button {
  background: var(--amp-hexcoded-theme-color-accent);
  color: var(--amp-hexcoded-theme-color-text-primary);
  font-family: var(--amp-hexcoded-font-display);
  font-weight: var(--amp-hexcoded-weight-display);
  letter-spacing: var(--amp-hexcoded-letter-spacing-tight);
}
```

### JS / TS

```ts
import * as tokens from '@one-impression/tokens-hexcoded/js';

console.log(tokens.themeColorAccent); // '#22C55E'
```

### SCSS

```scss
@use '@one-impression/tokens-hexcoded/scss' as hexcoded;

.button {
  background: hexcoded.$amp-hexcoded-theme-color-accent;
}
```

## Theme switching

Light is the default. Dark mode follows `prefers-color-scheme`, or attach `[data-theme="dark"]` to switch manually. Accent (Tech Green) is constant across modes — only surfaces and ink invert.

## Companion package

For wordmark SVGs, monogram, favicons, app icons, social templates, business cards, and email signature templates, use [`@one-impression/brand-hexcoded`](../brand-hexcoded).

## Source

Locked to: `design-system-final/index.html` · v1.0 Final · 2026-05-22 (md5 `fee731682ee0b95cdb05eabd736dfe41`).
