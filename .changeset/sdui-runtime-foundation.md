---
"@one-impression/sdui-runtime": major
---

feat(sdui-runtime): add @one-impression/sdui-runtime@1.0.0 — SDUI runtime foundation

New package providing the foundation layer for the SDUI runtime in amplify-creator-app:
- SduiNode base wrapper (Zod validation, error boundary, click/view/load/dismount lifecycle, telemetry)
- Interpreter dispatcher (type-based renderer lookup with forward-compat fallback)
- PageRoot page container dispatcher
- Clickable and Viewable HOCs
- Action engine (pluggable verb handlers, capability dispatch)
- Bottom-sheet manager (Zustand-driven, stack depth=2, sheet-aware context for gorhom v5+ scrollable/input swaps)
- 7 hooks ported from legacy (useAppStateSession, useBottomSheetData, useBottomSheetFormSync, useFormSubmissionLoading, useHydrateParams, useKeyboardStatus, usePageRefresh)
- 6 skeleton loaders + ContainerLoader + 3-tier resolution (action hint → endpoint hint → default)
- Registry shells for ui-components, snippets, pages, actions, capabilities (populated by tasks 023-026)
- SduiRuntimeProvider root provider
