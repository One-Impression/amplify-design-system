---
"@one-impression/ui-native": minor
"@one-impression/sdui-runtime": minor
---

Add circular progress support.

- **ui-native:** new `CircularProgress` primitive (SVG ring with optional centered content); declares `react-native-svg` as a peer dependency.
- **sdui-runtime:** `info_row` progress with `shape: "ring"` now renders the ring (with its `%` label centered) via `right_media`; `shape: "bar"` (default) keeps the linear indicator. Progress `value` is now normalized against `max` (a `value: 41, max: 100` previously rendered as a full bar). `info_row` tags now pass `bg_color`/`label.color` through to the pill instead of dropping them.

Requires `@one-impression/sdk-native-sdui` with the `ProgressSchema.shape` field.
