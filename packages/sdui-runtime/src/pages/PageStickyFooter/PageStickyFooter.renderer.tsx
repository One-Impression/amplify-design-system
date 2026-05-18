import React, { useEffect } from "react";
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  RefreshControl,
  View,
  StyleSheet,
} from "react-native";
import type { Page } from "@one-impression/sdk-native-sdui";
import { Interpreter } from "../../interpreter/index.js";
import { useActionEngine } from "../../action-engine/useActionEngine.js";
import { useBottomSheetStore } from "../../bottom-sheet/useBottomSheetStore.js";
import { usePageRefresh } from "../../hooks/usePageRefresh.js";
import { useAppStateSession } from "../../hooks/useAppStateSession.js";

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
  footer: {
    // Footer is pinned at the bottom, outside the scroll area
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
  const bottomSheetStore = useBottomSheetStore();
  const { refreshing, onRefresh } = usePageRefresh(page.on_refresh);

  const pageData = page.data as
    | { footer?: unknown; keyboard_aware?: boolean }
    | undefined;
  const footer = pageData?.footer;
  const keyboardAware = pageData?.keyboard_aware ?? false;

  // Register inline bottom sheets
  useEffect(() => {
    if (page.bottom_sheets) {
      for (const sheet of page.bottom_sheets) {
        bottomSheetStore.open({
          id: sheet.id,
          title: sheet.title,
          size: sheet.size ?? "medium",
          items: sheet.items ?? [],
          on_dismiss: sheet.on_dismiss,
          on_open: sheet.on_open,
        });
        bottomSheetStore.close(sheet.id);
      }
    }
  }, [page.bottom_sheets, bottomSheetStore]);

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
      refreshControl={
        page.on_refresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
    >
      {page.items.map((node, i) => (
        <Interpreter key={node.id ?? `item-${i}`} node={node} />
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
      {wrappedBody}
      {footer ? (
        <View style={styles.footer}>
          <Interpreter node={footer as any} />
        </View>
      ) : null}
    </View>
  );
}
