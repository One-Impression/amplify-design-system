import { useShallow } from "zustand/react/shallow";
import { useBottomSheetStore } from "../bottom-sheet/useBottomSheetStore.js";

/**
 * Returns the currently active (most-recently opened) bottom sheet entry,
 * or null if none open. Resolves the topmost open sheet against the store
 * registry — consumers read sheet data for conditional rendering.
 *
 * Uses `useShallow` so the registry + openOrder read is taken as a single
 * atomic snapshot. Under React 18 concurrent rendering, two separate
 * `useBottomSheetStore(selector)` calls could otherwise see torn state
 * (one selector observes the new value while the other still sees the
 * old) when a single store update mutates both fields.
 */
export function useBottomSheetData() {
  return useBottomSheetStore(
    useShallow((s) => {
      if (s.openOrder.length === 0) return null;
      const topId = s.openOrder[s.openOrder.length - 1] as string;
      return s.registry[topId] ?? null;
    }),
  );
}
