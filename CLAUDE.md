# Claude Code Instructions — amplify-design-system

## What This Repo Is

This is the **build system** for One Impression's unified design tokens and shared UI components. It produces npm packages consumed by 3 products (Brand, Creator, Atmosphere).

## What This Repo Is NOT

This repo does NOT handle design governance, auditing, or intelligence. That is **Pixel Agent** (`pixel-agent` repo, public face at `canvas.amplify.club`). Pixel governs via PR-driven proposals back to this repo; this repo remains the upstream source of truth for component code and the publish target for Canvas packages. (Memory: feedback_canvas_distribution_via_npm.md.)

Before building anything related to:
- Token drift detection → already in Pixel (`token-sync.ts`)
- Design review / PR compliance → already in Pixel (`pr-reviewer.ts`)
- Accessibility auditing → already in Pixel (`accessibility-auditor.ts`)
- Theme management → already in Pixel (`theme-manager.ts`)
- Brand cascade → already in Pixel (`brand-cascade.ts`)
- Design mockups → already in Pixel (`design-generator.ts`)
- Component registry/tracking → already in Pixel (`design-system-manager.ts`)
- Visual regression → already in Pixel (`visual-comparison.ts`)
- Cross-product dependency analysis → already in Pixel (`cross-product-deps.ts`)
- Design governance / approval workflows → already in Pixel (`design-governance.ts`)
- Motion design system → already in Pixel (`motion-system.ts`)

**Check Pixel first. Do not duplicate.**

## Pixel ↔ This Repo Integration

Pixel reads from this repo via GitHub API:
- `packages/tokens-foundation/tokens/primitives/*.json` — primitive values
- `packages/tokens-foundation/tokens/semantic/*.json` — semantic mappings (light/dark)
- `packages/tokens-brand/tokens/*.json` — brand product theme tokens
- `packages/tokens-atmosphere/tokens/*.json` — atmosphere product theme tokens
- `packages/tokens-creator/tokens/*.json` — creator product theme tokens

Pixel's `token-sync.ts` compares these canonical files against what's deployed in product repos. When drift is found, Pixel raises alerts and can auto-cascade fixes.

## Build Commands

```bash
npm install          # Install workspace dependencies
npm run build        # Build all packages (tokens + UI + storybook)
npm run validate     # Cross-package consistency check
npm run storybook    # Launch Storybook at port 6006
```

## Package Structure

```
packages/
  tokens-foundation/  — Shared primitives (spacing, radii, shadows, typography, z-index, breakpoints)
  tokens-brand/       — Brand Platform tokens (purple primary, light/dark themes)
  tokens-atmosphere/  — Atmosphere tokens (gold accent, dark-first themes)
  tokens-creator/     — Creator App tokens (SDUI mappings, mobile-optimized)
  ui/                 — Shared React components (Button, Badge, Card, EmptyState, Skeleton)
  storybook/          — Component documentation and visual testing
  eslint-config/      — Design system lint rules (no-hardcoded-colors, no-raw-spacing, prefer-token-import)
  feature-flags/      — Feature flag utilities
```

## Token File Format

W3C Design Token Community Group (DTCG) format:
```json
{ "$value": "#6531FF", "$type": "color", "$description": "Primary accent" }
```

References use `{group.token}` syntax: `{ "$value": "{color.violet.600}" }`

Token hierarchy: primitives (raw values) → semantic (light/dark mappings) → product themes (product-specific overrides).

Build script (`scripts/build-tokens.js`) generates CSS variables, SCSS, JSON, JS, Tailwind v4, and React Native outputs.

## CI/CD

- `ci.yml` — Build all packages, validate consistency, secret scan, SDUI sync check
- `chromatic.yml` — Visual regression testing via Chromatic
- `storybook-deploy.yml` — Deploy Storybook to GitHub Pages on push to main
- ~~`figma-sync.yml`~~ — REMOVED: Tokens Studio integration deprecated in favour of direct PRs + Pixel cascade. Design changes flow via Pixel Agent governance, not Figma plugin.

## Rules

1. **No hardcoded colors** in UI components — use CSS variables only
2. **No design governance logic here** — that's Pixel's job
3. **All token changes** go through direct PR (Pixel will detect drift and auto-cascade)
4. **ESLint rules** exist in `packages/eslint-config/rules/` but are NOT enforced in product repos yet
5. **Breaking changes** to CSS variable names or values require a migration note in the PR description



## SDUI Runtime — Region Page Model

## SDUI Runtime — Region Page Model

Introduced in `feat/sdui-request-context-primitives` on `@one-impression/sdk-native-sdui@^3.4.0`. Full design doc: `packages/sdui-runtime/REGION-PAGE-MODEL.md`.

### Core concepts

- **Regions**: named slots in a page — `header` (`data.header`, a `Node[]`), `content` (`items`), `footer` (`data.footer`, shell/persistent).
- **Shell-first lifecycle**: initial load returns only the shell (footer + region skeletons + `on_load`). `on_load` fires `reload(["header","content"])` for the default state. Tab switches and first content load are the same operation.
- **`reload` action** (replaces deprecated `reload_page`/`reload_content`): region-scoped fetch + partial-page merge. `response.data` shallow-merges into `page.data`; `response.items` replaces `items`. Named regions drive which skeletons show while in flight.
- **`usePageScaffold`**: base hook owning lifecycle (`on_load`/`on_dismount`/back/app-state), live-page subscription, partial-merge, per-region loading, bottom-sheet registration, refresh, and `getRegion(name) → content-or-skeleton`. Layouts reduce to zone geometry only.
- **Render-bindings**: `{ ref: "$.local.<key>" }` (plus `contains` for array membership, `equals` for scalar) resolved reactively **before** schema validation in `SduiNode`. Chip `selected` and tab `active` reflect local state instantly with no reload.
- **`set_local` `array_toggle`**: toggles a value in/out of an array key — used for multi-select filter chips.
- **Backend-controlled debounce** (`debounce_ms` on any action): coalesces rapid bursts to the trailing dispatch. An immediate dispatch (e.g. tab switch) cancels any pending debounced run of the same key. Key = `type|target|endpoint`.
- **`creator.snippet.skeleton`**: BFF-composed shimmer renderer. Declare `rows` (`rect`/`line`/`circle` bars, `row` groups, `justify`), `repeat`, `card`. Store per-region skeletons as `data.<region>_skeleton` in the shell.

### Reload trigger matrix

| Trigger | `reload` regions | Footer |
|---|---|---|
| first load / tab switch | `["header","content"]` | persists |
| filter toggle (`debounce_ms: 400`) | `["content"]` | persists |
| pull-to-refresh | `["content"]` | persists |

### Fixture server env var

Set `SDUI_FIXTURE_LATENCY_MS=3000` when running the sdui-playground fixture server to add simulated reload latency so skeleton shimmers are observable during hand-testing. Default is 0 (off).

### Package versions

- `@one-impression/sdk-native-sdui` peer dep bumped to `^3.4.0` in `sdui-runtime`, `ui-native`, and `sdui-playground`.
- Changeset: `minor` on both `@one-impression/sdui-runtime` and `@one-impression/ui-native`.
- `ui-native` `Chip` gains a `trailingIcon` slot (remove × on selected multi-select chips).

### What lives in Pixel vs here

This is runtime/contract code — it lives here. Do not move region-page model logic to Pixel. Pixel governs token/design drift; this repo owns the SDUI execution primitives.

## Oportunities theme (newest product line)

Oportunities is the newest product theme in this monorepo. It ships as the
Studio-direction brand for One Impression's creator-intent platform.

- **Tokens**: `packages/tokens-oportunities/` — apricot palette, Geist + Inter + JBM, light + dark
- **Brand assets**: `packages/brand-oportunities/` — logos, app icons, favicons, social templates, business cards, email signature
- **Brand decisions**: `packages/brand-oportunities/BRAND-DECISIONS.md` — founder-approved, do not change without sign-off
- **Engineer hand-off**: `packages/brand-oportunities/ENGINEER-HANDOFF.md` — how to consume in a product app
- **Components**: 6 new composed components in `@one-impression/ui` (`Wordmark`, `SignalDot`, `CreatorIntentCard`, `BrandInterestCard`, `IntentFeed`, `AppIconOportunities`)

**Composition rule**: Oportunities components compose from `tokens-foundation`
primitives + existing `@one-impression/ui` primitives (Card, Avatar, Badge, etc.).
**Never invent new primitives for Oportunities** — add a composed component
that wraps existing primitives instead. If a true primitive is missing, raise
it in `@one-impression/ui` first so all themes benefit.

**Spelling**: single-P "Oportunities" everywhere. Not "Opportunities".
