# Canvas Design System Changelog

All notable changes to the public packages of `amplify-design-system`.

## [1.0.1] — 2026-04-27

### Changed (BREAKING — pre-publish)

- **Scope rename: `@amplify/*` → `@one-impression/*`** for every published
  package. The previous `@amplify` scope is not owned by the
  `One-Impression` org, which caused every GH Packages publish attempt
  on the v1.0.0 release to fail with `403 permission_denied`. Renaming
  to a scope that matches the org makes the workflow's automatic
  `GITHUB_TOKEN` sufficient to publish — no extra PAT or org-level
  package settings required.
- Affected packages: `@one-impression/ui`, `@one-impression/mcp-server`,
  `@one-impression/tokens-{foundation,brand,atmosphere,creator}`,
  `@one-impression/eslint-config`, `@one-impression/templates`,
  `@one-impression/feature-flags`, `@one-impression/storybook`.
- Internal cross-package imports rewired in the same commit so the
  monorepo workspaces still resolve.
- CI `setup-node` `scope:` updated to match.
- Consumer install command changes from `@amplify/*` → `@one-impression/*`.

This is BREAKING for any external consumer that pinned `@amplify/*` —
but since v1.0.0 never actually published to GH Packages, no real
consumers exist yet. Future migrations will follow standard semver.

## [1.0.0] — 2026-04-27

### Added
- **`@one-impression/mcp-server`** — new package. MCP server exposing the Canvas design system to AI agents (Pixel, Claude Code) via stdio + HTTP transports. Five tools: `list_components`, `get_props`, `find_block`, `validate_usage`, `suggest_token`.
- **`@one-impression/ui` JSON contracts** — every build now emits `dist/contracts/<Component>.json` (per-component spec via TypeScript compiler API) and `dist/contracts.json` (manifest). Single source of truth replacing the previous regex extractors. Exposed via subpath exports: `@one-impression/ui/contracts`, `@one-impression/ui/contracts/*`.
- **`@one-impression/ui` LLM docs** — every build emits `dist/llms.txt` (root index, [llmstxt.org](https://llmstxt.org) spec), `dist/llms/<Component>.md` (per-component rule sheets), and `dist/llms.json` (flat mirror). Exposed via subpath exports: `@one-impression/ui/llms.txt`, `@one-impression/ui/llms.json`, `@one-impression/ui/llms/*`.

### Changed
- **`@one-impression/ui` 0.1.0 → 1.0.0** — first stable release. Component API surface (46 components), variants, and prop signatures are now stable; future breaking changes will follow semver and ship with codemods (planned, Wave 2).
- CI publish loop now ships `@one-impression/mcp-server` alongside the existing token packages, `@one-impression/ui`, and `@one-impression/eslint-config`.

### Notes
- This release closes Wave 1 of the Canvas 100x program. Pixel and Claude Code can now consume Canvas through a structured contract instead of carrying hardcoded component lists.
