import React from "react";
import { View, StyleSheet } from "react-native";

const PLACEHOLDER_COLOR = "#E5E7EB";

function FeedCard() {
  return (
    <View style={styles.card}>
      <View style={styles.cardImage} />
      <View style={styles.cardBody}>
        <View style={[styles.line, { width: "70%" }]} />
        <View style={[styles.line, { width: "90%" }]} />
        <View style={[styles.line, { width: "40%" }]} />
      </View>
    </View>
  );
}

export function FeedSkeleton(): React.ReactElement {
  return (
    <View style={styles.container}>
      <View style={styles.chips}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.chip} />
        ))}
      </View>
      <FeedCard />
      <FeedCard />
      <FeedCard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  chips: { flexDirection: "row", gap: 8 },
  chip: {
    width: 72,
    height: 32,
    backgroundColor: PLACEHOLDER_COLOR,
    borderRadius: 16,
  },
  card: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F9FAFB",
  },
  cardImage: {
    height: 120,
    backgroundColor: PLACEHOLDER_COLOR,
  },
  cardBody: { padding: 12, gap: 8 },
  line: {
    height: 14,
    backgroundColor: PLACEHOLDER_COLOR,
    borderRadius: 4,
  },
});
