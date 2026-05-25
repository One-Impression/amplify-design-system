# @one-impression/tokens-creator

## 3.0.0

### Major Changes

- [#138](https://github.com/One-Impression/amplify-design-system/pull/138) [`2d0dfde`](https://github.com/One-Impression/amplify-design-system/commit/2d0dfde77dd29f5e66d2da4228a4c168a2cf0e9d) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - Migrate from `@amplify-ai/*` (npmjs.org, owner-locked) to `@one-impression/*` (GitHub Packages, org-owned).

  **Why:** The previous publish pipeline was bottlenecked on a single npm account, causing silent publish failures since 2026-05-22 (commits landed on `main` but never reached the registry). Moving to GitHub Packages under the `@one-impression` scope removes the single-owner dependency — every merge to `main` now publishes via the auto-injected `GITHUB_TOKEN`, with no human in the loop.

  **What changes for consumers:** Package scope changed from `@amplify-ai/*` to `@one-impression/*`. Install requires a GitHub PAT with `read:packages` scope (same auth model as the existing `@one-impression/sdk-*` packages from `amplify-schemas`). Update imports and `package.json` dependencies accordingly.

  **Versioning:** Major bump on every package because the scope change is a breaking name change — old `@amplify-ai/*` imports will not resolve after consumers update.

  **Pipeline:** Publishes now run via `changesets` (see `.changeset/` and `.github/workflows/publish.yml`) — every PR that ships a code change must include a `changeset` file declaring `patch`/`minor`/`major`. Merge to `main` opens a Version PR; merging that publishes.

### Minor Changes

- [#108](https://github.com/One-Impression/amplify-design-system/pull/108) [`b339202`](https://github.com/One-Impression/amplify-design-system/commit/b33920277bcf8bcd23cca0ee3fad23a69b9ab1cb) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - feat(tokens-creator): extend sdui.\* token contract + icon manifest pipeline

  Adds sdui.spacing, sdui.font-size, sdui.font-weight, sdui.icon-size, sdui.radius,
  sdui.border-width, and sdui.component.button token sections for the creator SDUI rebuild.

  Adds build-icons.ts pipeline that generates dist/icons/manifest.json, essentials.json,
  version.txt, and manifest.d.ts from SVG source files in icons/.

- [#133](https://github.com/One-Impression/amplify-design-system/pull/133) [`06676e5`](https://github.com/One-Impression/amplify-design-system/commit/06676e508000aa9fa51c1f615e364e4c1331206b) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - feat(tokens-creator): add palette semantic alias module

  Adds the `palette` export — a hand-curated semantic alias map for BFF and app
  consumers. Maps engineer-friendly names (`palette.text.strong`) to canonical
  SDUI token names (`"sdui.color.neutral-strong"`) across all 7 token families
  (color, font-size, font-weight, spacing, radius, icon-size, border-width).
  Build-time validator ensures every alias resolves in every theme JSON.

  New export path: `@one-impression/tokens-creator/palette`. Consumers replace
  inline token strings and local `const color = {...}` duplication with
  `import { palette } from "@one-impression/tokens-creator/palette"`. Theme
  resolution stays entirely client-side; the BFF emits palette names and the
  renderer paints the theme-correct value at paint time.

### Patch Changes

- Updated dependencies [[`2d0dfde`](https://github.com/One-Impression/amplify-design-system/commit/2d0dfde77dd29f5e66d2da4228a4c168a2cf0e9d)]:
  - @one-impression/tokens-foundation@3.0.0
