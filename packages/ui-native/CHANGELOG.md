# @one-impression/ui-native

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
