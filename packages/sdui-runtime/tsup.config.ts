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
  ],
});
