---
"@one-impression/sdui-runtime": major
"@one-impression/ui-native": minor
---

Addressable surfaces + runtime-owned navigation. `sdui-runtime` now owns the
native-stack host (`SduiNavigationHost`), reload-by-name + path-direct actions,
sheet content-fetched-from-own-API, action-driven header chrome, and the
`BlinkerDot` indicator; reload/sheet handlers and InfoRow/SectionHeader/Separator
renderers updated. Peers on `@one-impression/sdk-native-sdui` `^5.0.0` (breaking).

`ui-native`: `Separator` gains `variant` (solid/dashed/dotted) + per-state tinting.
