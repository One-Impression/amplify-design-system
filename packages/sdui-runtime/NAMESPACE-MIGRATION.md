# Namespace migration — `creator.*` → `sdui.*` (complete)

The SDUI node vocabulary is presentation, not domain, so snippet / ui-component
types are namespaced `sdui.*` (not `creator.*`) — the design system is
app-neutral, usable by any app rather than just the creator app. **This migration
is complete: `creator.*` is fully removed across the SDK, runtime, and
fixtures.** This doc is the record.

## End state

- **SDK (`sdk-native-sdui`)** — every schema discriminant and builder emits
  `sdui.snippet.*` / `sdui.ui_component.*`. No `creator.*` remains.
- **Runtime (`sdui-runtime`)** — the renderer registries are keyed `sdui.*` only.
  The resolver dispatches on the layer segment (`.snippet.` / `.ui_component.`),
  unchanged.
- **Fixtures / playground** — all emit `sdui.*`.

Pages were never affected — the `layout` field (`feed`/`standard`/…) is not
prefixed.

## How it shipped (staged, runtime-first)

The migration ran dual-accept so nothing broke mid-rollout, then dropped the old
prefix once no producer emitted it:

1. **Runtime registry alias** — added `sdui.*` keys alongside `creator.*` so the
   runtime could render the new prefix before any producer emitted it. Shipped
   first.
2. **SDK rename** — renamed discriminants + builders `creator.* → sdui.*` (plain
   single literals; no union helper — `NodeSchema.type` is a generic `z.string()`,
   so prefix is never enforced per-node, and a union would have broken the
   `MediaSchema` / `cond` discriminated unions that key on a *different* `type`).
3. **Flip emitters** — fixtures moved to `sdui.*`.
4. **Cleanup (this change)** — dropped every `creator.*` key/literal: registries
   simplified to plain `sdui.*` maps, renderer internals + fixtures swept. Done
   now, while there is **no live app** consuming the design system, so the break
   has zero blast radius — and before a live app pins anything to `creator.*`.

## If `creator.*` ever needs to be re-accepted

It won't for current apps, but for reference: the runtime resolver is already
segment-based, so re-accepting a legacy prefix is purely additive — alias the old
keys back into the registries. The SDK's generic `NodeSchema` accepts any `type`
string regardless of prefix.
