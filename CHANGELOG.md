# Canvas Design System Changelog

All notable changes to the public packages of `amplify-design-system`.

## [1.1.0] — 2026-04-28

### Added (additive — `@amplify-ai/ui`)

- **`xs` size variant** on `Button` and `IconButton`. Discovered while preparing the atmosphere migration: data-dense dashboards need a smaller-than-`sm` control (`h-6` = 24px) for tight rows. Without `xs` the alternative would have been forcing every consumer to either accept Canvas's coarser scale or to bypass Canvas with bespoke local primitives — neither acceptable.
- This is a precursor to the proper density-mode work planned in Wave 2 Tier 2 (`compact` × `cozy` orthogonal axis). Once density lands, `xs` becomes "compact `sm`" automatically; this PR keeps the explicit `xs` opt-out for callsites that want the smaller footprint regardless of density.

| Component | Size | Width / Height | Padding | Use case |
|-----------|------|----------------|---------|----------|
| Button | `xs` | h-6 (24px) | px-2 | Inline tables, dashboards, dense forms |
| IconButton | `xs` | 24×24 | — | Inline row actions in DataTable |

Pure additive — no breaking change. Existing `sm/md/lg` callsites unchanged.

## [1.0.1] — 2026-04-27

### Changed (BREAKING — pre-publish)

- **Scope rename: `@amplify-ai/*` → `@amplify-ai/*`** for every published
  package. The previous `@amplify` scope is not owned by the
  `One-Impression` org, which caused every GH Packages publish attempt
  on the v1.0.0 release to fail with `403 permission_denied`. Renaming
  to a scope that matches the org makes the workflow's automatic
  `GITHUB_TOKEN` sufficient to publish — no extra PAT or org-level
  package settings required.
- Affected packages: `@amplify-ai/ui`, `@amplify-ai/mcp-server`,
  `@amplify-ai/tokens-{foundation,brand,atmosphere,creator}`,
  `@amplify-ai/eslint-config`, `@amplify-ai/templates`,
  `@amplify-ai/feature-flags`, `@amplify-ai/storybook`.
- Internal cross-package imports rewired in the same commit so the
  monorepo workspaces still resolve.
- CI `setup-node` `scope:` updated to match.
- Consumer install command changes from `@amplify-ai/*` → `@amplify-ai/*`.

This is BREAKING for any external consumer that pinned `@amplify-ai/*` —
but since v1.0.0 never actually published to GH Packages, no real
consumers exist yet. Future migrations will follow standard semver.

## [1.0.0] — 2026-04-27

### Added
- **`@amplify-ai/mcp-server`** — new package. MCP server exposing the Canvas design system to AI agents (Pixel, Claude Code) via stdio + HTTP transports. Five tools: `list_components`, `get_props`, `find_block`, `validate_usage`, `suggest_token`.
- **`@amplify-ai/ui` JSON contracts** — every build now emits `dist/contracts/<Component>.json` (per-component spec via TypeScript compiler API) and `dist/contracts.json` (manifest). Single source of truth replacing the previous regex extractors. Exposed via subpath exports: `@amplify-ai/ui/contracts`, `@amplify-ai/ui/contracts/*`.
- **`@amplify-ai/ui` LLM docs** — every build emits `dist/llms.txt` (root index, [llmstxt.org](https://llmstxt.org) spec), `dist/llms/<Component>.md` (per-component rule sheets), and `dist/llms.json` (flat mirror). Exposed via subpath exports: `@amplify-ai/ui/llms.txt`, `@amplify-ai/ui/llms.json`, `@amplify-ai/ui/llms/*`.

### Changed
- **`@amplify-ai/ui` 0.1.0 → 1.0.0** — first stable release. Component API surface (46 components), variants, and prop signatures are now stable; future breaking changes will follow semver and ship with codemods (planned, Wave 2).
- CI publish loop now ships `@amplify-ai/mcp-server` alongside the existing token packages, `@amplify-ai/ui`, and `@amplify-ai/eslint-config`.

### Notes
- This release closes Wave 1 of the Canvas 100x program. Pixel and Claude Code can now consume Canvas through a structured contract instead of carrying hardcoded component lists.
