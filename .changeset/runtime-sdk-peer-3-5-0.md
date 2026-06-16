---
"@one-impression/sdui-runtime": patch
---

Bump the `@one-impression/sdk-native-sdui` peer (and dev) dependency to `^3.5.0`. The ring rendering added in 2.8.0 reads `ProgressSchema.shape`, which only exists from SDK 3.5.0 — the range now states that requirement explicitly. The peer remains optional, so the runtime still degrades gracefully (renders the linear bar) against older SDKs.
