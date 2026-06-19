---
"@one-impression/sdui-runtime": patch
---

Make `reload_section` / `replace_section` / `append_items` re-render standard and sticky-footer pages, and let in-page actions fire while the keyboard is open.

`PageStandard` and `PageStickyFooter` rendered straight from the `page` prop and never synced to `usePageStore` — so a section reload (e.g. KYC PAN verify swapping in the GST select) updated the store but never re-rendered the screen (only `PageFeed`, via `usePageScaffold`, read the live tree). Both now sync the page into the store on mount and read the live tree back, matching `PageFeed`.

Also set `keyboardShouldPersistTaps="handled"` on the page scroll containers (standard, sticky-footer, feed) so a tap on an in-page action (e.g. an inline "Verify" beside a focused text field) fires instead of being swallowed to dismiss the keyboard.
