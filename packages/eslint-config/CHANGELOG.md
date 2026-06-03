# @one-impression/eslint-config

## 3.0.0

### Major Changes

- [#138](https://github.com/One-Impression/amplify-design-system/pull/138) [`2d0dfde`](https://github.com/One-Impression/amplify-design-system/commit/2d0dfde77dd29f5e66d2da4228a4c168a2cf0e9d) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - Migrate from `@amplify-ai/*` (npmjs.org, owner-locked) to `@one-impression/*` (GitHub Packages, org-owned).

  **Why:** The previous publish pipeline was bottlenecked on a single npm account, causing silent publish failures since 2026-05-22 (commits landed on `main` but never reached the registry). Moving to GitHub Packages under the `@one-impression` scope removes the single-owner dependency — every merge to `main` now publishes via the auto-injected `GITHUB_TOKEN`, with no human in the loop.

  **What changes for consumers:** Package scope changed from `@amplify-ai/*` to `@one-impression/*`. Install requires a GitHub PAT with `read:packages` scope (same auth model as the existing `@one-impression/sdk-*` packages from `amplify-schemas`). Update imports and `package.json` dependencies accordingly.

  **Versioning:** Major bump on every package because the scope change is a breaking name change — old `@amplify-ai/*` imports will not resolve after consumers update.

  **Pipeline:** Publishes now run via `changesets` (see `.changeset/` and `.github/workflows/publish.yml`) — every PR that ships a code change must include a `changeset` file declaring `patch`/`minor`/`major`. Merge to `main` opens a Version PR; merging that publishes.
