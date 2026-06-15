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



## SDUI Runtime — Viewport Lifecycle & Backend-Driven Infinite Scroll

## SDUI Runtime — Viewport Lifecycle & Backend-Driven Infinite Scroll

### Viewport lifecycle (`packages/sdui-runtime/src/viewport/`)

`PageFeed` detects real item visibility via FlatList `onViewableItemsChanged` (50% threshold / 250 ms minimum). This replaces the `onLayout` proxy, which fires on render — not on actual visibility.

- **`ViewportManagedProvider`** — wrap a FlatList in this context to signal that the surface owns the view lifecycle for its subtree. `SduiNode` reads `useViewportManaged()` and skips its own `<Viewable>` wrapper when inside this context.
- **`fireViewability(node, phase, deps)`** — fires `on_view` / `on_exit` triggers for a node, honoring per-trigger `policy`:
  - `once` (default) — dedup keyed `${node_id}::${phase}::${trigger_id}`; stored in a `Set` passed via `deps.fired`.
  - `every` — always fires.
  - Scalar `node.on_view` is treated as a single `once` trigger.
  - `view_events` telemetry fires once per node on first view.
- Called by `PageFeedRenderer`'s `handleViewableItemsChanged` ref; NOT by `SduiNode` directly when inside a managed surface.

**Do not add a `<Viewable>` wrapper inside a `ViewportManagedProvider` subtree** — it will double-fire on_view via the onLayout path.

### Backend-driven infinite scroll

The BFF owns all pagination decisions. The client never decides when to load more.

Pattern:
1. BFF returns the first batch as `page.items` in a `layout: feed` page.
2. The **(N-2)th-last** card in each batch carries a `viewability.on_view` trigger with `policy: once` and an `action` of type `bff_call` pointing at the next cursor.
3. When that card becomes visible, `fireViewability` dispatches the `bff_call`, which returns an `append_items` action.
4. The **final batch** omits `on_view` entirely — this terminates scroll with no client-side flag.
5. Cursor is a query param baked into the trigger by the server; the client never stores or increments it.

### `append_items` handler notes

- **`usePageStore.appendItems`** now supports top-level (feed) append: if `target === page.id`, items are appended directly to `page.items`. Nested list/section nodes still route through `appendItemsInTree`.
- The handler appends **raw nodes** (not strict-parsed) so node-level fields like `viewability` are not stripped by an older SDK schema. Nodes are validated at render time by `SduiNode`.

### SDK version

`@one-impression/sdk-native-sdui` **^3.2.0** is required — it ships the typed `viewability` contract (`on_view` / `on_exit` / `policy`). The raw-append approach in `append-items.ts` remains as belt-and-suspenders for forward-compatibility.

### Playground demo

`demo.feed` in the fixture server demonstrates the full flow: 15 cards over 2 backend-driven loads (page size 5 → 10 → 15), with cursor advancing server-side and clean termination on the last batch.

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
