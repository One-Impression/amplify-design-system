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
  ui/                 — Shared React components (Button, Badge, Card, EmptyState, Skeleton,
                        and Studio v0 primitives — see below)
  storybook/          — Component documentation and visual testing
  eslint-config/      — Design system lint rules (no-hardcoded-colors, no-raw-spacing, prefer-token-import)
  feature-flags/      — Feature flag utilities
```

### `@amplify-ai/ui` — Studio v0 primitives (Wave 4, v2.13.0)

Six new **beta** components (`lifecycle.status=beta`, `since=2.13.0`) that implement the Magic Studio Option-D cockpit shell. Source-of-truth contracts:

- `magic-studio/docs/mockups/option-d.html` — canonical mockup
- `magic-studio/docs/mockups/OPTION_D_SPEC.md` — binding spec
- `packages/ui/src/components/FlowSidebar/SPEC.md` — FlowSidebar v0 contract (PR #101)

| Component | Key props | Notes |
|---|---|---|
| `LivePaneToggle` | `value: 'live'\|'variants'\|'split'`, `onChange`, `liveUrl?`, `disabled?` | 3-state segmented control for the Studio top bar; W3C radiogroup keyboard pattern; `data-live-url` surface for consumer iframe |
| `ReferenceSnapshotPill` | `capturedAt: Date`, `screenshotUrl: string`, `onClick?`, `formatTime?`, `label?` | Top-bar pill showing snapshot capture time; `Intl.DateTimeFormat` default; use `formatTime` for VR-stable Storybook/Chromatic snapshots |
| `DiffOverlay` | `liveScreenshot`, `variantScreenshot`, `mode: 'highlight'\|'swipe'\|'side-by-side'`, `swipePercent?`, `showLegend?`, `ariaLabel?` | Pixel-diff layer over the Live pane; `role="img"`; swipe curtain via `clip-path` |
| `FlowContextSidebar` | `flowName`, `steps: FlowStep[]`, `activeStepId`, `collapsed?`, `onStepClick?`, `onCollapse?`, `onApplyToAll?`, `applyToAllLabel?` | Left-rail multi-step navigator; 260 px expanded / 44 px rail; empty `steps: []` returns `null` |
| `RecentChangesPanel` | `filePath`, `commits: GitCommit[]`, `onClose`, `formatTime?` | Right side-panel of last N git commits; `role="complementary"`; `Esc` closes |
| `ReplyAffordance` | `variantRef: { gen: number; variant: number\|string }`, `onClick`, `label?` | Hover-revealed pill on a `VariantCard`; pre-fills composer with `@V<n> (Gen <m>):`; visibility owned by parent hover state |

**Token dependencies:** All six consume the existing `--amp-studio-theme-*` and `--amp-semantic-*` surface from `@amplify-ai/tokens-studio` 1.0.2. Four new layout tokens are proposed and will be published in a sibling `tokens-studio` PR; each has an inline `var(--name, fallback)` default so components render correctly before that PR merges:

- `--amp-studio-theme-layout-history-panel-w` (360 px — `RecentChangesPanel`)
- `--amp-studio-theme-layout-flow-sidebar-w` (260 px — `FlowContextSidebar`)
- `--amp-studio-theme-layout-flow-sidebar-rail-w` (44 px — `FlowContextSidebar`)
- `--amp-studio-theme-layout-flow-step-chip-h` (64 px — `FlowContextSidebar`)

**Publish gating:** `@amplify-ai/ui@2.13.0` is **NOT yet published to npm**. Publish is gated on the matching `tokens-studio` sibling PR merging first to ensure consumers get a consistent token surface.

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
