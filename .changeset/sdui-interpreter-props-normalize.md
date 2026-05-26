---
"@one-impression/sdui-runtime": patch
---

`Interpreter` now normalises legacy `props`-shaped wire payloads to the canonical `data` field before resolving the renderer. When a node arrives with `props` but no `data`, the props are copied into `data` and a `sdui.interpreter.props_normalized` telemetry event is emitted so stale BFF emits are easy to spot in dev. Nodes that already have `data` are passed through untouched — the helper never overwrites the canonical field. Defensive migration aid: matches the `data` contract from `@one-impression/sdui-primitives@1.0.0` while old handler emits are still being migrated.
