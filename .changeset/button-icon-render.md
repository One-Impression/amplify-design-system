---
"@one-impression/sdui-runtime": patch
---

Fix `Button` icon rendering and surface render errors in the dev fallback.

The Button renderer routed `icon_left` / `icon_right` (bare `{ name, color?, size? }` specs, not nodes) straight through the Interpreter, whose `resolveRenderer` does `type.includes(...)` on the absent `type` — so ANY button with an icon threw "Cannot read property 'includes' of undefined" and fell back. Render them with `IconGlyph` directly (the same icon-store path `InfoRow` / `renderMedia` use), which resolves a default size/colour and feeds the parsed SVG concrete dimensions.

Also surface the caught error message in the dev `SduiFallback` for render-time throws (previously only schema-parse failures showed the message; render throws showed a bare label, making them hard to diagnose).
