---
"@one-impression/sdui-runtime": minor
---

Add BFF client, Zustand state stores, icon store, and theme bridge to sdui-runtime.

- BFF client with auth/retry/error/on-load-action interceptors and TanStack Query hooks
- 8 Zustand stores: page, bottom-sheet-data, bottom-sheet-form, navigation-stack, search-params, aerobar, file-upload, auth
- Icon store with MMKV persistence, essentials fallback, and foreground re-fetch policy
- Theme bridge mapping @one-impression/tokens-creator sdui.* tokens to RN-resolvable values
