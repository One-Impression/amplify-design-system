# Canvas Design System Changelog

All notable changes to the public packages of `amplify-design-system`.

## [1.0.0] — 2026-04-27

### Added
- **`@amplify/mcp-server`** — new package. MCP server exposing the Canvas design system to AI agents (Pixel, Claude Code) via stdio + HTTP transports. Five tools: `list_components`, `get_props`, `find_block`, `validate_usage`, `suggest_token`.
- **`@amplify/ui` JSON contracts** — every build now emits `dist/contracts/<Component>.json` (per-component spec via TypeScript compiler API) and `dist/contracts.json` (manifest). Single source of truth replacing the previous regex extractors. Exposed via subpath exports: `@amplify/ui/contracts`, `@amplify/ui/contracts/*`.
- **`@amplify/ui` LLM docs** — every build emits `dist/llms.txt` (root index, [llmstxt.org](https://llmstxt.org) spec), `dist/llms/<Component>.md` (per-component rule sheets), and `dist/llms.json` (flat mirror). Exposed via subpath exports: `@amplify/ui/llms.txt`, `@amplify/ui/llms.json`, `@amplify/ui/llms/*`.

### Changed
- **`@amplify/ui` 0.1.0 → 1.0.0** — first stable release. Component API surface (46 components), variants, and prop signatures are now stable; future breaking changes will follow semver and ship with codemods (planned, Wave 2).
- CI publish loop now ships `@amplify/mcp-server` alongside the existing token packages, `@amplify/ui`, and `@amplify/eslint-config`.

### Notes
- This release closes Wave 1 of the Canvas 100x program. Pixel and Claude Code can now consume Canvas through a structured contract instead of carrying hardcoded component lists.
