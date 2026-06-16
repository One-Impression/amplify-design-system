---
"@one-impression/sdui-runtime": minor
---

Fix chip taps + add scrollable chip rows.

- `ChipRenderer` (ui_component.chip) now dispatches `on_click` via `DSChip.onPress`
  instead of relying on SduiNode's outer Clickable — which the inner Pressable
  swallowed, so a chip's `on_click` never fired (e.g. filter chips were dead).
  Mirrors the Tab / snippet-Chip renderers. Also resolves the chip icon via
  `IconGlyph` (was a no-op `Interpreter`).
- `GroupChipsRenderer` honors `data.layout`: `scroll` renders a single
  horizontally-scrolling row; `wrap` (default) keeps the multi-line row. Removes
  the hardcoded `paddingHorizontal` that double-padded the row on top of the
  caller's gutter.

Requires `@one-impression/sdk-native-sdui ^4.4.0` (the `groupChips.layout` field
+ chip `selected` render-binding).
