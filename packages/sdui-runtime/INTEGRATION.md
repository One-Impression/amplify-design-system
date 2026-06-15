# Integrating SDUI into an app

`@one-impression/sdui-runtime` renders **server-driven screens**: your BFF emits a
page as JSON (the wire contract from `@one-impression/sdk-native-sdui`), and the
runtime renders it, dispatches its actions, and owns navigation. You wire *how* to
load a page and *how* actions reach your app's nav/auth — nothing else.

- **`@one-impression/sdui-runtime`** — renderers, action engine, navigation host, the page scaffold.
- **`@one-impression/sdk-native-sdui`** — the wire schemas + typed builders (Node-safe; used by your BFF too). See [`BFF-CONTRACT.md`](./BFF-CONTRACT.md).

A complete working reference is `apps/sdui-playground` in this repo.

## 1. Install

```sh
npm i @one-impression/sdui-runtime @one-impression/sdk-native-sdui
```

Peer dependencies the app must already have (see this package's `peerDependencies`):
`react`, `react-native`, `@react-navigation/native` + `@react-navigation/native-stack`,
`react-native-screens`, `react-native-safe-area-context`, `react-native-gesture-handler`,
`@gorhom/bottom-sheet`, `@tanstack/react-query`. (`react-native-webview` if you use web-view pages.)

## 2. Metro config — one `react` / `react-native`

The #1 cause of red-screens: more than one copy of `react`/`react-native` in the tree
(invalid-hook / invalid-element errors). In `metro.config.js`, force resolution to the
**app's** copy and watch the workspace:

```js
config.resolver.resolveRequest = (ctx, moduleName, platform) => {
  if (moduleName === "react" || moduleName === "react-native" || moduleName.startsWith("react-native/")) {
    return ctx.resolveRequest({ ...ctx, originModulePath: APP_NODE_MODULES }, moduleName, platform);
  }
  return ctx.resolveRequest(ctx, moduleName, platform);
};
```

See `apps/sdui-playground/metro.config.js` for the full monorepo setup (`watchFolders`, `nodeModulesPaths`, `unstable_enablePackageExports`).

## 3. Provider stack

Wrap the app once. The runtime exposes `SduiRuntimeProvider` (configures the action
engine) and `IconStoreProvider` (fetches + caches the icon manifest):

```tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SduiRuntimeProvider, IconStoreProvider, applyNavigate } from "@one-impression/sdui-runtime";

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

// One source of truth — both the action engine (bff_call / reload) and the icon
// store hit your BFF, so derive both from a single constant (and reuse it in
// resolvePage, §5) rather than repeating the literal.
const BFF_BASE_URL = "https://api.your-app.com";

export function Providers({ children }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <QueryClientProvider client={queryClient}>
            <SduiRuntimeProvider
              bffConfig={{ baseUrl: BFF_BASE_URL }}
              authConfig={{ getToken: () => authStore.accessToken ?? null }}
              telemetryConfig={{ emitter: { emit: (e, p) => analytics.track(e, p) } }}
              onNavigate={(op, target, params) => applyNavigate(op, target, params)}
              onToast={(level, message) => showToast(level, message)}
              onDeeplink={(url) => Linking.openURL(url)}
            >
              <IconStoreProvider bffBaseUrl={BFF_BASE_URL} authToken={authStore.accessToken}>
                {children}
              </IconStoreProvider>
            </SduiRuntimeProvider>
          </QueryClientProvider>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

## 4. What the app supplies (`SduiRuntimeProvider`)

| Prop | What it's for |
|------|---------------|
| `bffConfig.baseUrl` | Base URL the runtime's `bff_call` / `reload` resolve endpoint paths against. |
| `authConfig.getToken()` | Returns the current bearer token (or `null`); the runtime adds `Authorization` on every BFF call. |
| `telemetryConfig.emitter.emit(event, params)` | Where `sdui.node.rendered`, `view_events`, etc. go — wire to your analytics. |
| `onNavigate(op, target, params)` | A `navigate` action lands here. Forward to `applyNavigate` (runtime's native stack) or your own router. |
| `onToast(level, message)` | A `toast` action. |
| `onDeeplink(url)` | A `deeplink` action. |

The runtime also sends `X-Active-Influencer-Id` (when set via `useActiveSocialStore`) and,
for localhost BFFs only, `X-Dev-Identity` — both handled internally.

## 5. Mount the navigation host

`SduiNavigationHost` owns the page stack + native transitions. Give it `resolvePage`
(how to fetch a page by its `navigate` target) and the first screen:

```tsx
import { SduiNavigationHost } from "@one-impression/sdui-runtime";
import type { Page } from "@one-impression/sdk-native-sdui";

// BFF_BASE_URL is the same shared constant from §3.
async function resolvePage(screenId: string): Promise<Page> {
  const res = await fetch(`${BFF_BASE_URL}/sdui/page/${encodeURIComponent(screenId)}`);
  if (!res.ok) throw new Error(`page ${screenId} → ${res.status}`);
  return (await res.json()) as Page;
}

export default function App() {
  return (
    <Providers>
      <SduiNavigationHost resolvePage={resolvePage} initialScreenId="home" />
    </Providers>
  );
}
```

`resolvePage` is the only wired seam — every `navigate` target round-trips through it, so
navigation stays fully data-driven. The host hides its native header automatically when a
page declares a header region (`data.header` or `data.header_skeleton`).

## 6. Registering app-specific snippets

> **Pending the `creator.* → sdui.*` namespace standardization.** Today the core snippet
> registry is keyed under `creator.*`. Once neutralized, the core library is `sdui.*` and an
> app registers its own snippets/ui-components by extending the runtime's registries
> (`snippets` / `ui-components`), with `resolveRenderer` dispatching on the `.snippet.` /
> `.ui_component.` layer segment so app types and core types coexist. This section will be
> finalized when that lands.

## Gotchas
- **Single react/RN** — see §2. The most common red-screen.
- **Icon manifest** — `IconStoreProvider` fetches the glyph manifest from your BFF (`/v1/.../assets/icons-manifest`) into MMKV; bundled essentials cover first paint. Point its `bffBaseUrl` at your BFF.
- **`reload`/`bff_call` use endpoint *ids*, not paths** — the id (e.g. `creator.campaigns.list`) resolves to a path via the SDK's `EndpointPaths`. See [`BFF-CONTRACT.md`](./BFF-CONTRACT.md) §Endpoints.

## Reference
`apps/sdui-playground` is the canonical, runnable integration — `App.tsx`, `src/providers.tsx`,
`src/fixtures/loadPage.ts`, `metro.config.js`, and a mock BFF (`server/fixture-server.mjs`).
