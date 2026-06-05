---
"@one-impression/sdui-runtime": patch
---

Add creator.auth.bootstrap to the endpoint registry — the bootstrap route predates the /v1/creator/* path convention and is absent from the codegen'd catalog, so authenticated app entry could not resolve it
