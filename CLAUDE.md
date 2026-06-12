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



## SDUI Playground (`apps/sdui-playground`)

## SDUI Playground (`apps/sdui-playground`)

An on-device Expo app for developing the SDUI rendering layer in isolation — no publish cycle, no gateway dependency. Renders real SDUI page contracts (JSON fixtures) through the actual `sdui-runtime` + `ui-native` + `tokens-creator` workspace packages.

**Stack**: Expo SDK 54 · React Native 0.81.5 · React 19.1.0 · New Architecture (Fabric/bridgeless)

**Key facts**:
- `apps/*` must be listed in the root `workspaces` alongside `packages/*`.
- Root `package.json` `overrides` pin `react`/`react-dom` to `19.1.0` and `react-native` to `0.81.5` repo-wide. Root `.npmrc` sets `legacy-peer-deps=true`. Do not remove either — they prevent npm from hoisting a wrong RN version.
- Metro resolves `@one-impression/sdui-runtime` and `@one-impression/ui-native` **directly from source** (`src/index.ts`) via `resolveRequest` aliases in `metro.config.js`, enabling Fast Refresh on renderer edits without a build step.
- A single copy of `react`/`react-native` is enforced via `extraNodeModules` in `metro.config.js`. Without this, workspace packages can pull a second copy → "Invalid hook call" red-screen.
- `react-native-mmkv` must be v3+ under New Architecture (bridgeless JSI); v2 cannot bind.
- The `react-native-worklets/plugin` Babel plugin **must be last** in `babel.config.js`.

**Run loop**:
```bash
# From apps/sdui-playground/

# Fixture server (serves page JSON on port 3012; edit a .json → picked up on next fetch, no restart)
npm run serve:fixtures
adb reverse tcp:3012 tcp:3012

# Metro on port 8082 (creator-app holds 8081)
adb reverse tcp:8082 tcp:8082
RCT_METRO_PORT=8082 npx expo start --dev-client --port 8082 --clear

# Native rebuild (only needed after adding a native dep or config-plugin change)
CI=1 npx expo prebuild --platform android --no-install
(cd android && JAVA_HOME=/opt/homebrew/opt/openjdk@17 ./gradlew :app:installDebug)
```

**Fixture server** (`server/fixture-server.mjs`, port 3012):
- `GET /sdui/page/:target` → serves `server/pages/:target.json` fresh on every request.
- `GET /v1/creator/assets/icons-manifest` → serves `packages/tokens-creator/dist/icons/manifest.json` for `IconStoreProvider`.
- `GET /healthz` → lists available page targets.

**Contract validation**:
```bash
node scripts/validate-contracts.mjs
```
Validates all `server/pages/*.json` against `PageSchema` (from `sdk-native-sdui`) and per-action payload schemas. Reports unknown fields stripped by Zod and schema violations.

**SDUI rendering changes shipped with the playground**:
- `SduiNavigationHost` — runtime-owned native-stack with per-transition types; bottom sheets as `transparentModal` routes.
- **Page gutter** — 12 px symmetric gutter + vertical row-gap owned by the layout container, not individual snippets. Per-type and backend-overridable.
- **Icons** — rendered via `IconGlyph` + `IconStoreProvider`; SVGs resolved from the MMKV-persisted manifest with bundled-essentials fallback.
- **Token resolvers** — accept both short camelCase keys and the fully-qualified `sdui.<group>.<kebab>` wire form (`lookupToken`).
- **Card** — `elevation` prop (`none|sm|md|lg|xl`), outer-shadow/inner-clip structure; defaults match the legacy creator card (`neutralSubtle` border, no shadow, `neutralInverse` bg, `lg` radius, `md` padding).
- **sdk-native-sdui v3** — `InfoRow` field renamed `status_tag` → `tag`; `Text` field renamed `weight` → `font_weight`.

**Do not add** EAS / Expo cloud build config here — the playground is local-only.

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
