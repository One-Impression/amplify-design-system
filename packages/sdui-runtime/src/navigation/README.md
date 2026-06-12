# SDUI Navigation

A reusable, runtime-owned navigation layer so **every** SDUI app gets the same
clean, near-native navigation experience without re-implementing it per app.

## Why this lives in the runtime (not in each app's `_layout`)

Before this module, navigation was delegated to each consumer: the action-engine
`navigate` handler called `config.onNavigate(op, target, params)` and the app
decided what to do (push a route, etc.); sheets were a separate overlay via
`useBottomSheetStore` + `BottomSheetHost`. That meant two stacks and, crucially,
**the transition quality was the app's problem** — so navigation looked and felt
different (or bland) per app.

This module makes the runtime **own the whole interaction**: when a `navigate`
click-action fires, the runtime owns the stack push/pop **and** the native UI
transition; when a `sheet` action fires, the runtime owns the present/dismiss and
folds it into one back model. Apps mount one host and inherit the experience.

## What delivers the "native feel"

- **Pages** — `@react-navigation/native-stack` riding on `react-native-screens`.
  This produces real platform transitions (UINavigationController push on iOS,
  Fragment transitions on Android) + swipe-to-go-back + the OS back button. It is
  NOT a JS animation — that's the difference between "smooth" and "bland".
- **Bottom sheets** — also native-stack routes (presented `transparentModal`), with
  gorhom's *non-modal* `BottomSheet` rendered **inside** the route purely for the
  drag gesture, snap points, and dimmed backdrop. See "Sheets are routes" below.

## Per-navigation transitions

A `navigate` action can carry `transition` and/or `presentation` in its `params`;
`applyNavigate` threads them onto the pushed route and the `SduiPage` screen's
`options` apply them synchronously per push:

- `transition` → native-stack `animation`: `slide_from_right` (iOS default),
  `slide_from_bottom`, `fade`, `fade_from_bottom`, `flip`, `simple_push`, `none`.
- `presentation` → `card` | `modal` | `transparentModal` | `formSheet`.

This is how a server (or a fixture) chooses "push from the right" vs "push from the
bottom" per navigation without any app code. The default is `slide_from_right`.

## Sheets are routes — the structural model

A bottom sheet is a **native-stack route** (`SduiSheet`, presented
`transparentModal` so the page stays visible behind a dimmed backdrop). Its
*presence is the route existing on the stack*. gorhom's non-modal `BottomSheet`
lives inside the route only for the drag gesture + snap points + backdrop.

This is deliberately NOT the old gorhom-`BottomSheetModal` host, which bridged a
declarative `open` flag to imperative `present()` / `dismiss()` via a `useEffect`.
That bridge could desync: a pull-down dismiss left a transparent full-screen
container mounted that ate every subsequent touch, and Android hardware-back
didn't reach it. Making the sheet a route removes the imperative bridge entirely:

> Every dismissal path — drag-to-close, **backdrop tap**, **hardware-back**,
> swipe-back, and a programmatic `dismiss` action — funnels through a single
> `navigation.goBack()` that pops the route. One source of truth, no desync.

`goBack()` therefore needs no special sheet-handling: popping the top route pops a
sheet if one is on top, else a page. It's wired to any custom affordance.

### Tappable overlay with a click-action

The dimmed backdrop carries a server-driven `overlay_on_click` action (declared on
the page's `bottom_sheets[]` entry, falling back to `on_dismiss`). Tapping the
overlay fires that action and then closes the sheet. With neither field set,
tapping the overlay simply dismisses — the platform-standard behaviour.

> Why the reversal from the earlier "rejected" note: the gorhom-modal coordinator
> was rejected-then-adopted only as long as the modal host behaved. Once the
> imperative bridge proved to desync (dead-touch overlay, hardware-back miss), the
> route model became the correct structural fix. gorhom is still shipped for sheet
> *content* (`BottomSheetContext`, `BottomSheetScrollView`, snap points) — it just
> no longer owns *presence*.

A legacy store-based path (`BottomSheetHost` + `useBottomSheetStore.open/close`)
remains for apps that mount the gorhom host directly rather than `SduiNavigationHost`;
`presentSheet` / `dismissSheet` pick the route-based host when it's registered and
fall back to the store otherwise.

## API

```tsx
import { SduiNavigationHost } from "@one-impression/sdui-runtime";

<SduiNavigationHost
  resolvePage={(screenId) => fetchPageJson(screenId)}  // screenId -> Promise<Page>
  initialScreenId="catalog.home"
/>
```

`resolvePage` may be **synchronous** (in-memory fixtures: `(id) => SCREENS[id]`) **or
async** (`(id) => fetch(...).then(r => r.json())`). When it returns a promise, the host
renders a loading skeleton while pending and an error view if it rejects; the page's real
title is set on the native header once the load resolves. This is what makes navigation
fully data-driven — every `navigate` target (and the initial screen) is loaded the same
way, with no static per-page registry. The only thing the app wires is *how* to load a page
by id + which screen to load first.

- The `navigate` action drives the host via `applyNavigate(op, target, params)` →
  `push | replace | pop | pop_to_root` on the native stack (`params.transition` /
  `params.presentation` choose the animation). Wire it once by passing
  `applyNavigate` as `SduiRuntimeProvider`'s `onNavigate`.
- The host registers a route-based sheet presenter on mount, so `sheet` /
  `dismiss` actions push/pop the `SduiSheet` route automatically — no separate
  sheet host to mount.

## Standalone vs nested (composing with expo-router)

- **Standalone** (`standalone` default): the host provides its own
  `NavigationContainer` — for apps with no navigator of their own (e.g. the SDUI
  playground). Batteries included.
- **Nested**: production apps like `amplify-creator-app` use `expo-router`, which
  already owns the root `NavigationContainer`. There the host mounts as a nested
  navigator (no second container). Configure `screenOptions.headerShown` to avoid
  a double header. *(Nested wiring lands when creator-app migrates; standalone is
  the first supported + validated path via the playground.)*

## Dependencies

`@react-navigation/native`, `@react-navigation/native-stack`,
`react-native-screens`, `react-native-safe-area-context`, and
`react-native-gesture-handler` are **peer dependencies** — a deliberate statement
that "SDUI navigation is native-stack-based." creator-app already has them (via
expo-router); other apps install them to use the host.
