---
"@one-impression/sdui-runtime": minor
---

Fix dead SDUI buttons, broken Button label rendering, missing root exports, and local-dev identity on document fetches

- ButtonRenderer forwards `on_click` to the design-system Button's `onPress` — the inner Pressable was capturing every tap, so no SDUI button dispatched its action
- ButtonRenderer renders `label` as the `TextSchema` value the Button schema declares, instead of routing it through the Interpreter (which requires a wire `type` and crashed every button render)
- `useLocalStore` (+ its types) exported from the package root — consuming apps bridge `set_local` writes into app stores
- Document-fetch client now sends `X-Dev-Identity` for localhost BFF URLs, mirroring the action engine, so local-dev identity applies to page loads and not only actions
- `getEndpoint` falls back to the codegen'd `EndpointPaths` catalog from the contracts package — page-document endpoint ids no longer need hand-maintained registry entries
