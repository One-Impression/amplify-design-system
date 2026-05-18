import React from "react";
import { View, StyleSheet } from "react-native";

const PLACEHOLDER_COLOR = "#E5E7EB";

function FieldSkeleton() {
  return (
    <View style={styles.field}>
      <View style={[styles.label, { width: "30%" }]} />
      <View style={styles.input} />
    </View>
  );
}

export function FormSkeleton(): React.ReactElement {
  return (
    <View style={styles.container}>
      <View style={[styles.heading, { width: "50%" }]} />
      <FieldSkeleton />
      <FieldSkeleton />
      <FieldSkeleton />
      <View style={styles.spacer} />
      <View style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
  heading: {
    height: 24,
    backgroundColor: PLACEHOLDER_COLOR,
    borderRadius: 4,
  },
  field: { gap: 6 },
  label: {
    height: 12,
    backgroundColor: PLACEHOLDER_COLOR,
    borderRadius: 4,
  },
  input: {
    height: 44,
    backgroundColor: PLACEHOLDER_COLOR,
    borderRadius: 8,
  },
  spacer: { height: 16 },
  button: {
    height: 48,
    backgroundColor: PLACEHOLDER_COLOR,
    borderRadius: 8,
  },
});
