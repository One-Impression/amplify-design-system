# @amplify-ai/brand-book-hexcoded

**Hexcoded brand book** — consolidated v1.0 lock + wordmark SVGs + HEX monogram + app icons + favicons + voice/tone guidelines.

Pairs with [`@amplify-ai/tokens-hexcoded`](../tokens-hexcoded) (machine-consumable tokens).

## What's here

```
brand-book-hexcoded/
├── index.html                  # Consolidated v1.0 brand book · open in a browser
├── BRAND-DECISIONS.md          # The 24 locked decisions + 1 parked, table form
├── index.js                    # Asset path exports
├── guidelines/
│   ├── voice-and-tone.md       # L10 · confident-direct register
│   ├── banned-words.md         # L12 · the 12 banned + why
│   ├── verb-usage.md           # L11 · "Hexcode it" writing rules
│   ├── error-voice.md          # L24 · Voice A samples
│   ├── photography.md          # L20 · brand sparingly · product extensively
│   ├── co-branding.md          # L23 · equal-height · 1× cap-height
│   └── accessibility.md        # WCAG 2.2 AA · contrast · keyboard · focus
└── assets/
    ├── logo/                   # HEXCODED wordmark SVGs
    ├── icons/                  # HEX monogram + app icons
    ├── favicons/               # Browser favicons + manifest
    └── social/                 # OG card + Twitter + LinkedIn + IG templates
```

## Use

### Read the book

```bash
open node_modules/@amplify-ai/brand-book-hexcoded/index.html
```

### Reference assets in your app

```js
import { wordmark, favicon } from '@amplify-ai/brand-book-hexcoded';

// HTML head
`<link rel="icon" href="${favicon.light}" type="image/svg+xml">
 <link rel="apple-touch-icon" href="${favicon.appleTouch180}">
 <link rel="manifest" href="${favicon.webmanifest}">`;
```

### Reference guideline copy

```js
import { guidelines } from '@amplify-ai/brand-book-hexcoded';
// guidelines.voiceAndTone → 'guidelines/voice-and-tone.md'
```

### Verify against the lock

`BRAND-DECISIONS.md` is the canonical lock table. Anything that diverges from it is drift — fix the surface, not the lock. Lock changes require a v1.0 → v2.0 bump + brand owner approval (L15).

## Lock summary

24 of 25 decisions locked · 1 parked (sonic identity — needs audio samples to commission).

See `BRAND-DECISIONS.md` for the full table.

## Versioning

This package and `tokens-hexcoded` ship in lockstep. Bumping one bumps both. Lock version is v1.0.0 anchored to `brand-book-v1-final`.

## Pairs with

- [`@amplify-ai/tokens-hexcoded`](../tokens-hexcoded) — machine-consumable design tokens (CSS / Tailwind / JSON / JS)
- [`@amplify-ai/ui`](../ui) — shared component library
- [`@amplify-ai/storybook`](../storybook) — component preview (Hexcoded theme story to be added)
