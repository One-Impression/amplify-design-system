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
                        ├── tokens/         — SDUI token contract (sdui.spacing, sdui.font-size, sdui.font-weight,
                        │                     sdui.icon-size, sdui.radius, sdui.border-width, sdui.component.button)
                        ├── icons/          — SVG source files (kebab-case; populate from legacy app before building)
                        └── scripts/
                            ├── build-icons.ts  — Generates dist/icons/manifest.json, essentials.json,
                            │                     version.txt, manifest.d.ts from icons/*.svg
                            └── sync-check.js
  ui/                 — Shared React components (Button, Badge, Card, EmptyState, Skeleton)
  storybook/          — Component documentation and visual testing
  eslint-config/      — Design system lint rules (no-hardcoded-colors, no-raw-spacing, prefer-token-import)
  feature-flags/      — Feature flag utilities
```

### tokens-creator package exports

| Export path | Resolves to |
|---|---|
| `@amplify-ai/tokens-creator` | `dist/tokens.js` |
| `@amplify-ai/tokens-creator/react-native` | `dist/tokens.native.js` — includes `export const sdui` namespace |
| `@amplify-ai/tokens-creator/icons` | `dist/icons/manifest.json` — full icon catalog |
| `@amplify-ai/tokens-creator/icons/essentials` | `dist/icons/essentials.json` — bootstrap subset (~10 icons) |
| `@amplify-ai/tokens-creator/icons/types` | `dist/icons/manifest.d.ts` — `IconName` literal-union type |

### SDUI token namespace (React Native)

The React Native output exports a structured `sdui` object for `useToken()` resolution:

```ts
import { sdui } from '@amplify-ai/tokens-creator/react-native';
sdui.spacing.xs      // 4
sdui.fontSize.md     // 14
sdui.fontWeight.bold // 700
sdui.iconSize.md     // 20
sdui.radius.md       // 8
sdui.borderWidth.thin // 1
sdui.component.button.heightMd // 40
```

### Icon manifest build

```bash
npm run build:icons -w packages/tokens-creator
```

Requires SVG files in `packages/tokens-creator/icons/` (kebab-case filenames). See `icons/README.md` for how to populate from the legacy app. An empty `icons/` directory produces a valid empty manifest — the build does not fail.

Outputs:
- `dist/icons/manifest.json` — `{ version, count, icons: { name: svgContent } }`
- `dist/icons/essentials.json` — bootstrap subset (arrow-left, check, close, home, search, …)
- `dist/icons/version.txt` — manifest version string
- `dist/icons/manifest.d.ts` — `IconName` literal-union type

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
