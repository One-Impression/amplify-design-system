import React from "react";
import { View, Text, StyleSheet } from "react-native";

declare const __DEV__: boolean | undefined;

export interface SduiFallbackProps {
  /** Node type that failed (e.g. `"snippet.info_row"`). Surfaced in dev. */
  nodeType?: string;
  /** Node id that failed. Surfaced in dev. */
  nodeId?: string;
  /** Validation / render error, when one is available. Surfaced in dev. */
  error?: Error;
}

function inDev(): boolean {
  if (typeof __DEV__ !== "undefined") return Boolean(__DEV__);
  if (typeof process !== "undefined" && process.env?.NODE_ENV) {
    return process.env.NODE_ENV !== "production";
  }
  return false;
}

/**
 * Fallback rendered when a node throws during schema validation or
 * rendering. Intentionally inert in production — one bad node must not
 * disrupt the rest of the page. In dev we surface the failing type/id
 * (and the error message, when present) so migration-period issues are
 * easy to spot in the simulator.
 */
export function SduiFallback(
  props: SduiFallbackProps = {},
): React.ReactElement {
  if (!inDev()) {
    return <View />;
  }
  const label = props.nodeType
    ? `${props.nodeType}${props.nodeId ? `#${props.nodeId}` : ""}`
    : props.nodeId
      ? `#${props.nodeId}`
      : "sdui-node";
  return (
    <View style={styles.container}>
      <Text style={styles.label}>SDUI fallback · {label}</Text>
      {props.error ? (
        <Text style={styles.error} numberOfLines={2}>
          {props.error.message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#dc2626",
    borderStyle: "dashed",
    borderRadius: 4,
    backgroundColor: "rgba(220, 38, 38, 0.05)",
  },
  label: {
    fontSize: 11,
    color: "#dc2626",
    fontWeight: "600",
  },
  error: {
    fontSize: 10,
    color: "#7f1d1d",
    marginTop: 2,
  },
});
