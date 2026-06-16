---
"@one-impression/sdui-runtime": patch
---

Strip JSX (`{/* ... */}`) and HTML (`<!-- ... -->`) comments from icon SVG markup before handing it to `SvgXml`. Several manifest glyphs were authored as JSX and leaked comments into the markup string, which `SvgXml` rendered as raw text nodes — throwing "Text strings must be rendered within a `<Text>` component" wherever those icons appeared. Comments carry no rendering meaning, so removing them is always safe.
