import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
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
