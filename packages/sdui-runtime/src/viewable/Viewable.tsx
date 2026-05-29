import React, { useRef, useCallback } from "react";
import type { ReactNode } from "react";
import { View } from "react-native";

interface ViewableProps {
  onView?: () => void;
  children: ReactNode;
}

/**
 * Wraps `children` in a layout-listening View that fires `onView` once,
 * the first time RN computes the wrapper's layout. Approximate proxy for
 * "the node is on screen now" — accurate enough for top-of-mount
 * impressions (cards in a non-virtualised section, items inside a bottom
 * sheet) but does not re-fire when the wrapper scrolls back into view.
 *
 * A FlatList-level viewport hook (`onViewableItemsChanged`) is the
 * authoritative path for items virtualised by FlatList; `Viewable`
 * remains the path for everything nested below such a list.
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
