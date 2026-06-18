# Addressable Surfaces + Cross-Surface Reload — Design

Status: **design locked, not yet built**
Related: [`UI-ZONE-PAGE-MODEL.md`](./UI-ZONE-PAGE-MODEL.md) (the existing zone-reload model), [`BFF-CONTRACT.md`](./BFF-CONTRACT.md)

## Why

We need a surface (page **or** bottom sheet) to be able to refresh **another, already-open surface anywhere in the stack** — driven entirely by the BFF, with no new frontend code per surface. The motivating flow:

> apply sheet → "Add billing & shipping" → **address-select** (single-select list) → "Add a new address" → **add-address form** → submit → *back + refresh the address list* → select an address → *back + refresh the apply sheet*.

Today's `reload` action is **UI-zone-scoped on the live page only** (see `UI-ZONE-PAGE-MODEL.md`); it cannot target a *different* surface in the stack, and bottom-sheet content is **statically embedded** in the parent page document, so a sheet can't be refreshed independently. This design adds **addressable surfaces** + **reload-by-name** + **sheet-content-from-its-own-API**.

## Principles (reconciled)

1. **No frontend endpoint-id → path registry.** Actions carry the **API path directly**. The current `EndpointPaths`/`getEndpoint` lookup (`action-engine/handlers/_shared/bff-request.ts`, `bff-call.ts`, `reload.ts`) is the legacy anti-pattern: it forces a frontend release before the BFF can use a new endpoint. New surfaces/actions are **path-direct**; migrating the existing id-based actions is a tracked follow-up.
2. **Surfaces are addressed by a backend-provided name, which is a pure reference handle — never resolved to a path by the frontend.** The name reuses each surface's existing canonical identity: **`page.id` / `sheet.id`** (already the page-store key and the bottom-sheet registry key respectively). This does **not** reintroduce id→path coupling, because the name only matches an *already-open* surface; it is never turned into an endpoint.
3. **Uniqueness per open instance comes from `route.key`** (React Navigation, minted free on push). The **route stack is the single source of truth for presence, order, and uniqueness.** A name (`page.id`/`sheet.id`) may map to multiple open `route.key`s.

## Data structure — addressing model

The custom route stack (`navigation/SduiNavigationHost.tsx` + `navigationRef`) already interleaves `SduiPage` and `SduiSheet` routes on one ordered stack. We extend it with a derived by-name index — **no parallel registry object**:

| Concept | Source |
|---|---|
| unique id (per open instance) | `route.key` (React Navigation) |
| referenceable name | `page.id` / `sheet.id` (= the `screenId`/`sheetId` route param) |
| order / "nearest" tiebreak | route **index** in `navigationRef.getState().routes` |
| refetch handle | the route's own fetch (by **path**) |

```ts
// Derived from a single navigationRef.addListener('state', …) — the route stack
// stays the single source of truth; this is a read index, not a second store.
byName: Map<string /* name */, string[] /* route.key[], in stack order */>
// read by id  → routes.find(r => r.key === id)   (stacks are shallow; effectively O(1))
// read by name → byName.get(name)                (O(1))
```

### Resolving one-name → many-ids
`reload { page }` carries the **caller's `route.key`** (the caller knows its own). Policy:
- **`nearest` (default)** — the matching route with the highest index **below the caller** = the surface you return to via `back`.
- **`top`** — most-recently opened instance.
- **`all`** — every open instance (surfaces legitimately mirrored in two places).

> Why `route.key`-keyed, not `id`-keyed: the existing `useBottomSheetStore.registry` and the page store key by `sheet.id`/`pageId` and therefore **collide on same-id** (last-write-wins). They are fine for static single-instance sheets, but cannot support "same name, multiple open instances." The new index keys on `route.key` and uses the name only as a secondary lookup.

## Sheet content from its own API

Today a bottom sheet's content is embedded in the parent page's `bottom_sheets[]` and registered into `useBottomSheetStore.registry[sheet.id]`. New addressable sheets instead **fetch their own content on open**:

- the parent only *opens* a sheet shell (`sheet` action carries the content **path** + the sheet's name);
- the sheet fetches its document via `on_load` (path-direct) — fresh every open;
- `reload { page: "<sheet name>" }` re-fetches it.

### Coexistence + deprecation (do NOT rip out the id-keyed registry)
`useBottomSheetStore.registry` is load-bearing (inline `bottom_sheet` snippet, page `bottom_sheets[]`, `SduiSheetScreen` content, `useBottomSheetData`, `sheetPresenter`, `BottomSheetHost`). It is correct for **static, single-instance** sheets.

- **Keep** it as a content cache for static sheets.
- **Add** the `route.key`-keyed index + fetch-on-open **additively**, scoped to addressable surfaces (apply-checklist, address-select).
- **One hard rule:** presence/uniqueness/order live in the **route stack only**. The id-keyed registry is demoted to *content*; it must not also own "is this open." (Today presence is split between `openSheets[sheet.id]` in `BottomSheetHost` and route existence in `SduiSheetScreen` — that split is the footgun; new surfaces use route presence exclusively.)
- **Gradual deprecation target:** the store-based presence host (`BottomSheetHost` + `openSheets`), once all sheets are route-based. The content registry can remain a harmless cache.

## The `reload` action (extended)

```
reload { page: "<page.id | sheet.id>", scope?: "nearest" | "top" | "all" }   // default: nearest
```
Resolves to `route.key`(s) via the by-name index, then refetches each (by the route's own path). The existing zone-scoped `reload` (no `page`) is unchanged.

### Action chains (the flow)
- **Form submit** → `submit { form_id, endpoint: "<upsert path>", on_success: compound[ navigate{op:back}, reload{page:"address-select"} ] }`
- **Select an address** → `compound[ <persist selection>, navigate{op:back}, reload{page:"apply-checklist"} ]`

## BFF layering (non-negotiable)

Every new BFF surface follows the **same three-layer split as the Explore / My-Campaigns tabs** — no shortcuts:
1. **Adapter** — domain-shaped data, mock/real swappable (e.g. `mockCampaignsAdapter`).
2. **View-model deriver** — pure `domain → view-model`, no SDUI nodes (e.g. `deriveExploreCard`, `deriveMyCampaignCard`).
3. **SDUI builder** — `view-model → nodes`, owns design tokens (e.g. `buildCampaignCard`).

`apply-checklist`, `address-select`, and `address-form` each get their own adapter + deriver + SDUI layer.

## Surfaces (BFF, amplify-gateway)

- **`apply-checklist`** (`page.id`) — the apply checkpoint content (section header + checkpoint rows + separators), moved **out** of the detail's static `bottom_sheets[]` into its own endpoint; the detail opens a sheet shell that fetches it.
- **`address-select`** (`page.id`) — single-select radio list of addresses + "Add a new address" → form. (The apply flow uses this.)
- **`addresses`** (existing) — the **generic** view/edit/add list, reachable from anywhere.
- **`address-form`** — already built; fix submit to carry `endpoint` + `on_success` chain.

## Open items / carried context
- **Path-direct migration** of existing endpoint-id actions (`EndpointPaths` removal) — separate, larger follow-up; new surfaces are path-direct from day one.
- **In-sheet tap gesture** — content-area taps in `SduiSheetScreen` (@gorhom) are flaky; fold the fix into the sheet-host work.
- **Dev patches needing permanent homes:** `resolvePath` `{}`-token support and the `addressForm` `EndpointPaths` entry (both currently `node_modules` patches in the creator app).

---

# Build Plan

Build order: **A → B in `sdui-runtime` + the playground first** (the keystone, testable without a publish cycle), then **C** (gateway BFF), then **D** (creator-app wiring). Each stage is independently verifiable.

## Stage A — Contract (`sdk-native-sdui` in **amplify-schemas** → publish)
> **Path-direct is already in the schema source.** `reload` / `bff_call` / `reload_section` already carry an optional **`path: z.string()`** ("fetch `bffBaseUrl + path` verbatim, no client-catalog lookup; preferred over the legacy optional `endpoint` id"), `submit.endpoint` is already a free `z.string()`, and `navigate.target` is a free `z.string()`. So new surfaces are called **by path** with **no frontend endpoint registry** — that work is done. (Earlier confusion came from reading a stale published `4.0.0` dist; the dep is `^4.5.0` and the source is migrated.)
- **A1.** The **only** schema change: add two optional fields to `ReloadPayloadSchema` for reload-by-name:
  - `page: z.string().optional()` — target an open surface by its name (`page.id`/`sheet.id`); absent = current surface (today's behaviour).
  - `scope: z.enum(["nearest","top","all"]).default("nearest")` — which instance when a name has multiple open.
  `ui_zones` is unchanged; it names the zones of whichever surface `page` resolves to.
- **A2.** Publish amplify-schemas; bump `sdui-runtime` + the creator app to consume (also pulls the already-migrated `path` field through to consumers stuck on an older version).

**No frontend endpoint registry — hard rule (already the contract).** The runtime fetches `bffBaseUrl + path` directly. `EndpointPaths` / `resolveEndpointUrl` id→path resolution survives only as legacy for already-shipped `endpoint`-id callers and is deleted as those migrate; new surfaces emit `path` and never touch it.
- **A2.** Confirm `page.id` / `sheet.id` are emitted on every page/sheet envelope (already required on `page.schema`); document them as the addressable **name**.
- **A3.** Ensure `sheet`/`navigate`/`bff_call`/`reload` payloads can carry an **endpoint path** directly (path-direct), not only an id. (New field or relax `endpoint` to accept a path.)

## Stage B — Runtime (`sdui-runtime`, verify in playground)
- **B1.** By-name index: `Map<name, route.key[]>` derived from a single `navigationRef.addListener('state', …)`. Read-by-id via `getState().routes`. No parallel store.
- **B2.** `reload`-by-name: resolve `{page, scope}` → `route.key`(s) (nearest/top/all relative to the caller's `route.key`) → refetch each by its path.
- **B3.** Path-direct fetch path for new surfaces in `_shared/bff-request.ts` (accept a path without `EndpointPaths` lookup); leave the id-path intact for legacy callers.
- **B4.** Sheet-content-from-own-API: `SduiSheetScreen` fetches its document via the sheet's `on_load` (path) instead of (or falling back from) `registry[sheetId]`; route presence stays authoritative.
- **B5.** Make route presence the single source of truth; stop new surfaces from using `openSheets[sheet.id]`. (Do not remove the legacy path yet.)
- **B6.** Playground fixtures exercising: reload-by-name (nearest), a sheet that fetches its own content, and a 3-level back+reload chain.

## Stage C — BFF (`amplify-gateway`)
- **C1.** `apply-checklist` endpoint (`page.id: "apply-checklist"`) — move the checkpoint snippets out of the detail's static `bottom_sheets[]`; detail opens a sheet shell with `on_load` → this path.
- **C2.** `address-select` endpoint (`page.id: "address-select"`) — single-select radio rows + "Add a new address" (→ form path); each row's `on_click = compound[persist, back, reload{page:"apply-checklist"}]`.
- **C3.** `address-form` submit → add `endpoint` (upsert path) + `on_success: compound[back, reload{page:"address-select"}]`.
- **C4.** Keep `addresses` as the generic view/edit/add list.
- **C5.** All new actions are path-direct (no endpoint-id).

## Stage D — Creator app (`amplify-creator-app`)
- **D1.** Adopt the new runtime (publish or `patch-package`); fold in the carried dev patches (`resolvePath` `{}`, `EndpointPaths`).
- **D2.** Sheet host renders content from the fetched sheet document; register each surface's `page.id`/`sheet.id` name.
- **D3.** Fix the in-sheet content-tap gesture (@gorhom) so checkpoint/list rows navigate reliably.
- **D4.** On-device E2E: apply sheet → address-select → form → submit (list refreshes) → select (sheet refreshes) → checkpoint shows ✓.

## Definition of done
The full address-selection flow works on-device with **zero per-surface frontend code** (all surfaces, names, paths, and reload chains BFF-driven), multiple same-name instances resolve correctly, and the legacy id-keyed registry remains intact for static sheets.
