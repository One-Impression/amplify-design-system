---
"@one-impression/sdui-runtime": patch
---

Validate the composite snippet against the typed SDK schema.

Bumps `@one-impression/sdk-native-sdui` to `^3.1.0` (which now ships the
`composite` / `submit` / `select_trigger` / form-validation / header-slot
contracts) and switches the composite renderer from the placeholder `z.any()`
to the real `CompositeSchema.shape.data` discriminated union — so cover/stack/row
nodes are now type-validated at the boundary. The ephemeral local `submit`
ActionType patch is no longer needed (the verb is in the published SDK). Also
aligns the playground's `group_config` `gap` demos to the long-form spacing
tokens the schema expects.
