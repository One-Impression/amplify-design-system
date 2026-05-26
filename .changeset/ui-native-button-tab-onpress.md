---
"@one-impression/ui-native": patch
---

Forwards `onPress` explicitly on `DSButton` and `DSTab` props so the outer Clickable wrapper used by SDUI renderers can wire it through. The inner `<Pressable>` was swallowing taps from the outer wrapper, leaving every SDUI button and tab inert. JSDoc on both new prop declarations explains the SDUI nested-Pressable problem so future maintainers know why the prop is explicit instead of relying on `...props`.
