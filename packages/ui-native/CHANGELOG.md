# @one-impression/ui-native

## 2.2.0

### Minor Changes

- [#222](https://github.com/One-Impression/amplify-design-system/pull/222) [`07f8ebe`](https://github.com/One-Impression/amplify-design-system/commit/07f8ebe7defca4f442cef00cd9601fe9ac38d8be) Thanks [@achin-oi](https://github.com/achin-oi)! - SDUI composite snippet, form system, header slot, and Tag theming.

  - **`sdui.snippet.composite`** — one composing snippet whose `data.layout`
    discriminant (`cover` / `stack` / `row`) names a slot-set + placement; slots
    hold arbitrary child Nodes. Owns arrangement (gutter, full-bleed media,
    edge-overlap float, header/footer strips), never contents. `resolveRenderer`
    now dispatches on the layer segment (`.snippet.` / `.ui_component.`) so legacy
    `creator.*` and domain-neutral `sdui.*` types both resolve.
  - **Header slot** — `page_header` as a wire slot (top safe-area inset +
    solid/gradient background + pressable back affordance) across page types and
    bottom sheets; the native nav header is hidden when a wire header is present.
  - **Form system** — `form_id`-keyed store, `useFormField`, validation evaluator,
    decoupled `submit` action; `component.field` token rhythm; composable
    `select_trigger` (replaces the bespoke phone-number input).
  - **Tag theming** — the Tag renderer now honors the wire `bg_color` /
    `text_color` / `gradient` / glyph `icon` fields (previously every tag rendered
    as the default white pill). Adds a `component.tag` token group so tags share
    the system radius + font scale, with the icon sized to the label.
  - **group_config** card no longer forces an `sm` shadow — it falls back to the
    Card default elevation like every other snippet card.

- [#229](https://github.com/One-Impression/amplify-design-system/pull/229) [`e2cdb64`](https://github.com/One-Impression/amplify-design-system/commit/e2cdb64d36c7e223559c0abc7848889976926e7b) Thanks [@achin-oi](https://github.com/achin-oi)! - SDUI region page model — the runtime for shell-first, region-scoped pages (tabbed / filtered feeds), on `@one-impression/sdk-native-sdui@^3.4.0`.

  **Runtime**

  - **`usePageScaffold`** — base page scaffold owning every cross-cutting concern (lifecycle `on_load`/`on_dismount`/back/app-state, live-page subscription, the `reload` partial-merge, per-region loading, bottom-sheet registration, refresh) and exposing `getRegion(name)` → content-or-skeleton. Layouts reduce to zone geometry. `PageFeed` moved onto it.
  - **Region-scoped `reload`** + **partial-page merge** in `usePageStore` (`response.data` shallow-merges, `response.items` replaces; per-region loading flags).
  - **Reactive render-bindings** — `{ ref: "$.local.<key>" }` (+ `contains`/`equals`) resolved before validation in `SduiNode`, so a chip's `selected` / a tab's `active` reflect local state instantly with no reload.
  - **`set_local` `array_toggle`** handler (multi-select membership) + **backend-controlled debounce** in the action engine.
  - **`creator.snippet.skeleton`** renderer — composable shimmer (`rect`/`line`/`circle` bars, horizontal row groups, padding), shown per region while reloading.
  - Fixes: Chip wires `on_click` via the pressable + shows a remove × (trailing) via the icon-store glyph; `TabsFooter` bottom safe-area; nav host hides the native header when a header **region** is declared (`data.header_skeleton`), not only `data.header`.

  **ui-native**

  - `Chip` gains a `trailingIcon` slot (remove × on selected multi-select chips).

  Additive — existing pages/snippets unchanged. Supersedes the unreleased `reload_page`/`reload_content` primitives.

## 2.1.0

### Minor Changes

- [#217](https://github.com/One-Impression/amplify-design-system/pull/217) [`5a525db`](https://github.com/One-Impression/amplify-design-system/commit/5a525dbb3846d46f229a2eb8beb73636d998997c) Thanks [@achin-oi](https://github.com/achin-oi)! - SDUI rendering layer: card, gutter, icons, and tag/badge support.

  - **ui-native Card** now matches the legacy creator card defaults — thin
    `neutralSubtle` border, no shadow (`elevation: 'none'`), `neutralInverse`
    background, `lg` radius, `md` padding — with an outer/inner structure and a
    new optional `elevation` prop (`none|sm|md|lg|xl`) plus `resolveShadow`.
  - **Token resolvers** accept the long `sdui.<group>.<kebab>` wire form in
    addition to the short camelCase keys, so contracts using fully-qualified
    token strings resolve correctly.
  - **Page gutter** is now container-owned: a single 12px gutter with symmetric
    vertical row-gap, per-type and backend-overridable.
  - **Icons** render through `IconStoreProvider` + `IconGlyph`, resolving SVGs
    from the manifest (MMKV) with bundled essentials fallback.
  - **InfoRow** consumes the renamed `tag` field and renders count/dot badges;
    Text uses `font_weight`. Aligns with `sdk-native-sdui` v3.

## 2.0.2

### Patch Changes

- [#169](https://github.com/One-Impression/amplify-design-system/pull/169) [`4e62f87`](https://github.com/One-Impression/amplify-design-system/commit/4e62f877281043d7ec00ea360450fde2cd454d8c) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - `Box` now forwards five additional React Native style props that were previously silently dropped: `position`, `zIndex`, `opacity`, `overflow`, and the four individual border widths (`borderTopWidth`, `borderBottomWidth`, `borderLeftWidth`, `borderRightWidth`, all of which accept either a `BorderWidthToken` or a raw number). SDUI handlers emit these on Box nodes for absolute-positioned overlays, animated fades, and one-sided dividers — without forwarding, those layouts rendered without their styling. Additive only — existing props are untouched.

## 2.0.1

### Patch Changes

- [#148](https://github.com/One-Impression/amplify-design-system/pull/148) [`9fa7a74`](https://github.com/One-Impression/amplify-design-system/commit/9fa7a74fc0a1bd2aa556fc27a280b70997159f7a) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - Forwards `onPress` explicitly on `DSButton` and `DSTab` props so the outer Clickable wrapper used by SDUI renderers can wire it through. The inner `<Pressable>` was swallowing taps from the outer wrapper, leaving every SDUI button and tab inert. JSDoc on both new prop declarations explains the SDUI nested-Pressable problem so future maintainers know why the prop is explicit instead of relying on `...props`.

## 2.0.0

### Major Changes

- [#138](https://github.com/One-Impression/amplify-design-system/pull/138) [`2d0dfde`](https://github.com/One-Impression/amplify-design-system/commit/2d0dfde77dd29f5e66d2da4228a4c168a2cf0e9d) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - Migrate from `@amplify-ai/*` (npmjs.org, owner-locked) to `@one-impression/*` (GitHub Packages, org-owned).

  **Why:** The previous publish pipeline was bottlenecked on a single npm account, causing silent publish failures since 2026-05-22 (commits landed on `main` but never reached the registry). Moving to GitHub Packages under the `@one-impression` scope removes the single-owner dependency — every merge to `main` now publishes via the auto-injected `GITHUB_TOKEN`, with no human in the loop.

  **What changes for consumers:** Package scope changed from `@amplify-ai/*` to `@one-impression/*`. Install requires a GitHub PAT with `read:packages` scope (same auth model as the existing `@one-impression/sdk-*` packages from `amplify-schemas`). Update imports and `package.json` dependencies accordingly.

  **Versioning:** Major bump on every package because the scope change is a breaking name change — old `@amplify-ai/*` imports will not resolve after consumers update.

  **Pipeline:** Publishes now run via `changesets` (see `.changeset/` and `.github/workflows/publish.yml`) — every PR that ships a code change must include a `changeset` file declaring `patch`/`minor`/`major`. Merge to `main` opens a Version PR; merging that publishes.

- [#110](https://github.com/One-Impression/amplify-design-system/pull/110) [`82f1b5c`](https://github.com/One-Impression/amplify-design-system/commit/82f1b5cd55a275995e83858089bed047374574fa) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - feat(ui-native): initial release — 18 React Native primitives for Creator App SDUI

  Token-resolved components consuming @one-impression/tokens-creator/react-native:

  - Layout: Box, Stack
  - Foundation: Text, Icon, Image, Separator
  - Interactive: Button, Card, Input, Chip, Checkbox, Radio, Tag, Tab
  - Composite: ProgressIndicator, SearchBar, SelectableItem, ImageStack, Section, ScrollView

  Plus ThemeProvider, token type unions, and resolver utilities.

### Patch Changes

- Updated dependencies [[`2d0dfde`](https://github.com/One-Impression/amplify-design-system/commit/2d0dfde77dd29f5e66d2da4228a4c168a2cf0e9d), [`b339202`](https://github.com/One-Impression/amplify-design-system/commit/b33920277bcf8bcd23cca0ee3fad23a69b9ab1cb), [`06676e5`](https://github.com/One-Impression/amplify-design-system/commit/06676e508000aa9fa51c1f615e364e4c1331206b)]:
  - @one-impression/tokens-creator@3.0.0
