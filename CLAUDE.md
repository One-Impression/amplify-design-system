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



## SDUI Runtime — Notable Contracts & Behaviour

## SDUI Runtime — Notable Contracts & Behaviour

**Package**: `packages/sdui-runtime`

### `submit` action — path-direct contract
`payload.endpoint` is **removed**. The submit action now uses `payload.path` (same contract as `bff_call` / `reload`): the handler calls `resolveRequestUrl` + `buildBffHeaders`, carrying the same auth + dev-identity + active-social headers. Builders must emit `payload.path`; a missing path is a logged no-op (no request, no `on_success`/`on_error` chain).

```ts
// wire shape
{ type: "submit", payload: { form_id: string; path: string; path_params?: Record<string,string>; query_params?: Record<string,string>; request_body?: Record<string,unknown>; ... } }
```

Form values are merged **over** `request_body` (form wins on key collisions).

### Page store — per-navigation-instance (keyed by `route.key`)
The page store is no longer single-page. Each mounted screen registers its own entry under `route.key`; pushing a new screen does not clobber the screen behind it. New store API:

- `setPageTree(page, instanceKey?)` — register + activate
- `activatePage(instanceKey)` — re-focus on navigation back
- `dropPage(instanceKey)` — remove on unmount
- `pagesByKey: Record<string, Page>` — per-instance cache
- `activeKey: string | null` — focused instance

`page` / `pageId` mirror the active instance (backwards-compatible for handlers). Two instances of the same page id (e.g. two campaign-detail screens on the stack) keep separate trees.

### Section reload reaches header/footer slots
`replaceNode` (and therefore `replace_section`) now searches `page.data.header` and `page.data.footer` slots after `page.items`, so a reload can swap a pinned footer node (e.g. KYC verify step revealing the Submit footer).

### `PageStandard` and `PageStickyFooter` now read the live store
Previously only `PageFeed` (via `usePageScaffold`) re-rendered on `reload_section` / `replace_section` / `append_items`. Both standard and sticky-footer pages now sync into the store on mount and read `livePage` back, identical to the feed.

### Keyboard taps (`keyboardShouldPersistTaps="handled"`)
All three scroll containers (feed, standard, sticky-footer) now set `keyboardShouldPersistTaps="handled"`. In-page actions (e.g. an inline Verify button beside a focused text field) fire without requiring a prior keyboard-dismiss tap.

### Button icon rendering (`icon_left` / `icon_right`)
`icon_left` and `icon_right` in `ButtonComponentSchema` are bare `{ name, color?, size? }` specs — **not** nodes. They are rendered with `IconGlyph` directly (same path as `InfoRow`/`renderMedia`). Do **not** route them through the `Interpreter`; passing a spec with no `type` crashes `resolveRenderer`.

### `SduiErrorBoundary` API change
`fallback: ReactNode` prop is replaced by `renderFallback: (error?: Error) => ReactNode`. The boundary now captures the error and passes it to the callback, so dev fallbacks can surface the error message. Update any direct usages of `SduiErrorBoundary`.

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
