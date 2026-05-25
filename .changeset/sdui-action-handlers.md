---
"@one-impression/sdui-runtime": minor
---

Add SDUI action handlers and capability handlers (Task 23, Brief #264)

- 13 action verb handlers: navigate, bff_call, sheet, dismiss, toast,
  reload_section, replace_section, append_items, set_local, emit_telemetry,
  compound, capability dispatcher, deeplink
- 13 capability handlers: files, camera, notifications, linking-open,
  linking-open-oauth, deep-link, share, clipboard, haptics, auth, phone,
  ui-tooltip, app-refresh
- Enhanced action engine with compound AST interpreter (sequence, parallel,
  branch, catch, delay), async chain support (on_success/on_error), and
  capability:* prefix routing
- Populated action and capability registries
