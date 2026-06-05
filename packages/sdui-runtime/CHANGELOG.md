# @one-impression/sdui-runtime

## 2.5.1

### Patch Changes

- [#214](https://github.com/One-Impression/amplify-design-system/pull/214) [`4e81f2a`](https://github.com/One-Impression/amplify-design-system/commit/4e81f2a59936d9cfa2d63f87321ec8a6d0d6e046) Thanks [@achin-oi](https://github.com/achin-oi)! - Add creator.auth.bootstrap to the endpoint registry — the bootstrap route predates the /v1/creator/\* path convention and is absent from the codegen'd catalog, so authenticated app entry could not resolve it

## 2.5.0

### Minor Changes

- [#210](https://github.com/One-Impression/amplify-design-system/pull/210) [`41d0254`](https://github.com/One-Impression/amplify-design-system/commit/41d0254e6f589a41c7cbbe0159bd5946f6df9a8b) Thanks [@achin-oi](https://github.com/achin-oi)! - Fix dead SDUI buttons, broken Button label rendering, missing root exports, and local-dev identity on document fetches
  - ButtonRenderer forwards `on_click` to the design-system Button's `onPress` — the inner Pressable was capturing every tap, so no SDUI button dispatched its action
  - ButtonRenderer renders `label` as the `TextSchema` value the Button schema declares, instead of routing it through the Interpreter (which requires a wire `type` and crashed every button render)
  - `useLocalStore` (+ its types) exported from the package root — consuming apps bridge `set_local` writes into app stores
  - Document-fetch client now sends `X-Dev-Identity` for localhost BFF URLs, mirroring the action engine, so local-dev identity applies to page loads and not only actions
  - `getEndpoint` falls back to the codegen'd `EndpointPaths` catalog from the contracts package — page-document endpoint ids no longer need hand-maintained registry entries

## 2.4.0

### Minor Changes

- [#191](https://github.com/One-Impression/amplify-design-system/pull/191) [`0a8b509`](https://github.com/One-Impression/amplify-design-system/commit/0a8b509a9c09031973f0ca1fcba7046a7d660103) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - feat(sdui-runtime): Card header/footer slot rendering, on_view one-shot, X-Active-Influencer-Id header injection

  Three additive changes to the runtime that unblock the Explore listing surface and close a long-standing correctness gap on view-impression dispatch.
  - **Card renderer — header / items / footer slots.** `CardSnippetSchema` (sdk-native-sdui ^2.8.0) now exposes `data.header?: Node`, `data.items?: Node[]`, and `data.footer?: Node` plus a sibling `config?: { footer_bg_color?: ColorToken }`. `CardRenderer` composes them in the legacy `CardSnippetType1` order (header → items → footer). When `config.footer_bg_color` is set, the footer slot is wrapped in a `Box` with the resolved background color so the footer can carry its own banner stripe inside an otherwise-neutral card body. `on_click` and `on_view` on the card node itself continue to flow through `SduiNode`'s Clickable + Viewable wrappers; header/footer Nodes carry their own actions and dispatch independently via `Interpreter`.
  - **`SduiNode.on_view` — one-shot per instance.** `handleViewed` previously dispatched `props.on_view` every time `Viewable` fired its callback, which meant scroll-back-up over a feed item would re-emit the impression — duplicate analytics, duplicate side effects, duplicate server-side spend. The wire contract treats `on_view` as a single-impression signal. Added a per-instance `firedRef` that flips to `true` before the first dispatch and short-circuits subsequent calls. New Node instances (e.g. items appended via `append_items` pagination) get their own ref and fire their own `on_view` once when scrolled into view. The set-before-dispatch ordering matters and is covered by a regression test.
  - **`bff_call` — X-Active-Influencer-Id header.** A creator may have multiple linked social influencer profiles; the active selection scopes every BFF read (catalog, earnings, feed). Added a new `useActiveSocialStore` zustand store (`activeInfluencerId: string | null`, `setActiveInfluencerId(...)`) exported from the package's public surface. `bff_call` always injects the `X-Active-Influencer-Id` header when the store has a value — applied to every environment, not localhost-gated (unlike `X-Dev-Identity`). When the store is `null`, the header is omitted and the server falls back to its default scoping for the authenticated creator.

  Backwards-compatible: the new Card slots, the one-shot guard, and the new header are all additive. Existing pages that don't use header/footer slots or don't set `activeInfluencerId` see no behavioural change.

## 2.3.1

### Patch Changes

- [#189](https://github.com/One-Impression/amplify-design-system/pull/189) [`34089db`](https://github.com/One-Impression/amplify-design-system/commit/34089db8a9c2e7d655e2be90dd55840bc4f71d6a) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - fix(sdui-runtime): home BC renderer fixes — Tab icon + tap dispatch, InfoRow flat status_tag label, optimistic tab-bar active state

  Renderer-level bugs and a UX gap found by on-device E2E of the home BC against `sdk-native-sdui@^2.6.0`. Visible bugs are caught by `SduiErrorBoundary` so they render as fallback boxes rather than crash the screen.
  - **`TabRenderer` — icon crash.** The renderer wrapped `v.icon` in `<Interpreter node={v.icon} />`, but `icon` is a flat `IconSchema` (`{ name, size?, color? }`), not an SDUI node — so `Interpreter` called `resolveRenderer(undefined)` and crashed on `.startsWith()`. The footer's 3 tabs rendered as fallback boxes. Fix: render `<DSIcon name={v.icon.name} size={v.icon.size} color={v.icon.color} />`, matching the established pattern in `ChipRenderer`, `PageHeader`, `InfoIconRow`, and 6 other renderers that consume `IconSchema`.
  - **`TabRenderer` — tap swallowed.** `DSTab` is itself a `Pressable`. Passing `on_click` to `SduiNode` wrapped the tab in an outer `Clickable` Pressable, but in RN the deepest Pressable under the touch point wins — so the inner DSTab Pressable swallowed the tap and the outer handler never fired. (`DSTab.types.ts` already documents this expectation.) Fix: dispatch `on_click` locally via `useActionEngine` and pass the press handler directly as `DSTab.onPress`; intentionally do not forward `on_click` to `SduiNode` (so no outer Clickable wraps). `on_load` / `on_view` / `on_dismount` continue to flow through `SduiNode` unchanged.
  - **`InfoRow` — status_tag label flat-text bug.** The renderer passed the whole `v.status_tag.label` object to `DSTag.label`, but `status_tag.label` is a flat `TextSchema` (`{ text, color?, font_size?, font_weight? }`), not a string. React rendered it as a child and threw "Objects are not valid as a React child (found: object with keys {text})." Every `info_row` on the home Explore feed rendered as a fallback box (no title/subtitle/status tag). Fix: `label={v.status_tag.label.text}`, same pattern title/subtitle/badge already use in this renderer.
  - **Tab-bar optimistic active state.** "Which tab is highlighted" is intrinsically a client-UI concern: the user just touched the button, the indicator should follow the finger — not wait for the BFF round-trip that loads the new tab's content. Previously the active indicator was driven only by `data.active_index` from the server, which meant every tab switch had a perceptible lag (the highlight only moved once the new tab's `replace_section` response arrived). Fix: added a generic `TabBarActiveContext` (exported from `state/`) that a parent tab-bar renderer provides and child Tabs consume. `TabsFooterRenderer` now owns a `useState<string | null>` for the optimistic active tab id and provides it; `TabRenderer` updates it on press _before_ dispatching `on_click`. The effective active index is `local override ?? data.active_index` — the server still seeds selection at mount and can drive it via re-renders, but the local override wins until the next tap. Zero wire cost, zero gateway changes, no remount of the footer. Reusable for future tab bars (top tabs, segmented controls, etc.) since the context is generic.

  Verified on iPhone 15 Pro simulator: footer tabs render with correct labels, tapping a tab flips the active indicator **instantly** (no round-trip wait) while the BFF's `on_click` fires asynchronously and the gateway's `replace_section` action swaps the page sections, and campaign cards render full title / subtitle / status tag.

## 2.3.0

### Minor Changes

- [#185](https://github.com/One-Impression/amplify-design-system/pull/185) [`600c0d8`](https://github.com/One-Impression/amplify-design-system/commit/600c0d8391465a524cce3205153a938bd273a76c) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - fix(sdui-runtime): read flat label, resolve bff_call via EndpointPaths, lock sdk peer-dep

  Align the runtime with the `@one-impression/sdk-native-sdui` wire contract (the source of truth), fixing two on-device home-page crashes and closing the version gap that let the drift go uncaught:
  - **Flat label reads (crash fix):** the `label` (and `subtitle`) fields are declared as a flat `TextSchema` (`{ text, ... }`), but the `Tab`, `Tag`, `Chip`, `Checkbox`, `Radio`, `SelectableItem`, and `Input` ui_component renderers read them as nested nodes (`v.label.data.text`), throwing "Cannot read property 'text' of undefined". They now read `v.label.text` / `v.subtitle.text`.
  - **bff_call endpoint resolution (404 fix):** `bff_call` previously treated the logical endpoint id (e.g. `creator.home.tab`) as a literal path, requesting `/creator.home.tab`. It now resolves the id through `EndpointPaths` (id → `/v1/...`), substitutes path params into the resolved path, trims a trailing slash off the base URL to avoid a double slash, and throws if an id is unregistered.
  - **Peer-dep tightened:** `@one-impression/sdk-native-sdui` peerDependency raised from `>=1.0.0` to `^2.6.0` (the contract version that ships `EndpointPaths`), so this whole class of schema/renderer drift surfaces at install time instead of on the simulator. Added as a devDependency at `^2.6.0` so the `EndpointPaths` import resolves at build/test time.
  - **Anti-regression test:** added an emit→render contract test that round-trips the home node set against their `sdk-native-sdui` schemas and asserts `tab`/`chip`/`tag`/`info_breakdown_row` built nodes expose a flat `data.label.text` (not `data.label.data`).

  Bump level is `minor`: the renderer and resolver changes are behavior fixes, and the peer-dependency range change is the notable surface (per this repo's feat=minor convention; consumers already on a 2.x sdk are unaffected).

## 2.2.1

### Patch Changes

- [#177](https://github.com/One-Impression/amplify-design-system/pull/177) [`d5c6678`](https://github.com/One-Impression/amplify-design-system/commit/d5c6678c5cdb6836bf02026a5f5147046d023e0a) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - PageFeed renderer now reads `data.config` (gradient / bg_color / scroll_header_color) and `data.footer` to match the legacy PageType3 visual hierarchy:
  - `config.gradient` — absolute-positioned gradient backdrop. Uses `react-native-linear-gradient` when the host app installs it (optional peer); falls back to a solid first-color View otherwise so the runtime still works without the native dep.
  - `config.bg_color.type` — solid token-name background when no gradient is provided.
  - `config.scroll_header_color.type` — header tint applied to the filters bar once the user has scrolled (binary toggle; legacy uses an interpolated animation).
  - `data.footer` — a single SDUI Node rendered pinned at the bottom of the page, OUTSIDE the FlatList, so it does not scroll with the body. Designed for `creator.snippet.tabs_footer` on the home page.

  Existing `filters`, `loader`, `empty_state`, and `on_load_more` behavior is unchanged.

  Also exports a new `Gradient` component (`@one-impression/sdui-runtime`) for renderers that want to reuse the same gradient backdrop primitive.

  The matching `config` / `footer` schema fields are added on the upstream `@one-impression/sdk-native-sdui` PageFeed schema; until that package republishes, the renderer reads them through an `extractFeedPageData` helper that casts `page.data` to the augmented shape.

- [#178](https://github.com/One-Impression/amplify-design-system/pull/178) [`c92de1f`](https://github.com/One-Impression/amplify-design-system/commit/c92de1f1918c64a43df9614db9d0eb7a94c499a8) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - `TabsFooter` renderer is now legacy-faithful and supports active-index styling:
  - Renders each tab Node in an equal-width slot (`flex: 1` per tab), matching legacy `TabsFooterSnippetType1.styles.ts`.
  - Adds the top border + soft top-edge shadow from the legacy snippet so the footer reads as a pinned bottom navigation.
  - Reads `data.active_index` and overrides each tab Node's `data.active` flag accordingly — the inner `Tab` renderer (`creator.ui_component.tab`) already paints the active state via `data.active`, so the active tab gets the primary-color tint automatically.
  - `on_click` is dispatched per-tab via the existing Tab → `SduiNode` → `Clickable` chain — no extra wrapping layer here. Producers can therefore keep all per-tab navigation/state mutations on the Tab Node itself.
  - Active-index override is non-mutating: tabs without `active_index` keep their producer-supplied `data.active`.

  Designed to live inside the new `PageFeed` `data.footer` slot for the home page bottom-tabs use case.

## 2.2.0

### Minor Changes

- [#165](https://github.com/One-Impression/amplify-design-system/pull/165) [`8477de3`](https://github.com/One-Impression/amplify-design-system/commit/8477de3245435edeb38de0f47fa52c883d4227fa) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - The `bff_call` action handler now injects an `X-Dev-Identity` request header when the BFF base URL targets `localhost` or `127.0.0.1`. The header value is sourced from a new `useDevConfigStore` (exposes `setDevIdentity(value: string | null)`); when unset the header is silently skipped, and the URL gate ensures production traffic is never augmented even if the value is accidentally populated. Replaces the manual creator-app patch that injected the header from outside the runtime.

### Patch Changes

- [#167](https://github.com/One-Impression/amplify-design-system/pull/167) [`9552f2e`](https://github.com/One-Impression/amplify-design-system/commit/9552f2ef65309f2e10422e00f10c040bc2fc5f1a) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - `PageFeedRenderer` now subscribes to `usePageStore` for its `items` data so `replaceNode` and `appendItems` (added in [#149](https://github.com/One-Impression/amplify-design-system/issues/149)) take effect end-to-end. On mount the renderer syncs the server-provided page tree into the store via `setPageTree(page)`; the FlatList then reads `items` reactively with a `useShallow` selector scoped by `page.id`, falling back to the prop value when the store hasn't been populated yet or holds a different page. Without this, infinite-scroll `append_items` and section reload were updating the store but never re-rendering the feed.

- [#166](https://github.com/One-Impression/amplify-design-system/pull/166) [`2cc554a`](https://github.com/One-Impression/amplify-design-system/commit/2cc554aa42e8ced90acb987b3360e1b1594c0283) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - `resolveRenderer` now returns `null` (not `undefined`, never throws) when a node type isn't registered, so one bad node degrades gracefully instead of taking down the page. The first occurrence of each unknown type emits `sdui.renderer.unknown_type` through the telemetry sink wired by `SduiRuntimeProvider`; subsequent occurrences are silenced via an internal `Set` to avoid flooding telemetry. Sibling pattern to `SduiNode`'s defensive `ZodError` handling.

- [#168](https://github.com/One-Impression/amplify-design-system/pull/168) [`1b14c96`](https://github.com/One-Impression/amplify-design-system/commit/1b14c965574291a85b13620b2d659e1f965088ca) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - `StepsRenderer` no longer hardcodes `#6531FF` / `#E0E0E0` for the active and inactive step bars. It now passes the semantic tokens `"primary"` and `"neutralWeak"` (from `@one-impression/tokens-creator`) to the `Box` `bg` prop, so the step indicator respects theme switching and brand cascades instead of bypassing the token system.

- Updated dependencies [[`4e62f87`](https://github.com/One-Impression/amplify-design-system/commit/4e62f877281043d7ec00ea360450fde2cd454d8c)]:
  - @one-impression/ui-native@2.0.2

## 2.1.0

### Minor Changes

- [#146](https://github.com/One-Impression/amplify-design-system/pull/146) [`a5cdf99`](https://github.com/One-Impression/amplify-design-system/commit/a5cdf993ace287a0b58c83dd2425a9f326e5630a) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - Rewires the bottom-sheet runtime to match gorhom's imperative `BottomSheetModal` API. `useBottomSheetStore` is reorganised around `registry` / `openSheets` / `openOrder` / `contexts` with `register`, `unregister`, `open`, `close`, `closeAll` actions; reopening an already-open sheet promotes it to topmost. `BottomSheetHost` renders one `BottomSheetHostSheet` per registered sheet, each owning its own ref and calling `present()` / `dismiss()` via a `useEffect` keyed on the open flag. Page renderers (`PageStandard`, `PageFeed`, `PageStickyFooter`) and the `BottomSheet` snippet renderer pre-register on mount and unregister on unmount, so navigating away no longer leaks orphan entries. `useBottomSheetData` reads through `useShallow` for an atomic snapshot under React 18 concurrent rendering. The `sheet` action handler now calls `open(sheet_id)` (registry lookup) instead of stamping a sheet inline.

- [#150](https://github.com/One-Impression/amplify-design-system/pull/150) [`00df31b`](https://github.com/One-Impression/amplify-design-system/commit/00df31b3599747f205290efbda8beec4366981f7) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - Wires `Form` and `Input` together through a `FormContext` so submit-time `bff_call` actions see the latest input values. `Input` reads `data.field_name` and propagates each keystroke to `FormContext.setValue(field_name, value)`; `Form` wraps its submit button in `FormSubmitWrapper`, which intercepts the `bff_call` action and merges the ref-backed values snapshot into `payload.request_body` at click time. The merge logic + state factory are extracted into a framework-free `form-values.ts` so the contract is unit-testable without React Native. Mount-time seeding of FormContext captures refs to keep the empty-deps useEffect lint-clean. Without this, OTP entry and every form submit fired with empty bodies.

- [#149](https://github.com/One-Impression/amplify-design-system/pull/149) [`0d3595f`](https://github.com/One-Impression/amplify-design-system/commit/0d3595f48bc9891a200866d8aa9d84bc5a01dd9f) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - Adds `replaceNode(targetId, node)` and `appendItems(targetId, items)` methods to `usePageStore`, plus a new `page: Page | null` field with `setPageTree()`. Closes the gap where `reload_section`, `replace_section`, and `append_items` action handlers called methods that didn't exist on the store — every dispatch was silently crashing. Tree walks are immutable so unmodified siblings preserve their references for React's shallow-equality bail-out. Existing `sections`/`replaceSection`/`appendSection` API is preserved.

### Patch Changes

- [#145](https://github.com/One-Impression/amplify-design-system/pull/145) [`46b1e2f`](https://github.com/One-Impression/amplify-design-system/commit/46b1e2f7c1c695c73cd33184aad08c40b84f7fc2) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - The `bff_call` action handler now parses the response JSON body and dispatches `body.action` (if present) before any declared `on_success` chain. Re-enables server-driven action chaining the runtime had previously discarded — required for `append_items` on infinite scroll, post-submit navigation, and any BFF response that carries its own follow-up action. Defensive `.catch(() => null)` on the body parse tolerates non-JSON / empty responses.

- [#151](https://github.com/One-Impression/amplify-design-system/pull/151) [`c7c979f`](https://github.com/One-Impression/amplify-design-system/commit/c7c979f4469dc8ca6542584c24f2f7c4498676ea) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - `SduiNode` now parses node data defensively: a `ZodError` from the schema validation renders a `SduiFallback` element (dev mode shows node type + id, prod is blank) and surfaces the failure through the telemetry hook, rather than crashing the entire page. Non-Zod errors continue to propagate. Migration-period resilience — bad or stale handler emit no longer takes down the whole tree.

- [#147](https://github.com/One-Impression/amplify-design-system/pull/147) [`b66dddb`](https://github.com/One-Impression/amplify-design-system/commit/b66dddbd1cd8e31e386055a3099d2c0f3debf987) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - Fixes `renderMedia` to read `MediaSchema` as a nested discriminated union (`media.image.src`, `media.icon.name`, `media.image_stack`, `media.progress`) instead of treating it as a flat object. The previous flat read produced `undefined` for every valid wire payload — icons rendered blank and cover images were missing on aerobar, cards, info-rows. Pure logic is extracted into a framework-free `describeMedia` helper so the mapping is unit-testable without React Native.

- Updated dependencies [[`9fa7a74`](https://github.com/One-Impression/amplify-design-system/commit/9fa7a74fc0a1bd2aa556fc27a280b70997159f7a)]:
  - @one-impression/ui-native@2.0.1

## 2.0.0

### Major Changes

- [#138](https://github.com/One-Impression/amplify-design-system/pull/138) [`2d0dfde`](https://github.com/One-Impression/amplify-design-system/commit/2d0dfde77dd29f5e66d2da4228a4c168a2cf0e9d) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - Migrate from `@amplify-ai/*` (npmjs.org, owner-locked) to `@one-impression/*` (GitHub Packages, org-owned).

  **Why:** The previous publish pipeline was bottlenecked on a single npm account, causing silent publish failures since 2026-05-22 (commits landed on `main` but never reached the registry). Moving to GitHub Packages under the `@one-impression` scope removes the single-owner dependency — every merge to `main` now publishes via the auto-injected `GITHUB_TOKEN`, with no human in the loop.

  **What changes for consumers:** Package scope changed from `@amplify-ai/*` to `@one-impression/*`. Install requires a GitHub PAT with `read:packages` scope (same auth model as the existing `@one-impression/sdk-*` packages from `amplify-schemas`). Update imports and `package.json` dependencies accordingly.

  **Versioning:** Major bump on every package because the scope change is a breaking name change — old `@amplify-ai/*` imports will not resolve after consumers update.

  **Pipeline:** Publishes now run via `changesets` (see `.changeset/` and `.github/workflows/publish.yml`) — every PR that ships a code change must include a `changeset` file declaring `patch`/`minor`/`major`. Merge to `main` opens a Version PR; merging that publishes.

- [#112](https://github.com/One-Impression/amplify-design-system/pull/112) [`a79afd9`](https://github.com/One-Impression/amplify-design-system/commit/a79afd94f6b272e33124f20d30c53a8c9e30adc4) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - feat(sdui-runtime): add @one-impression/sdui-runtime@1.0.0 — SDUI runtime foundation

  New package providing the foundation layer for the SDUI runtime in amplify-creator-app:
  - SduiNode base wrapper (Zod validation, error boundary, click/view/load/dismount lifecycle, telemetry)
  - Interpreter dispatcher (type-based renderer lookup with forward-compat fallback)
  - PageRoot page container dispatcher
  - Clickable and Viewable HOCs
  - Action engine (pluggable verb handlers, capability dispatch)
  - Bottom-sheet manager (Zustand-driven, stack depth=2, sheet-aware context for gorhom v5+ scrollable/input swaps)
  - 7 hooks ported from legacy (useAppStateSession, useBottomSheetData, useBottomSheetFormSync, useFormSubmissionLoading, useHydrateParams, useKeyboardStatus, usePageRefresh)
  - 6 skeleton loaders + ContainerLoader + 3-tier resolution (action hint → endpoint hint → default)
  - Registry shells for ui-components, snippets, pages, actions, capabilities (populated by tasks 023-026)
  - SduiRuntimeProvider root provider

### Minor Changes

- [#114](https://github.com/One-Impression/amplify-design-system/pull/114) [`643c3c1`](https://github.com/One-Impression/amplify-design-system/commit/643c3c10e4ad57984afd1da81e9dbc0e4480665e) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - Add SDUI action handlers and capability handlers (Task 23, Brief [#264](https://github.com/One-Impression/amplify-design-system/issues/264))
  - 13 action verb handlers: navigate, bff_call, sheet, dismiss, toast,
    reload_section, replace_section, append_items, set_local, emit_telemetry,
    compound, capability dispatcher, deeplink
  - 13 capability handlers: files, camera, notifications, linking-open,
    linking-open-oauth, deep-link, share, clipboard, haptics, auth, phone,
    ui-tooltip, app-refresh
  - Enhanced action engine with compound AST interpreter (sequence, parallel,
    branch, catch, delay), async chain support (on_success/on_error), and
    capability:\* prefix routing
  - Populated action and capability registries

- [#113](https://github.com/One-Impression/amplify-design-system/pull/113) [`085ab77`](https://github.com/One-Impression/amplify-design-system/commit/085ab77b870aaebeda3e2e3fa3d06c779eea1280) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - Add BFF client, Zustand state stores, icon store, and theme bridge to sdui-runtime.
  - BFF client with auth/retry/error/on-load-action interceptors and TanStack Query hooks
  - 8 Zustand stores: page, bottom-sheet-data, bottom-sheet-form, navigation-stack, search-params, aerobar, file-upload, auth
  - Icon store with MMKV persistence, essentials fallback, and foreground re-fetch policy
  - Theme bridge mapping @one-impression/tokens-creator sdui.\* tokens to RN-resolvable values

- [#117](https://github.com/One-Impression/amplify-design-system/pull/117) [`981937c`](https://github.com/One-Impression/amplify-design-system/commit/981937c60c53da4ab9941e9fbcd0ec9b1bc0b00b) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - feat(sdui-runtime): add 5 page layout container renderers

  Adds PageStandard, PageStickyFooter, PageFeed, WebViewPage, and
  WebViewPageWithAction page container renderers under src/pages/.
  Populates the pageContainerRegistry so PageRoot can dispatch to the
  correct layout based on the BFF page envelope's layout field.
  - PageStandard: scrollable page with pull-to-refresh and back-press handling
  - PageStickyFooter: keyboard-aware layout with pinned footer for forms/checkout
  - PageFeed: FlatList-based infinite-scroll feed with filter chips, load-more, empty state
  - WebViewPage: full-screen WebView shell with optional title header
  - WebViewPageWithAction: WebView with URL-pattern interception for payment/OAuth flows

- [#134](https://github.com/One-Impression/amplify-design-system/pull/134) [`66d2325`](https://github.com/One-Impression/amplify-design-system/commit/66d23254b99b36c57c9fc2cbc3897d5dab52e385) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - Add runtime handlers for the new SDUI primitives shipped in
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

- [#136](https://github.com/One-Impression/amplify-design-system/pull/136) [`904d980`](https://github.com/One-Impression/amplify-design-system/commit/904d980fe4eec6c2314dddad1f1c9d09c47d7ea3) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - Emit standalone bundles at `/bff`, `/icon-store`, and `/action-engine`
  subpath exports.

  Previously consumers had to deep-import `dist/bff/index.js` to avoid
  pulling the full runtime into every chunk. The package now advertises
  three first-class subpath exports, each backed by its own tsup entry,
  so `import { ... } from "@one-impression/sdui-runtime/bff"` (etc.) works
  without falling through to the root bundle.

  Also marks `react-native-svg` and `react-native-mmkv` as externals so
  the `icon-store` subbundle leaves them to the consumer to provide.

- [#116](https://github.com/One-Impression/amplify-design-system/pull/116) [`e2b5cb1`](https://github.com/One-Impression/amplify-design-system/commit/e2b5cb15bf924aa670e8f6d3be778f36d3fd5491) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - feat(sdui-runtime): add 43 Tier 2 snippet renderers for Creator App SDUI

  Populates the snippet registry with renderers for all Creator BFF snippet types:
  - Layout / Utility (12): GroupConfig, GroupSteps, GroupSnippets, GroupChips, Card,
    BannerImage, EmptySpace, Separator, Loader, Aerobar, EmptyState, Steps
  - Headers / Footers (11): PageHeader, PageHeaderImageStack, PageFooter,
    PageFooterWithCheckbox, PageFloaterHeader, BottomSheetHeader,
    BottomSheetHeaderWithSearch, BottomSheetFooter, SectionHeader, TabsFooter, Tabs
  - Card / Layout containers (4): BottomSheet (store-based), BottomSheetInputSection,
    BottomSheetInput, Form (with FormContext)
  - Image snippets (3): ImageCarousel, ImageStack, OverlappingImage
  - Info / List (6): InfoRow, InfoProgressRow, InfoIconRow, InfoMediaRow,
    InfoBreakdownRow, List
  - Input / Selection (6): Input, PhoneNumberInput, ToggleInput, SingleSelectInput,
    MultiSelectInput, UploadFile
  - Chip (1)

  Shared helper: renderMedia() for discriminated MediaSchema union rendering.
  All renderers follow the SduiNode + Interpreter pattern from Task 24.

- [#115](https://github.com/One-Impression/amplify-design-system/pull/115) [`1e0e90e`](https://github.com/One-Impression/amplify-design-system/commit/1e0e90eae22d1497ebacf57a7f93cf7d7c5777ac) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - feat(sdui-runtime): add 18 Tier 1 ui_component renderers

### Patch Changes

- Updated dependencies [[`2d0dfde`](https://github.com/One-Impression/amplify-design-system/commit/2d0dfde77dd29f5e66d2da4228a4c168a2cf0e9d), [`b339202`](https://github.com/One-Impression/amplify-design-system/commit/b33920277bcf8bcd23cca0ee3fad23a69b9ab1cb), [`06676e5`](https://github.com/One-Impression/amplify-design-system/commit/06676e508000aa9fa51c1f615e364e4c1331206b), [`82f1b5c`](https://github.com/One-Impression/amplify-design-system/commit/82f1b5cd55a275995e83858089bed047374574fa)]:
  - @one-impression/tokens-creator@3.0.0
  - @one-impression/ui-native@2.0.0
