---
"@one-impression/ui-native": patch
---

`Box` now forwards five additional React Native style props that were previously silently dropped: `position`, `zIndex`, `opacity`, `overflow`, and the four individual border widths (`borderTopWidth`, `borderBottomWidth`, `borderLeftWidth`, `borderRightWidth`, all of which accept either a `BorderWidthToken` or a raw number). SDUI handlers emit these on Box nodes for absolute-positioned overlays, animated fades, and one-sided dividers — without forwarding, those layouts rendered without their styling. Additive only — existing props are untouched.
