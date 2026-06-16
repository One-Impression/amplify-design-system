---
"@one-impression/sdui-runtime": minor
---

Drop `creator.*` node-type support entirely (namespace migration cleanup). The renderer registries are now keyed `sdui.*` only — the transitional `creator.*` keys and alias machinery are removed, and all renderer-internal type literals + playground fixtures are swept to `sdui.*`. Done while no live app consumes the design system, so there is no blast radius; the SDK already emits `sdui.*` only. The resolver (layer-segment dispatch) is unchanged.
