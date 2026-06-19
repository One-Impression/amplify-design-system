import React, { useCallback, useEffect } from "react";
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  RefreshControl,
  View,
  StyleSheet,
} from "react-native";
import type { Page, Node } from "@one-impression/sdk-native-sdui";
import { Interpreter } from "../../interpreter/index.js";
import { GutterItem } from "../../layout/page-gutter.js";
import { useActionEngine } from "../../action-engine/useActionEngine.js";
import { useBottomSheetStore } from "../../bottom-sheet/useBottomSheetStore.js";
import { usePageRefresh } from "../../hooks/usePageRefresh.js";
import { useAppStateSession } from "../../hooks/useAppStateSession.js";
import { usePageStore } from "../../state/usePageStore.js";
import { useShallow } from "zustand/react/shallow";
import { useRoute, useFocusEffect } from "@react-navigation/native";

interface PageProps {
  page: Page;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bodyScroll: {
    flex: 1,
  },
});

/**
 * Keyboard-aware page layout with a sticky footer.
 * Legacy equivalent: PageType2.
 *
 * Body items scroll inside a ScrollView while the footer node is pinned
 * at the bottom of the screen. When `keyboard_aware` is true, the body
 * wraps in a KeyboardAvoidingView so the footer stays above the keyboard.
 *
 * Used for forms, checkout flows, and apply-wizard screens.
 */
export function PageStickyFooterRenderer({
  page,
}: PageProps): React.ReactElement {
  const actionEngine = useActionEngine();
  const register = useBottomSheetStore((s) => s.register);
  const unregister = useBottomSheetStore((s) => s.unregister);
  const { refreshing, onRefresh } = usePageRefresh(page.on_refresh);

  // Per-instance store entry (keyed by route.key) so reload_section /
  // replace_node / append_items re-render without clobbering other stacked
  // screens. See PageStandard for the full rationale.
  const instanceKey = useRoute().key;
  const livePage = usePageStore(
    useShallow((s): Page => s.pagesByKey[instanceKey] ?? page),
  );
  useEffect(() => {
    usePageStore.getState().setPageTree(page, instanceKey);
    return () => usePageStore.getState().dropPage(instanceKey);
  }, [page, instanceKey]);
  useFocusEffect(
    useCallback(() => {
      usePageStore.getState().activatePage(instanceKey);
    }, [instanceKey]),
  );

  // Read header/footer from the LIVE page so a section reload that swaps a slot
  // node (e.g. the KYC verify step revealing the footer) re-renders. `keyboard_
  // aware` is a static layout flag, so the prop is fine for it.
  const pageData = livePage.data as
    | { header?: unknown; footer?: unknown; keyboard_aware?: boolean }
    | undefined;
  const header = pageData?.header;
  const footer = pageData?.footer;
  const keyboardAware =
    (page.data as { keyboard_aware?: boolean } | undefined)?.keyboard_aware ??
    false;

  // Register inline bottom sheets (do not open) — see PageStandard for details.
  useEffect(() => {
    if (!page.bottom_sheets) return;
    for (const sheet of page.bottom_sheets) {
      register(sheet.id, {
        id: sheet.id,
        title: sheet.title,
        size: sheet.size ?? "medium",
        items: sheet.items ?? [],
        header: (sheet as { header?: Node }).header,
        footer: (sheet as { footer?: Node }).footer,
        on_dismiss: sheet.on_dismiss,
        on_open: sheet.on_open,
        overlay_on_click: (sheet as { overlay_on_click?: unknown })
          .overlay_on_click,
      });
    }
    return () => {
      if (!page.bottom_sheets) return;
      for (const sheet of page.bottom_sheets) {
        unregister(sheet.id);
      }
    };
  }, [page.bottom_sheets, register, unregister]);

  // Page lifecycle: on_load / on_dismount
  useEffect(() => {
    if (page.on_load) actionEngine.dispatch(page.on_load);
    return () => {
      if (page.on_dismount) actionEngine.dispatch(page.on_dismount);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // App foreground / background triggers
  useAppStateSession(page.on_app_foreground, page.on_app_background);

  // Hardware back-press handler (Android)
  useEffect(() => {
    if (!page.on_back_press) return;
    const handler = () => {
      actionEngine.dispatch(page.on_back_press!);
      return true;
    };
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handler,
    );
    return () => subscription.remove();
  }, [actionEngine, page.on_back_press]);

  const bodyContent = (
    <ScrollView
      style={styles.bodyScroll}
      // Deliver taps to children while the keyboard is open (e.g. an inline
      // field action) instead of swallowing the first tap to dismiss it.
      keyboardShouldPersistTaps="handled"
      refreshControl={
        page.on_refresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
    >
      {livePage.items.map((node, i) => (
        <GutterItem key={node.id ?? `item-${i}`} node={node} index={i}>
          <Interpreter node={node} />
        </GutterItem>
      ))}
    </ScrollView>
  );

  const wrappedBody = keyboardAware ? (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {bodyContent}
    </KeyboardAvoidingView>
  ) : (
    bodyContent
  );

  return (
    <View style={styles.container}>
      {/* Pinned top header SLOT — symmetric with the sticky footer slot below.
          Owns its own top chrome (safe-area + background); the native nav
          header is hidden when this is present (see SduiNavigationHost). */}
      {header ? <Interpreter node={header as any} /> : null}
      {wrappedBody}
      {footer ? <Interpreter node={footer as any} /> : null}
    </View>
  );
}
