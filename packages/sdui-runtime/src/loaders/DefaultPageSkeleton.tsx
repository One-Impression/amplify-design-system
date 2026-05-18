import React from "react";
import { View, StyleSheet } from "react-native";

const PLACEHOLDER_COLOR = "#E5E7EB";

function SkeletonBlock({ width, height }: { width: string | number; height: number }) {
  return (
    <View
      style={[styles.block, { width, height }]}
    />
  );
}

export function DefaultPageSkeleton(): React.ReactElement {
  return (
    <View style={styles.container}>
      <SkeletonBlock width="60%" height={24} />
      <SkeletonBlock width="100%" height={80} />
      <SkeletonBlock width="100%" height={80} />
      <SkeletonBlock width="80%" height={16} />
      <SkeletonBlock width="100%" height={80} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  block: {
    backgroundColor: PLACEHOLDER_COLOR,
    borderRadius: 8,
  },
});
