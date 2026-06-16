# SDUI Playground — plan & context

An on-device (Expo) app inside `amplify-design-system` for developing + polishing the
SDUI rendering layer (ui-native primitives, sdui-runtime renderers, snippet visuals)
in isolation — **without** the merge → publish → re-consume cycle, and **without**
touching the gateway or the creator app.

## Why this exists / key decisions

- **SDUI-driven by design.** The playground mounts the **real** `SduiRuntimeProvider`
  + `Interpreter` and is driven by **hardcoded SDUI JSON fixtures** (the same wire
  format the gateway emits). It does NOT mount renderers with bespoke props. This
  tests the exact app path (`JSON → Interpreter → node-registry → renderer →
  SduiNode schema-validation → ui-native + tokens`), and the fixtures double as the
  `reference-fixtures-production-wire-format-ground-truth` + regression set.
- **In-monorepo, not cross-repo link.** Built inside `amplify-design-system` so the
  workspace siblings (`sdui-runtime`, `ui-native`, `tokens-creator`) resolve to local
  source — avoiding the cross-repo `link:`/React-dedup pain. `sdk-native-sdui`
  (the schema/builder contract, in amplify-schemas) comes from the **registry**.
- **Expo (managed).** Chosen only for dev-ergonomics: prebuild handles the native deps
  (reanimated, gesture-handler, @gorhom/bottom-sheet, react-native-webview,
  react-native-svg). Mirrors the creator-app env. Local-only → **no EAS, no Expo
  free-plan limits** (EAS = cloud Build/Update/Submit, which we never use).
- **Fast Refresh** is a Metro/RN feature — present here regardless of Expo.

## Hard facts (verified)

- design-system: **npm workspaces** (`"workspaces": ["packages/*"]`); add `"apps/*"`.
- Pin to the creator-app for fidelity: **react-native 0.76.9, expo ~52.0.0, react 18.3.1**.
- `sdui-runtime` peer deps that the app MUST provide: react, react-native,
  `@one-impression/sdk-native-sdui ^2.8.0` (registry), `ui-native`, `tokens-creator`
  (workspace), **`@gorhom/bottom-sheet ^5` + `react-native-webview`** (native).
  `ui-native` Icon uses **react-native-svg** (native).
- `SduiRuntimeProvider` props: `bffConfig`, `authConfig`, `onNavigate`, `onToast`,
  `onDeeplink`, `children` — all stub-able for a fixture-driven playground.

## The #1 gotcha (will red-screen if missed)

**Single `react` / `react-native`.** Metro must resolve ONE copy (the app's), or
hooks/invalid-element red-screen. Handle in `metro.config.js` (`resolveRequest`
forcing the app's `node_modules` for `react`/`react-native`) + monorepo
`watchFolders` (repo root) + `nodeModulesPaths`.

## Dependency resolution in this monorepo (the setup saga — read before re-installing)

The design-system root hosts RN **libraries** (sdui-runtime, ui-native) that peer-dep
`react-native >=0.72.0`. npm 7+ auto-installs that peer at the *latest* match (0.85/0.86),
which hoists and overrides the app's Expo-52-pinned RN 0.76.9 → native build picks the
wrong RN source-set (e.g. expo-dev-launcher's `rn77` against RN 0.85 → Kotlin
`'create' overrides nothing`). Four mechanisms keep it pinned + reproducible:

1. **Root `overrides`** (in design-system `package.json`): force `react-native` 0.76.9,
   `react` 18.3.1 repo-wide. Within every lib's peer range, so safe.
2. **Root `.npmrc` `legacy-peer-deps=true`**: stop npm auto-installing the wide RN peer
   to bleeding-edge. The app's *direct* RN 0.76.9 wins. (Also lets `npx expo install`
   succeed — it would otherwise ERESOLVE on react 18 vs 19.)
3. **metro packages as app devDeps** (`metro*@0.81.5`): `@expo/cli` (SDK 52) does
   `require('metro/src/lib/TerminalReporter')` resolved from *root* node_modules. The
   RN-version churn left metro nested under `@react-native/community-cli-plugin` instead
   of hoisted → "Cannot find module metro/...". Declaring metro as a direct app devDep
   hoists it to root. Pin to the version RN 0.76's community-cli-plugin wants (0.81.5).
4. **Undeclared deps sdui-runtime imports but doesn't list** — provide them in the app:
   `react-native-mmkv@^2` (v2, not v3 — new-arch is OFF), `react-native-linear-gradient`,
   `zustand`, `zod`, and 7 `expo-*` (clipboard, document-picker, haptics, image-picker,
   notifications, secure-store, web-browser). Install expo-* via `npx expo install` so
   versions match SDK 52. **secure-store needs its config plugin in `app.json` + a
   re-prebuild.** All are native → each new one is a `prebuild` + `gradlew installDebug`.

**Before any rebuild, run the unresolved-import scan** (grep dist for bare specifiers,
check each resolves) so you add every missing native dep in ONE rebuild, not N.

## Build / run loop (verified commands)

```
# native rebuild (after adding any native dep): from apps/sdui-playground/
CI=1 npx expo prebuild --platform android --no-install   # only if config-plugin/dep added
(cd android && JAVA_HOME=/opt/homebrew/opt/openjdk@17 ./gradlew :app:installDebug)

# metro on :8082 (creator-app holds :8081). MUST restart --clear after dep changes.
adb reverse tcp:8082 tcp:8082 && adb reverse tcp:3001 tcp:3001
RCT_METRO_PORT=8082 npx expo start --dev-client --port 8082 --clear

# launch / reconnect (force-stop first or the intent just re-delivers to the open app)
adb shell am force-stop com.oneimpression.sduiplayground
adb shell am start -a android.intent.action.VIEW \
  -d "sduiplayground://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8082" \
  com.oneimpression.sduiplayground
```

Renderer dev-loop: the workspace packages export `dist`, so a naive setup wouldn't
Fast-Refresh renderer-source edits. **We alias `@one-impression/{sdui-runtime,ui-native}`
to their `src/index.ts` in `metro.config.js`** (`resolveRequest`) so Metro reads source
directly — edit a renderer → instant Fast Refresh, zero build step. The aliased src uses
ESM `.js` specifiers that map to `.ts/.tsx` siblings, so the same resolver strips `.js`
for imports originating inside those `src` dirs. (We do NOT use `tsup --watch` — esbuild
can't parse the Flow syntax in `react-native-linear-gradient`'s platform files, which
sdui-runtime now pulls in; Metro's babel handles it fine, hence the src-alias path.)

## Structure

```
apps/sdui-playground/
  package.json          expo 52 / RN 0.76.9 / react 18.3.1; workspace + registry + native deps
  app.json              dev-client; id com.oneimpression.sduiplayground
  metro.config.js       monorepo watchFolders + single react/react-native dedup
  babel.config.js       babel-preset-expo (+ reanimated/worklets plugin LAST)
  tsconfig.json
  index.js              registerRootComponent(App)
  App.tsx               providers → PlaygroundScreen
  src/
    providers.tsx       GestureHandlerRootView → QueryClientProvider → SduiRuntimeProvider(stub) → BottomSheetModalProvider
    PlaygroundScreen.tsx FixturePicker + Stage
    FixturePicker.tsx   list fixtures → select; state/variant switch
    Stage.tsx           renders selected fixture via Interpreter / page renderer
    fixtures/
      index.ts          registry: {name, kind:'node'|'page', json}
      snippets/*.json    Card, OverlappingImage[recommended/applied/closing], InfoRow, Chip…
      pages/explore-feed.json   captured from the running local gateway
```

## Phases

1. **Scaffold** — branch `feat/sdui-playground`; add `apps/*` to root workspaces;
   write config + skeleton; `npm install` (root) + `npx expo install` natives.
2. **Native build** — `npx expo prebuild` + `npx expo run:android` → dev-client on emulator.
3. **Shell** — providers + FixturePicker + Stage (real `SduiRuntimeProvider` + `Interpreter`).
4. **Fixtures** — author per-snippet node fixtures + capture explore-feed JSON from the gateway.
5. **Run + verify** — pick fixture → render; edit a renderer → Fast Refresh → see it.
6. **Polish** — drive the explore `Card`/`OverlappingImage` to the reference design, then the rest.

## Polish backlog (what we're working toward)

- Match the reference card (legacy `one_club_app`): hero cover + overlapping brand
  avatar + match-band badge + tags + reward row (green ₹ icon) + tinted strips, on an
  elevated rounded `Card`.
- **Tokenize the leaks** (currently raw in the gateway builder, but the intrinsic ones
  belong in the renderer): `border_radius 24` → `sdui.radius.*`; `marginVertical "6"`
  → `sdui.spacing.*`; cover/avatar dims → tokens; `["#F55DC1","#495AF4"]` gradient →
  `sdui.color.*`. Intrinsic look (radius/elevation/padding/type-scale) lives in the
  renderer (token-driven), not the wire.

## Current state (update as we go)

- [x] Branch `feat/sdui-playground` on latest `main`; `apps/sdui-playground/` dirs created.
- [x] Phase 1 — config + skeleton + install. Workspace symlinks (sdui-runtime/ui-native/tokens-creator) confirmed local; natives installed.
- [x] Phase 2 — native build. Resolved the RN-version trap (root `overrides` + `.npmrc legacy-peer-deps` → single RN 0.76.9 / react 18.3.1), hoisted metro 0.81.5, added the undeclared native deps (mmkv v2, linear-gradient, 7 expo-*). `gradlew installDebug` green; `com.oneimpression.sduiplayground` on emulator.
- [x] Phase 3 — shell. `providers.tsx` (GestureHandlerRootView → BottomSheetModalProvider → QueryClientProvider → SduiRuntimeProvider[stub bff/auth/telemetry/nav]) · `Stage` (real `Interpreter`) · `FixturePicker` · `PlaygroundScreen` (+ error boundary).
- [x] Phase 4 — fixtures. Captured real wire JSON from the local gateway: `campaign-card` (sdui.snippet.card) + 3 explore sections. Registry in `src/fixtures/index.ts`.
- [x] Phase 5 — RUNS + Fast Refresh verified. Card renders through the real SDUI path (telemetry confirms every child renderer fires). Edited the Separator renderer in `src` → red bar appeared via Fast Refresh, no rebuild/reload. metro-config `disableHierarchicalLookup` removed (broke RN's nested react-devtools-core); src-alias + `.js`-strip resolver added.
- [x] Catalog navigation — Home is now an SDUI page (`fixtures/pages/home.ts`) with 4 zones: **Pages** + **Bottom sheets** (separate `section_header`s) + **Most used snippets** (inline) + **All snippets** launcher. Launchers carry real `on_click` actions: `navigate` (pages) and `sheet` (bottom sheets). Wired through the real path — `on_click` → action-engine → runtime `onNavigate` → `useNavigationStore` (push/pop/replace) → `Router` mounts the target via `PageRoot`. Bottom sheets register on `page.bottom_sheets[]` and present via `<BottomSheetHost/>` (mounted in providers — the runtime doesn't mount it itself). All 3 flows verified on device.
  - Files: `sdui.ts` (node/page/action factories), `navigation/useNavigationStore.ts`, `Router.tsx`, `fixtures/registry.ts` (route table), `fixtures/pages/{home,demos,all-snippets}.ts`, `fixtures/snippets/samples.ts`. Old flat picker (FixturePicker/PlaygroundScreen/Stage/fixtures/index.ts) removed.
  - Page layouts demoed: standard, sticky_footer, feed (real captured explore), + campaign detail. `web_view` not yet demoed.
- [ ] All-snippets coverage — currently 5 of ~43 snippets have authored samples (`card, info_row, section_header, group_chips, separator`). Expand `samples.ts` to cover every `sdui.snippet.*` (read each `*.schema.js` for the data shape). Same for more bottom-sheet variants (bottom_sheet_header/footer/input) and the `web_view` page.
- [ ] Phase 6 — polish. Card/pages render plain (no hero image — fake-CDN 404s; info-rows oddly indented; no visual hierarchy). Drive `Card`/`OverlappingImage`/`InfoRow` renderers to the reference design; tokenize the leaks.
- [ ] **Form & submission system** — store-keyed-by-`form_id` + server-driven validation + decoupled submit (footer/sheet button submits the form). Full design + layering + phased task plan: **`packages/sdui-runtime/FORM-SYSTEM-DESIGN.md`**. `demo.form` is the e2e fixture (currently render-only). Sticky-footer-in-sheet support already shipped (the info sheet `footer` slot), which this builds on.
