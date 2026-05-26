import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  BackHandler,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import type { Page, Node, Action } from "@one-impression/sdk-native-sdui";
import { Interpreter } from "../../interpreter/index.js";
import { useActionEngine } from "../../action-engine/useActionEngine.js";
import { useBottomSheetStore } from "../../bottom-sheet/useBottomSheetStore.js";
import { usePageRefresh } from "../../hooks/usePageRefresh.js";
import { useAppStateSession } from "../../hooks/useAppStateSession.js";

interface PageProps {
  page: Page;
}

interface FeedPageData {
  filters?: Node[];
  on_load_more?: Action;
  loader?: Node;
  empty_state?: Node;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

/**
 * Infinite-scroll feed page with horizontal filter chips.
 * Legacy equivalent: PageType3.
 *
 * Uses FlatList (not ScrollView) for virtualized rendering of page.items.
 * Supports:
 * - Horizontal filter chips bar at the top
 * - Infinite scroll via on_load_more action
 * - Loader node displayed while fetching more items
 * - Empty state node when items is empty
 * - Pull-to-refresh via page.on_refresh
 */
export function PageFeedRenderer({ page }: PageProps): React.ReactElement {
  const actionEngine = useActionEngine();
  const register = useBottomSheetStore((s) => s.register);
  const unregister = useBottomSheetStore((s) => s.unregister);
  const { refreshing, onRefresh } = usePageRefresh(page.on_refresh);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadingMoreRef = useRef(false);

  const pageData = (page.data as FeedPageData | undefined) ?? {};
  const filters = pageData.filters;
  const onLoadMore = pageData.on_load_more;
  const loader = pageData.loader;
  const emptyState = pageData.empty_state;

  // Register inline bottom sheets (do not open) — see PageStandard for details.
  useEffect(() => {
    if (!page.bottom_sheets) return;
    for (const sheet of page.bottom_sheets) {
      register(sheet.id, {
        id: sheet.id,
        title: sheet.title,
        size: sheet.size ?? "medium",
        items: sheet.items ?? [],
        on_dismiss: sheet.on_dismiss,
        on_open: sheet.on_open,
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
    actionEngine.dispatch(onLoadMore);
    // Reset loading state after timeout as safety net.
    // The BFF response will re-render the page with new/appended items.
    setTimeout(() => {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }, 5000);
  }, [actionEngine, onLoadMore]);

  const renderItem = useCallback(
    ({ item }: { item: Node }) => (
      <Interpreter node={item} />
    ),
    [],
  );

  const keyExtractor = useCallback(
    (item: Node, index: number) => item.id ?? `feed-item-${index}`,
    [],
  );

  // Footer: show loader node while loading more items
  const renderFooter = useCallback(() => {
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

  // Filter chips bar rendered as FlatList header
  const renderHeader = useCallback(() => {
    if (!filters || filters.length === 0) return null;
    return (
      <View style={styles.filterBar}>
        {filters.map((filterNode, i) => (
          <View key={filterNode.id ?? `filter-${i}`} style={styles.filterChip}>
            <Interpreter node={filterNode} />
          </View>
        ))}
      </View>
    );
  }, [filters]);

  return (
    <View style={styles.container}>
      <FlatList
        data={page.items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          page.on_refresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      />
    </View>
  );
}
