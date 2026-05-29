---
"@one-impression/sdui-runtime": minor
"@one-impression/ui-native": minor
---

Explore tab end-to-end fixes — bundled session of nine issues found while running the home/Explore checklist on iOS:

**sdui-runtime**

- **`useLocalStore` re-export** (`src/index.ts`) — surface the store at the main entry so consumers can import it without reaching through the runtime's deep dist subpath. Pairs with the creator-app `active-social-bridge` switch from a deep import.
- **`replaceNodeInTree` + `replaceNode` recurse into pinned slots** (`src/state/usePageStore.ts`) — `data.header`, `data.footer`, and the `data.items[]` array are all walked, so `replace_section` actions that target IDs pinned in any of the three (e.g. the home page's `home-header-section`) actually find and swap their node instead of silently no-opping.
- **`PageFeedRenderer` subscribes the whole effective page** (`src/pages/PageFeed/PageFeed.renderer.tsx`) — read `header`/`filters`/`footer`/`config` off the live page tree via `useShallow` so a `replace_section` on the header/footer triggers a renderer re-read instead of staying frozen at the prop snapshot.
- **`Interpreter` guard** (`src/interpreter/Interpreter.tsx`) — render `<Fallback>` when a node has `type !== string` (null / undefined / typeless stubs from the wire) instead of crashing on `node.type.startsWith(…)`. Defence-in-depth at the renderer dispatcher boundary.
- **Touch-swallow fix for Pressable-rooted primitives** (`src/ui_components/{Chip,Checkbox,Radio,SelectableItem}/*.renderer.tsx`) — apply the Tab-pattern: dispatch `on_click` from the renderer via `useCallback`, pass directly to the DS primitive's `onPress`, and stop forwarding `on_click` to `SduiNode` so the inner `Pressable` isn't shadowed by an outer `Clickable`.
- **`ChipRenderer` icon descriptor** (`src/ui_components/Chip/Chip.renderer.tsx`) — render `v.icon` (a plain `IconSchema` descriptor `{name, size?, color?}`) via `<DSIcon>` directly; the previous `<Interpreter node={v.icon}/>` blew up at `node.type.startsWith` when the chip became `selected: true` and the server emitted an icon.
- **Endpoint registry merges legacy + dotted + gateway aliases** (`src/bff/endpoint-registry.ts`) — `useBffDocument` accepts the SDK's `EndpointPaths` dotted IDs in addition to the legacy short keys. `creator.campaigns.byId` / `creator.partnerships.byId` aliases bridge the gateway's auto-generated naming to the SDK's `*.detail` convention. `resolvePath` substitutes both `:id` and `{id}` placeholder syntaxes.
- **List-level viewport tracker on `PageFeed`** (`src/pages/PageFeed/PageFeed.renderer.tsx`) — `FlatList.onViewableItemsChanged` with a 50% threshold + 100 ms minimum-view-time dispatches `on_view` exactly once per top-level item via a `firedViewIdsRef` Set. Nested items continue to fire `on_view` through `Viewable.onLayout`.
- **Per-image press in `PageHeaderImageStackRenderer`** (`src/snippets/PageHeaderImageStack/PageHeaderImageStack.renderer.tsx`) — resolve each image's `on_click` from the parsed data and thread the handler through `DSImageStack.onImagePress`. Requires `ImageSchema.on_click` (sdk-native-sdui, see paired patch).

**ui-native**

- **`DSImageStack.onImagePress(index)`** (`src/primitives/ImageStack/ImageStack.tsx` + `.types.ts`) — new optional prop. When the consumer returns a handler for an index, the matching image is wrapped in a `Pressable` (with `accessibilityRole="button"`); otherwise the image renders as a plain `RNImage`. Used by the SDUI social-avatar stack to dispatch per-face `on_click`.

**Compatibility**

All renderer changes preserve the SDUI wire format. No new required wire fields. The `ui-native` `onImagePress` prop is optional and doesn't affect existing call sites.
