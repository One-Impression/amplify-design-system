---
"@one-impression/sdui-runtime": patch
---

`reload` is now latest-wins per region. A new reload of a region takes ownership from any in-flight reload of that region, so rapid/chained tab switches render only the latest response instead of flickering through each one in arrival order (and the last to *arrive* no longer wins over the last clicked). Reloads targeting disjoint regions still run in parallel; an in-flight reload is aborted only when *all* its regions are superseded — partial overlap (e.g. a `["content"]` filter over an in-flight `["header","content"]` tab switch) lets the older reload still apply the regions it owns. Skeletons are held across the hand-off. Automatic — no wire/BFF change.
