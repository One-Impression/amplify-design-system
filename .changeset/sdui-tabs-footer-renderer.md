---
"@one-impression/sdui-runtime": patch
---

`TabsFooter` renderer is now legacy-faithful and supports active-index styling:

- Renders each tab Node in an equal-width slot (`flex: 1` per tab), matching legacy `TabsFooterSnippetType1.styles.ts`.
- Adds the top border + soft top-edge shadow from the legacy snippet so the footer reads as a pinned bottom navigation.
- Reads `data.active_index` and overrides each tab Node's `data.active` flag accordingly — the inner `Tab` renderer (`creator.ui_component.tab`) already paints the active state via `data.active`, so the active tab gets the primary-color tint automatically.
- `on_click` is dispatched per-tab via the existing Tab → `SduiNode` → `Clickable` chain — no extra wrapping layer here. Producers can therefore keep all per-tab navigation/state mutations on the Tab Node itself.
- Active-index override is non-mutating: tabs without `active_index` keep their producer-supplied `data.active`.

Designed to live inside the new `PageFeed` `data.footer` slot for the home page bottom-tabs use case.
