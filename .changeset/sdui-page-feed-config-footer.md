---
"@one-impression/sdui-runtime": patch
---

PageFeed renderer now reads `data.config` (gradient / bg_color / scroll_header_color) and `data.footer` to match the legacy PageType3 visual hierarchy:

- `config.gradient` — absolute-positioned gradient backdrop. Uses `react-native-linear-gradient` when the host app installs it (optional peer); falls back to a solid first-color View otherwise so the runtime still works without the native dep.
- `config.bg_color.type` — solid token-name background when no gradient is provided.
- `config.scroll_header_color.type` — header tint applied to the filters bar once the user has scrolled (binary toggle; legacy uses an interpolated animation).
- `data.footer` — a single SDUI Node rendered pinned at the bottom of the page, OUTSIDE the FlatList, so it does not scroll with the body. Designed for `creator.snippet.tabs_footer` on the home page.

Existing `filters`, `loader`, `empty_state`, and `on_load_more` behavior is unchanged.

Also exports a new `Gradient` component (`@one-impression/sdui-runtime`) for renderers that want to reuse the same gradient backdrop primitive.

The matching `config` / `footer` schema fields land in amplify-schemas CR-19 — until that publishes, the renderer reads them through an `extractFeedPageData` helper that casts `page.data` to the augmented shape.
