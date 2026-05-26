# @one-impression/brand-hexcoded

Locked brand assets for **Hexcoded** — the AI content platform.
Theme direction: **Tech Green** (Outfit 900 wordmark + Phantom motion).

This package ships ready-to-use SVG/HTML assets — no build step, no token wiring.
For runtime tokens (colors, type, motion), use [`@one-impression/tokens-hexcoded`](../tokens-hexcoded).

---

## Folder layout

```
assets/
  logo/                  6 wordmark variants (incl. Phantom-animated)
  icons/                 App icons (light + dark, 1024 + 180, PWA maskable, spec)
  favicons/              Favicon sources (SVG + per-size PNG sources + safari + webmanifest)
  social/                LinkedIn cover/post, IG post/story, X banner, OG image
  business-cards/        Front + back at 89 × 54 mm (300 DPI print spec)
  email-signature/       Full + minimal HTML signature templates
```

---

## Naming convention

`<asset-type>-<variant>-<size>.svg`

Examples:
- `wordmark-on-dark.svg`
- `app-icon-dark-1024.svg`
- `linkedin-cover-1584x396.svg`
- `business-card-front-89x54.svg`

Sizes follow the platform's native canvas spec where one exists (LinkedIn cover is
always 1584×396, an iPhone touch icon is always 180×180, etc).

---

## How to use each asset

### Logo / wordmark

- **`wordmark-default.svg`** — Transparent background, ink-black `#0B0B0F` wordmark. Default for most surfaces.
- **`wordmark-on-light.svg`** — Warm-white `#FAFAFA` background bundled, ink-black wordmark. For printed material.
- **`wordmark-on-dark.svg`** — Ink-black `#0B0B0F` background, white wordmark, Tech Green stepped **Phantom shadow** (3 layers: 1/2/3px offsets). Canonical dark variant per L01.
- **`wordmark-monochrome.svg`** — Uses `currentColor` for fill — drop into any single-ink context (engraving, foiling, single-color print).
- **`wordmark-with-phantom.svg`** — **Animated** Phantom variant. 3-layer green stepped shadow breathing opacity on 3s ease-in-out cycle. Respects `prefers-reduced-motion`. Use on hero surfaces, landing pages, splash screens.
- **`wordmark-spec.svg`** — Reference only. Shows clear-space rule (1× cap-height all sides) and bounding box.

### App icons (HEX monogram)

- iOS / Android home-screen: `app-icon-{light,dark}-{1024,180}.svg`
- **Dark variant is canonical** per L08/L09: HEX white on `#0B0B0F` with green Phantom shadow.
- iOS touch icon (`<link rel="apple-touch-icon">`): `app-icon-light-180.svg` or `app-icon-dark-180.svg`
- PWA maskable (`purpose="maskable"`): `pwa-maskable-icon-512.svg` (respects 80% safe-zone)
- Specification reference: `app-icon-spec.svg` (squircle radius 22.37%, safe-zone, glyph alignment)

### Favicons

- Modern browsers: link `favicon-light.svg` (with `<meta name="theme-color" content="#22C55E">`)
- Legacy / iOS touch: `favicon-{16,32,180}.png` (these files contain SVG sources at the spec dimension — **render to PNG before deploy** via Sharp / Resvg / equivalent)
- Safari pinned tab: `safari-pinned-tab.svg` (monochrome — Safari applies user-defined tint)
- PWA manifest: `site.webmanifest`

### Social

Templates pre-sized for each platform's native canvas. Drop your headline copy into the existing text placement and re-export to PNG / JPG for upload.

### Business cards

89 × 54 mm at 300 DPI = 1051 × 638 px. CMYK conversion happens at the printer (Tech Green `#22C55E` ≈ PANTONE 354 C).

### Email signature

Two variants. Both use inline styles only (no external CSS, no `<script>`) — works in Gmail / Outlook / Apple Mail / iOS / Android Mail. Replace `Your Name`, `Title`, and `you@hexcoded.com` placeholders.

---

## Consume from JS

```js
import brand from '@one-impression/brand-hexcoded';

const wordmarkPath = brand.wordmark.default; // 'assets/logo/wordmark-default.svg'
const greenHex     = brand.brandColors.techGreen; // '#22C55E'
```

Or import named exports:

```js
import { wordmark, appIcon, brandColors } from '@one-impression/brand-hexcoded';
```

To resolve to an absolute path, use Node's `import.meta.resolve` or your bundler's asset loader.

---

## Validate

```sh
npm run -w @one-impression/brand-hexcoded validate
```

Checks all SVGs have `<svg>` + `</svg>` + `viewBox`, email signatures have inline styles + no `<script>`, and `site.webmanifest` is valid JSON.

---

## Locked source

Anchored to: `design-system-final/index.html` · v1.0 Final · 2026-05-22 (md5 `fee731682ee0b95cdb05eabd736dfe41`). Full decision log in [`BRAND-DECISIONS.md`](BRAND-DECISIONS.md). Engineering notes in [`ENGINEER-HANDOFF.md`](ENGINEER-HANDOFF.md).
