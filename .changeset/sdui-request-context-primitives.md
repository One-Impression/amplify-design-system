---
"@one-impression/sdui-runtime": minor
"@one-impression/ui-native": minor
---

SDUI region page model — the runtime for shell-first, region-scoped pages (tabbed / filtered feeds), on `@one-impression/sdk-native-sdui@^3.4.0`.

**Runtime**
- **`usePageScaffold`** — base page scaffold owning every cross-cutting concern (lifecycle `on_load`/`on_dismount`/back/app-state, live-page subscription, the `reload` partial-merge, per-region loading, bottom-sheet registration, refresh) and exposing `getRegion(name)` → content-or-skeleton. Layouts reduce to zone geometry. `PageFeed` moved onto it.
- **Region-scoped `reload`** + **partial-page merge** in `usePageStore` (`response.data` shallow-merges, `response.items` replaces; per-region loading flags).
- **Reactive render-bindings** — `{ ref: "$.local.<key>" }` (+ `contains`/`equals`) resolved before validation in `SduiNode`, so a chip's `selected` / a tab's `active` reflect local state instantly with no reload.
- **`set_local` `array_toggle`** handler (multi-select membership) + **backend-controlled debounce** in the action engine.
- **`creator.snippet.skeleton`** renderer — composable shimmer (`rect`/`line`/`circle` bars, horizontal row groups, padding), shown per region while reloading.
- Fixes: Chip wires `on_click` via the pressable + shows a remove × (trailing) via the icon-store glyph; `TabsFooter` bottom safe-area; nav host hides the native header when a header **region** is declared (`data.header_skeleton`), not only `data.header`.

**ui-native**
- `Chip` gains a `trailingIcon` slot (remove × on selected multi-select chips).

Additive — existing pages/snippets unchanged. Supersedes the unreleased `reload_page`/`reload_content` primitives.
