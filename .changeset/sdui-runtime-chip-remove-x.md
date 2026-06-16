---
"@one-impression/sdui-runtime": patch
---

ui_component Chip now renders a trailing remove × when `selected` — the
conventional multi-select / filter-chip affordance (matches the snippet Chip).
Reactive to the render-bound `selected`, so the × appears/disappears instantly.
