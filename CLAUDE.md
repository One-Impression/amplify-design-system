# Claude Code Instructions — amplify-design-system

## What This Repo Is

This is the **build system** for One Impression's unified design tokens and shared UI components. It produces npm packages consumed by 3 products (Brand, Creator, Atmosphere).

## What This Repo Is NOT

This repo does NOT handle design governance, auditing, or intelligence. That is **Pixel Agent** (`pixel-agent` repo, deployed at pixel.amplify.club).

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
  templates/          — Base CSS layer + token CSS for use in generated UIs; kept in sync with @amplify/ui component output
```

### `packages/templates` — key conventions

**Token values** (`src/tokens.ts`) are sourced from the Tailwind preset, not standalone choices:
- Brand primary: `#6531FF` (violet-600), hover: `#752AD4`
- Neutral-900 (text): `#1D252D`; borders use opacity-based RGBA, not solid stone steps
- New variables added: `--amp-surface-overlay`, `--amp-border-strong`, `--amp-border-brand`, `--amp-shadow-brand`, `--amp-gradient-brand`, `--amp-gradient-brand-soft`, `--amp-accent-hover`
- `--amp-text-xs` changed to `11px`; `--amp-text-2xl` changed to `32px`; `--amp-transition` changed to `150ms ease`

**Component CSS** (`src/base-css.ts`) mirrors the exact Tailwind classes used by `@amplify/ui` React components:
- **Button**: height-based sizing (`h-10`/`h-12`/`h-8`), `focus-visible` ring, disabled via `opacity:.5`. New variants: `.amp-btn-secondary`, `.amp-btn-sm`. Outline variant is now `1px` border with `bg-transparent`.
- **Card**: `1px` border (was `2px`), no default shadow; hover shadow only on `.clickable`. New variant: `.amp-card.elevated`.
- **Badge**: now `6px` border-radius (was `full`), adds `.amp-badge-red`, `.amp-badge-amber`, `.amp-badge-neutral`.
- **Input**: `h-10`, `border-radius: var(--amp-radius-xl)` (16px), `1px` border, `2px` focus ring. `select.amp-input` adds a custom SVG chevron arrow.
- **Chip**: `1px` border (was `1.5px`), new hover state.
- When adding new component styles to templates, verify the CSS matches the Tailwind class output of the corresponding `@amplify/ui` component.

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
