---
"@one-impression/sdui-runtime": patch
---

GroupChips `layout: "scroll"` now insets the scroll content horizontally so the
first/last chip don't sit flush against the screen edge (and align with a
full-bleed header title). The wrap layout stays gutter-less (caller owns inset).
