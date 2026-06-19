import React, { useCallback, useEffect } from "react";
import { BackHandler, ScrollView, RefreshControl, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { sdui } from "@one-impression/tokens-creator/react-native";
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

/**
 * Standard scrollable page layout.
 * Legacy equivalent: PageType1.
 *
 * Renders page.items inside a ScrollView with pull-to-refresh support.
 * Registers inline bottom sheets on mount and handles back-press + app-state lifecycle triggers.
 */
export function PageStandardRenderer({ page }: PageProps): React.ReactElement {
  const actionEngine = useActionEngine();
  const register = useBottomSheetStore((s) => s.register);
  const unregister = useBottomSheetStore((s) => s.unregister);
  const { refreshing, onRefresh } = usePageRefresh(page.on_refresh);
  const insets = useSafeAreaInsets();

  // Per-instance store entry (keyed by route.key) so reload_section /
  // replace_node / append_items flow back into the render without clobbering
  // other stacked screens. Register + activate on mount, drop on unmount,
  // re-claim active focus on navigation back. Prop is the fallback until sync.
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

  // Register inline bottom sheets so sheet actions can open them later.
  // Sheets are pre-registered (not opened) — the sheet action handler
  // resolves them from the store registry by id. The cleanup path
  // unregisters them on page unmount so navigating away does not leave
  // orphan entries in the registry.
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
      return true; // Prevent default back behavior
    };
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handler,
    );
    return () => subscription.remove();
  }, [actionEngine, page.on_back_press]);

  // Optional pinned top header SLOT — symmetric with the sticky footer slot.
  // When present the runtime hides the native nav header (see SduiNavigationHost)
  // and this wire snippet owns the top chrome (safe-area inset + background).
  const header = (page.data as { header?: Node } | undefined)?.header;

  return (
    <View style={{ flex: 1 }}>
      {header ? <Interpreter node={header} /> : null}
      <ScrollView
        style={{ flex: 1 }}
        // Deliver taps to children even while the keyboard is open — otherwise a
        // tap on an in-page action (e.g. an inline "Verify" beside a text field)
        // is swallowed to dismiss the keyboard and the press never fires. With
        // "handled", taps on non-interactive areas still dismiss the keyboard.
        keyboardShouldPersistTaps="handled"
        // Bottom safe-area inset + a base buffer so the last item clears the home
        // indicator with breathing room. Applied to every scroll page by default.
        contentContainerStyle={{ paddingBottom: insets.bottom + sdui.spacing.lg }}
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
    </View>
  );
}
