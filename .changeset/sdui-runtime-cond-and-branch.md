---
"@one-impression/sdui-runtime": minor
---

Add runtime handlers for the new SDUI primitives shipped in
`@one-impression/sdk-native-sdui` v2.1.0.

- `cond:local` evaluator — predicate primitive over the local Zustand store.
  Supports `eq`, `ne`, `gt`, `lt`, `gte`, `lte`, `exists`, `not_exists`. Plugs
  into any guard slot via a typed `Cond` union; unknown discriminator values
  fail closed so the runtime can ship ahead of new primitives.
- `action:branch` — top-level conditional dispatcher. Evaluates a `Cond` guard,
  dispatches `then` on truthy or `else` on falsy. Falsy with no `else` is a
  no-op.
- `action:compound` — accepts the flat `{ mode, actions, wait }` payload
  shape in addition to the legacy AST. `mode: parallel` + `wait: first` races
  for resolution with remaining children becoming fire-and-forget. Partial
  failures in `parallel` + `wait: all` no longer abort siblings; an aggregate
  error surfaces only when every child rejects.
- `action:set_local` — `value` accepts ref-object form
  (`{ ref: "$.now" | "$.now_minus_seconds" | "$.response.<path>" | "$.payload.<path>" }`)
  in addition to literals. Unresolved refs resolve to `null` rather than
  throw, matching the open-enum rule for forward-compatible ref forms.
- 45 unit tests covering happy paths, edge cases, unresolved refs, race
  semantics, and nested branch-in-compound / compound-in-branch.
