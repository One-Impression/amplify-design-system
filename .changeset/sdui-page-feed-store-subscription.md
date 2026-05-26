---
"@one-impression/sdui-runtime": patch
---

`PageFeedRenderer` now subscribes to `usePageStore` for its `items` data so `replaceNode` and `appendItems` (added in #149) take effect end-to-end. On mount the renderer syncs the server-provided page tree into the store via `setPageTree(page)`; the FlatList then reads `items` reactively with a `useShallow` selector scoped by `page.id`, falling back to the prop value when the store hasn't been populated yet or holds a different page. Without this, infinite-scroll `append_items` and section reload were updating the store but never re-rendering the feed.
