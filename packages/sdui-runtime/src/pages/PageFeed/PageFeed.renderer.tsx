import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  BackHandler,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { useShallow } from "zustand/react/shallow";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { sdui } from "@one-impression/tokens-creator/react-native";
import type { Page, Node, Action } from "@one-impression/sdk-native-sdui";
import { Interpreter } from "../../interpreter/index.js";
import { GutterItem } from "../../layout/page-gutter.js";
import { useActionEngine } from "../../action-engine/useActionEngine.js";
import { useTelemetry } from "../../telemetry/useTelemetry.js";
import { useBottomSheetStore } from "../../bottom-sheet/useBottomSheetStore.js";
import { usePageRefresh } from "../../hooks/usePageRefresh.js";
import { useAppStateSession } from "../../hooks/useAppStateSession.js";
import { usePageStore } from "../../state/usePageStore.js";
import { Gradient, type GradientItem } from "../../gradient/index.js";
import { ViewportManagedProvider, fireViewability } from "../../viewport/index.js";
import { extractFeedPageData, type FeedPageData } from "./extractFeedPageData.js";

interface PageProps {
  page: Page;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  /**
   * Wrapping View that holds the gradient (absolute-positioned) behind the
   * body. Mirrors legacy PageType3's outer `View` — flex:1 + position:relative
   * so absolute-filled children paint behind the scroll body.
   */
  outer: {
    flex: 1,
    position: "relative",
  },
  /**
   * Sticky top header region — rendered above the scrolling body, distinct
   * from `items`. Legacy PageType3 keeps `header` (searchBar / profileHeader)
   * outside the scroll view so it stays pinned.
   */
  header: {
    width: "100%",
  },
  /** Body column that scrolls (FlatList) — sits above the gradient. */
  body: {
    flex: 1,
  },
  /**
   * Pinned bottom footer slot. Legacy PageType3 renders `footer` inside
   * `ScreenContainer` *outside* the scroll view, so the footer never moves
   * with scroll content.
   */
  footer: {
    width: "100%",
  },
  filterBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterChip: {
    marginRight: 8,
  },
});

export type { FeedPageData };

/**
 * Infinite-scroll feed page with horizontal filter chips, configurable
 * background (gradient or solid token color), and an optional pinned-bottom
 * footer slot.
 *
 * Legacy equivalent: PageType3.
 *
 * Uses FlatList (not ScrollView) for virtualized rendering of page.items.
 * Supports:
 * - `data.config.gradient`     — absolute-positioned gradient backdrop
 * - `data.config.bg_color`     — solid background token used when no gradient
 * - `data.config.scroll_header_color` — header tint applied while scrolled
 * - `data.footer`              — single Node pinned above the safe area (does
 *                                NOT scroll with the body)
 * - `data.filters`             — horizontal filter chips bar at the top
 * - Infinite scroll via on_load_more action
 * - Loader node displayed while fetching more items
 * - Empty state node when items is empty
 * - Pull-to-refresh via page.on_refresh
 *
 * NOTE: the matching `config` / `footer` schema fields are added on the
 * upstream `@one-impression/sdk-native-sdui` PageFeed schema. Until that
 * package republishes, the renderer reads them through
 * {@link extractFeedPageData} which casts the page `data` to the
 * augmented shape — the cast becomes a no-op once the upstream types
 * catch up.
 */
export function PageFeedRenderer({ page }: PageProps): React.ReactElement {
  const actionEngine = useActionEngine();
  const telemetry = useTelemetry();
  const register = useBottomSheetStore((s) => s.register);
  const unregister = useBottomSheetStore((s) => s.unregister);
  const { refreshing, onRefresh } = usePageRefresh(page.on_refresh);
  const insets = useSafeAreaInsets();
  const [loadingMore, setLoadingMore] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loadingMoreRef = useRef(false);

  // Viewport lifecycle for list items — real visibility via FlatList's
  // onViewableItemsChanged (NOT onLayout). Fires each item's on_view/on_exit
  // triggers per policy; one-shot triggers dedup against `viewFiredRef`. This is
  // how backend-driven infinite scroll works: the BFF puts an `on_view`
  // load-more on the Nth-last card; it fires only when that card is truly seen.
  const viewFiredRef = useRef<Set<string>>(new Set());
  // viewabilityConfig MUST be a stable reference — FlatList throws if it changes.
  const viewabilityConfigRef = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 250,
  });
  const handleViewableItemsChanged = useRef(
    ({ changed }: { changed: { item: Node; isViewable: boolean }[] }) => {
      const deps = {
        fired: viewFiredRef.current,
        dispatch: (a: Action) => actionEngine.dispatch(a),
        emit: (name: string, params?: Record<string, unknown>) =>
          telemetry.emit(name, params),
      };
      for (const { item, isViewable } of changed) {
        fireViewability(item, isViewable ? "view" : "exit", deps);
      }
    },
  ).current;

  const pageData = extractFeedPageData(page.data);
  const { header, filters, on_load_more: onLoadMore, loader, empty_state: emptyState, config, footer } =
    pageData;
  const gradient = config?.gradient as GradientItem | undefined;
  const bgColorToken = config?.bg_color?.type;
  const scrollHeaderColorToken = config?.scroll_header_color?.type;

  // Sync the server-provided page tree into usePageStore on mount / whenever
  // the page prop reference changes. This makes `replaceNode` / `appendItems`
  // (dispatched from action handlers like reload_section / append_items)
  // reactively flow back into this renderer below.
  useEffect(() => {
    usePageStore.getState().setPageTree(page);
  }, [page]);

  // Subscribe to the store for live updates to items. We fall back to the
  // prop value when the store hasn't been populated yet (first render before
  // the setPageTree effect commits) or when the store currently holds a
  // different page (e.g. during a navigation transition). useShallow keeps
  // the read atomic — pageId + items together — so the renderer can't see a
  // torn snapshot under React 18 concurrent rendering.
  const items = usePageStore(
    useShallow((s) => {
      if (s.pageId === page.id && s.page) {
        return s.page.items;
      }
      return page.items;
    }),
  );

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

  // Infinite scroll — dispatch on_load_more when user scrolls near the bottom
  const handleEndReached = useCallback(() => {
    if (!onLoadMore || loadingMoreRef.current) return;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    actionEngine.dispatch(onLoadMore as Action);
    // Reset loading state after timeout as safety net.
    // The BFF response will re-render the page with new/appended items.
    setTimeout(() => {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }, 5000);
  }, [actionEngine, onLoadMore]);

  const renderItem = useCallback(
    ({ item }: { item: Node }) => (
      <GutterItem node={item}>
        <Interpreter node={item} />
      </GutterItem>
    ),
    [],
  );

  const keyExtractor = useCallback(
    (item: Node, index: number) => item.id ?? `feed-item-${index}`,
    [],
  );

  // Footer of the FlatList (NOT the pinned page footer): show loader node
  // while loading more items.
  const renderListFooter = useCallback(() => {
    if (loadingMore && loader) {
      return <Interpreter node={loader} />;
    }
    return null;
  }, [loadingMore, loader]);

  // Empty state when no items
  const renderEmpty = useCallback(() => {
    if (emptyState) {
      return <Interpreter node={emptyState} />;
    }
    return null;
  }, [emptyState]);

  // Filter chips bar rendered as FlatList header. When `data.config.scroll_header_color`
  // is set we tint the filter bar background after the user has scrolled,
  // matching legacy `headerBg` Animated interpolation as a binary toggle.
  const renderHeader = useCallback(() => {
    if (!filters || filters.length === 0) return null;
    const tint =
      gradient && scrolled && scrollHeaderColorToken
        ? { backgroundColor: scrollHeaderColorToken }
        : null;
    return (
      <View style={[styles.filterBar, tint]}>
        {filters.map((filterNode, i) => (
          <View key={filterNode.id ?? `filter-${i}`} style={styles.filterChip}>
            <Interpreter node={filterNode} />
          </View>
        ))}
      </View>
    );
  }, [filters, gradient, scrolled, scrollHeaderColorToken]);

  const handleScroll = useCallback(
    (event: { nativeEvent: { contentOffset: { y: number } } }) => {
      const y = event.nativeEvent.contentOffset.y;
      if (y > 0 && !scrolled) setScrolled(true);
      else if (y <= 0 && scrolled) setScrolled(false);
    },
    [scrolled],
  );

  // Background resolution:
  // - When a gradient is present the gradient itself paints the backdrop.
  // - Else if a token bg_color was provided we apply it as a solid fill.
  // - Else: fall back to default transparent (host page / theme decides).
  const containerStyle =
    !gradient && bgColorToken
      ? [styles.outer, { backgroundColor: bgColorToken }]
      : styles.outer;

  return (
    <View style={containerStyle}>
      {gradient ? <Gradient item={gradient} /> : null}
      {/* Sticky top region above the scrolling body — distinct from `items`.
          Legacy pageType3 renders `header` (searchBar / profileHeader) outside
          the scroll view so it stays pinned. */}
      {header ? (
        <View style={styles.header}>
          <Interpreter node={header} />
        </View>
      ) : null}
      {/* The list owns viewport detection for its items, so SduiNode defers its
          on_view/on_exit to onViewableItemsChanged (real visibility) below. */}
      <ViewportManagedProvider>
        <View style={styles.body}>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderListFooter}
            ListEmptyComponent={renderEmpty}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={viewabilityConfigRef.current}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={[
              items?.length ? null : styles.container,
              { paddingBottom: insets.bottom + sdui.spacing.lg },
            ]}
            refreshControl={
              page.on_refresh ? (
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              ) : undefined
            }
          />
        </View>
      </ViewportManagedProvider>
      {footer ? (
        <View style={styles.footer}>
          <Interpreter node={footer} />
        </View>
      ) : null}
    </View>
  );
}
