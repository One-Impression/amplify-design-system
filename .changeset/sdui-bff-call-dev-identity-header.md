---
"@one-impression/sdui-runtime": minor
---

The `bff_call` action handler now injects an `X-Dev-Identity` request header when the BFF base URL targets `localhost` or `127.0.0.1`. The header value is sourced from a new `useDevConfigStore` (exposes `setDevIdentity(value: string | null)`); when unset the header is silently skipped, and the URL gate ensures production traffic is never augmented even if the value is accidentally populated. Replaces the manual creator-app patch that injected the header from outside the runtime.
