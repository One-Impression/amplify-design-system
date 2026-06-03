# Oportunities — Locked Brand Decisions

Final record of every brand decision for **Oportunities** as of 2026-05-19.
This file is the source-of-truth for the asset package. Token values live in
`@one-impression/tokens-oportunities`.

---

## Theme direction

**Studio** — chosen from 8 candidate directions on 2026-05-19.

Rationale: warm-cream + apricot + Geist evokes "creative studio" rather than
"saas product," differentiating from the dominant blue-grey B2B SaaS look.
Apricot period is the brand's signature mnemonic.

---

## Wordmark

| Property | Value |
|---|---|
| Glyph | `oportunities.` (single-P spelling, lowercase, trailing period) |
| Typeface | Geist (Vercel), weight 600 |
| Tracking | -0.04em |
| Ink color | `#0F0D0B` on light surfaces |
| Period color | `#E89252` (apricot) on light, `#F0A668` (brighter apricot) on dark |
| Clear-space | 1 × cap-height on all sides (minimum) |
| Minimum size | 11 px wordmark height (favicon) — below this use the `op.` mark |
| Forbidden | Outlining, drop-shadow, scaling the period independently, replacing typeface |

### Signature gradient
Apricot → terracotta → purple, 0% → 50% → 100%:
- `#E89252` → `#D87B6E` → `#6B4FA0`

Used only as a **static snapshot** on wordmark in marketing hero / OG moments.
Live animation (e.g. landing page sweep) is reserved for product-marketing surfaces
and **must not** be used in product UI (would distract from primary task).

---

## App icon

| Property | Value |
|---|---|
| Mark | `op.` (first two letters + apricot period) |
| Shape | iOS squircle, corner radius **22.37%** of canvas width |
| Light variant | Cream `#FDF8F3` background, dark `#0F0D0B` glyph, `#E89252` period |
| Dark variant | Dark `#0F0D0B` background, cream `#F4ECE0` glyph, `#F0A668` period |
| Sizes shipped | 1024 (asset stores), 180 (iOS touch), 512 (PWA maskable) |
| Safe zone | 80% of canvas (51 px padding at 512 — required for PWA maskable) |
| Glyph alignment | Optical center; period sits on the baseline, not below |

---

## Favicon

| Property | Value |
|---|---|
| Mark | `op.` at 32+; bare apricot dot + small `op` at 16 |
| Light SVG | `#FDF8F3` background, dark glyph |
| Dark SVG | `#0F0D0B` background, light glyph |
| Safari pinned-tab | Monochrome SVG mask (Safari applies user tint) |
| Theme color (meta) | `#E89252` (apricot) |
| Background color (manifest) | `#FDF8F3` (cream) |

---

## Voice register

Two registers, applied per-context:

### Direct-confident
Used for: **push notifications, primary buttons, error messages, tooltips**.
- Short. Verb-first. Imperative or declarative.
- No hedging ("might," "perhaps," "consider").
- No filler ("just," "simply").
- Examples:
  - Push: `New collab from L'Oréal — 48h to respond.`
  - Button: `Send brief`
  - Error: `Payout blocked — bank IFSC invalid. Fix bank details.`
  - Tooltip: `Locked until KYC complete.`

### Tool-curious
Used for: **empty states, success moments, email subject lines, marketing copy**.
- Warmer. Asks the user a question or offers a thought.
- Slightly playful but never cute.
- No exclamation marks beyond 1 per surface.
- Examples:
  - Empty: `No briefs yet. Run intent scan to find your first.`
  - Success: `Brief sent. We'll surface replies as they arrive.`
  - Subject: `Three creators matched your brief this week.`
  - Marketing: `Creator intent, visible.`

---

## Application contexts (10 confirmed)

The brand applies across:

1. Product UI (web app on `oportunities.in`)
2. Mobile app (iOS + Android home-screen icons)
3. PWA install (manifest, maskable icon)
4. Browser favicon (light + dark + Safari pinned)
5. Email transactional (logo header, brand color accents)
6. Email signature (HTML + minimal variants)
7. LinkedIn company page (cover + post template)
8. Instagram (post + story templates)
9. X / Twitter (banner + OG image)
10. Print: business cards (89 × 54 mm), with future expansion to pitch decks

---

## Sizing scale

Type and component sizing follow the foundation fluid-type scale (token package),
but for the **brand assets** specifically:

| Pixel size | Use |
|---|---|
| 11 px | Minimum wordmark height — favicon |
| 16 px | Favicon @ 1× |
| 20 px | UI nav wordmark, dense surfaces |
| 24 px | Standard product header wordmark |
| 32 px | Email signature wordmark |
| 40 px | Marketing landing nav wordmark |
| 56 px | Hero wordmark on product pages |
| 72 px | LinkedIn post / IG post wordmark |
| 88 px | Default brand-asset wordmark (default SVG viewBox) |
| 96 px | LinkedIn cover, X banner |
| 120 px | OG image wordmark, hero on marketing landing |
| 560 px | App icon glyph (1024 canvas) |
| 96 px | App icon glyph (180 canvas) |

---

## What changes vs other Amplify brands

- **Single-P spelling** "Oportunities" — distinctive, registered, do **NOT** correct to "Opportunities."
- **Apricot period** is non-negotiable. It's the brand mark.
- **Geist**, not Inter (Inter is the Amplify-platform default).
- **Cream**, not white. `#FDF8F3` background everywhere; pure `#FFFFFF` is reserved for medical / sterile contexts (not us).
- **No icon family** beyond the `op.` mark. We borrow Lucide for product UI but never iconise the brand itself.

---

## Decision log

| Date | Decision | Source |
|---|---|---|
| 2026-05-19 | Studio direction chosen from 8 candidates | Founder pick |
| 2026-05-19 | Asset package v1.0.0 created | This PR |

Pending decisions (NOT in this asset package):
- Long-form brand voice doc (separate concern, lives in marketing wiki)
- Motion grammar for in-product transitions (handled by `@one-impression/tokens-foundation/motion`)
- Sound / haptics (deferred until mobile app GA)
