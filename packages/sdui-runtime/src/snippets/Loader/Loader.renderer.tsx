import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { LoaderSchema } from "@one-impression/sdk-native-sdui";
import { Box } from "@one-impression/ui-native";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { SduiNode } from "../../sdui-node/index.js";

const styles = StyleSheet.create({
  shimmerBox: {
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    overflow: "hidden",
  },
  cardShimmer: { width: "100%", height: 120 },
  circular: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignSelf: "center",
  },
  feedRow: { width: "100%", height: 64, marginBottom: 8 },
  profileShimmer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: "center",
  },
  filterChip: { width: 72, height: 32, borderRadius: 16, marginRight: 8 },
  filterRow: { flexDirection: "row" as const, paddingVertical: 8 },
});

function ShimmerPlaceholder({
  style,
}: {
  style: object;
}): React.ReactElement {
  return <View style={[styles.shimmerBox, style]} />;
}

export function LoaderRenderer(node: Node): React.ReactElement {
  return (
    <SduiNode
      data={node.data}
      schema={LoaderSchema.shape.data}
      id={node.id}
      on_click={node.on_click}
      on_load={node.on_load}
      on_view={node.on_view}
      on_dismount={node.on_dismount}
      view_events={node.view_events}
      load_events={node.load_events}
    >
      {(v) => {
        switch (v.variant) {
          case "card_shimmer":
            return (
              <Box>
                <ShimmerPlaceholder style={styles.cardShimmer} />
              </Box>
            );
          case "circular":
            return (
              <Box>
                <ActivityIndicator size="large" />
              </Box>
            );
          case "feed":
            return (
              <Box>
                <ShimmerPlaceholder style={styles.feedRow} />
                <ShimmerPlaceholder style={styles.feedRow} />
                <ShimmerPlaceholder style={styles.feedRow} />
              </Box>
            );
          case "profile":
            return (
              <Box>
                <ShimmerPlaceholder style={styles.profileShimmer} />
                <ShimmerPlaceholder
                  style={{ width: "60%", height: 16, marginTop: 12, alignSelf: "center", borderRadius: 4 }}
                />
              </Box>
            );
          case "filter":
            return (
              <Box>
                <View style={styles.filterRow}>
                  <ShimmerPlaceholder style={styles.filterChip} />
                  <ShimmerPlaceholder style={styles.filterChip} />
                  <ShimmerPlaceholder style={styles.filterChip} />
                  <ShimmerPlaceholder style={styles.filterChip} />
                </View>
              </Box>
            );
          default:
            return (
              <Box>
                <ActivityIndicator size="small" />
              </Box>
            );
        }
      }}
    </SduiNode>
  );
}
