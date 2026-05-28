---
"@one-impression/sdui-runtime": patch
---

fix(sdui-runtime): home BC renderer bugs — Tab icon + tap dispatch, InfoRow flat status_tag label

Two renderer-level bugs found by on-device E2E of the home BC against `sdk-native-sdui@^2.6.0`. Each broke a visible piece of the home page; both are caught by `SduiErrorBoundary` so they render as fallback boxes rather than crash the screen.

- **`TabRenderer` — icon crash.** The renderer wrapped `v.icon` in `<Interpreter node={v.icon} />`, but `icon` is a flat `IconSchema` (`{ name, size?, color? }`), not an SDUI node — so `Interpreter` called `resolveRenderer(undefined)` and crashed on `.startsWith()`. The footer's 3 tabs rendered as fallback boxes. Fix: render `<DSIcon name={v.icon.name} size={v.icon.size} color={v.icon.color} />`, matching the established pattern in `ChipRenderer`, `PageHeader`, `InfoIconRow`, and 6 other renderers that consume `IconSchema`.

- **`TabRenderer` — tap swallowed.** `DSTab` is itself a `Pressable`. Passing `on_click` to `SduiNode` wrapped the tab in an outer `Clickable` Pressable, but in RN the deepest Pressable under the touch point wins — so the inner DSTab Pressable swallowed the tap and the outer handler never fired. (`DSTab.types.ts` already documents this expectation.) Fix: dispatch `on_click` locally via `useActionEngine` and pass the press handler directly as `DSTab.onPress`; intentionally do not forward `on_click` to `SduiNode` (so no outer Clickable wraps). `on_load` / `on_view` / `on_dismount` continue to flow through `SduiNode` unchanged.

- **`InfoRow` — status_tag label flat-text bug.** The renderer passed the whole `v.status_tag.label` object to `DSTag.label`, but `status_tag.label` is a flat `TextSchema` (`{ text, color?, font_size?, font_weight? }`), not a string. React rendered it as a child and threw "Objects are not valid as a React child (found: object with keys {text})." Every `info_row` on the home Explore feed rendered as a fallback box (no title/subtitle/status tag). Fix: `label={v.status_tag.label.text}`, same pattern title/subtitle/badge already use in this renderer.

Verified on iPhone 15 Pro simulator: footer tabs render with correct labels and the active-underline indicator, tapping a tab fires the BFF's `on_click` and the gateway's `replace_section` action is applied, and campaign cards render full title / subtitle / status tag.
