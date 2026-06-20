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



## SDUI / ui-native Primitives

## SDUI / ui-native Primitives

### `DateField` (`@one-impression/ui-native`)
A pure-JS calendar popover — no native module required. Shows a month grid + year list. Value is ISO `YYYY-MM-DD`. Props: `label`, `value`, `placeholder`, `error`, `helperText`, `disabled`, `minDate`, `maxDate`, `onChange`, `onOpen`.

### `date_input` (`sdui-runtime`)
SDUI renderer for `DateField`. Registered as `sdui.snippet.date_input`. Binds into `useFormStore` by `(form_id, field_name)` exactly like other form inputs. Data schema is renderer-owned (not in `sdk-native-sdui`) — gateway emits it as raw wire.

### `show_when` conditional visibility (`sdui-runtime`)
A base-node wire extension (`{ field, equals | not_equals | in | truthy, form_id? }`) that hides/shows a node based on a sibling field's value in the same form. Evaluated by `ConditionalGate` in `interpreter/ConditionalGate.tsx`. When a node becomes hidden its validation error is cleared so it drops out of the form's validity gate; its value is preserved so toggling back restores user input. `ConditionalGate` is mounted by the Interpreter only for nodes that carry `show_when`.

**Interpreter change**: the Interpreter now checks for `show_when` before rendering — nodes carrying it are wrapped in `<ConditionalGate>` instead of rendered directly.

**Form.renderer change**: `Form.renderer` now passes the **raw** field nodes (`node.data.fields`) to `FormInner` instead of the schema-parsed `v.fields`. This preserves per-field wire extensions (e.g. `show_when`) that `FormSchema` would otherwise strip.

### `single_select_input` — `layout: "horizontal"` flag
New optional wire field. `"horizontal"` (or `"row"`) lays radio options as equal-width flex columns in a row. Default (unset) stays vertical.

### `select_trigger` — restyled + multi-value support
`select_trigger` now renders as an input-styled field (label + bordered box + value/placeholder + chevron) matching `Input`/`DateField` visual grammar. Supports both `string` (single-select) and `string[]` (multi-select) field values — each id is mapped via `value_display` and joined with `, `. Wire `data` shape updated: `{ form_id, field_name, label?, default_value?, value_display?, placeholder?, required? }` (removed `trailing_icon`).

### `Input` (`@one-impression/ui-native`) — fixes
- Real placeholder is hidden until the label floats; empty+resting state no longer overlaps the placeholder.
- The floating label is an `AnimatedPressable` that focuses the field on tap (passthrough is unreliable on Android for z-lifted labels).
- Inputs gain a small `sm` top margin (`marginTop: sdui.spacing.sm`).

### `Tab.renderer` — icon fix
Tab icons now render via `IconGlyph` (not bare `DSIcon`) so footer tab icons resolve from the manifest.

## Rules

1. **No hardcoded colors** in UI components — use CSS variables only
2. **No design governance logic here** — that's Pixel's job
3. **All token changes** go through direct PR (Pixel will detect drift and auto-cascade)
4. **ESLint rules** exist in `packages/eslint-config/rules/` but are NOT enforced in product repos yet
5. **Breaking changes** to CSS variable names or values require a migration note in the PR description

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
