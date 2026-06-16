# SDUI Region Page Model — design + execution plan

Status: **in build** (worktree `feat/sdui-request-context-primitives`). Supersedes the
request-context primitives in PR #229 (which predate this model).

## The model

A page is composed of **regions**. Each region is a slot in `data` (chrome) or the
top-level `items` array (content). A page renderer places regions in **zones**
(pinned top / scroll body / pinned bottom); the geometry is the only per-layout
difference.

| Region | Lives in | Zone (feed) |
|--------|----------|-------------|
| `header` | `data.header` (`Node[]` — e.g. `[page_header, group_chips]`) | pinned top |
| `content` | `items` (top-level) | scroll body |
| `footer` | `data.footer` | pinned bottom (shell) |

Per-region skeletons: `data.<region>_skeleton`. A reload response is a **partial
page** — `response.data` shallow-merges into `page.data`, `response.items` replaces
`items`. The regions named in a `reload` action drive which skeletons show while the
fetch is in flight.

### Shell-first lifecycle
The footer is **app-shell chrome** — loaded once, never reloaded. First load returns
the shell (footer + region skeletons + `on_load`); `on_load` fires
`reload(["header","content"])` for the default tab. Tab switch and first content
load are the **same** operation.

| Trigger | `reload` regions | Footer |
|---------|------------------|--------|
| first load / tab switch | `["header","content"]` | persists |
| filter toggle / pull-refresh | `["content"]` | persists |

### Reusable vocabulary (runtime — zero feature knowledge)
- `reload({ endpoint, regions, query_params, debounce_ms })` — region-scoped fetch + partial-merge.
- `set_local` ops incl. `array_toggle` (array membership, for multi-select).
- Render-bindings: `{ ref: "$.local.<key>" }`, `+contains` (array → bool), `+equals` (scalar → bool); resolved reactively **before** schema validation.
- `sdui.snippet.skeleton` — BFF-composed placeholder (`rows`/`repeat`/`card`), no hardcoded shape.

### Base scaffold (runtime architecture)
`usePageScaffold(page)` owns the cross-cutting concerns so a layout is pure geometry:
lifecycle (`on_load` once / `on_dismount` / back / app-state), live-page subscription,
partial-merge consumption, per-region loading, bottom-sheet registration, refresh, and
`getRegion(name) → content-or-skeleton`. Every layout extends it; the capability is
universal and dormant when a page declares no regions/skeletons.

## Additivity
Purely additive on today's `PageSchema` envelope: new `data.<region>_skeleton` keys,
new `reload` action, new `array_toggle` op, new binding value forms. Existing pages
and responses are byte-for-byte unchanged. A partial response is a subset of the
existing envelope shape, not a new structure.

## Decisions (locked — defaults)
1. **`header` region = `data.header` as `Node[]`** (`[page_header, group_chips]`). This is the *feed layout's* region shape; `data` is loose per-layout, so other layouts are unaffected — still additive at the contract level.
2. **Drop `reload_page`/`reload_content`** (no consumers) in favour of one region-scoped `reload`. Keep `debounce_ms`.
3. **Namespace neutralization** (`creator.*` → `sdui.*` + app-extension path) happens **after** the feed demo runs.
4. **Scope:** `PageFeed` moves onto the scaffold now; the other 4 renderers move over incrementally later.

## Execution plan

### Phase 1 — Contract (SDK 3.4.0, additive)
- `reload` action + `regions: string[]` (replace `reload_page`/`reload_content`).
- `array_toggle` set_local op (done; ensure in 3.4.0).
- Promote `sdui.snippet.skeleton` to a typed SDK schema.
- Bindings need no schema change. → publish 3.4.0 (overlay locally meanwhile).

### Phase 2 — Runtime base
- Partial-page merge + per-region loading in `usePageStore`.
- Region-scoped `reload` handler.
- `usePageScaffold` hook (lifecycle + region resolution + `getRegion`).
- Unit tests (merge, per-region loading, getRegion skeleton selection, binding reactivity).

### Phase 3 — Feed on scaffold + running playground
- `PageFeed` → thin zones (`getRegion`).
- Fixture: shell-first + partial responses (tab → header+content; filter → content).
- Remove temp 3s delay.
- On-device verify: shell → shimmer → content; tab (header+content shimmer, footer/optimistic tab stay); filter (content shimmer, header static, × chips); pull-refresh.

### Phase 4 — Package & publish
- Publish `sdui-runtime` (minor) on 3.4.0; consolidate PRs (supersede #229), strip throwaway + temp delay.

### Phase 5 — Drop-in to any app
- Namespace-neutral core registry (`sdui.*`) + app-extension path.
- Integration guide (6-step mount: install → Providers → ActionEngineConfig → SduiNavigationHost → resolvePage → BFF builders).
- BFF contract doc (envelope / regions / skeleton / action vocabulary).
- Playground as the canonical example.

## Definition of done
Playground runs the shell-first tabbed/filtered feed smoothly (per-scope skeletons,
optimistic selection, × chips, safe-area footer, pull-refresh); a second non-feed page
works untouched (proves additivity); packages published; integration + BFF docs exist;
core snippets app-neutral.
