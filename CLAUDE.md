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
  sdui-runtime/       — SDUI runtime for Creator App: interpreter, action engine, bottom-sheet manager,
                        loaders, providers, and 43 Tier-2 snippet renderers
```

### sdui-runtime snippet registry

The `snippetRegistry` in `packages/sdui-runtime/src/registries/snippets.ts` maps `creator.snippet.*` wire-type strings to renderer functions. As of Task 25, 43 renderers are registered across these categories:

| Category | Count | Examples |
|---|---|---|
| Layout / Utility | 12 | GroupConfig, Card, BannerImage, Aerobar, EmptyState, Steps |
| Headers / Footers | 11 | PageHeader, BottomSheetHeader, Tabs, TabsFooter |
| Card / Layout containers | 4 | BottomSheet (store-based), Form (with FormContext) |
| Image | 3 | ImageCarousel, ImageStack, OverlappingImage |
| Info / List | 6 | InfoRow, InfoProgressRow, InfoIconRow, List |
| Input / Selection | 6 | Input, PhoneNumberInput, ToggleInput, MultiSelectInput |
| Chip | 1 | Chip |

**Renderer function signature:** `(node: Node) => React.ReactElement` — not `ComponentType<Node>`.

**Key patterns:**
- All renderers wrap content in `SduiNode` + pass the Zod schema for the snippet type.
- `BottomSheet` renderer does **not** render inline — it registers with `useBottomSheetStore` on mount and returns `null`. The `BottomSheetHost` at the app root handles display.
- `Form` renderer provides `FormContext` (exported as `FormContext` and `useFormContext` from `@amplify-ai/sdui-runtime`) so child field renderers can read/write form state.
- `renderMedia()` shared helper (exported from `@amplify-ai/sdui-runtime`) handles discriminated `MediaSchema` union rendering; use it in any new snippet that accepts a media field.

**Adding a new snippet renderer:**
1. Create `packages/sdui-runtime/src/snippets/<Name>/<Name>.renderer.tsx` and `index.ts`.
2. Register it in `snippets.ts` under the correct `creator.snippet.<wire_type>` key.
3. Export any public context/hooks from `src/index.ts` under the `// ── Snippets ──` block.

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
