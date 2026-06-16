---
"@one-impression/sdui-runtime": patch
---

Declare `react-native-svg` as a required peer dependency. The runtime already imports it (icon rendering via `SvgXml`, and `ui-native`'s `CircularProgress` uses it too), but it was undeclared — so consuming apps got no install warning and could ship without native-linking it, crashing at runtime with `RNSVGSvgView … not found`. `INTEGRATION.md` now documents the install + native-rebuild (`pod install` / Gradle) requirement.
