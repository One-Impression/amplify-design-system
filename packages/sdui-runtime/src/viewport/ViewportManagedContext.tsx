import React, { createContext, useContext } from "react";

/**
 * Signals that an ancestor surface (e.g. a feed's FlatList) owns viewport
 * detection for this subtree via a real visibility API (onViewableItemsChanged)
 * and drives each node's view lifecycle centrally.
 *
 * When true, `SduiNode` does NOT fire its own `on_view` / `view_events` via the
 * `onLayout` proxy — that would fire on render, not on visibility. The managing
 * surface fires the full lifecycle (see {@link fireViewability}) instead.
 *
 * Default false: outside a managed surface (standard ScrollView pages) SduiNode
 * keeps its existing self-managed behavior.
 */
const ViewportManagedContext = createContext<boolean>(false);

export function ViewportManagedProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <ViewportManagedContext.Provider value={true}>
      {children}
    </ViewportManagedContext.Provider>
  );
}

/** True when an ancestor surface manages this node's viewport lifecycle. */
export function useViewportManaged(): boolean {
  return useContext(ViewportManagedContext);
}
