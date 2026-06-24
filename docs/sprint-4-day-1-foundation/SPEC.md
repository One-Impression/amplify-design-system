# Canvas Primitives — Sprint 4 Day 1 Foundation Spec

**Source:** Oportunities forge (`~/product-forge/oportunities/sprint-4-day-1/`)
**Locked:** 2026-06-02
**Owner spec:** Apaksh (Founder, One Impression)
**Status:** APPROVED — engineering can implement

---

## Why this PR

Four cross-product UI primitives consumed by Amplify, Hexcoded, and **Oportunities** (incoming Sprint 4 build). Per §B1 + §B13, capabilities used by ≥2 businesses belong in core/Canvas with no product prefix in the name.

This PR ships the **design contract** (canvas-primitives.html) — a single reference page showing all variants, states, props, tokens, and a11y notes. Engineering implements the actual TSX components in `packages/ui/src/components/` from this contract.

The 4 primitives are mostly extractions from existing locked CSS in the Oportunities creator app (proven on real screens, not greenfield design):
- **Skeleton** — extracted from `.shim` (1.5s sweep, opacity 0.7)
- **Toast** — extracted from `.toast` (dark ink bg + accent emoji + light text) + 4 severity left-bars
- **Inline Form Error** — PAT-OPT-001 gentle warm-accent pattern + strict severity option
- **Share/Copy CTA** — extracted from `.bc-copy` invite-share pattern + Web Share API integration

---

## Components in scope

### 1. `<Skeleton>` — `canvas.skeleton`

Five variants:
- `line` — single text line, parametric width + height
- `circle` — avatar / icon placeholder, parametric diameter
- `card` — whole card block placeholder
- `block` — image / hero placeholder
- `list` — multi-row list item placeholder

**Token spec:** uses `--canvas-border-soft` base, `--canvas-bg-soft` sweep, `--canvas-radius-sm/md/lg`.
**Animation:** 1.5s linear sweep, opacity 0.7. Respect `prefers-reduced-motion: reduce` via `animated: false` prop.
**A11y:** `aria-busy="true"` on container.

### 2. `<Toast>` — `canvas.toast`

Four severity variants:
- `success` — `--canvas-success #2F8A4F`
- `info` — `--canvas-info #3B6EB5`
- `warning` — `--canvas-warning #C6892C`
- `danger` — `--canvas-danger #B33A3A`

Dark base (`--canvas-ink`) with severity-coloured left-bar (3px). Auto-dismiss timings: 4s success/info, 6s warning, 8s danger. Action toasts persist until interacted. Stack max 3, 8px gap, oldest dismisses first.
**Position:** bottom-center on mobile, top-right on desktop (≥768px).
**A11y:** `role="status"` for success/info, `role="alert"` for warning/danger.

### 3. `<InlineError>` — `canvas.inline-error`

Two severities:
- `gentle` (default, PAT-OPT-001) — `--canvas-gentle #E68F47` warm-accent
- `strict` — `--canvas-danger #B33A3A`

Strict variant has shake animation (200ms horizontal jitter) on submit-attempt error. Field border bumps to 1.5px in severity colour. **Default to gentle** — choose strict only when input is truly invalid (DPDP-required empty, format actually wrong).
**A11y:** `role="alert"` + `aria-describedby="{fieldId}"`.

### 4. `<ShareCta>` — `canvas.share-cta`

Three variants:
- `share` — native Web Share API (`navigator.share`)
- `copy` — clipboard (`navigator.clipboard.writeText` with `document.execCommand` legacy fallback)
- `share-with-copy-fallback` — try share sheet; fall back to clipboard + success toast

On success, icon morphs to ✓ + label changes to `successLabel` for 1.2s, then reverts. Pair with `Toast` (variant: success) for action confirmation.
**A11y:** native `button` element with full keyboard support. `icon-only` requires `aria-label`.

---

## Token namespace (Canvas-neutral)

All tokens in the `--canvas-*` namespace — no `--oportunities-*`, no `--amplify-*`, no `--hexcoded-*` colours hardcoded. Severity tokens (success/info/warning/danger) and the gentle warm-accent are product-agnostic — every product consumes them via Canvas.

See `canvas-primitives.html` for the complete token list at the top of the `<style>` block.

---

## Verification

- **Reference page renders correctly:** open `docs/sprint-4-day-1-foundation/canvas-primitives.html` in any modern browser.
- **A11y:** each component section includes a `<div class="note">` with screen-reader / keyboard / contrast notes.
- **Variants:** every variant of every component is rendered side-by-side for visual review.

---

## §B compliance

- **§B1** — components serve ≥2 businesses (Amplify, Hexcoded, Oportunities) → live in Canvas, not per-business service ✓
- **§B13** — no product prefix in component name (`canvas.skeleton`, not `oportunities.skeleton`) ✓
- **§B9** — when MCP catalog generation is added, these components will appear via generated artifacts (not hand-written)

---

## Out of scope for this PR

- TSX component implementations (engineering picks up from this spec)
- Storybook stories (added in follow-up PR after TSX lands)
- Token additions to `tokens-foundation` (the `--canvas-*` namespace mapping; follow-up if not already present)

---

## References

- Source forge: `~/product-forge/oportunities/sprint-4-day-1/canvas-primitives.html`
- Decision lineage: D-OPT-407 (verification badge language) + D-OPT-408 (follower display) + D-OPT-409 (upgrade nudge) + D-OPT-410 (V7 selection) — see `OPORTUNITIES-PRD-V12.6.1.html` Part A
- Pattern source: PAT-OPT-001 (Oportunities patterns.md)
- §B1 + §B13: `~/zenith-coding-agent/architecture/VISION.md`
