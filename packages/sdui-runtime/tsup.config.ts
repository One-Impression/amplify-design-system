import { defineConfig } from "tsup";

export default defineConfig({
  // Multi-entry: emit a standalone bundle at each subpath the package
  // advertises in its `exports` map. This lets consumers do
  // `import { x } from "@amplify-ai/sdui-runtime/bff"` without falling
  // through to `dist/index.js` (which would pull the entire bundle into
  // every consumer chunk that only needs the bff client).
  //
  // Each entry is rooted at a directory's `index.ts`. New subpaths follow
  // the pattern: add `src/<name>/index.ts` → add to `entry[]` → add
  // `./<name>` to `package.json#exports`.
  entry: [
    "src/index.ts",
    "src/bff/index.ts",
    "src/icon-store/index.ts",
    "src/action-engine/index.ts",
  ],
  format: ["esm"],
  dts: false, // handled by tsc --emitDeclarationOnly
  clean: true,
  external: [
    "react",
    "react-native",
    "@one-impression/sdk-native-sdui",
    "@amplify-ai/ui-native",
    "@amplify-ai/tokens-creator",
    "@gorhom/bottom-sheet",
    // Expo / React Native packages used via dynamic imports in capabilities/
    "expo-clipboard",
    "expo-document-picker",
    "expo-haptics",
    "expo-image-picker",
    "expo-notifications",
    "expo-secure-store",
    "expo-web-browser",
    // WebView used by page renderers (WebViewPage, WebViewPageWithAction)
    "react-native-webview",
    // SVG + MMKV used by icon-store (parseSvg / useIconStore)
    "react-native-svg",
    "react-native-mmkv",
  ],
});
