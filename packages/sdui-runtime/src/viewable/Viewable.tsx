import React, { useRef, useCallback } from "react";
import type { ReactNode } from "react";
import { View } from "react-native";

interface ViewableProps {
  onView?: () => void;
  children: ReactNode;
}

/**
 * HOC that fires onView the first time the component becomes visible.
 * Uses onLayout as a simple proxy — in production this should be replaced
 * with an IntersectionObserver-style solution (e.g. react-native-intersection-observer)
 * once the viewport detection library is wired.
 */
export function Viewable({
  onView,
  children,
}: ViewableProps): React.ReactElement {
  const hasFired = useRef(false);

  const handleLayout = useCallback(() => {
    if (onView && !hasFired.current) {
      hasFired.current = true;
      onView();
    }
  }, [onView]);

  if (!onView) {
    return <>{children}</>;
  }

  return <View onLayout={handleLayout}>{children}</View>;
}
