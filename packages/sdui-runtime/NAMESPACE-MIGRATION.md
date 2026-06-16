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

No schema-level union/helper is needed — `NodeSchema.type` is a generic
`z.string()`, so node validation accepts **any** prefix. Backward-compatibility
comes from three places, not a union:

1. **SDK** — rename schema discriminants + builders `creator.* → sdui.*` (plain
   single literals; keeps `MediaSchema`/`cond` discriminated-unions intact).
2. **Runtime registry** — keep the `creator.*` keys AND add `sdui.*` aliases, so
   old payloads still resolve a renderer. (The resolver already dispatches on the
   `.snippet.`/`.ui_component.` segment, so only the map keys change.)
3. **Generic `NodeSchema`** — accepts both at the validation boundary.

A union discriminator was the original idea but is both unnecessary (the type
field isn't enforced per-node) and unsafe (it would break the discriminated
unions that key on a *different* `type` field).

## Steps

**Step 1 — runtime registry alias (one PR, patch). Ships FIRST.** Add `sdui.*`
keys alongside `creator.*` in the registry maps (alias to the same renderers).
Dispatch is unchanged. This must publish + be adopted **before** any producer
emits `sdui.*`, so the runtime can render the new prefix the moment it appears.

**Step 2 — SDK rename + emit-new (one PR, minor). Ships SECOND.** Rename each
schema discriminant and builder `creator.* → sdui.*` (plain literals). Tests
assert builders emit `sdui.*`. Publish. Old `creator.*` payloads still validate
(generic `NodeSchema`).

**Step 3 — flip emitters (per surface, mechanical).** Switch fixtures / BFFs
`creator.* → sdui.*`. Both prefixes are accepted, so there is no coordination
deadline — each emitter flips when ready.

**Step 4 — cleanup (the only breaking step, deferred).** Once telemetry shows no
`creator.*` traffic, drop the `creator.` half of each union (helper change, ~1
line each) and the alias registry keys.

### Order

**Runtime alias (1) → SDK rename (2) → emitters (3) → cleanup (4).** Runtime
goes first so it can render `sdui.*` before any producer emits it. Steps 1–3 are
non-breaking and can ship immediately; Step 4 waits for zero `creator.*` traffic.

The bulk (Steps 1–2) is mechanical — applied with a codemod over the schema /
builder / registry files (no helper needed).
