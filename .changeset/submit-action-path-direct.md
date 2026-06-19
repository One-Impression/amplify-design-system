---
"@one-impression/sdui-runtime": patch
---

Fix the `submit` action: it was left on the old endpoint-id contract during the path-direct migration, reading `payload.endpoint` (always undefined now that builders emit `payload.path`) and hand-building the URL with a bare `Authorization` header. Every form submit silently no-op'd (the validity gate passed, then it aborted on the missing endpoint). It now resolves the URL via the shared path-direct plumbing (`resolveRequestUrl`) and uses `buildBffHeaders` — so it carries the same auth, dev-identity, and active-social headers as `bff_call` / `reload`.
