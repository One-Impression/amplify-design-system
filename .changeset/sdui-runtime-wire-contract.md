---
"@one-impression/sdui-runtime": minor
---

fix(sdui-runtime): read flat label, resolve bff_call via EndpointPaths, lock sdk peer-dep

Align the runtime with the `@one-impression/sdk-native-sdui` wire contract (the source of truth), fixing two on-device home-page crashes and closing the version gap that let the drift go uncaught:

- **Flat label reads (crash fix):** the `label` (and `subtitle`) fields are declared as a flat `TextSchema` (`{ text, ... }`), but the `Tab`, `Tag`, `Chip`, `Checkbox`, `Radio`, `SelectableItem`, and `Input` ui_component renderers read them as nested nodes (`v.label.data.text`), throwing "Cannot read property 'text' of undefined". They now read `v.label.text` / `v.subtitle.text`.
- **bff_call endpoint resolution (404 fix):** `bff_call` previously treated the logical endpoint id (e.g. `creator.home.tab`) as a literal path, requesting `/creator.home.tab`. It now resolves the id through `EndpointPaths` (id → `/v1/...`), substitutes path params into the resolved path, trims a trailing slash off the base URL to avoid a double slash, and throws if an id is unregistered.
- **Peer-dep tightened:** `@one-impression/sdk-native-sdui` peerDependency raised from `>=1.0.0` to `^2.6.0` (the contract version that ships `EndpointPaths`), so this whole class of schema/renderer drift surfaces at install time instead of on the simulator. Added as a devDependency at `^2.6.0` so the `EndpointPaths` import resolves at build/test time.
- **Anti-regression test:** added an emit→render contract test that round-trips the home node set against their `sdk-native-sdui` schemas and asserts `tab`/`chip`/`tag`/`info_breakdown_row` built nodes expose a flat `data.label.text` (not `data.label.data`).

Bump level is `minor`: the renderer and resolver changes are behavior fixes, and the peer-dependency range change is the notable surface (per this repo's feat=minor convention; consumers already on a 2.x sdk are unaffected).
