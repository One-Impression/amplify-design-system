---
"@one-impression/sdui-runtime": patch
---

`resolveRenderer` now returns `null` (not `undefined`, never throws) when a node type isn't registered, so one bad node degrades gracefully instead of taking down the page. The first occurrence of each unknown type emits `sdui.renderer.unknown_type` through the telemetry sink wired by `SduiRuntimeProvider`; subsequent occurrences are silenced via an internal `Set` to avoid flooding telemetry. Sibling pattern to `SduiNode`'s defensive `ZodError` handling.
