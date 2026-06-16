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

const Stack = createNativeStackNavigator<SduiRootParamList>();

type PageScreenProps = NativeStackScreenProps<SduiRootParamList, "SduiPage">;

function makePageScreen(resolvePage: ResolvePage) {
  return function SduiPageScreen({
    route,
    navigation,
  }: PageScreenProps): React.ReactElement {
    const screenId = route.params?.screenId;
    const [page, setPage] = useState<Page | undefined>(undefined);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);

    // Load the page for this screenId. Re-runs if the route's screenId changes
    // (it doesn't for a given screen instance, but this keeps it correct). A
    // sync resolvePage resolves on the first microtask; an async one drives the
    // skeleton → render / error transition.
    useEffect(() => {
      let alive = true;
      setLoading(true);
      setError(null);
      setPage(undefined);
      Promise.resolve(resolvePage(screenId))
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
    }, [screenId]);

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
      if (page?.title && !hasWireHeader) {
        navigation.setOptions({ title: page.title });
      }
    }, [page, navigation]);

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
        options={({ route }) => ({
          title: route.params?.screenId ?? "",
          ...(route.params?.transition
            ? { animation: route.params.transition as never }
            : {}),
          ...(route.params?.presentation
            ? { presentation: route.params.presentation as never }
            : {}),
        })}
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

  const navigator = (
    <SduiNavigator
      resolvePage={resolvePage}
      initialScreenId={initialScreenId}
      screenOptions={screenOptions}
    />
  );

  return standalone ? (
    <NavigationContainer ref={navigationRef}>{navigator}</NavigationContainer>
  ) : (
    navigator
  );
}

const styles = StyleSheet.create({
  missing: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  missingTitle: { fontSize: 14, color: "#888" },
  missingId: { fontSize: 13, color: "#C00", marginTop: 6 },
  missingErr: { fontSize: 12, color: "#999", marginTop: 10, textAlign: "center" },
  transparent: { backgroundColor: "transparent" },
});
