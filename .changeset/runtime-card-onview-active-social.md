---
"@one-impression/sdui-runtime": minor
---

feat(sdui-runtime): Card header/footer slot rendering, on_view one-shot, X-Active-Influencer-Id header injection

Three additive changes to the runtime that unblock the Explore listing surface and close a long-standing correctness gap on view-impression dispatch.

- **Card renderer — header / items / footer slots.** `CardSnippetSchema` (sdk-native-sdui ^2.8.0) now exposes `data.header?: Node`, `data.items?: Node[]`, and `data.footer?: Node` plus a sibling `config?: { footer_bg_color?: ColorToken }`. `CardRenderer` composes them in the legacy `CardSnippetType1` order (header → items → footer). When `config.footer_bg_color` is set, the footer slot is wrapped in a `Box` with the resolved background color so the footer can carry its own banner stripe inside an otherwise-neutral card body. `on_click` and `on_view` on the card node itself continue to flow through `SduiNode`'s Clickable + Viewable wrappers; header/footer Nodes carry their own actions and dispatch independently via `Interpreter`.

- **`SduiNode.on_view` — one-shot per instance.** `handleViewed` previously dispatched `props.on_view` every time `Viewable` fired its callback, which meant scroll-back-up over a feed item would re-emit the impression — duplicate analytics, duplicate side effects, duplicate server-side spend. The wire contract treats `on_view` as a single-impression signal. Added a per-instance `firedRef` that flips to `true` before the first dispatch and short-circuits subsequent calls. New Node instances (e.g. items appended via `append_items` pagination) get their own ref and fire their own `on_view` once when scrolled into view. The set-before-dispatch ordering matters and is covered by a regression test.

- **`bff_call` — X-Active-Influencer-Id header.** A creator may have multiple linked social influencer profiles; the active selection scopes every BFF read (catalog, earnings, feed). Added a new `useActiveSocialStore` zustand store (`activeInfluencerId: string | null`, `setActiveInfluencerId(...)`) exported from the package's public surface. `bff_call` always injects the `X-Active-Influencer-Id` header when the store has a value — applied to every environment, not localhost-gated (unlike `X-Dev-Identity`). When the store is `null`, the header is omitted and the server falls back to its default scoping for the authenticated creator.

Backwards-compatible: the new Card slots, the one-shot guard, and the new header are all additive. Existing pages that don't use header/footer slots or don't set `activeInfluencerId` see no behavioural change.
