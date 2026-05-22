# @amplify-ai/tokens-hexcoded

**Hexcoded design tokens** — Apple Premium aesthetic + Tech Green brand + Phantom motion.

Locked to **Brand Book v1.0 Final** (`@amplify-ai/brand-book-hexcoded`). 24 of 25 brand decisions locked. 1 parked (sonic identity).

## Install

```bash
npm install @amplify-ai/tokens-hexcoded
```

## Use

### CSS variables (recommended for Hexcoded apps)

```html
<link rel="stylesheet" href="node_modules/@amplify-ai/tokens-hexcoded/dist/variables.css" />
```

```css
.btn-primary {
  background: var(--color-accent);          /* Tech Green #22C55E */
  color: var(--color-bg-elev);
  border-radius: 999px;
  font-family: var(--font-body);
  height: 44px;                              /* Apple HIG min tap target */
}
```

### Tailwind v4 preset

```css
@import "@amplify-ai/tokens-hexcoded/tailwind";
```

### JavaScript / TypeScript

```js
import tokens from '@amplify-ai/tokens-hexcoded';
console.log(tokens.theme.color.accent.$value);   // "#22C55E"
```

### Tokens JSON (W3C DTCG)

```js
import tokens from '@amplify-ai/tokens-hexcoded/json';
```

## What's locked here

| Lock # | Token | Value |
|---|---|---|
| L02 | `color.accent` | `#22C55E` · Tech Green · Tailwind green-500 · RGB 34 197 94 · PANTONE 354 C |
| L05 | `font.display` | `Outfit, sans-serif` |
| L05 | `font.body`    | `Inter, system-ui, sans-serif` |
| L05 | `font.mono`    | `JetBrains Mono, monospace` |
| L05 | `weight.display` | `900` |
| L01 | `motion.duration.phantom` | `3000ms` |
| L04 | `motion.easing.phantom`   | `ease-in-out` |
| L19 | `state.warning` | `#FBBF24` |
| L19 | `state.danger`  | `#EF4444` |
| L19 | `state.success` | `#22C55E` (= accent) |
| L18 | Dark mode | OS preference only · no manual toggle in v1 |

Full lock at `@amplify-ai/brand-book-hexcoded`.

## Phantom motion family

Size-aware shadow keyframes (offsets scale with logo size):

| Variant | Layers | Offsets | Used at |
|---|---|---|---|
| `phantomXs` | 1 | 1px | ≤16px favicon |
| `phantomSm` | 2 | 1px · 2px | 18–28px sidebar |
| `phantomShadow` (default) | 3 | 1px · 2px · 3px | 32–48px |
| `phantomLG` | 3 | 2px · 3px · 5px | 56–80px hero |
| `phantomXL` | 4 | 2px · 4px · 6px · 8px | 96px+ cover |
| `phantomGreen` | 3 | 1/2/3px · `rgba(0,0,0,0.25)` | on green-bg surfaces |

All cycle 3s ease-in-out · solid → transparent → solid.

## Dark mode · L18

Light is the default theme. Dark variant activates via `prefers-color-scheme: dark` only — there is no manual toggle in v1. Tokens declare both modes; consumers wire them via media query.

## Build

```bash
npm run build
```

Generates `dist/variables.css`, `dist/variables.scss`, `dist/tokens.json`, `dist/tokens.js`, `dist/tailwind.css`.

## Depends on

- [`@amplify-ai/tokens-foundation`](../tokens-foundation) — shared primitives (spacing, radii, breakpoints, z-index)

## Pairs with

- [`@amplify-ai/brand-book-hexcoded`](../brand-book-hexcoded) — human-readable book, logo files, guidelines
- [`@amplify-ai/ui`](../ui) — shared component library
