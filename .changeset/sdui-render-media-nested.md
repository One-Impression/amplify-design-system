---
"@one-impression/sdui-runtime": patch
---

Fixes `renderMedia` to read `MediaSchema` as a nested discriminated union (`media.image.src`, `media.icon.name`, `media.image_stack`, `media.progress`) instead of treating it as a flat object. The previous flat read produced `undefined` for every valid wire payload — icons rendered blank and cover images were missing on aerobar, cards, info-rows. Pure logic is extracted into a framework-free `describeMedia` helper so the mapping is unit-testable without React Native.
