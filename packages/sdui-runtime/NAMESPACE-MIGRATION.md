# Namespace migration — `creator.*` → `sdui.*`

The SDUI node vocabulary is presentation, not domain — snippet/ui-component
types should be namespaced `sdui.*`, not `creator.*`. This makes the design
system app-neutral (any app, not just the creator app, can emit and render the
core types). This doc is the migration plan.

## Current state

- Node types are written as hand-coded string literals, **one per schema file**
  (`z.literal("creator.snippet.x")`) and one per builder (`type: "creator..."`).
  There is no shared prefix constant — the prefix is duplicated ~63× in the SDK.
- **`composite` is already on `sdui.*`** (`sdui.snippet.composite`) — a partial
  migration that proves the target and that both prefixes coexist in practice.
- The runtime resolver (`registries/node-registry.ts`) dispatches on the **layer
  segment** (`.snippet.` / `.ui_component.`), **not** the `creator.` prefix — so
  `sdui.*` and `creator.*` route through the same lane with no dispatch change.
  Only the registry **lookup maps** are keyed by the full literal.

### Inventory (surfaces that carry the prefix)

| Repo | Surface | Count |
|------|---------|-------|
| amplify-schemas | `z.literal("creator.…")` schema discriminants | ~63 files |
| amplify-schemas | builders emitting `type: "creator.…"` | ~63 |
| amplify-design-system | runtime registry map keys (`snippets.ts` + `ui-components.ts`) | ~62 |
| amplify-design-system | playground fixture / BFF emitters | ~235 literals |

Pages are unaffected — the `layout` field (`feed`/`standard`/…) is not prefixed.

## Strategy — dual-accept, non-breaking until the last step

The running app and deployed BFFs emit `creator.*` today, so a hard rename would
break them. The migration accepts **both** prefixes during the transition and
only drops `creator.*` once nothing emits it.

A small helper centralizes the dual-accept so the final flip is one-line:

```ts
// schemas/nodeType.ts
export const snippetType = (name: string) =>
  z.union([z.literal(`creator.snippet.${name}`), z.literal(`sdui.snippet.${name}`)]);
export const uiComponentType = (name: string) =>
  z.union([z.literal(`creator.ui_component.${name}`), z.literal(`sdui.ui_component.${name}`)]);
```

Builders keep an explicit `sdui.*` string literal (preserves literal-type
inference on the node's `type`).

## Steps

**Step 0 — helper (SDK).** Add `schemas/nodeType.ts` with `snippetType` /
`uiComponentType` dual-accept helpers.

**Step 1 — SDK dual-accept + emit-new (one PR, minor, non-breaking).**
Replace each schema's `z.literal("creator.X")` with `snippetType("X")` /
`uiComponentType("X")`; switch each builder to emit `sdui.X`. Tests assert both
prefixes parse and builders emit `sdui.*`. Publish. Old `creator.*` payloads
still validate.

**Step 2 — runtime registry alias (one PR, patch).** Add `sdui.*` keys alongside
`creator.*` in the registry maps (alias to the same renderers). Dispatch is
unchanged. Publish.

**Step 3 — flip emitters (per surface, mechanical).** Switch fixtures / BFFs
`creator.* → sdui.*`. Both prefixes are accepted, so there is no coordination
deadline — each emitter flips when ready.

**Step 4 — cleanup (the only breaking step, deferred).** Once telemetry shows no
`creator.*` traffic, drop the `creator.` half of each union (helper change, ~1
line each) and the alias registry keys.

### Order

SDK (0+1) → runtime (2) → emitters (3) → cleanup (4). Steps 0–3 are
non-breaking and can ship immediately; Step 4 waits for zero `creator.*` traffic.

The bulk (Steps 1–2) is mechanical — best applied with a codemod over the schema
/ builder / registry files plus the helper, not by hand.
