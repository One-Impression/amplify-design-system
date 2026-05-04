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
  ui/                 — Shared React components (Button, Badge, Card, EmptyState, Skeleton, RadioGroup, Combobox)
  storybook/          — Component documentation and visual testing
  eslint-config/      — Design system lint rules (no-hardcoded-colors, no-raw-spacing, prefer-token-import)
  feature-flags/      — Feature flag utilities
```

### Beta form primitives (since 2.6.0)

**RadioGroup + Radio** — Accessible radio group with arrow-key navigation (down/right = next, up/left = previous), Space to select, horizontal/vertical orientation. Only the selected radio is tabbable. Arrow keys skip disabled radios and wrap around.

```tsx
<RadioGroup name="color" value={color} onValueChange={setColor} orientation="vertical">
  <Radio value="red">Red</Radio>
  <Radio value="blue" disabled>Blue</Radio>
</RadioGroup>
```

Key props: `name` (required), `value`/`defaultValue`, `onValueChange`, `orientation` (`vertical`|`horizontal`), `disabled`, `readOnly`, `label`, `error`, `helperText`.

**Combobox** — Searchable single-select. Supports three item sources (mutually exclusive): `items={[...]}` prop, `<Combobox.Item>` children, or async `loadItems(query)` (debounced, default 250 ms). Includes a clear button when a value is selected. Keyboard: ArrowDown/Up to navigate, Enter to select, Escape to close, Home/End to jump.

```tsx
// Static items
<Combobox label="Platform" items={platforms} value={val} onValueChange={setVal} />

// Children composition
<Combobox label="Currency" value={val} onValueChange={setVal}>
  <Combobox.Item value="usd" label="USD" hint="Default" />
  <Combobox.Item value="eur" label="EUR" />
</Combobox>

// Async
<Combobox label="Country" loadItems={fetchCountries} debounceMs={300} value={val} onValueChange={setVal} />
```

Key props: `value`/`defaultValue`, `onValueChange`, `items`, `loadItems`, `debounceMs`, `label`, `placeholder`, `error`, `helperText`, `emptyMessage`, `disabled`, `readOnly`, `name`.

Both components use Canvas CSS variables only — no hardcoded colors or spacing.

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
