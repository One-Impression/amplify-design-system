---
"@one-impression/sdui-runtime": minor
"@one-impression/ui-native": minor
"@one-impression/tokens-creator": minor
---

SDUI composite snippet, form system, header slot, and Tag theming.

- **`sdui.snippet.composite`** — one composing snippet whose `data.layout`
  discriminant (`cover` / `stack` / `row`) names a slot-set + placement; slots
  hold arbitrary child Nodes. Owns arrangement (gutter, full-bleed media,
  edge-overlap float, header/footer strips), never contents. `resolveRenderer`
  now dispatches on the layer segment (`.snippet.` / `.ui_component.`) so legacy
  `creator.*` and domain-neutral `sdui.*` types both resolve.
- **Header slot** — `page_header` as a wire slot (top safe-area inset +
  solid/gradient background + pressable back affordance) across page types and
  bottom sheets; the native nav header is hidden when a wire header is present.
- **Form system** — `form_id`-keyed store, `useFormField`, validation evaluator,
  decoupled `submit` action; `component.field` token rhythm; composable
  `select_trigger` (replaces the bespoke phone-number input).
- **Tag theming** — the Tag renderer now honors the wire `bg_color` /
  `text_color` / `gradient` / glyph `icon` fields (previously every tag rendered
  as the default white pill). Adds a `component.tag` token group so tags share
  the system radius + font scale, with the icon sized to the label.
- **group_config** card no longer forces an `sm` shadow — it falls back to the
  Card default elevation like every other snippet card.
