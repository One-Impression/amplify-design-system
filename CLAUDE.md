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
                        + Data Viz primitives (v2.3.0, all beta):
                          LineChart, BarChart, PieChart, Sparkline,
                          Heatmap, Funnel, KPI, ProgressRing
  storybook/          — Component documentation and visual testing
  eslint-config/      — Design system lint rules (no-hardcoded-colors, no-raw-spacing, prefer-token-import)
  feature-flags/      — Feature flag utilities
```

### Data Viz components (`@amplify-ai/ui` v2.3.0, status: beta)

All 8 components are hand-rolled SVG — **zero new runtime dependencies** (shared helpers in `lib/chart-utils.ts`). All are `'use client'`, responsive (100% viewBox width, configurable `height`), and a11y-first: `role="img"` + `aria-label` required + SR-only `<table>` fallback.

| Component | Key props / variants |
|---|---|
| `LineChart` | `xAxis`, `series[]` (name+values), optional `tooltip` render slot |
| `BarChart` | `layout`: `vertical` \| `horizontal` \| `stacked` \| `grouped`; defaults to `grouped` for multi-series |
| `PieChart` | `variant`: `pie` \| `donut`; donut accepts `centerSlot` |
| `Sparkline` | `variant`: `line` \| `bar` \| `area`; inline mini chart |
| `Heatmap` | `variant`: `calendar` (GitHub-style, ISO date ids) \| `matrix` (row/col index + labels) |
| `Funnel` | `stages[]` (name+value+description?), `showConversion` toggle |
| `KPI` | `size`: `md`\|`lg`\|`xl`; `delta`, `sparkline`, `higherIsBetter` (invert trend color for churn-style metrics) |
| `ProgressRing` | `value` 0–100, `size`: `sm`\|`md`\|`lg`\|`xl`, `variant`: `default`\|`accent`\|`success`\|`warning`\|`error`; accepts `children` center slot |

All charts reference design-token CSS variables (e.g. `--amp-semantic-text-muted`) with hardcoded fallbacks. Swap fallbacks to `tokens-foundation` v2.x once published.

Storybook stories are under `Data Viz/` and use realistic Amplify domain data (GMV in ₹Cr, campaign pipelines, creator deliveries, brand churn).

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
