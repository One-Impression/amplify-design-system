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



## SDUI Gutter / Layout Model

## SDUI Gutter / Layout Model

All horizontal gutter and vertical inter-item spacing in SDUI is **page-owned** — managed by `GutterItem` in `packages/sdui-runtime/src/layout/page-gutter.tsx`. Snippets must NOT carry their own competing margins.

### GutterItem

- Wraps each top-level item with the page's horizontal gutter (skipped for full-bleed items) and asymmetric vertical margins.
- `marginTop = resolveRowGap(node) + GAP_TOP_OVERRIDES[node.type]`
- `marginBottom = max(0, resolveRowGap(node) − GAP_BOTTOM_REDUCTIONS[node.type])`
- Takes an `index` prop — must be passed by every caller so the first-item rule fires correctly.

### First-item top rule (index 0)

- Full-bleed banner (`sdui.snippet.banner_image` + `isFullBleed`) → `marginTop: 0` (flush against screen/nav edge).
- Any other first item → standard `md` top inset.
- Applies on pages (`PageStandard`, `PageStickyFooter`, `PageFeed` tabs) and sheets (`SduiSheetScreen`).

### Override tables (in `page-gutter.tsx`)

| Table | Effect |
|---|---|
| `GAP_OVERRIDES` | Base row gap for a type (replaces the default) |
| `GAP_TOP_OVERRIDES` | Extra top margin ADDED on top of the row gap (asymmetric) |
| `GAP_BOTTOM_REDUCTIONS` | Amount SUBTRACTED from the bottom margin (floored at 0) |

Current overrides: `sdui.snippet.section_header` → base gap `md`, extra top `sm`, bottom reduction `sm` (so it reads as a strong break above while hugging content below).

### Surfaces that use GutterItem

`PageStandard`, `PageStickyFooter`, `PageFeed`, and `SduiSheetScreen` all wrap items in `GutterItem` with the item index. The loading/title path in `SduiSheetScreen` uses `PAGE_GUTTER_TOKEN` directly for its inset.

### Rules for snippet authors

1. **Do not add vertical margin/padding to a snippet** for inter-item spacing — that is `GutterItem`'s job. Adding it doubles the gap.
2. **Do not hardcode a horizontal inset** that replicates the page gutter. Use `PAGE_GUTTER_TOKEN` (from `page-gutter.tsx`) if a full-bleed snippet needs its own leading/trailing inset (e.g. `group_chips` scroll row).
3. **To change spacing for a snippet type**, add or edit an entry in `GAP_OVERRIDES`, `GAP_TOP_OVERRIDES`, or `GAP_BOTTOM_REDUCTIONS` — not in the snippet renderer.
4. **Section header title weight** defaults to `sdui.font-weight.semibold`; only override explicitly when the server sends a value.

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
