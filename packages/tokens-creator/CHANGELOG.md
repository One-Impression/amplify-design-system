# @one-impression/tokens-creator

## 3.3.0

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

## 3.2.0

### Minor Changes

- [#191](https://github.com/One-Impression/amplify-design-system/pull/191) [`0a8b509`](https://github.com/One-Impression/amplify-design-system/commit/0a8b509a9c09031973f0ca1fcba7046a7d660103) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - feat(tokens-creator): state-banner color tokens for campaign/opportunity lifecycle stripes

  Adds four bg + text token pairs to the `sdui.color.*` namespace and surfaces them through a new `palette.state.*` group. These are reserved for the persistent banner that communicates where a campaign / opportunity sits in its lifecycle — distinct from `palette.status.*`, which is for inline messaging (toasts, form errors).

  Tokens added (light + dark theme):

  - `state-neutral-bg` / `state-neutral-text` — info / pending review (warm-grey surface).
  - `state-action-required-bg` / `state-action-required-text` — creator must act (amber).
  - `state-success-bg` / `state-success-text` — approved / paid (green).
  - `state-urgent-bg` / `state-urgent-text` — deadline approaching (orange — intentionally distinct from action-required amber and from `negative` red, so the three "lean in" states each have their own affordance).

  Bg + text pairs are tuned for AA contrast in both themes: each text token is two steps darker (light theme) or two steps lighter (dark theme) than its background. Dark theme backgrounds use the accent hue at 18% over the dark surface so the banner reads as tinted-but-recessive rather than competing with the body content.

  Why new tokens rather than aliasing existing `status.*`: the urgent-orange shade is not present in the existing palette (the closest existing alternative would be `notice` amber, which is reserved for action-required); and the four state-banner cells must remain perceptually independent across light AND dark themes. Aliasing to `notice` / `positive` / etc. would collapse urgent and action-required into the same hue, defeating the visual differentiation the banner needs.

  Build artifacts regenerated (CSS variables, SCSS, JSON, JS, Tailwind v4, React Native). Existing palette consumers are unaffected.

## 3.1.0

### Minor Changes

- [#176](https://github.com/One-Impression/amplify-design-system/pull/176) [`44895cc`](https://github.com/One-Impression/amplify-design-system/commit/44895cc89db278d64dcf0456faa30a49ba26a936) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - Add four gradient anchor color tokens for the home page background: `gradientHomeStart` (`#E2E7FE`), `gradientHomeMid1` (`#DEE2FE`), `gradientHomeMid2` (`#EBF9FF`), and `gradientHomeEnd` (`#FFFFFF`). These mirror the legacy hex values used in the home page `pageConfig.gradient.colors` and unblock a legacy-faithful SDUI rebuild that currently bypasses the token system with raw hex literals. Purely additive — no existing token names or values change — and the names are reusable across any future page that wants a similar light-violet → off-white background ramp.

## 3.0.0

### Major Changes

- [#138](https://github.com/One-Impression/amplify-design-system/pull/138) [`2d0dfde`](https://github.com/One-Impression/amplify-design-system/commit/2d0dfde77dd29f5e66d2da4228a4c168a2cf0e9d) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - Migrate from `@amplify-ai/*` (npmjs.org, owner-locked) to `@one-impression/*` (GitHub Packages, org-owned).

  **Why:** The previous publish pipeline was bottlenecked on a single npm account, causing silent publish failures since 2026-05-22 (commits landed on `main` but never reached the registry). Moving to GitHub Packages under the `@one-impression` scope removes the single-owner dependency — every merge to `main` now publishes via the auto-injected `GITHUB_TOKEN`, with no human in the loop.

  **What changes for consumers:** Package scope changed from `@amplify-ai/*` to `@one-impression/*`. Install requires a GitHub PAT with `read:packages` scope (same auth model as the existing `@one-impression/sdk-*` packages from `amplify-schemas`). Update imports and `package.json` dependencies accordingly.

  **Versioning:** Major bump on every package because the scope change is a breaking name change — old `@amplify-ai/*` imports will not resolve after consumers update.

  **Pipeline:** Publishes now run via `changesets` (see `.changeset/` and `.github/workflows/publish.yml`) — every PR that ships a code change must include a `changeset` file declaring `patch`/`minor`/`major`. Merge to `main` opens a Version PR; merging that publishes.

### Minor Changes

- [#108](https://github.com/One-Impression/amplify-design-system/pull/108) [`b339202`](https://github.com/One-Impression/amplify-design-system/commit/b33920277bcf8bcd23cca0ee3fad23a69b9ab1cb) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - feat(tokens-creator): extend sdui.\* token contract + icon manifest pipeline

  Adds sdui.spacing, sdui.font-size, sdui.font-weight, sdui.icon-size, sdui.radius,
  sdui.border-width, and sdui.component.button token sections for the creator SDUI rebuild.

  Adds build-icons.ts pipeline that generates dist/icons/manifest.json, essentials.json,
  version.txt, and manifest.d.ts from SVG source files in icons/.

- [#133](https://github.com/One-Impression/amplify-design-system/pull/133) [`06676e5`](https://github.com/One-Impression/amplify-design-system/commit/06676e508000aa9fa51c1f615e364e4c1331206b) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - feat(tokens-creator): add palette semantic alias module

  Adds the `palette` export — a hand-curated semantic alias map for BFF and app
  consumers. Maps engineer-friendly names (`palette.text.strong`) to canonical
  SDUI token names (`"sdui.color.neutral-strong"`) across all 7 token families
  (color, font-size, font-weight, spacing, radius, icon-size, border-width).
  Build-time validator ensures every alias resolves in every theme JSON.

  New export path: `@one-impression/tokens-creator/palette`. Consumers replace
  inline token strings and local `const color = {...}` duplication with
  `import { palette } from "@one-impression/tokens-creator/palette"`. Theme
  resolution stays entirely client-side; the BFF emits palette names and the
  renderer paints the theme-correct value at paint time.

### Patch Changes

- Updated dependencies [[`2d0dfde`](https://github.com/One-Impression/amplify-design-system/commit/2d0dfde77dd29f5e66d2da4228a4c168a2cf0e9d)]:
  - @one-impression/tokens-foundation@3.0.0
