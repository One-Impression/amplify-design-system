import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View, StatusBar } from "react-native";
import { sdui } from "@one-impression/tokens-creator/react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  type NativeStackNavigationOptions,
  type NativeStackScreenProps,
} from "@react-navigation/native-stack";
import type { Page } from "@one-impression/sdk-native-sdui";
import { PageRoot } from "../interpreter/index.js";
import { DefaultPageSkeleton } from "../loaders/index.js";
import {
  navigationRef,
  pushSheet,
  popSheet,
  SDUI_PAGE_ROUTE,
  SDUI_SHEET_ROUTE,
  type SduiRootParamList,
} from "./navigationRef.js";
import { SduiSheetScreen } from "./SduiSheetScreen.js";
import { setSheetPresenter } from "./sheetPresenter.js";
import {
  rebuildSurfaceIndex,
  registerSurfaceReload,
  setNavigationAccessor,
} from "./surfaceRegistry.js";

/**
 * Resolve a screenId (a `navigate` target) to its Page envelope. May be
 * synchronous (in-memory fixtures) OR async (fetch the page JSON from a BFF) —
 * the host renders a loading skeleton while a returned promise is pending and an
 * error view if it rejects. This is what makes navigation fully data-driven: the
 * app only wires *how* to load a page by id, not a static per-page registry.
 */
export type ResolvePage = (
  screenId: string,
) => Page | undefined | Promise<Page | undefined>;

export interface SduiNavigationHostProps {
  /** Resolve a screenId to its Page envelope. Sync or async — see {@link ResolvePage}. */
  resolvePage: ResolvePage;
  /** The first screen shown. */
  initialScreenId: string;
  /**
   * When true (default) the host provides its own NavigationContainer — for apps
   * with no navigator of their own. Set false to nest under an existing
   * container (e.g. expo-router).
   */
  standalone?: boolean;
  /** Native-stack screen options (animation, header, gestures). Sensible native defaults applied. */
  screenOptions?: NativeStackNavigationOptions;
}

/**
 * Stacked native-header title used when a navigate action supplies a subtitle
 * (native-stack has no built-in subtitle). Rendered on the branded header bg, so
 * it uses the inverse tint; the subtitle is the same color, dimmed. Only used
 * when a subtitle is present — titles without one keep the plain string header.
 */
function SduiHeaderTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}): React.ReactElement {
  return (
    <View style={styles.headerTitleWrap}>
      <Text style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={styles.headerSubtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const Stack = createNativeStackNavigator<SduiRootParamList>();

type PageScreenProps = NativeStackScreenProps<SduiRootParamList, "SduiPage">;

function makePageScreen(resolvePage: ResolvePage) {
  return function SduiPageScreen({
    route,
    navigation,
  }: PageScreenProps): React.ReactElement {
    const screenId = route.params?.screenId;
    // The path-direct fetch handle. `screenId` is the surface NAME (used by the
    // by-name index for reload-by-name); `contentPath` is the concrete BFF path
    // the navigate action carried (`params.path` → route `contentPath`). Fetch
    // by the path when present, falling back to screenId for surfaces whose
    // name IS their path (e.g. the initial screen).
    const contentPath = route.params?.contentPath;
    const fetchKey = contentPath ?? screenId;
    const [page, setPage] = useState<Page | undefined>(undefined);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);
    // Bumped by reload-by-name to re-run the load effect (refetch this page
    // instance). The route stack stays authoritative for presence; this only
    // re-triggers the page's OWN fetch.
    const [reloadNonce, setReloadNonce] = useState(0);

    // Register this page route's refetch handler so reload-by-name targeting
    // the page's name (screenId) can refresh it. Keyed by route.key so multiple
    // open instances of the same page each refetch independently.
    useEffect(
      () => registerSurfaceReload(route.key, () => setReloadNonce((n) => n + 1)),
      [route.key],
    );

    // Load the page for this screenId. Re-runs if the route's screenId changes
    // or a reload-by-name bumps the nonce. A sync resolvePage resolves on the
    // first microtask; an async one drives the skeleton → render / error
    // transition.
    useEffect(() => {
      let alive = true;
      setLoading(true);
      setError(null);
      setPage(undefined);
      Promise.resolve(resolvePage(fetchKey))
        .then((p) => {
          if (!alive) return;
          setPage(p ?? undefined);
          setLoading(false);
        })
        .catch((e: unknown) => {
          if (!alive) return;
          setError(e instanceof Error ? e : new Error(String(e)));
          setLoading(false);
        });
      return () => {
        alive = false;
      };
    }, [fetchKey, reloadNonce]);

    // Reflect the loaded page's title in the native header once it arrives
    // (the static screen options can't know it before the fetch resolves).
    // When the page declares a wire header SLOT (`data.header`), hide the native
    // nav header entirely — the wire `page_header` snippet owns the top chrome
    // (safe-area inset + background), symmetric with the footer slot.
    useEffect(() => {
      // The page owns its top chrome if it renders a header zone — either the
      // header content (`data.header`) OR, in the shell-first UI-zone model, a
      // header placeholder (`data.header_skeleton`) that a `reload` fills in.
      // Either way, hide the native nav header so it doesn't double up with the
      // wire `page_header`.
      const data = page?.data as
        | { header?: unknown; header_skeleton?: unknown }
        | undefined;
      const hasWireHeader = !!data?.header || !!data?.header_skeleton;
      navigation.setOptions({ headerShown: !hasWireHeader });
      if (!hasWireHeader) {
        // Reconcile the loaded page into the native header: the page's own title
        // wins for the title; the action-supplied subtitle (loading chrome)
        // persists since the page has no wire-header subtitle of its own. With a
        // subtitle present, render the stacked component; else the plain string.
        const title = page?.title ?? route.params?.title;
        const subtitle = route.params?.subtitle;
        if (title && subtitle) {
          navigation.setOptions({
            headerTitle: () => (
              <SduiHeaderTitle title={title} subtitle={subtitle} />
            ),
          });
        } else if (title) {
          navigation.setOptions({ title });
        }
      }
    }, [page, navigation, route.params?.title, route.params?.subtitle]);

    if (loading) return <DefaultPageSkeleton />;
    if (error) {
      return (
        <View style={styles.missing}>
          <Text style={styles.missingTitle}>Couldn’t load</Text>
          <Text style={styles.missingId}>{screenId}</Text>
          <Text style={styles.missingErr}>{error.message}</Text>
        </View>
      );
    }
    if (!page) {
      return (
        <View style={styles.missing}>
          <Text style={styles.missingTitle}>No screen for</Text>
          <Text style={styles.missingId}>{screenId}</Text>
        </View>
      );
    }
    return <PageRoot page={page} />;
  };
}

function SduiNavigator({
  resolvePage,
  initialScreenId,
  screenOptions,
}: Pick<
  SduiNavigationHostProps,
  "resolvePage" | "initialScreenId" | "screenOptions"
>): React.ReactElement {
  const PageScreen = useMemo(() => makePageScreen(resolvePage), [resolvePage]);
  return (
    <>
      {/* Inverse app chrome by default: branded header bg + light title/icons,
          and a matching light-content status bar. App/runtime-owned (device
          chrome, not page content); a consumer can override via screenOptions. */}
      <StatusBar barStyle="light-content" backgroundColor={sdui.color.primary} />
      <Stack.Navigator
        screenOptions={{
          animation: "slide_from_right",
          gestureEnabled: true,
          headerStyle: { backgroundColor: sdui.color.primary },
          headerTintColor: sdui.color.neutralInverse,
          ...screenOptions,
        }}
      >
      <Stack.Screen
        name={SDUI_PAGE_ROUTE}
        component={PageScreen}
        initialParams={{ screenId: initialScreenId }}
        // Per-navigation transition is set synchronously from the route params
        // so the navigate action can pick the animation/presentation per push.
        // The title starts as the screenId placeholder and is replaced with the
        // page's real title once the (possibly async) load resolves — see the
        // navigation.setOptions in SduiPageScreen.
        options={({ route }) => {
          // Header chrome shown DURING the shimmer (synchronously, before the
          // page document is fetched). Prefer the navigate-supplied title; fall
          // back to the route name only when the action carried none (legacy).
          // A subtitle upgrades the header to the stacked custom component; with
          // no subtitle we keep the plain string title so existing pages render
          // exactly as before.
          const title = route.params?.title ?? route.params?.screenId ?? "";
          const subtitle = route.params?.subtitle;
          return {
            ...(subtitle
              ? {
                  headerTitle: () => (
                    <SduiHeaderTitle title={title} subtitle={subtitle} />
                  ),
                }
              : { title }),
            ...(route.params?.transition
              ? { animation: route.params.transition as never }
              : {}),
            ...(route.params?.presentation
              ? { presentation: route.params.presentation as never }
              : {}),
          };
        }}
      />
      {/* Bottom sheets are routes too — presented over the page as a
          transparentModal so the page stays visible behind the dimmed
          backdrop. Header hidden + gestures off so gorhom owns the drag. */}
      <Stack.Screen
        name={SDUI_SHEET_ROUTE}
        component={SduiSheetScreen}
        options={{
          presentation: "transparentModal",
          animation: "fade",
          headerShown: false,
          gestureEnabled: false,
          contentStyle: styles.transparent,
        }}
      />
      </Stack.Navigator>
    </>
  );
}

/**
 * Runtime-owned navigation host. Owns the page stack + native transitions, folds
 * `sheet` actions into one back model, and mounts the bottom-sheet host. See
 * ./README.md.
 */
export function SduiNavigationHost({
  resolvePage,
  initialScreenId,
  standalone = true,
  screenOptions,
}: SduiNavigationHostProps): React.ReactElement {
  // Route the `sheet` / `dismiss` action handlers at the native stack: opening a
  // sheet pushes a transparentModal SduiSheet route; dismissing pops it. Android
  // hardware-back and swipe-back are handled natively by the stack for the
  // focused route — no separate BackHandler needed.
  useEffect(() => setSheetPresenter(pushSheet, popSheet), []);

  // Wire the surface registry's read accessor to the live navigationRef so the
  // by-name index reads the real route stack (the single source of truth). Done
  // here rather than in surfaceRegistry's module scope so that module stays free
  // of the react-navigation import (keeps its resolution logic unit-testable).
  useEffect(() => {
    setNavigationAccessor({
      isReady: () => navigationRef.isReady(),
      getRoutes: () =>
        navigationRef.isReady() ? (navigationRef.getState()?.routes ?? []) : [],
      getCurrentRouteKey: () =>
        navigationRef.isReady() ? navigationRef.getCurrentRoute()?.key : undefined,
    });
  }, []);

  // Maintain the by-name surface index from a SINGLE navigation `state`
  // listener. The route stack stays the single source of truth; the index is a
  // derived read structure (see surfaceRegistry). `addListener('state', …)`
  // fires on every push/pop/replace; we also rebuild once on `onReady` so the
  // initial route is indexed before any reload-by-name can target it.
  const handleStateChange = () => rebuildSurfaceIndex();

  const navigator = (
    <SduiNavigator
      resolvePage={resolvePage}
      initialScreenId={initialScreenId}
      screenOptions={screenOptions}
    />
  );

  return standalone ? (
    <NavigationContainer
      ref={navigationRef}
      onReady={handleStateChange}
      onStateChange={handleStateChange}
    >
      {navigator}
    </NavigationContainer>
  ) : (
    // Nested mode: no container of our own to hang onReady/onStateChange on.
    // Attach the same single `state` listener directly to the shared ref.
    <NestedSurfaceIndexListener>{navigator}</NestedSurfaceIndexListener>
  );
}

/**
 * Non-standalone host: the consumer owns the NavigationContainer, so we can't
 * use its onReady/onStateChange. Attach the same single `state` listener to the
 * shared `navigationRef` once it's ready, and rebuild immediately.
 */
function NestedSurfaceIndexListener({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  useEffect(() => {
    if (!navigationRef.isReady()) return;
    rebuildSurfaceIndex();
    const unsub = navigationRef.addListener("state", () => rebuildSurfaceIndex());
    return unsub;
  }, []);
  return <>{children}</>;
}

const styles = StyleSheet.create({
  headerTitleWrap: { alignItems: "center", justifyContent: "center" },
  headerTitle: {
    color: sdui.color.neutralInverse,
    fontSize: 17,
    fontWeight: "600",
  },
  headerSubtitle: {
    color: sdui.color.neutralInverse,
    opacity: 0.8,
    fontSize: 12,
    marginTop: 1,
  },
  missing: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  missingTitle: { fontSize: 14, color: "#888" },
  missingId: { fontSize: 13, color: "#C00", marginTop: 6 },
  missingErr: { fontSize: 12, color: "#999", marginTop: 10, textAlign: "center" },
  transparent: { backgroundColor: "transparent" },
});
