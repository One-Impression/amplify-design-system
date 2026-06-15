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



## SDUI System (sdui-runtime / ui-native)

## SDUI System (sdui-runtime / ui-native)

New capabilities added in this repo that affect how SDUI pages and snippets are authored.

### Composite snippet
`sdui.snippet.composite` is the new composing primitive. Its `data.layout` discriminant (`cover` / `stack` / `row`) defines the slot-set; slots hold arbitrary child Nodes. The composite owns arrangement only (gutter, full-bleed media, edge-overlap float, header/footer strips) — never contents.

- Use `cover` for campaign/card layouts: slots are `header_bg`, `header`, `media`, `overlay`, `float`, `float_end`, `body`, `footer`.
- `stack` / `row` supersede `group_config` for linear layouts.
- `resolveRenderer` now dispatches on the **layer segment** (`.snippet.` / `.ui_component.`) so both legacy `creator.*` and new `sdui.*` type prefixes resolve. Do not assume a hardcoded `creator.` namespace.

### Form system
Forms are server-driven and keyed by `form_id`.

- Snippet: `creator.snippet.form` wraps field snippets; `form_id` keys the store.
- Supported field snippets: `creator.snippet.input` (text/email/number/phone), `creator.snippet.single_select_input`, `creator.snippet.multi_select_input`.
- Validation types: `required`, `min_length`, `regex`, `min`, `max`, `min_selected`, `match_field`.
- Submit action: `{ type: "submit", payload: { form_id, endpoint, method, request_body, on_success, on_error } }`. Validates all fields before POST; server 422 with `{ errors: { field: message } }` writes back into the field error map.
- Phone number is composed, not bespoke: generic `input` with a `select_trigger` leading slot that opens a `single_select_input` bottom sheet for country-code selection.
- Design reference: `packages/sdui-runtime/FORM-SYSTEM-DESIGN.md`.

### Wire header slot (`page_header`)
Pages now support a `data.header` wire slot symmetric with `data.footer`. Supported on `standard`, `sticky_footer`, `feed` layouts and bottom sheets.

- `creator.snippet.page_header` owns top chrome: safe-area inset, solid or gradient background (`data.background.gradient.colors` + `angle`), and a pressable `left_icon` back affordance.
- When a wire header is present the native nav header is hidden automatically.
- Bottom-sheet header pins outside the scroll view and replaces the plain sheet title.

### Tag theming
`creator.ui_component.tag` now reads its full wire data:
- `bg_color` / `text_color` — solid pill colour.
- `gradient: { colors, angle }` — multi-stop gradient clipped to the pill.
- `icon: { name }` — glyph resolved via the icon store, sized inline to the label.

### Token groups added
- `component.field` — `{ height:48, paddingX:16, paddingY:12, radius:8 }` in `tokens-creator`. Shared by Input, SelectableItem, and Button.
- `component.tag` — `{ paddingX:12, paddingY:6, radius:8, fontSize:12 }` in `tokens-creator`. Shared system radius + font scale for all tags.

Both groups are wired through the theme JSON, `build-tokens.js` native emit, and `ui-native`/`sdui-runtime` type declarations.

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
