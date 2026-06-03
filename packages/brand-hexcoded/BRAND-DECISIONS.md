# Hexcoded — Locked Brand Decisions

Final record of every brand decision for **Hexcoded** as of **2026-05-22**.
This file is the source-of-truth for the asset package. Token values live in
[`@one-impression/tokens-hexcoded`](../tokens-hexcoded).

**24 of 25 decisions locked. 1 parked** (sonic identity — needs audio samples).

---

## What Hexcoded is

AI content platform — comparable to Hexfield and R-cads, but more powerful.
*"The only AI platform businesses, creators, or creative people need for everything and anything content."*

- Brief → multi-format content (reel · static · caption · thumbnail · cutdown)
- AI creators + build-your-own AI clone + AI clones of real human creators
- Audience: small-to-large businesses **and** creative people
- Headline differentiator: **physical reality super power mode**

---

## Theme direction

**Tech Green** — chosen from candidate exploration directions on 2026-05-22.
Anchored to Brand Book v1.0 Final.

Rationale: Tech Green `#22C55E` is unambiguously "tech / build / ship," reads
as confident-direct rather than playful or premium. Pairs with brand-true black
for a Vercel/Linear-adjacent feel without being derivative. Phantom motion
provides the brand's only mnemonic flourish — restrained, not decorative.

---

## L01 · Logo motion variant

**Phantom** — Outfit 900 wordmark + green stepped shadow that breathes
opacity on a 3s ease-in-out cycle.

| Property | Value |
|---|---|
| Shadow layers | 3 layers · 1px / 2px / 3px stepped offsets |
| Shadow colour | `#22C55E` Tech Green |
| Shadow opacities (static) | 85% / 55% / 32% (front to back) |
| Breath cycle | 3s ease-in-out (6s slow for hero / OOH) |
| Reduced motion | `prefers-reduced-motion: reduce` → static frame |
| Scales | Proportional with logo size |

---

## L02 · Brand green

**Tech Green `#22C55E`** — Tailwind green-500 · RGB 34 197 94 · PANTONE 354 C.

This is THE brand colour. Never substitute. CMYK conversion happens at the printer.

---

## L03 · Shadow depth

3 layers · 1px / 2px / 3px stepped offsets · scales proportionally with logo size.

---

## L04 · Breath cycle

3s ease-in-out base. 6s slow for hero / OOH. Static variant for print.

---

## L05 · Typography

| Slot | Typeface | Weight | Tracking |
|---|---|---|---|
| Display | Outfit | 900 | -0.025em |
| Body    | Inter | 400 / 500 | normal |
| Code    | JetBrains Mono | 400 | normal |

Multi-language coverage for US · EU · India.

---

## L06 · Wordmark casing

Always **UPPERCASE** in the logo. Accept variants only in search input.

**No separators, dots, or dashes** inside HEXCODED. Single token, single word.

---

## L07 · Logo lockup

L1 · Wordmark alone is primary. +URL / descriptor combination marks for
letterheads and OOH only.

---

## L08 · Monogram

**HEX** (three letters) on black with breathing green Phantom shadow.
`H` fallback at 16px only (shadow can't render at this scale).

---

## L09 · App icon

HEX on black · iOS-native corner radius (`r = 22.37%` of canvas) · breathing
Phantom shadow.

---

## L10 · Brand voice register

Confident-direct. *"Hexcoded turns one brief into…"* No marketing fluff.

---

## L11 · Self-reference

**VERB** — *"Get hexcoded"* · *"Take your brief, hexcode it, ship it"*

---

## L12–L18 · Voice continuation

12 banned words / phrases (recorded in the v1.0 spec, locked).
Errors are direct and minimal — no apologies, no fluff. State what
happened, state what to do.

---

## L19 · UI state colours

| State | Hex | Notes |
|---|---|---|
| Success | `#22C55E` | === accent (intentional) |
| Warning | `#FBBF24` | amber 400 |
| Danger  | `#EF4444` | red 500 |
| Info    | `#0EA5E9` | sky 500 |

---

## L20–L23 · Surfaces, motion timing, layout

| Token | Light | Dark |
|---|---|---|
| Page bg | `#FAFAFA` | `#0B0B0F` |
| Elevated | `#FFFFFF` | `#1C1C22` |
| Soft | `#F5F5F7` | `#15151B` |
| Border | `#E5E5EA` | `#2C2C30` |

Motion timing: `120ms` (fast), `200ms` (base), `320ms` (slow). Easing: `cubic-bezier(0.16, 1, 0.3, 1)`.

Max content width: 1400px.

---

## L24 · Forbidden treatments

- Cursive styles, thin fonts, italic display weights
- Outlined or hollow wordmark
- Scaling individual letters of HEXCODED
- Replacing the typeface (no Roboto/Poppins substitutions)
- Drop-shadow that isn't the canonical Phantom (no purple shadows, no blur shadows)
- Animated decorations beyond the Phantom breath
- High-saturation backgrounds behind the wordmark (use the dark or light variants)

---

## L25 · Sonic identity — **PARKED**

Needs audio samples to decide. Re-evaluated after first launch surfaces are in market.
