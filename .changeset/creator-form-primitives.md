---
"@one-impression/sdui-runtime": minor
"@one-impression/ui-native": minor
---

Form primitives for multi-field creator forms:

- **`DateField` (ui-native)** — a tappable date input with a self-contained, pure-JS calendar popover (month grid + year list, no native date-picker module), so it renders in any RN/Expo client without a prebuild. ISO `YYYY-MM-DD` value, min/max bounds.
- **`date_input` renderer (sdui-runtime)** — form-store-bound date field over `DateField`; the data schema is renderer-owned (emitted as raw wire, like the form `submit` action and `validations`).
- **`show_when` conditional visibility (sdui-runtime)** — a base-node rule (`{ field, equals | not_equals | in | truthy }`) evaluated against a sibling field in the same form; the gated node renders only while the rule holds, and a hidden form field is dropped from validation so it can't block submit. Wired at the interpreter via `ConditionalGate`.
- **Tab icon fix (sdui-runtime)** — `Tab.renderer` now renders its icon through `IconGlyph` (was a bare `DSIcon` with no glyph child), so footer tab icons resolve from the icon manifest.
