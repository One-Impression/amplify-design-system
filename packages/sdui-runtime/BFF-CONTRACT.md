# SDUI BFF contract

How a backend emits SDUI pages the runtime can render. The wire types + typed
builders live in `@one-impression/sdk-native-sdui` — **prefer the builders** over
hand-written JSON; they validate shape at construction. The *why* behind the
UI-zone model is in [`UI-ZONE-PAGE-MODEL.md`](./UI-ZONE-PAGE-MODEL.md); this is the reference.

## 1. Page envelope

```jsonc
{
  "id": "demo.feed",              // screen id (the navigate target)
  "title": "My Campaigns",        // native-header title (used only if no header zone)
  "protocol_version": "1.0.0",
  "layout": "feed",               // selects the layout renderer (standard | feed | sticky_footer | web_view | …)
  "data": { /* chrome zones + skeletons — see §2 */ },
  "items": [ /* the content zone — see §2 */ ],
  "on_load":    { /* Action — fires once when the screen mounts */ },
  "on_refresh": { /* Action — pull-to-refresh */ },
  "on_dismount":{ /* Action */ },
  "on_back_press": { /* Action — Android hardware back */ },
  "bottom_sheets": [ /* inline sheets, registered (not opened) */ ]
}
```

Only `id` / `title` / `protocol_version` / `layout` / `items` are always meaningful; the
rest are optional. A page that just renders content needs only `layout` + `items`.

## 2. UI zones

A page is composed of **UI zones**. The convention:
- `data.<zone>` — a chrome zone (a single `Node`), e.g. `data.header`, `data.footer`. When a zone needs several nodes (e.g. a page header + filter chips), wrap them in one container node.
- `items` — the **content** zone (top-level).
- `data.<zone>_skeleton` — the zone's loading placeholder.

Which zone renders where on screen (pinned top / scroll body / pinned bottom)
is owned by the layout renderer, not the wire. For the `feed` layout: `header` → pinned top,
`content` (= `items`) → scroll body, `footer` → pinned bottom.

## 3. Shell-first + reload scopes

A page can render a **shell** first (chrome + skeletons), then stream zones in via
`reload` from `on_load`. The `reload` response is a **partial page**:

- `response.data` is **shallow-merged** into the live page's `data` (unrefreshed zones + skeletons survive).
- `response.items` **replaces** `items`.
- The action's `ui_zones` names which zones are refreshing → the runtime shows each one's skeleton while in flight; unnamed zones (e.g. a footer shell) stay mounted.

| Trigger | `reload` `ui_zones` | Response |
|---------|---------------------|----------|
| first load / tab switch | `["header","content"]` | `{ data: { header: {...} }, items: [...] }` |
| filter / pull-refresh | `["content"]` | `{ items: [...] }` |

The runtime sends `ui_zones` + the bound context as query params; return exactly the named zones. Full model + worked example: [`UI-ZONE-PAGE-MODEL.md`](./UI-ZONE-PAGE-MODEL.md).

**Latest-wins per UI zone.** Reloads are coordinated by the zones they target: a new `reload` of a zone takes ownership from any in-flight `reload` of that zone, so only the most recent response is applied — chained tab switches render just the latest tab, never a flicker through every response in arrival order. Reloads targeting *disjoint* zones run in parallel untouched. An in-flight reload is aborted only when *all* its zones have been superseded; if only some were (e.g. a `["content"]` filter landing over an in-flight `["header","content"]` tab switch), it still applies the zones it owns. This is automatic — the BFF declares no concurrency flag.

## 4. Action vocabulary

Every interactive field (`on_click`, `on_load`, `on_refresh`, a chip's `on_click`, …) is an `Action`:

| Verb | Payload (key fields) | Effect |
|------|----------------------|--------|
| `navigate` | `{ target, op, params }` | Push/replace a screen (via the app's `onNavigate`). |
| `bff_call` | `{ endpoint, method?, query_params?, request_body?, on_success?, on_error? }` | Fetch; may dispatch a follow-up action from the response body. |
| `reload` | `{ endpoint, ui_zones[], method?, query_params?, request_body? }` | UI-zone-scoped partial-page refresh (§3). |
| `set_local` | `{ key, op, value? }` | Mutate local store. `op`: `set` / `merge` / `toggle` / `increment` / `remove` / **`array_toggle`** (add/remove a value from an array — multi-select). |
| `compound` | `{ actions: Action[], mode? }` | Run actions in sequence (default) or parallel. |
| `append_items` | `{ target, items, has_more? }` | Append raw nodes to a container (infinite scroll). |
| `reload_section` / `replace_section` | `{ target, endpoint?/data }` | Swap a single node by id (distinct from a UI zone, which is a whole page area). |
| `toast` / `dismiss` / `deeplink` / `emit_telemetry` / `branch` / `submit` | — | As named. |

Any action may carry **`debounce_ms`** (backend-controlled): the engine coalesces a burst of
the same action (keyed by verb + target + endpoint) onto the trailing run — e.g. a filter chip
that re-fetches sets ~400ms; a tab switch omits it.

## 5. Render-bindings (reactive local state)

A `data` field may be a **binding** resolved (reactively) from the local store before
render — so chips/tabs reflect selection instantly with no reload:

```jsonc
"selected": { "ref": "$.local.selected_filters", "contains": "beauty" }  // array membership → bool
"active":   { "ref": "$.local.selected_tab",     "equals": "for_you"  }  // scalar equality → bool
"x":        { "ref": "$.local.<key>" }                                    // raw value
```

`$.local.<key>` is a **flat** key lookup (mirrors `set_local` / `get` — `$.local.form.submitted`
reads the literal key `"form.submitted"`, not nested). Bindings also work in request fields
(`query_params` / `request_body`) of `bff_call` / `reload`, so a reload binds to the current
context; arrays become CSV in query params.

## 6. Skeletons

`sdui.snippet.skeleton` is a BFF-composed shimmer — the runtime supplies the pulse, you
compose the shape:

```jsonc
{ "type": "sdui.snippet.skeleton", "id": "skel-header", "data": {
  "padding": 16,
  "rows": [
    { "row": [ { "shape": "line", "height": 24, "width": "55%" }, { "shape": "circle", "width": 24 } ], "justify": "between" },
    { "shape": "line", "height": 14, "width": "35%" },
    { "row": [ { "shape": "rect", "height": 32, "width": 76, "radius": 16 } ] }   // chip row
  ]
} }
```

- `rows` — stacked bars; a row is a single bar (`shape`: `rect` / `line` / `circle`, `height` / `width` / `radius`) or a **horizontal group** (`{ row: [...], justify }`).
- `repeat` — render the rows N times (e.g. 4 card placeholders).
- `card` — wrap each group in a card surface.
- `padding` — horizontal inset (match the content's gutter).

Compose a skeleton that *resembles* the zone it replaces (header = title + icon + chip row; card = media + logo + tag + lines), and declare it as `data.<zone>_skeleton`.

## 7. Use the SDK builders

`@one-impression/sdk-native-sdui` exports typed builders for nodes + actions — construct
pages type-safely instead of raw JSON: `composite`, `chip`, `groupChips`, `tabsFooter`,
`pageHeader`, `reload`, `setLocal`, `compound`, `bffCall`, `navigate`, … Each returns a
validated node/action.

```ts
import { reload } from "@one-impression/sdk-native-sdui";
reload({ endpoint: "creator.campaigns.list", uiZones: ["content"], debounceMs: 400,
         queryParams: { tab: { ref: "$.local.selected_tab" }, filter: { ref: "$.local.selected_filters" } } });
```

## 8. Endpoints

`bff_call` / `reload` take an **endpoint id** (e.g. `creator.campaigns.list`), not a path. The
SDK's `EndpointPaths` maps id → request path (`/v1/creator/campaigns`) — the single source of
truth shared with the gateway. Path params (`{id}`) are filled from `path_params`. Add new
endpoints to the SDK's endpoint registry.

## 9. Worked example

The campaigns feed (`apps/sdui-playground/server/fixture-server.mjs`) is the canonical
example: a shell (footer + header/content skeletons + `on_load → reload(["header","content"])`),
a tab tap (`compound[set_local tab, set_local filters=[], reload(["header","content"])]`), and
a filter tap (`compound[set_local array_toggle, reload(["content"], debounce 400)]`), with the
endpoint returning the matching partial page per requested `ui_zones`.
