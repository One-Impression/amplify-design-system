---
"@one-impression/sdui-runtime": minor
---

Viewport-visibility lifecycle + backend-driven infinite-scroll feeds.

- **Viewport coordinator** — `PageFeed` now detects real item visibility via FlatList `onViewableItemsChanged` (50% / 250ms), replacing the `onLayout` proxy for list items. It fires each node's `on_view` / `on_exit` triggers honoring per-trigger `policy` (`once` | `every`), with `once`-dedup keyed by `(node_id, trigger_id)`. `SduiNode` defers its view lifecycle to the surface when one manages it (`ViewportManagedProvider`).
- **Backend-driven infinite scroll** — a feed renders `sdui.snippet.composite` cards as top-level `page.items`; the BFF puts an `on_view` (policy `once`) load-more on the Nth-last card, returns an `append_items` action, and omits `on_view` on the last batch to terminate. The cursor lives entirely server-side; the client takes no pagination decisions. `usePageStore.appendItems` now supports top-level (feed) append, and `append_items` appends the raw nodes (validated at render) so node-level fields like `viewability` aren't stripped.
- Playground: the campaigns feed (`demo.feed`) + a paginated fixture endpoint demonstrate it end-to-end (15 cards over 2 backend-driven loads, no cascade, clean termination).
