# SDUI UI-Zone Page Model — reference

Status: **shipped** (runtime `usePageScaffold` + `reload`). Renamed from the
"region page model": the wire/code term is now **`ui_zone`** (the page area a
`reload` refreshes), not `region`/`section` — see the naming note below.

## The model

A page is composed of **UI zones**. A zone is a named slot in `data` (chrome) or
the top-level `items` array (content). A layout renderer places each zone in its
geometry (pinned top / scroll body / pinned bottom); that geometry is the only
per-layout difference.

| UI zone | Lives in | Geometry (feed) |
|---------|----------|-----------------|
| `header` | `data.header` (a **single `Node`** — e.g. a container wrapping `page_header` + filter chips) | pinned top |
| `content` | `items` (top-level) | scroll body |
| `footer` | `data.footer` | pinned bottom (shell) |

Per-zone skeletons: `data.<zone>_skeleton` (`header_skeleton`, `content_skeleton`).
A reload response is a **partial page** — `response.data` shallow-merges into
`page.data`, `response.items` replaces `items`. The `ui_zones` named in a `reload`
action drive which skeletons show while the fetch is in flight.

> **header is one node.** When the header needs both a page header and filter chips,
> the producer wraps them in a single container node; filters are **not** their own
> zone — they render inside the header zone.

### Shell-first lifecycle
The footer is **app-shell chrome** — loaded once, never reloaded. First load returns
the shell (footer + zone skeletons + `on_load`); `on_load` fires
`reload(["header","content"])` for the default tab. Tab switch and first content
load are the **same** operation.

| Trigger | `reload` `ui_zones` | Footer |
|---------|---------------------|--------|
| first load / tab switch | `["header","content"]` | persists |
| filter toggle / pull-refresh | `["content"]` | persists |

### Reusable vocabulary (runtime — zero feature knowledge)
- `reload({ endpoint, ui_zones, query_params, debounce_ms })` — zone-scoped fetch + partial-merge.
- `set_local` ops incl. `array_toggle` (array membership, for multi-select).
- Render-bindings: `{ ref: "$.local.<key>" }`, `+contains` (array → bool), `+equals` (scalar → bool); resolved reactively **before** schema validation. `query_params` values accept these bindings too.
- `sdui.snippet.skeleton` — BFF-composed placeholder (`rows`/`repeat`/`card`), no hardcoded shape.

### Base scaffold (runtime architecture)
`usePageScaffold(page)` owns the cross-cutting concerns so a layout is pure geometry:
lifecycle (`on_load` once / `on_dismount` / back / app-state), live-page subscription,
partial-merge consumption, per-zone loading, bottom-sheet registration, refresh, and
`getUiZone(name) → content-or-skeleton`. Every layout extends it; the capability is
universal and dormant when a page declares no zones/skeletons.

## Naming note — why `ui_zone` (not `region` / `section` / `slot`)
- `region` is vague; renamed to `ui_zone`.
- `section` is taken — `sdui.*.section` (a node type) + `reload_section` / `replace_section`, which address **one node by `id`** (the opposite granularity). A UI zone is a named page *area* refreshed by partial-merge.
- `slot` is taken — `composite` already uses "slots" (named `header`/`footer`/…) for its *internal* sub-areas.
- `surface` is taken — `SurfaceSchema`.

The older model split "region" (logical slot) from "zone" (physical placement);
those are 1:1 in practice and are **collapsed** into one concept: the UI zone.

## Contract
- SDK ≥ `@one-impression/sdk-native-sdui@4.0.0`: `reload.payload.ui_zones`, `query_params` bindings (`BindingValueSchema`), `PageFeedSchema.data.{header_skeleton,content_skeleton}` (`header` is a single `Node`), `PartialReloadResponseSchema`.
- Additive on the page envelope otherwise; existing pages/responses unchanged.
