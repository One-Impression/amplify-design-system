---
"@one-impression/sdui-runtime": minor
---

Rewires the bottom-sheet runtime to match gorhom's imperative `BottomSheetModal` API. `useBottomSheetStore` is reorganised around `registry` / `openSheets` / `openOrder` / `contexts` with `register`, `unregister`, `open`, `close`, `closeAll` actions; reopening an already-open sheet promotes it to topmost. `BottomSheetHost` renders one `BottomSheetHostSheet` per registered sheet, each owning its own ref and calling `present()` / `dismiss()` via a `useEffect` keyed on the open flag. Page renderers (`PageStandard`, `PageFeed`, `PageStickyFooter`) and the `BottomSheet` snippet renderer pre-register on mount and unregister on unmount, so navigating away no longer leaks orphan entries. `useBottomSheetData` reads through `useShallow` for an atomic snapshot under React 18 concurrent rendering. The `sheet` action handler now calls `open(sheet_id)` (registry lookup) instead of stamping a sheet inline.
