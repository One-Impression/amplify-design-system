import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { StyleSheet, Text } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
  type BottomSheetFooterProps,
} from "@gorhom/bottom-sheet";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { Action } from "@one-impression/sdk-native-sdui";
import { Interpreter } from "../interpreter/index.js";
import { useActionEngine } from "../action-engine/useActionEngine.js";
import { BottomSheetContext } from "../bottom-sheet/BottomSheetContext.js";
import { useBottomSheetStore } from "../bottom-sheet/useBottomSheetStore.js";
import type { SduiRootParamList } from "./navigationRef.js";

const SIZE_TO_SNAP: Record<string, string[]> = {
  small: ["25%"],
  medium: ["50%"],
  large: ["80%"],
  full: ["95%"],
};

type Props = NativeStackScreenProps<SduiRootParamList, "SduiSheet">;

/**
 * A bottom sheet rendered AS a native-stack route (presented `transparentModal`
 * by `SduiNavigationHost`). The sheet's presence is the route's existence on the
 * stack, so every dismissal path — drag-to-close, backdrop tap, hardware-back,
 * swipe-back, a programmatic `dismiss` action — funnels through a single
 * `navigation.goBack()`. There is no imperative present()/dismiss() bridge to
 * desync, which is what left the old gorhom-modal host with a dead full-screen
 * touch-eating overlay after a pull-down dismiss.
 *
 * gorhom's *non-modal* `BottomSheet` lives inside the route purely for the drag
 * gesture, snap points, and the dimmed backdrop. The backdrop carries a
 * server-driven click-action (`overlay_on_click`, falling back to `on_dismiss`).
 */
export function SduiSheetScreen({
  route,
  navigation,
}: Props): React.ReactElement | null {
  const sheetId = route.params?.sheetId;
  const sheet = useBottomSheetStore((s) => s.registry[sheetId]);
  const actionEngine = useActionEngine();
  const sheetRef = useRef<BottomSheet>(null);
  // goBack() is idempotent-guarded: drag-close fires onClose AND the route may
  // already be popping, so guard against a double-pop.
  const poppedRef = useRef(false);

  const snapPoints = useMemo(
    () => SIZE_TO_SNAP[sheet?.size ?? "medium"] ?? SIZE_TO_SNAP["medium"],
    [sheet?.size],
  );

  const pop = useCallback(() => {
    if (poppedRef.current) return;
    poppedRef.current = true;
    if (navigation.canGoBack()) navigation.goBack();
  }, [navigation]);

  // on_open lifecycle — once, on mount.
  useEffect(() => {
    if (sheet?.on_open) actionEngine.dispatch(sheet.on_open as Action);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Defensive: a sheet id with no registered definition just closes the route.
  useEffect(() => {
    if (!sheet) pop();
  }, [sheet, pop]);

  // Backdrop tap: fire the overlay click-action (server-driven) — gorhom's
  // pressBehavior="close" handles the actual close → onClose → pop.
  const handleOverlayPress = useCallback(() => {
    const overlay = (sheet?.overlay_on_click ?? sheet?.on_dismiss) as
      | Action
      | undefined;
    if (overlay) actionEngine.dispatch(overlay);
  }, [sheet, actionEngine]);

  // gorhom close (pan-down-to-close or index → -1): fire on_dismiss, pop route.
  const handleClose = useCallback(() => {
    if (sheet?.on_dismiss) actionEngine.dispatch(sheet.on_dismiss as Action);
    pop();
  }, [sheet, actionEngine, pop]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        onPress={handleOverlayPress}
      />
    ),
    [handleOverlayPress],
  );

  // Sticky footer — pinned at the bottom of the sheet OUTSIDE the scroll area
  // (the same shape a sticky-footer page gives a screen). gorhom's
  // `BottomSheetFooter` keeps it fixed while `items` scroll behind it; the
  // footer node (a `page_footer`) owns its own surface + safe-area inset.
  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) =>
      sheet?.footer ? (
        <BottomSheetFooter {...props}>
          <Interpreter node={sheet.footer} />
        </BottomSheetFooter>
      ) : null,
    [sheet?.footer],
  );

  if (!sheet) return null;

  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableDynamicSizing={false}
      onClose={handleClose}
      backdropComponent={renderBackdrop}
      footerComponent={sheet.footer ? renderFooter : undefined}
    >
      <BottomSheetContext.Provider value={{ insideSheet: true }}>
        {/* Pinned header SLOT — a wire `bottom_sheet_header` snippet rendered
            OUTSIDE the scroll area so it (and any search field it carries)
            stays put as `items` scroll. Symmetric with the footer slot.
            Replaces the plain `title` text when present. */}
        {sheet.header ? <Interpreter node={sheet.header} /> : null}
        <BottomSheetScrollView
          contentContainerStyle={[
            styles.content,
            // Reserve room so the last item isn't hidden behind the pinned footer.
            sheet.footer && styles.contentWithFooter,
          ]}
        >
          {!sheet.header && sheet.title ? (
            <Text style={styles.title}>{sheet.title}</Text>
          ) : null}
          {sheet.items.map((node, i) => (
            <Interpreter key={node.id ?? i} node={node} />
          ))}
        </BottomSheetScrollView>
      </BottomSheetContext.Provider>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 32 },
  contentWithFooter: { paddingBottom: 96 },
  title: { fontSize: 18, fontWeight: "700", paddingVertical: 12 },
});
