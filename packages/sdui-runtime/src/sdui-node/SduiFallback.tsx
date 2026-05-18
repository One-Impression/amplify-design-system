import React from "react";
import { View } from "react-native";

/**
 * Fallback rendered when a node throws during schema validation or rendering.
 * Intentionally empty — one bad node must not disrupt the page.
 */
export function SduiFallback(): React.ReactElement {
  return <View />;
}
