import React from "react";
import type { ReactNode } from "react";
import { Pressable } from "react-native";

interface ClickableProps {
  onPress?: () => void;
  children: ReactNode;
}

/**
 * HOC that wraps children in a Pressable when on_click is defined.
 * Passthrough (no extra View) when there's no press handler.
 */
export function Clickable({
  onPress,
  children,
}: ClickableProps): React.ReactElement {
  if (!onPress) {
    return <>{children}</>;
  }

  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      {children}
    </Pressable>
  );
}
