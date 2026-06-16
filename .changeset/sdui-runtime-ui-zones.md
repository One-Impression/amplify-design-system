---
"@one-impression/sdui-runtime": major
---

Rename `region` → `ui_zone` across the page-scaffold/reload model, matching `@one-impression/sdk-native-sdui@4.0.0`. BREAKING — the runtime now reads `reload.payload.ui_zones` (not `regions`), so a BFF must emit `ui_zones`; the SDK peer is bumped to `^4.0.0`.

- `usePageScaffold`: `getRegion` → `getUiZone`, `isRegionLoading` → `isUiZoneLoading`.
- `usePageStore`: `loadingRegions` → `loadingUiZones`, `mergeRegions` → `mergeUiZones`, `setRegionsLoading` → `setUiZonesLoading`.
- `reload` handler: reads `payload.ui_zones`; sends `?ui_zones=` to the BFF; zone-keyed latest-wins concurrency.
- `data.header` is treated as a single `Node` (the producer wraps page_header + filters in one container); filters render inside the header zone.

Renderer geometry, lifecycle, partial-merge, and skeleton selection are otherwise unchanged. `REGION-PAGE-MODEL.md` → `UI-ZONE-PAGE-MODEL.md`.
