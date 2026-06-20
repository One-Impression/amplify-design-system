---
"@one-impression/sdui-runtime": minor
---

Search-in-bottomsheet primitives (powers type-to-search pickers, e.g. location):

- **`Input.local_key`** — an input mirrors its current text into the local store under `local_key` on every change, so a (debounced) reload can read it via `{ ref: "$.local.<key>" }`. Standalone (form-unbound) inputs now also keep their own text, so a header search box is controllable.
- **`reload_section` resolves `$.local` refs** — its request body now runs through `resolveRequestRefs` against the local store (like `bff_call`), so the typed value rides into the search request.
- **Bottom-sheet content is reactive** — `SduiSheetScreen` registers its items in `usePageStore` (keyed by route, active instance) and renders the live tree, so `reload_section` / `replace_section` / `append_items` targeting a section INSIDE a sheet now update reactively (was local-state only).
