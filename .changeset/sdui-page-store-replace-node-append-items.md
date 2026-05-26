---
"@one-impression/sdui-runtime": minor
---

Adds `replaceNode(targetId, node)` and `appendItems(targetId, items)` methods to `usePageStore`, plus a new `page: Page | null` field with `setPageTree()`. Closes the gap where `reload_section`, `replace_section`, and `append_items` action handlers called methods that didn't exist on the store — every dispatch was silently crashing. Tree walks are immutable so unmodified siblings preserve their references for React's shallow-equality bail-out. Existing `sections`/`replaceSection`/`appendSection` API is preserved.
