---
"@one-impression/sdui-runtime": patch
---

Make the page store **per-navigation-instance** (keyed by `route.key`) instead of a single shared page. Previously every mounted screen wrote to one `page`/`pageId`, so pushing a detail page clobbered the feed behind it — returning to the feed showed a permanent skeleton (its content was overwritten and `on_load` never re-fired). Each screen now keeps its own entry, re-claims active focus on navigation back (so its actions and reload/replace/append target its own tree), and drops it on unmount. Two instances of the same page id (e.g. two campaign details on the stack) no longer collide.
