import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import type { AppStateStatus } from "react-native";
import type { Action } from "@one-impression/sdk-native-sdui";
import { useActionEngine } from "../action-engine/useActionEngine.js";

/**
 * Tracks app-state transitions (active/background/inactive) and dispatches
 * page-level on_app_foreground / on_app_background actions.
 * Ported 1:1 from legacy.
 */
export function useAppStateSession(
  onForeground?: Action,
  onBackground?: Action,
): void {
  const engine = useActionEngine();
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextState === "active"
      ) {
        if (onForeground) engine.dispatch(onForeground);
      }
      if (
        appState.current === "active" &&
        nextState.match(/inactive|background/)
      ) {
        if (onBackground) engine.dispatch(onBackground);
      }
      appState.current = nextState;
    });

    return () => subscription.remove();
  }, [engine, onForeground, onBackground]);
}
