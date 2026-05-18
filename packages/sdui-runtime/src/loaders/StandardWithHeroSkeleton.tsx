import React from "react";
import { View, StyleSheet } from "react-native";

const PLACEHOLDER_COLOR = "#E5E7EB";

export function StandardWithHeroSkeleton(): React.ReactElement {
  return (
    <View style={styles.container}>
      <View style={styles.hero} />
      <View style={styles.body}>
        <View style={[styles.line, { width: "50%" }]} />
        <View style={[styles.line, { width: "100%" }]} />
        <View style={[styles.line, { width: "80%" }]} />
        <View style={styles.spacer} />
        <View style={[styles.line, { width: "100%" , height: 48 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    height: 200,
    backgroundColor: PLACEHOLDER_COLOR,
  },
  body: { padding: 16, gap: 12 },
  line: {
    height: 14,
    backgroundColor: PLACEHOLDER_COLOR,
    borderRadius: 4,
  },
  spacer: { height: 8 },
});
