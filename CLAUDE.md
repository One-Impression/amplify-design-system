

## Overview

# amplify-design-system

Monorepo for Amplify's design system — token packages, component library, and Storybook.

## Overview

This is an npm workspaces monorepo. Packages live under `packages/`.

| Package | Description |
|---|---|
| `packages/tokens-foundation` | Base design tokens |
| `packages/tokens-brand` | Brand-tier tokens |
| `packages/tokens-creator` | Creator-tier tokens |
| `packages/tokens-atmosphere` | Atmosphere-tier tokens |
| `packages/ui` | `@amplify/ui` — React component library |
| `packages/storybook` | Storybook 8 instance (docs + visual regression) |
| `packages/eslint-config` | Shared ESLint config |
| `packages/feature-flags` | Feature flag utilities |

## Commands

```bash
# Install all dependencies
npm ci

# Build everything
npm run build

# Build only the UI package
npm run build -w packages/ui
# or
npm run build:ui

# Build Storybook
npm run build -w packages/storybook
```

## @amplify/ui Component Library

`packages/ui` contains 5 core components: **Badge**, **Button**, **Card**, **EmptyState**, **Skeleton**.

- All components use token-based styling and TypeScript strict types.
- Components follow a variant pattern.
- Must be built (`npm run build:ui`) before Storybook can consume it.

## Storybook

`packages/storybook` is a Storybook 8 instance with:
- Auto-docs and interactive controls for all 5 UI components.
- Dark-themed Amplify branding.
- SDUI snippet documentation stories (15 snippet types, grouped under `SDUI/Snippets`).
- SDUI stories use a `SnippetDoc` component showing type, description, and formatted JSON contract.

## CI Workflows

### `ci.yml` — Build Verification
- Verifies `dist/` output exists and is non-empty for: `tokens-foundation`, `tokens-brand`, `tokens-creator`, `tokens-atmosphere`, **and `ui`**.
- After token/UI builds are verified, also builds `@amplify/ui` and then runs a full Storybook build to confirm both succeed.

### `chromatic.yml` — Visual Regression (PRs only)
- Triggers on PRs that modify `packages/ui/**`, `packages/storybook/**`, or `packages/tokens-*/**`.
- Builds UI and all token packages before running Chromatic.
- Uses `CHROMATIC_PROJECT_TOKEN` secret.
- `exitZeroOnChanges: false` — PR will fail if visual changes are detected and not accepted.
- `onlyChanged: true` — only stories affected by the diff are tested.
- Externals tracked: `packages/ui/src/**` and `packages/tokens-*/tokens/**`.

## Adding a New Component

1. Add the component under `packages/ui/src/` following the variant pattern.
2. Add a Storybook story under `packages/storybook/` with all variants and interactive controls.
3. The Chromatic workflow will automatically pick it up on the next PR touching `packages/ui/**`.
