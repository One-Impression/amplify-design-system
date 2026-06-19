import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
  type BottomSheetFooterProps,
} from "@gorhom/bottom-sheet";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { resolveSpacing } from "@one-impression/ui-native";
import type { Action, Node } from "@one-impression/sdk-native-sdui";
import { Interpreter } from "../interpreter/index.js";
import { GutterItem, PAGE_GUTTER_TOKEN } from "../layout/page-gutter.js";
import { useActionEngine } from "../action-engine/useActionEngine.js";
import { useBffConfig } from "../action-engine/useBffConfig.js";
import { BottomSheetContext } from "../bottom-sheet/BottomSheetContext.js";
import {
  useBottomSheetStore,
  type SheetEntry,
} from "../bottom-sheet/useBottomSheetStore.js";
import type { SduiRootParamList } from "./navigationRef.js";
import { registerSurfaceReload } from "./surfaceRegistry.js";
import { fetchSurfaceDocument } from "./fetchSurfaceDocument.js";
import { ListRowsSkeleton } from "../loaders/index.js";

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
  // Addressable sheets carry a content `path`: they fetch their OWN document on
  // open instead of reading the static registry. The route's existence is
  // authoritative for presence either way (B5).
  const contentPath = route.params?.contentPath;
  const isAddressable = !!contentPath;

  const staticSheet = useBottomSheetStore((s) => s.registry[sheetId]);
  const actionEngine = useActionEngine();
  const { bffBaseUrl, authToken } = useBffConfig();
  const sheetRef = useRef<BottomSheet>(null);
  // goBack() is idempotent-guarded: drag-close fires onClose AND the route may
  // already be popping, so guard against a double-pop.
  const poppedRef = useRef(false);

  // Fetched document for an addressable sheet (null until the first fetch
  // resolves). Static sheets ignore this and read the registry directly.
  const [fetched, setFetched] = useState<SheetEntry | null>(null);

  // Fetch the sheet's own document path-direct. Used on open and by
  // reload-by-name. Maps the fetched JSON into the SheetEntry render shape.
  // `queryParams` (reload-by-name only) ride into the refetch so the document
  // can reflect what the triggering action passed (e.g. a just-picked address);
  // the initial open passes none.
  const fetchContent = useCallback(
    (queryParams?: Record<string, unknown>) => {
    if (!contentPath) return;
    // Clear to the loading state on EVERY fetch — initial open AND reload-by-name
    // — so the sheet shows its shimmer as feedback that it's (re)loading, matching
    // the page screen's reload behavior. Content swaps back in when the fetch
    // resolves.
    setFetched(null);
    fetchSurfaceDocument<Partial<SheetEntry> & { items?: Node[] }>(
      bffBaseUrl,
      authToken,
      contentPath,
      queryParams,
    )
      .then((doc) => {
        setFetched({
          id: doc.id ?? sheetId,
          title: doc.title,
          size: doc.size ?? "medium",
          items: doc.items ?? [],
          header: doc.header,
          footer: doc.footer,
          on_dismiss: doc.on_dismiss,
          on_open: doc.on_open,
          overlay_on_click: doc.overlay_on_click,
        });
      })
      .catch((e: unknown) => {
        // eslint-disable-next-line no-console
        console.warn(
          `[SduiSheetScreen] failed to fetch content for "${sheetId}" (${contentPath}):`,
          e,
        );
      });
  }, [contentPath, bffBaseUrl, authToken, sheetId]);

  // The effective sheet: the fetched document for addressable sheets, else the
  // static registry entry (legacy path — kept working untouched).
  const sheet = isAddressable ? fetched ?? undefined : staticSheet;

  // Addressable sheets fetch their content once on mount (on_load-style).
  useEffect(() => {
    if (isAddressable) fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Register a reload handler keyed by this route so reload-by-name targeting
  // this sheet's name refetches its document. Only addressable sheets refetch;
  // static sheets have no own-document to refresh.
  useEffect(() => {
    if (!isAddressable) return;
    return registerSurfaceReload(route.key, (opts) =>
      fetchContent(opts?.queryParams),
    );
  }, [isAddressable, route.key, fetchContent]);

  const snapPoints = useMemo(
    () => SIZE_TO_SNAP[sheet?.size ?? "medium"] ?? SIZE_TO_SNAP["medium"],
    [sheet?.size],
  );

  const pop = useCallback(() => {
    if (poppedRef.current) return;
    poppedRef.current = true;
    if (navigation.canGoBack()) navigation.goBack();
  }, [navigation]);

  // on_open lifecycle. Static sheets: fire once on mount (definition is already
  // in the registry). Addressable sheets: fire once the fetched document
  // arrives (its on_open ships in that document).
  const openFiredRef = useRef(false);
  useEffect(() => {
    if (openFiredRef.current) return;
    if (isAddressable && !fetched) return; // wait for the document
    if (sheet?.on_open) actionEngine.dispatch(sheet.on_open as Action);
    openFiredRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddressable, fetched]);

  // Defensive: a STATIC sheet id with no registered definition just closes the
  // route. Addressable sheets are intentionally empty until their fetch
  // resolves — never auto-pop them while the document is loading.
  useEffect(() => {
    if (isAddressable) return;
    if (!sheet) pop();
  }, [isAddressable, sheet, pop]);

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

  // Addressable sheet still fetching its document → PRESENT the sheet now (so it
  // animates open immediately) showing a shimmer skeleton; swap in content when
  // the fetch resolves. Only a STATIC sheet with no definition renders nothing
  // (its auto-pop effect closes the route).
  const loading = isAddressable && !fetched;
  if (!loading && !sheet) return null;

  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableDynamicSizing={false}
      onClose={handleClose}
      backdropComponent={renderBackdrop}
      footerComponent={!loading && sheet?.footer ? renderFooter : undefined}
    >
      <BottomSheetContext.Provider value={{ insideSheet: true }}>
        {loading || !sheet ? (
          // Loading state: sheet is open, content is in flight → show the
          // action-supplied title/subtitle (so the opening sheet reads properly,
          // not blank) above the shimmer rows. The fetched document's own
          // header/title takes over once it arrives.
          <BottomSheetScrollView contentContainerStyle={styles.content}>
            {route.params?.title ? (
              <Text style={styles.title}>{route.params.title}</Text>
            ) : null}
            {route.params?.subtitle ? (
              <Text style={styles.subtitle}>{route.params.subtitle}</Text>
            ) : null}
            <ListRowsSkeleton />
          </BottomSheetScrollView>
        ) : (
          <>
            {/* Pinned header SLOT — a wire `bottom_sheet_header` snippet rendered
                OUTSIDE the scroll area so it (and any search field it carries)
                stays put as `items` scroll. Symmetric with the footer slot.
                Replaces the plain `title` text when present. */}
            {sheet.header ? <Interpreter node={sheet.header} /> : null}
            <BottomSheetScrollView
              contentContainerStyle={[
                // No horizontal padding here — each item's GutterItem owns the
                // page gutter, so sheet content aligns with page layouts.
                styles.scrollBody,
                // Reserve room so the last item isn't hidden behind the pinned footer.
                sheet.footer && styles.contentWithFooter,
              ]}
            >
              {!sheet.header && sheet.title ? (
                <Text style={[styles.title, styles.titleInset]}>
                  {sheet.title}
                </Text>
              ) : null}
              {/* Wrap each item in GutterItem so sheet content shares the page's
                  gutter + inter-item gap model (incl. the section_header
                  GAP_OVERRIDES). The route-based sheet was outside that system,
                  so its section headers got no vertical gap. */}
              {sheet.items.map((node, i) => (
                <GutterItem key={node.id ?? i} node={node} index={i}>
                  <Interpreter node={node} />
                </GutterItem>
              ))}
            </BottomSheetScrollView>
          </>
        )}
      </BottomSheetContext.Provider>
    </BottomSheet>
  );
}

const PAGE_GUTTER_PX = resolveSpacing(PAGE_GUTTER_TOKEN) ?? 12;

const styles = StyleSheet.create({
  // Loading branch — skeleton/title/subtitle aren't GutterItem-wrapped, so inset
  // them at the page gutter to match the loaded content's alignment.
  content: { paddingHorizontal: PAGE_GUTTER_PX, paddingBottom: 32 },
  // Loaded content branch — each item's GutterItem owns the horizontal inset.
  scrollBody: { paddingBottom: 32 },
  contentWithFooter: { paddingBottom: 96 },
  title: { fontSize: 18, fontWeight: "700", paddingTop: 12 },
  titleInset: { paddingHorizontal: PAGE_GUTTER_PX },
  subtitle: { fontSize: 13, color: "#666", paddingBottom: 8 },
});
