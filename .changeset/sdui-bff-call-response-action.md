---
"@one-impression/sdui-runtime": patch
---

The `bff_call` action handler now parses the response JSON body and dispatches `body.action` (if present) before any declared `on_success` chain. Re-enables server-driven action chaining the runtime had previously discarded — required for `append_items` on infinite scroll, post-submit navigation, and any BFF response that carries its own follow-up action. Defensive `.catch(() => null)` on the body parse tolerates non-JSON / empty responses.
