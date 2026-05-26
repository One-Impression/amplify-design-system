import React, { useEffect } from "react";
import { BackHandler, ScrollView, RefreshControl } from "react-native";
import type { Page } from "@one-impression/sdk-native-sdui";
import { Interpreter } from "../../interpreter/index.js";
import { useActionEngine } from "../../action-engine/useActionEngine.js";
import { useBottomSheetStore } from "../../bottom-sheet/useBottomSheetStore.js";
import { usePageRefresh } from "../../hooks/usePageRefresh.js";
import { useAppStateSession } from "../../hooks/useAppStateSession.js";

interface PageProps {
  page: Page;
}

/**
 * Standard scrollable page layout.
 * Legacy equivalent: PageType1.
 *
 * Renders page.items inside a ScrollView with pull-to-refresh support.
 * Registers inline bottom sheets on mount and handles back-press + app-state lifecycle triggers.
 */
export function PageStandardRenderer({ page }: PageProps): React.ReactElement {
  const actionEngine = useActionEngine();
  const bottomSheetStore = useBottomSheetStore();
  const { refreshing, onRefresh } = usePageRefresh(page.on_refresh);

  // Register inline bottom sheets so sheet actions can open them later.
  // Sheets are pre-registered (not opened) — the sheet action handler
  // resolves them from the store registry by id.
  useEffect(() => {
    if (page.bottom_sheets) {
      for (const sheet of page.bottom_sheets) {
        bottomSheetStore.register(sheet.id, {
          id: sheet.id,
          title: sheet.title,
          size: sheet.size ?? "medium",
          items: sheet.items ?? [],
          on_dismiss: sheet.on_dismiss,
          on_open: sheet.on_open,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page.bottom_sheets]);

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
      return true; // Prevent default back behavior
    };
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handler,
    );
    return () => subscription.remove();
  }, [actionEngine, page.on_back_press]);

  return (
    <ScrollView
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
}
