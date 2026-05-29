import React, { useRef, useCallback } from "react";
import type { ReactNode } from "react";
import { View } from "react-native";
import { useViewableContext } from "./ViewableContext.js";

interface ViewableProps {
  onView?: () => void;
  children: ReactNode;
}

/**
 * HOC that fires `onView` the first time the wrapped component becomes
 * visible.
 *
 * Two modes:
 *
 * - **Default (`trackedByList === false`)** — uses `onLayout` as a
 *   first-paint proxy. Fires once when RN computes the wrapper's layout.
 *   Approximate, and assumes the wrapper actually mounts inside the
 *   viewport (true for non-virtualized containers like a ScrollView body
 *   or a bottom sheet); does NOT re-fire on scroll-into-view.
 *
 * - **Tracked by parent list (`trackedByList === true`)** — render-only:
 *   no wrapping View, no `onLayout`, no `onView` dispatch. The parent
 *   (typically `PageFeedRenderer`) is doing real viewport detection via
 *   FlatList's `onViewableItemsChanged` and will fire `on_view` itself.
 *   Suppressing here prevents double-dispatch.
 *
 * Eventually a real `IntersectionObserver`-style hook will replace the
 * `onLayout` proxy for the default mode; the FlatList path is already
 * authoritative and doesn't need it.
 */
export function Viewable({
  onView,
  children,
}: ViewableProps): React.ReactElement {
  const { trackedByList } = useViewableContext();
  const hasFired = useRef(false);

  const handleLayout = useCallback(() => {
    if (onView && !hasFired.current) {
      hasFired.current = true;
      onView();
    }
  }, [onView]);

  // Either no work to do, or a parent list is the authoritative tracker —
  // render children verbatim without wrapping in a layout-listening View.
  if (!onView || trackedByList) {
    return <>{children}</>;
  }

  return <View onLayout={handleLayout}>{children}</View>;
}
