# `@one-impression/ui` Changelog

## 3.0.0

### Major Changes

- [#138](https://github.com/One-Impression/amplify-design-system/pull/138) [`2d0dfde`](https://github.com/One-Impression/amplify-design-system/commit/2d0dfde77dd29f5e66d2da4228a4c168a2cf0e9d) Thanks [@mridulgupta-oi](https://github.com/mridulgupta-oi)! - Migrate from `@amplify-ai/*` (npmjs.org, owner-locked) to `@one-impression/*` (GitHub Packages, org-owned).

  **Why:** The previous publish pipeline was bottlenecked on a single npm account, causing silent publish failures since 2026-05-22 (commits landed on `main` but never reached the registry). Moving to GitHub Packages under the `@one-impression` scope removes the single-owner dependency — every merge to `main` now publishes via the auto-injected `GITHUB_TOKEN`, with no human in the loop.

  **What changes for consumers:** Package scope changed from `@amplify-ai/*` to `@one-impression/*`. Install requires a GitHub PAT with `read:packages` scope (same auth model as the existing `@one-impression/sdk-*` packages from `amplify-schemas`). Update imports and `package.json` dependencies accordingly.

  **Versioning:** Major bump on every package because the scope change is a breaking name change — old `@amplify-ai/*` imports will not resolve after consumers update.

  **Pipeline:** Publishes now run via `changesets` (see `.changeset/` and `.github/workflows/publish.yml`) — every PR that ships a code change must include a `changeset` file declaring `patch`/`minor`/`major`. Merge to `main` opens a Version PR; merging that publishes.

Per-package changelog for `@one-impression/ui`. The full cross-package
changelog lives at the repository root (`CHANGELOG.md`); this file
mirrors the entries that touch this package only.

## 2.13.0 — 2026-05-08

### Added — six new Studio v0 primitives

Studio v0 Wave 4 — six primitives that ship the Magic Studio
Option-D cockpit shell. Source-of-truth contracts:

- `magic-studio/docs/mockups/option-d.html` (canonical mockup)
- `magic-studio/docs/mockups/OPTION_D_SPEC.md` (binding spec)
- `packages/ui/src/components/FlowSidebar/SPEC.md` (FlowSidebar v0
  contract from PR #101 — implemented here as `FlowContextSidebar`)

All six ship as `lifecycle.status=beta`, `since=2.13.0`. Pure additive —
no breaking changes to existing primitives.

| Primitive               | Main props                                                                                                                              | Stories                                                          |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `LivePaneToggle`        | `value: 'live' \| 'variants' \| 'split'`, `onChange`, `liveUrl?`, `disabled?`                                                           | Default, LiveActive, SplitActive, Disabled                       |
| `ReferenceSnapshotPill` | `capturedAt: Date`, `screenshotUrl: string`, `onClick?`, `formatTime?`, `label?`                                                        | Default, CustomLabel, PinnedTimeFormat                           |
| `DiffOverlay`           | `liveScreenshot: string`, `variantScreenshot: string`, `mode: 'highlight' \| 'swipe' \| 'side-by-side'`, `swipePercent?`, `showLegend?` | Highlight, Swipe, SwipeAt70, SideBySide                          |
| `FlowContextSidebar`    | `flowName`, `steps: FlowStep[]`, `activeStepId`, `collapsed?`, `onStepClick?`, `onCollapse?`, `onApplyToAll?`, `applyToAllLabel?`       | Default, MixedStatus, WithApplyToAll, Collapsed, LongList, Empty |
| `RecentChangesPanel`    | `filePath`, `commits: GitCommit[]`, `onClose`, `formatTime?`                                                                            | Default, Empty, SingleCommit                                     |
| `ReplyAffordance`       | `variantRef: { gen: number; variant: number \| string }`, `onClick`, `label?`                                                           | Default, LetterKey, CustomLabel, InVariantCardContext            |

### Token references

- All primitives consume the `--amp-studio-theme-*` + `--amp-semantic-*`
  token surface already shipping from `@one-impression/tokens-studio` 1.0.2.
- `FlowContextSidebar` references three new layout tokens (declared in
  `magic-studio/docs/mockups/OPTION_D_SPEC.md` §7 and in the sibling
  `tokens-studio` PR):
  - `--amp-studio-theme-layout-flow-sidebar-w` (260 px)
  - `--amp-studio-theme-layout-flow-sidebar-rail-w` (44 px)
  - `--amp-studio-theme-layout-flow-step-chip-h` (64 px)
- `RecentChangesPanel` references
  `--amp-studio-theme-layout-history-panel-w` (360 px).
- All four have inline `var(--name, fallback)` defaults so the
  components render correctly even before the token-bump publishes.

### Versioned

- `@one-impression/ui`: `2.12.0` → `2.13.0`

### Publish gating

This PR does NOT publish `@one-impression/ui@2.13.0` to npm. Publish is
gated on the matching `tokens-studio` PR merging first so consumers
picking up `@one-impression/ui` 2.13.0 alongside
`@one-impression/tokens-studio` get a consistent token surface. The
orchestrating coordinator handles the sequence.

## Earlier versions

See the cross-package root changelog
([`CHANGELOG.md`](../../CHANGELOG.md)) for entries before 2.13.0.
