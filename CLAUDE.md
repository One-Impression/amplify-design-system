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



## SDUI Bottom-Sheet System (`packages/sdui-runtime`)

## SDUI Bottom-Sheet System (`packages/sdui-runtime`)

### Store shape (`useBottomSheetStore`)

| Field | Type | Purpose |
|---|---|---|
| `registry` | `Record<string, SheetEntry>` | All sheets declared by the active page, keyed by `sheet_id`. |
| `openSheets` | `Record<string, boolean>` | Which registered sheets are currently presented. |
| `openOrder` | `string[]` | Explicit oldest→newest open history. Last entry = topmost sheet. |
| `contexts` | `Record<string, Record<string, unknown>>` | Per-sheet runtime context payload stamped at `open()` time. |

### Actions

- `register(sheetId, sheet)` — adds a sheet definition without opening it. Idempotent (overwrites by id).
- `unregister(sheetId)` — removes entry from registry, openSheets, openOrder, and contexts atomically.
- `open(sheetId, contextPayload?)` — looks up sheet from registry; no-op + `console.warn` if not found. Reopening an already-open sheet promotes it to topmost in `openOrder` without duplicating.
- `close(sheetId?)` — clears open flag for one sheet; omit id to close the most-recently opened (pops `openOrder`).
- `closeAll()` — clears openSheets, openOrder, contexts; registry survives.

### Lifecycle contract

Page renderers (`PageStandard`, `PageFeed`, `PageStickyFooter`) and the `BottomSheet` snippet renderer **must**:
1. Call `register(id, sheet)` for each `page.bottom_sheets[]` entry in a `useEffect` on mount.
2. Return a cleanup function that calls `unregister(id)` for each sheet on unmount — prevents orphan registry entries when navigating away.

The `sheet` action handler calls `open(sheet_id)` (registry lookup). It does **not** stamp a new sheet definition.

### `BottomSheetHost` rendering model

gorhom's `BottomSheetModal` is an **imperative** API (no `visible`/`open` prop). `BottomSheetHost` renders one `BottomSheetHostSheet` child per registry entry. Each child owns its own `ref<BottomSheetModalMethods>` and bridges the declarative `openSheets[id]` flag to `ref.current?.present()` / `ref.current?.dismiss()` via a `useEffect` keyed on `open`.

Mount `<BottomSheetHost />` **once** at the app root (`_layout.tsx`).

### `useBottomSheetData`

Returns the `SheetEntry` for the topmost open sheet (`openOrder` tail → registry lookup), or `null`. Uses `useShallow` to take an atomic snapshot of both `openOrder` and `registry` in a single selector — required under React 18 concurrent rendering to avoid torn state.

### Tests

Unit tests live at `src/bottom-sheet/__tests__/useBottomSheetStore.test.ts` and are included in the package test command:
```bash
npm --workspace packages/sdui-runtime test
```

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
