# @amplify-ai/brand-oportunities

Locked brand assets for **Oportunities** — the creator-intent intelligence platform.
Theme direction: **Studio** (Geist + apricot period).

This package ships ready-to-use SVG/HTML assets — no build step, no token wiring.
For runtime tokens (colors, type, spacing), use `@amplify-ai/tokens-oportunities`.

---

## Folder layout

```
assets/
  logo/                  6 wordmark variants
  icons/                 App icons (light + dark, 1024 + 180, PWA maskable, spec)
  favicons/              Favicon sources (SVG + per-size + safari pinned tab + webmanifest)
  social/                LinkedIn cover/post, IG post/story, X banner, OG image
  business-cards/        Front + back at 89 × 54 mm (300 DPI print spec)
  email-signature/       Full + minimal HTML signature templates
```

---

## Naming convention

`<asset-type>-<variant>-<size>.svg`

Examples:
- `wordmark-on-dark.svg`
- `app-icon-light-1024.svg`
- `linkedin-cover-1584x396.svg`
- `business-card-front-89x54.svg`

Sizes follow the platform's native canvas spec where one exists (LinkedIn cover is
always 1584×396, an iPhone touch icon is always 180×180, etc).

---

## How to use each asset

### Logo / wordmark
- **`wordmark-default.svg`** — Transparent background, dark ink. Default for most surfaces.
- **`wordmark-on-light.svg`** — Cream `#FDF8F3` background bundled, for printed material.
- **`wordmark-on-dark.svg`** — Dark `#0F0D0B` background, cream wordmark, **brighter** apricot period (`#F0A668`) for AA contrast.
- **`wordmark-monochrome.svg`** — Uses `currentColor` for fill — drop into any single-ink context (engraving, foiling, single-color print).
- **`wordmark-with-gradient.svg`** — Static snapshot of the **signature** apricot → purple gradient sweep. Use sparingly: brand moments, cover heroes.
- **`wordmark-spec.svg`** — Reference only. Shows clear-space rule (1× cap-height all sides) and bounding box.

### App icons
- iOS / Android home-screen: `app-icon-{light,dark}-{1024,180}.svg`
- iOS touch icon (`<link rel="apple-touch-icon">`): `app-icon-light-180.svg`
- PWA maskable (`purpose="maskable"`): `pwa-maskable-icon-512.svg` (respects 80% safe-zone)
- Specification reference: `app-icon-spec.svg` (squircle radius 22.37%, safe-zone, glyph alignment)

### Favicons
- Modern browsers: link `favicon-light.svg` (with `<meta name="theme-color">`)
- Legacy: `favicon-{16,32,180}.png` (these files contain SVG sources at the spec dimension; render to PNG before deploy)
- Safari pinned tab: `safari-pinned-tab.svg` (monochrome — Safari applies tint)
- PWA manifest: `site.webmanifest`

### Social
Each file is the **exact** size requested by the platform. Replace `{...}` placeholder text in headlines before publishing.

### Business cards
Print-ready at 89 × 54 mm (standard EU/UK card). Includes 3 mm safety margin via inner padding. Replace `Apaksh Gupta` / `Founder` placeholders before press.

### Email signature
Two variants:
- `email-signature.html` — full, includes inline-SVG wordmark
- `email-signature-minimal.html` — text-only, maximum client compatibility (Outlook, older Gmail web)

Both use only email-safe inline CSS. **No** external stylesheets, **no** JavaScript, **no** web fonts.

Placeholder substitution: `{name}`, `{title}`, `{email}`, `{phone}` — replace via your CRM / signature manager.

---

## License & usage

Internal use across the One Impression / Amplify organization. Team members may use
these assets freely for any legitimate Oportunities work (presentations, social
posts, business cards, email signatures, marketing material).

**Do not** distribute the source files outside the org. **Do not** modify the
wordmark proportions, the apricot period color, or the squircle radius — these are
locked.

---

## Programmatic access

```js
import { wordmark, appIcon, favicon, brandColors } from '@amplify-ai/brand-oportunities';

// Returns asset paths relative to the package root.
console.log(wordmark.default); // 'assets/logo/wordmark-default.svg'
console.log(brandColors.apricot); // '#E89252'
```

---

## Related packages

- **`@amplify-ai/tokens-oportunities`** — runtime tokens (colors, type, spacing) as CSS / SCSS / JS
- **`@amplify-ai/ui`** — shared components themed via tokens-oportunities
