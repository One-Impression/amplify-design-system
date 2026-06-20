---
"@one-impression/sdui-runtime": minor
"@one-impression/ui-native": minor
---

Form primitives + fixes for multi-field creator forms:

**New**
- **`DateField` (ui-native)** + **`date_input` (sdui-runtime)** — a form-bound date field backed by a self-contained pure-JS calendar popover (month grid + year list, no native module). ISO `YYYY-MM-DD` value, min/max bounds.
- **`show_when` conditional visibility (sdui-runtime)** — a base-node rule (`{ field, equals | not_equals | in | truthy }`) evaluated against a sibling field; the gated node renders only while the rule holds, and a hidden form field drops out of validation. Wired at the interpreter via `ConditionalGate`.
- **`single_select_input` `layout: "horizontal"` (sdui-runtime)** — lays the radio options out as equal-width columns in a row (default stays vertical).

**Fixes**
- **`Tab.renderer`** renders its icon via `IconGlyph` (was a bare `DSIcon` with no glyph child), so footer tab icons resolve from the manifest.
- **`Form.renderer`** renders the raw field nodes (not the schema-parsed `v.fields`), preserving per-field wire extensions like `show_when`.
- **`select_trigger`** renders as an input-styled, tap-to-open field (label + bordered box + value/placeholder + chevron) and shows multi-select (`string[]`) values via `value_display`.
- **`Input` floating label** — the real placeholder shows only once the label floats (empty + resting no longer overlaps the placeholder); tapping the resting label now focuses the field (the label is a pressable that focuses the input). Inputs gain a small `sm` top margin.
