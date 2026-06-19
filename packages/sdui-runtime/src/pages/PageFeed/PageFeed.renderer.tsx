import React, { useCallback, useRef, useState } from "react";
import { FlatList, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { sdui } from "@one-impression/tokens-creator/react-native";
import type { Node, Action } from "@one-impression/sdk-native-sdui";
import { Interpreter } from "../../interpreter/index.js";
import { GutterItem } from "../../layout/page-gutter.js";
import { useActionEngine } from "../../action-engine/useActionEngine.js";
import { useTelemetry } from "../../telemetry/useTelemetry.js";
import { Gradient, type GradientItem } from "../../gradient/index.js";
import { ViewportManagedProvider, fireViewability } from "../../viewport/index.js";
import { usePageScaffold } from "../_shared/usePageScaffold.js";
import type { Page } from "@one-impression/sdk-native-sdui";

interface PageProps {
  page: Page;
}

interface FeedConfig {
  gradient?: GradientItem;
  bg_color?: { type: string };
}

const styles = StyleSheet.create({
  outer: { flex: 1, position: "relative" },
  header: { width: "100%" },
  body: { flex: 1 },
  footer: { width: "100%" },
});

/**
 * Feed layout — pure zone geometry over {@link usePageScaffold}. Three UI zones:
 * a pinned `header`, a scrolling `content` body (= top-level `items`, virtualized
 * via FlatList), and a pinned `footer` (the shell).
 * The scaffold decides content-vs-skeleton per zone; this renderer only places
 * each zone and owns content virtualization + viewport-driven infinite scroll.
 */
export function PageFeedRenderer({ page }: PageProps): React.ReactElement {
  const { page: livePage, getUiZone, isUiZoneLoading, refreshing, onRefresh } =
    usePageScaffold(page);
  const actionEngine = useActionEngine();
  const telemetry = useTelemetry();
  const insets = useSafeAreaInsets();

  const data = (livePage.data ?? {}) as Record<string, unknown>;
  const config = data.config as FeedConfig | undefined;
  const gradient = config?.gradient;
  const bgColorToken = config?.bg_color?.type;

  // UI zones resolved by the scaffold (content or skeleton, as appropriate).
  const headerNodes = getUiZone("header");
  const footerNodes = getUiZone("footer");

  // Content zone is virtualized, so we choose FlatList (items) vs a plain
  // skeleton list ourselves rather than via getUiZone.
  const items = (livePage.items ?? []) as Node[];
  const contentSkeleton = data.content_skeleton as Node | undefined;
  const showContentSkeleton =
    !!contentSkeleton && (isUiZoneLoading("content") || items.length === 0);

  // The header zone pads the top safe-area only while it shows the skeleton (the
  // real page_header self-insets); avoids the skeleton sliding under the status bar.
  const headerIsSkeleton = isUiZoneLoading("header") || !data.header;

  // Viewport lifecycle for list items — real visibility (NOT onLayout). Powers
  // backend-driven infinite scroll (a card's on_view load-more) + impressions.
  const viewFiredRef = useRef<Set<string>>(new Set());
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

  const containerStyle =
    !gradient && bgColorToken
      ? [styles.outer, { backgroundColor: bgColorToken }]
      : styles.outer;

  return (
    <View style={containerStyle}>
      {gradient ? <Gradient item={gradient} /> : null}

      {/* Pinned header zone — its node (page_header + filters) or skeleton. */}
      {headerNodes.length > 0 ? (
        <View style={[styles.header, headerIsSkeleton ? { paddingTop: insets.top } : null]}>
          {headerNodes.map((node, i) => (
            <Interpreter key={node.id ?? `header-${i}`} node={node} />
          ))}
        </View>
      ) : null}

      {/* Scrolling content zone — items (virtualized) or content skeleton. */}
      <ViewportManagedProvider>
        <View style={styles.body}>
          {showContentSkeleton ? (
            <ScrollView
              scrollEnabled={false}
              contentContainerStyle={{ paddingBottom: insets.bottom + sdui.spacing.lg }}
            >
              <GutterItem node={contentSkeleton!}>
                <Interpreter node={contentSkeleton!} />
              </GutterItem>
            </ScrollView>
          ) : (
            <FlatList
              data={items}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              onViewableItemsChanged={handleViewableItemsChanged}
              viewabilityConfig={viewabilityConfigRef.current}
              // Deliver taps to children while the keyboard is open (e.g. an
              // inline field action) rather than swallowing the first tap.
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: insets.bottom + sdui.spacing.lg }}
              refreshControl={
                livePage.on_refresh ? (
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                ) : undefined
              }
            />
          )}
        </View>
      </ViewportManagedProvider>

      {/* Pinned footer zone — the shell (tabs); never reloaded. */}
      {footerNodes.length > 0 ? (
        <View style={styles.footer}>
          {footerNodes.map((node, i) => (
            <Interpreter key={node.id ?? `footer-${i}`} node={node} />
          ))}
        </View>
      ) : null}
    </View>
  );
}
