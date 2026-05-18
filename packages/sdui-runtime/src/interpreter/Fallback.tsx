import React from "react";
import { View } from "react-native";

interface FallbackProps {
  type?: string;
}

/**
 * Rendered for unknown node types — forward-compat contract.
 * Intentionally empty; must not crash or disrupt layout.
 */
export function Fallback(_props: FallbackProps): React.ReactElement {
  return <View />;
}
