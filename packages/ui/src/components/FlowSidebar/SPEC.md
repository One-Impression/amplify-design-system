# FlowSidebar — Canvas Primitive Spec

**Status:** Spec (v0 contract — no code in this PR)
**Owner:** `@one-impression/ui`
**Date:** 2026-05-08
**Consumer:** Magic Studio (initially), any product with a multi-step flow

> Studio's `STUDIO_V0_STRIPDOWN` calls for the `PhaseRibbon` to disappear outside flow context. When a surface *is* part of a flow (e.g. `brand-order` with 7 steps in `magic-studio/src/lib/pages/registry.ts`), users still need a left-rail navigator. `PhaseRibbon` is a top-strip; `FlowSidebar` is its vertical, dense, thumbnail-aware sibling.

---

## 1. Component name and purpose

`FlowSidebar` — left-rail multi-step flow navigation.

It renders a vertical list of step chips (with optional thumbnails), highlights
the active step, supports keyboard arrow navigation, and emits step-change
events. It is collapsible to an icon-only rail. It is purely presentational —
selection state and step data are owned by the parent.

It is the vertical complement to `PhaseRibbon` (top-strip), the
flow-aware complement to `CollapsibleNavGroup` (general nav), and a sibling
of `HistoryStrip` (horizontal timeline of generations).

**v0 supports navigation only.** Drag-reorder, insert/remove, conditional
flow logic — all deferred to v0.2 (see §10).

---

## 2. Props interface (TypeScript)

```ts
export type FlowStepStatus = 'default' | 'in-progress' | 'complete' | 'skipped';

export interface FlowStepBadge {
  count: number;
  tone?: 'default' | 'accent';
}

export interface FlowStep {
  /** Stable id — used for `activeStepId` matching, React keys, and click events. */
  id: string;
  /** Visible label, e.g. "Step 2 · Package". */
  label: string;
  /**
   * Optional href. When provided AND `onStepClick` is not, the chip renders
   * as an `<a>` with the href; otherwise it renders as a `<button>` and click
   * is dispatched via `onStepClick(id)`. Mixing is allowed: chips with `href`
   * become `<a>` even if `onStepClick` is provided (anchors still emit the
   * click event for analytics).
   */
  href?: string;
  /**
   * Image URL, or `null` / `undefined` for a token-driven placeholder block
   * (1.6:1 aspect, `--amp-semantic-bg-subtle`, dashed border).
   */
  thumbnail?: string | null;
  /** Visual status — see §4. Defaults to `'default'`. */
  status?: FlowStepStatus;
  /** Optional badge, e.g. iteration count "3" on the chip top-right. */
  badge?: FlowStepBadge;
}

export interface FlowSidebarProps {
  /** Header label, e.g. "Brand Order — 7 steps". Hidden when collapsed. */
  flowName: string;
  /** Ordered list of steps. Empty array → component renders nothing (see §6). */
  steps: FlowStep[];
  /** Id of the currently active step. Must match a `step.id` or no chip is highlighted. */
  activeStepId: string;
  /** Default `false`. When `true`, sidebar collapses to icon-only rail. */
  collapsed?: boolean;
  /** Fired on chip activation (click, Enter, Space). Always fired even on `<a>` chips. */
  onStepClick?: (id: string) => void;
  /** Fired when the collapse toggle is activated. Parent owns the `collapsed` state. */
  onCollapse?: (collapsed: boolean) => void;
  /** Optional bottom-of-rail action button. If `undefined`, button is not rendered. */
  onApplyToAll?: () => void;
  /** Default `"Apply brief to all steps"`. Used as the visible label and aria-label. */
  applyToAllLabel?: string;
  /** Optional className passthrough on the outer `<nav>`. */
  className?: string;
}
```

**Imperative ref:** none in v0. Focus management is handled internally (arrow keys move focus between chips; the active step is the default focus target on mount).

**No internal state.** `collapsed`, `activeStepId`, and `steps` are all controlled. This matches `PhaseRibbon` and `HistoryStrip` and keeps the component server-render-friendly.

---

## 3. Layout / dimensions (in tokens)

All dimensions are token-driven. CSS variables are set at the `:root` of the consuming product's theme; defaults fall back via `var(--name, fallback)`.

| Prop | CSS variable | Default | Description |
|---|---|---|---|
| Expanded width | `--amp-studio-theme-layout-flow-sidebar-w` | `260px` | Total sidebar width when expanded |
| Collapsed width | `--amp-studio-theme-layout-flow-sidebar-collapsed-w` | `44px` | Total sidebar width when collapsed |
| Step chip height (expanded) | `--amp-studio-theme-layout-flow-step-chip-h` | `64px` | Vertical extent per chip |
| Outer padding | `--amp-spacing-3` | (existing) | Padding around the rail content |
| Gap between chips | `--amp-spacing-2` | (existing) | Vertical gap between chips |
| Thumbnail aspect | `1.6 : 1` | (literal) | Matches desktop default device frame |

**Width transition:** `width 180ms cubic-bezier(0.4, 0, 0.2, 1)`. Honour
`prefers-reduced-motion: reduce` (set transition `duration: 0`).

**Sticky header / footer:** `flowName` header is `position: sticky; top: 0;` so it stays visible while the chip list scrolls; the optional "Apply to all" button is `position: sticky; bottom: 0;` for the same reason on tall lists.

**Overflow:** When the chip list exceeds the viewport, the `<ul>` scrolls vertically (`overflow-y: auto`). No custom scrollbar styling — inherits from the consuming page.

---

## 4. States

| State | Visual treatment |
|---|---|
| **default** | Chip with label + thumbnail (or placeholder); border `--amp-semantic-border-subtle`; bg `--amp-semantic-bg-surface` |
| **active** | 2px ring `--amp-semantic-border-accent`; bold label; small accent dot (6px) on chip leading edge; `aria-current="step"` |
| **in-progress** | Animated dot pulsing (`@keyframes amp-flow-pulse`, 1.4s ease-in-out infinite) using `--amp-semantic-status-info`; label remains default weight |
| **complete** | Checkmark badge (top-right, 16px) using `--amp-semantic-status-success`; chip stays interactive |
| **skipped** | 50% opacity on the whole chip; diagonal hatch overlay (`linear-gradient(135deg, transparent 47%, var(--amp-semantic-border-subtle) 48% 52%, transparent 53%)`); chip remains keyboard-focusable so users can re-enter a skipped step |
| **hover** | Bg `--amp-semantic-bg-subtle`; cursor `pointer` |
| **focus** | Outline 2px `--amp-semantic-border-focus` with 2px offset (matches `HistoryStrip`'s focus ring exactly) |
| **disabled** | Not part of v0. (Skipped is the closest concept; deferred-step gating is v0.2.) |

**Reduced-motion:** all animations (pulse, width transition) shrink to zero duration when `prefers-reduced-motion: reduce` is set. Static visual cue — solid info-coloured dot — replaces the pulse.

**Collapsed visuals:** label hidden; thumbnail shown as a 28px×18px square (1.6:1 maintained); badge becomes a 6px dot; active state still shows the 2px accent ring; tooltip on hover surfaces the full label (uses the existing `Tooltip` primitive).

---

## 5. Accessibility

| Concern | Treatment |
|---|---|
| **Outer landmark** | `<nav role="navigation" aria-label="Flow steps">` |
| **List semantics** | `<ul role="list">` with `<li>` per step |
| **Step element** | `<button type="button">` by default. When `href` is provided: `<a href={href}>` with `onStepClick` still wired for click events. |
| **Active step** | `aria-current="step"` |
| **Step status** | Each step exposes status via `aria-label` enrichment — e.g. `"Step 2 · Package, complete"` or `"Step 4 · Brief, skipped"` — so screen readers announce status without relying on color/hatch |
| **Collapse toggle** | `<button>` with `aria-expanded={!collapsed}`; `aria-label="Collapse flow steps"` when expanded, `"Expand flow steps"` when collapsed; `aria-controls` referencing the chip list `id` |
| **Keyboard nav** | `Tab` moves into the rail; `ArrowDown` / `ArrowUp` cycle between chips with focus + roving tabindex (only the active chip has `tabIndex=0`, others `-1`); `Home` / `End` jump to first / last; `Enter` / `Space` activate; `Esc` exits to the previous focusable element |
| **Click target** | Min 44×44 CSS pixels (matches Apple HIG and WCAG 2.5.5 AA target size). Chip height token already meets this; collapsed-rail icon stays within the 44px collapsed width. |
| **Color contrast** | Label ≥ 4.5:1 against chip bg; status icons ≥ 3:1 against chip bg (WCAG AA). All token combinations are pre-verified — no untested pair lands in a chip state. |
| **Motion** | All animations honour `prefers-reduced-motion: reduce` |
| **Focus visible** | Always renders the focus ring on keyboard focus; never on mouse-only focus (`:focus-visible`) |

**Out of scope for v0:** `aria-describedby` linking to step descriptions, `role="tablist"` semantics (the rail is a navigation list, not tabs), drag-reorder ARIA (deferred with the feature itself).

---

## 6. Storybook stories needed

| Story | Coverage |
|---|---|
| `Default` | 5 steps, step 2 active, all `status: 'default'`, no thumbnails |
| `WithThumbnails` | 5 steps, mixed real-image and `null` thumbnails (placeholder block path) |
| `MixedStatus` | 5 steps: 1 complete, 1 in-progress, 1 skipped, 2 default; one with badge `{ count: 3, tone: 'accent' }` |
| `Collapsed` | 5 steps, collapsed; hover shows tooltip; toggle re-expands |
| `WithApplyToAll` | 5 steps + bottom action button visible |
| `Mobile` | Viewport `< 768px`. **Spec choice:** the sidebar transforms into an off-canvas drawer behind a hamburger trigger — *not* a top horizontal strip. Rationale: the chip list is information-dense (label + thumbnail + status + badge), which compresses poorly horizontally; a horizontal strip is what `PhaseRibbon` already provides. Drawer slides from the left, traps focus while open, and dismisses on backdrop click / `Esc`. Trigger button stays mounted in a `<header>` above the workspace. |
| `Empty` | `steps: []` — component returns `null`. Storybook story documents this behaviour (no skeleton; the consumer is expected to gate render on `steps.length > 0`). |
| `LongList` | 12 steps to demonstrate sticky header / footer + scrolling |
| `BrandOrderRealistic` | The 7 actual `brand-order` flow steps from the Studio registry — used as the "happy path" visual reference for Pixel review |

All stories use the `@one-impression/tokens-studio` theme; a controls table is exposed for `flowName`, `activeStepId`, `collapsed`.

---

## 7. Tests needed

Vitest + Testing Library, plus `@axe-core/playwright` for the axe pass.

| # | Test | Assertion |
|---|---|---|
| 1 | `renders all step labels` | Each `step.label` is in the DOM |
| 2 | `active step has aria-current` | The chip matching `activeStepId` has `aria-current="step"`; no other does |
| 3 | `click emits onStepClick` | `userEvent.click(chip)` fires `onStepClick` with the correct id |
| 4 | `keyboard arrow nav cycles steps` | Focus first chip; `ArrowDown` moves to next; `ArrowUp` reverses; `End` jumps to last; `Home` jumps to first |
| 5 | `Enter/Space activate the focused chip` | Both keys emit `onStepClick(id)` |
| 6 | `collapse toggle changes aria-expanded` | Toggle button swaps `aria-expanded` and emits `onCollapse(!collapsed)` |
| 7 | `href chips render as <a>` | Step with `href` is rendered as `<a>` and click still fires `onStepClick` |
| 8 | `skipped chip is keyboard-focusable` | Tabbing reaches a `status: 'skipped'` chip — skipped ≠ disabled |
| 9 | `apply-to-all button hidden when prop omitted` | `onApplyToAll === undefined` → no button rendered |
| 10 | `empty steps renders nothing` | `steps: []` → `container.firstChild === null` |
| 11 | `axe a11y` | 0 violations on the Default, MixedStatus, and Collapsed stories |
| 12 | `respects prefers-reduced-motion` | When `matchMedia('prefers-reduced-motion: reduce')` matches, animation classes are not applied (asserted via `getComputedStyle` snapshot) |
| 13 | `status surfaces in aria-label` | `status: 'complete'` chip has aria-label including the word "complete" |

Visual regression: Chromatic snapshots for all 9 stories on push (existing `chromatic.yml` workflow picks them up automatically).

---

## 8. Token additions needed

Three new layout tokens to add to **both** `theme-light.json` and `theme-dark.json` in `packages/tokens-studio/tokens/`. They live under `theme.layout` (next to existing `toolbar-h`, `drawer-h`, `pane-left-w`):

```json
{
  "theme": {
    "layout": {
      "flow-sidebar-w":            { "$value": "260px", "$description": "Magic Studio FlowSidebar expanded width — paired with --amp-studio-theme-layout-flow-sidebar-w" },
      "flow-sidebar-collapsed-w":  { "$value": "44px",  "$description": "Magic Studio FlowSidebar collapsed (icon-only) width — paired with --amp-studio-theme-layout-flow-sidebar-collapsed-w" },
      "flow-step-chip-h":          { "$value": "64px",  "$description": "Magic Studio FlowSidebar per-step chip height — paired with --amp-studio-theme-layout-flow-step-chip-h" }
    }
  }
}
```

Why these three only, and not also dark-only color tokens: `FlowSidebar` reuses the existing `--amp-semantic-*` palette wholesale (border, bg-subtle, status-success, status-info, status-error). No new colour primitives, no new semantic mappings — so the only token surface area added is layout.

`scripts/build-tokens.js` will emit:
- CSS: `--amp-studio-theme-layout-flow-sidebar-w: 260px;` (etc.)
- SCSS: `$amp-studio-theme-layout-flow-sidebar-w: 260px;`
- JSON / JS / Tailwind v4 / RN: per existing pipeline

**No breaking changes.** All three are additions; no rename, no value drift.

---

## 9. Open questions for Pixel review

1. **Mobile behaviour** — spec proposes off-canvas drawer (left-edge slide-in, focus-trapped) over a top horizontal strip. Pixel needs to confirm the drawer pattern matches Canvas mobile conventions, or whether a bottom-sheet is preferred.
2. **Drag-reorder timing** — keep deferred to v0.2 (current proposal), or pull into v0 if Studio has flows where step order genuinely needs editing on day one?
3. **"Apply brief to all" button placement** — bottom of sidebar (current proposal, sticky-positioned) vs top below the flow name vs floating button outside the sidebar. Affects which surface owns the affordance.
4. **Step thumbnails** — live screenshot of the real page (Pixel-rendered iframe captured at small size) vs Pixel-generated stylised visual summary (synthesised). The first is real but slow; the second is fast but synthetic. Default behaviour for the v0 consumer (Studio) needs a Pixel call.

---

## 10. Out of scope (deferred to v0.2)

- **Drag-reorder** — `react-aria` `useDraggableCollection` with keyboard-accessible move semantics
- **Insert / split / merge / delete** — chip-level affordances (hover toolbar) for editing flow shape
- **Conditional flow logic** — "if X selected at step 3, skip step 4" — needs a flow expression DSL, owned by `magic-studio` or the registry, not by this primitive
- **Cross-flow navigation** — jumping between unrelated flows (e.g. `brand-order` → `creator-onboarding`)
- **Per-step diff badges** — "this step has unsaved changes" — depends on Studio's editing model
- **Sticky scroll-spy** — the active chip auto-tracking the viewport scroll position when a long single-page form contains all steps

These are intentionally not props in the v0 interface so v0.2 can extend cleanly without breaking consumers.

---

## 11. Implementation note (post-spec)

This spec is the contract. The actual component lands in a follow-up Canvas PR after Magic Studio's mockup picks the exact look (thumbnails treatment, badge style, chip density). The interface above must not change between this spec and the implementation PR; visual tokens may.

**File layout (when built):**
```
packages/ui/src/components/FlowSidebar/
  FlowSidebar.tsx         — implementation
  FlowSidebar.stories.tsx — Storybook stories from §6
  FlowSidebar.test.tsx    — Vitest cases from §7
  index.ts                — barrel export
  SPEC.md                 — this file (kept in-tree for future reference)
```

**Barrel export added to** `packages/ui/src/index.ts`:
```ts
export * from './components/FlowSidebar';
```

**Token build trigger:** the three layout tokens land alongside the implementation PR (or just before it), so consumers picking up `@one-impression/ui` and `@one-impression/tokens-studio` together get a consistent release.
