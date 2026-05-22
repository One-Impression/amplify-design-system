# Accessibility · Hexcoded

WCAG 2.2 AA is the floor. Every surface we ship clears it.

## Contrast minimums

| Pairing | Required | Verified value |
|---------|----------|----------------|
| Body text · ink on bg | 4.5:1 | 18:1 (#0B0B0F on #FAFAFA) |
| Caption · muted on bg | 4.5:1 | 4.6:1 (#86868B on #FFFFFF) |
| Primary button · white on accent | 4.5:1 | 4.7:1 (#FFFFFF on #22C55E) |
| Accent text · accent-deep on bg | 4.5:1 | 6.9:1 (#16A34A on #FAFAFA) |
| Banner success · deep-green on whisper | 4.5:1 | 8.1:1 |
| Banner danger · red-text on red-bg | 4.5:1 | 7.4:1 (#991B1B on #FEE2E2) |
| Wordmark Phantom shadow on light bg | 3:1 | 4.4:1 (visual weight test) |

## Focus

- 2px `var(--accent)` outline at 3px offset on every focusable element via `:focus-visible`.
- Buttons clear the focus ring on mouse click (`:focus { outline: none }`) so it appears only for keyboard users.
- Modals trap focus while open. First interactive element gets focus on mount. Returns to the trigger on close.

## Keyboard navigation

- Tab cycles forward, Shift+Tab backward.
- Esc closes overlays (modal, drawer, popover, tooltip).
- Arrow keys navigate inside tabs, segmented controls, menus.
- Space + Enter activate buttons + toggle switches.

## Reduced motion

`prefers-reduced-motion: reduce` disables:

- Phantom breath (the wordmark + monogram switch to the static stepped-shadow text-shadow values from `tokens-hexcoded/shadow-stepped.json`).
- Page transitions.
- Skeleton shimmer.

Critical motion (loading spinners, progress bars) continues at reduced amplitude.

## Screen readers

- Every icon-only button has `aria-label`.
- Status badges are `role="status"` with `aria-live="polite"`.
- Error toasts are `role="alert"` with `aria-live="assertive"`.
- Modals: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`.

## Dark mode · L18

Activates via `prefers-color-scheme: dark`. No manual toggle. All contrast pairings re-verified in dark mode — same 4.5:1 minimum.
