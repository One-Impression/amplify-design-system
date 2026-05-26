---
"@one-impression/sdui-runtime": patch
---

`SduiNode` now parses node data defensively: a `ZodError` from the schema validation renders a `SduiFallback` element (dev mode shows node type + id, prod is blank) and surfaces the failure through the telemetry hook, rather than crashing the entire page. Non-Zod errors continue to propagate. Migration-period resilience — bad or stale handler emit no longer takes down the whole tree.
