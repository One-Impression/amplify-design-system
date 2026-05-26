---
"@one-impression/sdui-runtime": patch
---

`handleNavigate` now falls back to `action.target` when `payload.target` is undefined, with a deprecation warning routed through `config.logger.warn` (or `console.warn` if no logger is configured). New emits (with `target` inside `payload`, per [amplify-schemas#172](https://github.com/One-Impression/amplify-schemas/pull/172)) take precedence and never warn. Resilience aid for cached / third-party / pre-#172 emits that still place `target` at the action level — the page navigates correctly while the stale source surfaces in telemetry.
