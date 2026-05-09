# Canvas Design System Changelog

All notable changes to the public packages of `amplify-design-system`.

## 2.13.0 — 2026-05-08

### Added (additive — `@amplify-ai/ui`)

Studio v0 Wave 4 — six new primitives that ship the Magic Studio
Option-D cockpit shell. Source-of-truth contracts:

- `magic-studio/docs/mockups/option-d.html` (canonical mockup)
- `magic-studio/docs/mockups/OPTION_D_SPEC.md` (binding spec)
- `packages/ui/src/components/FlowSidebar/SPEC.md` (FlowSidebar v0
  contract from PR #101 — implemented here as `FlowContextSidebar`)

All six ship as `lifecycle.status=beta`, `since=2.13.0`. Pure additive —
no breaking changes to existing primitives.

- **`LivePaneToggle`** — 3-state segmented control (Live / Variants /
  Split) for the Studio top bar. Distinct from the generic
  `SegmentedControl` because it owns pane-state semantics: switching to
  `live` or `split` is the consumer's signal to mount a live iframe of
  `liveUrl`. Standard W3C radiogroup keyboard pattern with roving
  tabindex; data-live-url surface for the consumer's iframe; honours
  `prefers-reduced-motion`.
- **`ReferenceSnapshotPill`** — "Reference snapshot · 3:42 PM" pill
  rendered in the top bar after the first generate. Click opens the
  original-screenshot modal (consumer-rendered). Time formatting
  defaults to `Intl.DateTimeFormat` with locale-aware `h:mm a`; can be
  overridden via `formatTime` for visual-regression-stable Storybook /
  Chromatic snapshots. ISO `capturedAt` exposed via
  `data-captured-at`; URL via `data-screenshot-url`.
- **`DiffOverlay`** — red/green pixel-diff layer over the Live pane.
  Three modes: `highlight` (translucent multiply bands + legend pill),
  `swipe` (vertical curtain at `swipePercent` 0–100, defaults 50;
  `clip-path` for clean curtain reveal), and `side-by-side` (1fr / 1fr
  grid). `role="img"` with descriptive aria-label.
- **`FlowContextSidebar`** — left-rail multi-step flow navigator
  implementing the `FlowSidebar` v0 contract from PR #101 (with
  Studio-scoped tokens). 260 px expanded / 44 px rail; per-step status
  (`default` / `in-progress` / `complete` / `skipped`) drives chip
  treatment + aria-label suffix; roving tabindex; `Enter` / `Space`
  activate; `Home` / `End` jump first / last; `<a href>` chips render
  as anchors but still emit `onStepClick`; sticky bottom Apply-to-all
  action; collapse toggle with `aria-expanded` + `aria-controls`.
  Empty `steps: []` returns `null` (consumer-gated render).
- **`RecentChangesPanel`** — right side-panel listing the last N git
  commits touching a file. 360 px width via
  `--amp-studio-theme-layout-history-panel-w`; `role="complementary"`
  with `aria-labelledby` linked to the heading; `Esc` closes; commits
  with `url` render as `<a target="_blank" rel="noopener>`. Default
  timestamp formatter uses `Intl.RelativeTimeFormat`; overridable.
  Includes empty-state + single-commit fallbacks.
- **`ReplyAffordance`** — hover-revealed pill on a `VariantCard` that
  pre-fills the composer with `@V<n> (Gen <m>):`. Exposes the
  reference syntax via `data-ref-syntax`; gen / variant via dedicated
  data attributes for analytics. Native `<button>` semantics so
  `Enter` / `Space` activate. Visibility is owned by the parent
  `VariantCard`'s hover state — this primitive renders unconditionally.

### Token usage

All six primitives consume the existing `--amp-studio-theme-*` and
`--amp-semantic-*` token surface that ships from
`@amplify-ai/tokens-studio` 1.0.2 + the `--amp-semantic-*` alias block
landed in 2.11.2 / 2.12.0. Two token references propose new tokens
that the matching `tokens-studio` bump (sibling PR — token-bump
sub-agent) will publish:

- `--amp-studio-theme-layout-history-panel-w` (used by
  `RecentChangesPanel`; default 360 px fallback).
- `--amp-studio-theme-layout-flow-step-chip-h` (used by
  `FlowContextSidebar`; default 64 px fallback).

Both have inline `var(--name, fallback)` defaults, so the components
render correctly even before the token-bump publishes. The
`FlowSidebar` SPEC also calls for
`--amp-studio-theme-layout-flow-sidebar-w` and
`-flow-sidebar-rail-w` — both are already declared in
`magic-studio/docs/mockups/OPTION_D_SPEC.md` §7 and ship in the
sibling token-bump PR.

### Versioned

- `@amplify-ai/ui`: `2.12.0` → `2.13.0`

### Publish gating

This PR does NOT publish `@amplify-ai/ui@2.13.0` to npm. Publish is
gated on the matching `tokens-studio` PR merging first so consumers
picking up `@amplify-ai/ui` 2.13.0 alongside `@amplify-ai/tokens-studio`
get a consistent token surface. The orchestrating coordinator handles
the sequence.

## 2.11.2 — 2026-05-08

### Fixed (extended `--amp-semantic-*` alias block — all token packages)

Triage of `magic-studio` live (`magic-studio/docs/pixel-brief/STUDIO_LIVE_TRIAGE.md`
Issue #1) found that the 26-entry alias block introduced in #95 covers only
26 of the 41 `--amp-semantic-*` references that Canvas v2 primitives actually
hard-code. The other 15 — `bg-accent`, `bg-sunken`, `text-primary`, `text-muted`,
`text-on-accent`, `accent`, `accent-light`, `accent-primary`, `status-{error,
warning,success,info}-bg`, `border-{error,warning,info}` — were still
undefined in published CSS, so chip backgrounds, status fills, error borders,
and inverse text on accent surfaces all rendered as the user-agent default.

`scripts/build-tokens.js` now emits 41 alias entries per non-foundation token
package. Each new alias resolves to the same product-prefixed source the
existing block uses (e.g. `--amp-semantic-bg-accent: var(--amp-{prefix}-semantic-accent)`),
so dark-mode cascade and product theming continue to work unchanged.
Foundation skips identity aliases — only non-identity entries
(`bg-accent`, `text-on-accent`, `border-{error,warning,info}`,
`accent-primary`) are emitted there.

After this lands and is published, the per-app hotfix in
`magic-studio/src/app/globals.css` (One-Impression/magic-studio#66) becomes
fully redundant and can be deleted in a follow-up.

### Versioned

- `@amplify-ai/tokens-foundation`: `2.1.1` → `2.1.2`
- `@amplify-ai/tokens-brand`: `3.0.1` → `3.0.2`
- `@amplify-ai/tokens-atmosphere`: `2.0.2` → `2.0.3`
- `@amplify-ai/tokens-creator`: `2.0.2` → `2.0.3`
- `@amplify-ai/tokens-studio`: `1.0.1` → `1.0.2`

## 2.12.0 — 2026-05-08

### Added (additive — `@amplify-ai/ui`)

Studio v2 Wave 4 — Option-D fidelity polish across four primitives so
the Canvas surfaces consumed by `magic-studio` pixel-match the
`studio-v2-option-d.html` mockup. All changes are additive: existing
call sites compile and render unchanged; the polish manifests as
visual treatment + two opt-in slot props.

- **`BriefStrip`** — new `leading?: ReactNode` prop (default `"Brief"`,
  rendered as 11px uppercase tertiary label before the chip list).
  Chip radius tightened from `rounded-full` to `rounded-md` so chips
  read as 7px-rounded-rect tokens, matching the mockup's `.d-bchip`.
- **`HistoryStrip`** — new `liveSlot?: ReactNode` prop pushed to the
  right with `ml-auto` (used for "AI sees the live page" indicator).
  The Fragment-`→` connector between generations is now a styled
  hairline branch-line span with a centered arrow on a surface
  background. Mini-thumbs gain a 135deg gradient between subtle/canvas
  bg tokens, and the `win` thumb dot is bumped from `1×1` to `1.5×1.5`
  with a 2px surface ring so it reads as a true notification badge.
- **`CouncilRail`** — heading restyled from `text-sm font-semibold` to
  the 11px uppercase tertiary treatment used everywhere else in
  Option-D. The `forVariantLabel` is now plain accent text (no pill).
  Avatars are 24×24 `rounded-md` (not 28×28 `rounded-full`); verdict
  badges shrink to `rounded-[3px] px-1.5 py-0.5`. Ask-the-council
  input border switches to `border-dashed` to match the mockup's
  `.ask` affordance.
- **`SegmentedControl`** — already shipped with `shadow-sm` on the
  active-segment highlight layer in 2.11.0; added a dedicated
  `OptionDFidelity` story so Chromatic snapshots pin the Grid/Map
  toggle visual against the mockup region.

Each primitive now ships an `OptionDFidelity` Storybook story with the
Option-D HTML region inlined as JSDoc; these stories are the visual
contract Chromatic anchors against.

### Versioned

- `@amplify-ai/ui`: `2.11.0` → `2.12.0` — additive prop surface
  (`leading`, `liveSlot`); no breaking visual changes for existing
  consumers (`rounded-full` → `rounded-md` on `BriefStrip` chips and
  the rail-header restyle are intentional brand-cascade alignments,
  flagged here as the only visible deltas at non-Option-D call sites).

## 2.11.1 — 2026-05-08

### Fixed (`@amplify-ai/tokens-foundation@2.1.1` and all product token packages)

Canvas v2 primitives in `@amplify-ai/ui` (`BriefStrip`, `HistoryStrip`,
`CouncilRail`, `VariantCard`, `StatusBar`, `SegmentedControl`) hard-code
Tailwind arbitrary classes referencing a product-agnostic
`--amp-semantic-*` family (e.g. `bg-[var(--amp-semantic-bg-accent-subtle)]`,
`text-[var(--amp-semantic-text-default)]`). That family was not emitted
by any token package — only product-prefixed
`--amp-{brand,atmosphere,creator,studio}-semantic-*` was — so every
primitive rendered unstyled in every consumer.

`scripts/build-tokens.js` now appends a 26-entry alias block to every
package's `dist/variables.css`. Each alias resolves to the product-
prefixed source in the same package via `var()` indirection, so dark
mode cascades automatically and the alias is always theme-correct for
whichever product CSS is loaded. For `tokens-foundation` (unprefixed
`amp` namespace), identity aliases are skipped to avoid self-cycles.

This replaces the per-app hotfix in `magic-studio/src/app/globals.css`
(One-Impression/magic-studio#66) — that block can be deleted in a
follow-up PR after this lands and is published.

Source: `magic-studio/docs/pixel-brief/STUDIO_DESIGN_PLAN.md` §3.1.

## 2.11.0 — 2026-05-07

### Added (additive — `@amplify-ai/ui`)

Studio v2 Wave 3 — three more visual primitives lifted from the Studio
Phase-0 audit. All three ship as `lifecycle.status=beta`,
`since=2.11.0`. Pure additive — no breaking changes.

- **`StatusBar`** — slim ~24px horizontal status strip. Renders as a
  `<dl>` with `<dt>` / `<dd>` pairs for screen-reader semantics; one
  cell per item with `default` / `mono` variants (mono = monospace
  value for SHAs, versions). Supports `truncate` + `maxWidth` per
  item, and `align="between"` to push the last item right. Density-
  aware vertical padding.
- **`PhaseRibbon`** — numbered phase indicator (1 → 2 → 3 → …) above a
  workflow. `pending` / `active` / `done` / `error` per-phase status
  drives circle colour (status-success / accent / status-error /
  border tokens) and connector tint. Active phase flagged via
  `aria-current="step"`; `done` renders a check glyph; status auto-
  derives from `current` when not given explicitly.
- **`SegmentedControl`** — generalised two-or-more-button segmented
  control. Pill wrapper with a single sliding accent highlight,
  W3C-pattern `role="radiogroup"` + arrow / Home / End / Enter / Space
  keyboard navigation, roving tabindex, and `motion-reduce`-honoured
  slide animation. `sm` (~28px) / `md` (~36px) sizes; density=compact
  forces `sm`.

Unblocks the Studio cockpit footer migration and consolidates the
ad-hoc Grid|Map toggle into a reusable primitive.

### Added (new package — `@amplify-ai/tokens-studio@1.0.0`) — landed via #89

Studio-specific tokens package — used only by `studio.amplify.club`. Inherits primitives from tokens-foundation; layers Studio cockpit semantics on top. Sibling to `tokens-brand` / `tokens-creator` / `tokens-atmosphere`.

- **16 lifted variables** sourced verbatim from the Phase-0 token audit (`magic-studio/docs/audits/phase-0-tokens.md`):
  - 5 chrome colour semantics — `--amp-studio-theme-color-{bg,fg,muted,border,accent}` — back the existing `--studio-*` consumer aliases.
  - 4 layout dimensions — `--amp-studio-theme-layout-{toolbar-h,drawer-h,drawer-h-open,pane-left-w}` — back `--studio-toolbar-h` etc. (intentional raw `px` per `magic-studio/CLAUDE.md` Rule 2).
  - 7 Mirror / Map-mode voice colours — `--amp-studio-theme-map-voice-{pixel,aria,heimdall,atlas,sentinel,penny,zara}` — back `--mirror-voice-*`.
- **6-entry status scale** — `--amp-studio-status-{success,warning,error}` plus `-bg` variants — replaces the 10 raw hex literals (`#10b981`, `#f59e0b`, `#d4524d`, `#b45309`) called out as `❌` in the Phase-0 audit's status-indicator cluster.
- Light + dark themes; Studio is dark-default but both modes are emitted.
- Five build outputs (`variables.css`, `variables.scss`, `tokens.json`, `tokens.js`, `tailwind.css`) via the shared `scripts/build-tokens.js studio` entrypoint.
- Phase D in `magic-studio` will swap the in-repo `:root { --studio-* / --mirror-* }` definitions for an `@import "@amplify-ai/tokens-studio/css"` plus a small consumer-alias block (~16 lines) once this package is on the registry.
- `scripts/validate-tokens.js` now includes `tokens-studio` in cross-package reference-integrity checks; `scripts/build-tokens.js` accepts `studio` as a valid entrypoint.

Pure additive — no breaking change to any existing package.

## 2.10.0 — 2026-05-05

### Added (additive — `@amplify-ai/ui`)

Studio v2 Map mode prep — two new primitives compose into the variant-graph map view. Both ship as `lifecycle.status=beta`, `since=2.10.0`. Pure additive — no breaking changes.

- **`MapNode`** — Studio v2 Map mode — variant-graph node primitive with `live` / `ready` / `generating` / `error` / `locked` / `focus` state machine. Absolute-positioned via `x` / `y` / `width` (default `180`); selected and focus states share the 2px accent outline + glow; locked renders a top-right lock badge; live renders a dashed-border ghost; generating shows the shimmer body; error shows a red corner triangle. Dark theme by default.
- **`MapEdge`** — Studio v2 Map mode — SVG `<path>`-only edge primitive (consumer wraps in their own `<svg>`). Renders a smooth horizontal cubic Bézier between two `(x, y)` points. Token-driven `active` (accent stroke + thicker) and `dashed` (default `true`) modes. Exposes `buildEdgePath()` so layout code can compute geometry without rendering.

Unblocks the Studio v2 Map mode layer, which depends on these primitives being available on npm.

## 2.9.0 — 2026-05-04

### Added (additive — `@amplify-ai/ui`)

Studio v2 Wave 2 — foundational primitives composing the new Magic Studio v2 layout. All four ship as `lifecycle.status=beta`, `since=2.9.0`. Pure additive — no breaking changes.

- **`BriefStrip`** — Studio v2 Wave 2 — chip strip primitive composing `Chip`; persistent brief header for Magic Studio v2.
- **`HistoryStrip`** — Studio v2 Wave 2 — horizontal generation timeline with mini-thumb status (`ready` / `generating` / `error` / `locked` / `win`).
- **`CouncilRail`** (with `CouncilCard` + `CouncilSummary` subcomponents) — Studio v2 Wave 2 — right-rail per-agent verdicts; supports `disagreementsOnly` collapse + ask-the-council affordance.
- **`VariantCard`** — Studio v2 Wave 2 — canvas variant card with empty / generating / ready / error state machine; shimmer + retry built-in.

Unblocks the magic-studio v2 layout refactor, which depends on these primitives being available on npm.

## [1.1.0] — 2026-04-28

### Added (additive — `@amplify-ai/ui`)

- **`xs` size variant** on `Button` and `IconButton`. Discovered while preparing the atmosphere migration: data-dense dashboards need a smaller-than-`sm` control (`h-6` = 24px) for tight rows. Without `xs` the alternative would have been forcing every consumer to either accept Canvas's coarser scale or to bypass Canvas with bespoke local primitives — neither acceptable.
- This is a precursor to the proper density-mode work planned in Wave 2 Tier 2 (`compact` × `cozy` orthogonal axis). Once density lands, `xs` becomes "compact `sm`" automatically; this PR keeps the explicit `xs` opt-out for callsites that want the smaller footprint regardless of density.

| Component | Size | Width / Height | Padding | Use case |
|-----------|------|----------------|---------|----------|
| Button | `xs` | h-6 (24px) | px-2 | Inline tables, dashboards, dense forms |
| IconButton | `xs` | 24×24 | — | Inline row actions in DataTable |

Pure additive — no breaking change. Existing `sm/md/lg` callsites unchanged.

## [1.0.1] — 2026-04-27

### Changed (BREAKING — pre-publish)

- **Scope rename: `@amplify-ai/*` → `@amplify-ai/*`** for every published
  package. The previous `@amplify` scope is not owned by the
  `One-Impression` org, which caused every GH Packages publish attempt
  on the v1.0.0 release to fail with `403 permission_denied`. Renaming
  to a scope that matches the org makes the workflow's automatic
  `GITHUB_TOKEN` sufficient to publish — no extra PAT or org-level
  package settings required.
- Affected packages: `@amplify-ai/ui`, `@amplify-ai/mcp-server`,
  `@amplify-ai/tokens-{foundation,brand,atmosphere,creator}`,
  `@amplify-ai/eslint-config`, `@amplify-ai/templates`,
  `@amplify-ai/feature-flags`, `@amplify-ai/storybook`.
- Internal cross-package imports rewired in the same commit so the
  monorepo workspaces still resolve.
- CI `setup-node` `scope:` updated to match.
- Consumer install command changes from `@amplify-ai/*` → `@amplify-ai/*`.

This is BREAKING for any external consumer that pinned `@amplify-ai/*` —
but since v1.0.0 never actually published to GH Packages, no real
consumers exist yet. Future migrations will follow standard semver.

## [1.0.0] — 2026-04-27

### Added
- **`@amplify-ai/mcp-server`** — new package. MCP server exposing the Canvas design system to AI agents (Pixel, Claude Code) via stdio + HTTP transports. Five tools: `list_components`, `get_props`, `find_block`, `validate_usage`, `suggest_token`.
- **`@amplify-ai/ui` JSON contracts** — every build now emits `dist/contracts/<Component>.json` (per-component spec via TypeScript compiler API) and `dist/contracts.json` (manifest). Single source of truth replacing the previous regex extractors. Exposed via subpath exports: `@amplify-ai/ui/contracts`, `@amplify-ai/ui/contracts/*`.
- **`@amplify-ai/ui` LLM docs** — every build emits `dist/llms.txt` (root index, [llmstxt.org](https://llmstxt.org) spec), `dist/llms/<Component>.md` (per-component rule sheets), and `dist/llms.json` (flat mirror). Exposed via subpath exports: `@amplify-ai/ui/llms.txt`, `@amplify-ai/ui/llms.json`, `@amplify-ai/ui/llms/*`.

### Changed
- **`@amplify-ai/ui` 0.1.0 → 1.0.0** — first stable release. Component API surface (46 components), variants, and prop signatures are now stable; future breaking changes will follow semver and ship with codemods (planned, Wave 2).
- CI publish loop now ships `@amplify-ai/mcp-server` alongside the existing token packages, `@amplify-ai/ui`, and `@amplify-ai/eslint-config`.

### Notes
- This release closes Wave 1 of the Canvas 100x program. Pixel and Claude Code can now consume Canvas through a structured contract instead of carrying hardcoded component lists.
