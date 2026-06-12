---
"@one-impression/sdui-runtime": minor
"@one-impression/ui-native": minor
---

SDUI rendering layer: card, gutter, icons, and tag/badge support.

- **ui-native Card** now matches the legacy creator card defaults — thin
  `neutralSubtle` border, no shadow (`elevation: 'none'`), `neutralInverse`
  background, `lg` radius, `md` padding — with an outer/inner structure and a
  new optional `elevation` prop (`none|sm|md|lg|xl`) plus `resolveShadow`.
- **Token resolvers** accept the long `sdui.<group>.<kebab>` wire form in
  addition to the short camelCase keys, so contracts using fully-qualified
  token strings resolve correctly.
- **Page gutter** is now container-owned: a single 12px gutter with symmetric
  vertical row-gap, per-type and backend-overridable.
- **Icons** render through `IconStoreProvider` + `IconGlyph`, resolving SVGs
  from the manifest (MMKV) with bundled essentials fallback.
- **InfoRow** consumes the renamed `tag` field and renders count/dot badges;
  Text uses `font_weight`. Aligns with `sdk-native-sdui` v3.
