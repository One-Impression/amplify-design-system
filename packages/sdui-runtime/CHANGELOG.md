# @one-impression/sdui-runtime

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
