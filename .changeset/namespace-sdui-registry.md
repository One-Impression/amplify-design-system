---
"@one-impression/sdui-runtime": patch
---

Alias the `sdui.*` node-type namespace in the renderer registries. Every `creator.snippet.*` / `creator.ui_component.*` key now has an `sdui.*` alias resolving to the same renderer, so both prefixes render identically while emitters migrate `creator.* → sdui.*`. The resolver dispatch (on the `.snippet.`/`.ui_component.` segment) is unchanged; `creator.*` keys are retained for backward compatibility. See `NAMESPACE-MIGRATION.md`.
