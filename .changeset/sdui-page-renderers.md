---
"@amplify-ai/sdui-runtime": minor
---

feat(sdui-runtime): add 5 page layout container renderers

Adds PageStandard, PageStickyFooter, PageFeed, WebViewPage, and
WebViewPageWithAction page container renderers under src/pages/.
Populates the pageContainerRegistry so PageRoot can dispatch to the
correct layout based on the BFF page envelope's layout field.

- PageStandard: scrollable page with pull-to-refresh and back-press handling
- PageStickyFooter: keyboard-aware layout with pinned footer for forms/checkout
- PageFeed: FlatList-based infinite-scroll feed with filter chips, load-more, empty state
- WebViewPage: full-screen WebView shell with optional title header
- WebViewPageWithAction: WebView with URL-pattern interception for payment/OAuth flows
