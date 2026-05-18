import { useState, useCallback } from "react";
import type { Action } from "@one-impression/sdk-native-sdui";
import { useActionEngine } from "../action-engine/useActionEngine.js";

interface PageRefreshState {
  refreshing: boolean;
  onRefresh: () => void;
}

/**
 * Manages pull-to-refresh state for page containers.
 * Dispatches the page's on_refresh action and tracks the refreshing flag.
 * Ported 1:1 from legacy.
 */
export function usePageRefresh(onRefreshAction?: Action): PageRefreshState {
  const engine = useActionEngine();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    if (!onRefreshAction) return;
    setRefreshing(true);
    engine.dispatch(onRefreshAction);
    // The BFF call handler's on_success/on_error will eventually trigger a
    // state update that re-renders the page. We reset refreshing after a
    // timeout as a safety net.
    setTimeout(() => setRefreshing(false), 5000);
  }, [engine, onRefreshAction]);

  return { refreshing, onRefresh };
}
