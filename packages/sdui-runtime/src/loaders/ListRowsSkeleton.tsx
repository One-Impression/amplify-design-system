import React from "react";
import { View, StyleSheet } from "react-native";

const PLACEHOLDER_COLOR = "#E5E7EB";

function SkeletonRow() {
  return (
    <View style={styles.row}>
      <View style={styles.avatar} />
      <View style={styles.rowBody}>
        <View style={[styles.line, { width: "60%" }]} />
        <View style={[styles.line, { width: "40%" }]} />
      </View>
      <View style={styles.trailing} />
    </View>
  );
}

export function ListRowsSkeleton(): React.ReactElement {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <SkeletonRow key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 4 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PLACEHOLDER_COLOR,
  },
  rowBody: { flex: 1, gap: 6 },
  line: {
    height: 12,
    backgroundColor: PLACEHOLDER_COLOR,
    borderRadius: 4,
  },
  trailing: {
    width: 48,
    height: 12,
    backgroundColor: PLACEHOLDER_COLOR,
    borderRadius: 4,
  },
});
