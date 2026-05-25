---
"@one-impression/sdui-runtime": minor
---

Emit standalone bundles at `/bff`, `/icon-store`, and `/action-engine`
subpath exports.

Previously consumers had to deep-import `dist/bff/index.js` to avoid
pulling the full runtime into every chunk. The package now advertises
three first-class subpath exports, each backed by its own tsup entry,
so `import { ... } from "@one-impression/sdui-runtime/bff"` (etc.) works
without falling through to the root bundle.

Also marks `react-native-svg` and `react-native-mmkv` as externals so
the `icon-store` subbundle leaves them to the consumer to provide.
