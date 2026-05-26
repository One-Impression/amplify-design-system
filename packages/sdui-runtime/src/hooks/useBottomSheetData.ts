import { useBottomSheetStore } from "../bottom-sheet/useBottomSheetStore.js";

/**
 * Returns the currently active (most-recently opened) bottom sheet entry,
 * or null if none open. Resolves the topmost open sheet against the store
 * registry — consumers read sheet data for conditional rendering.
 */
export function useBottomSheetData() {
  const registry = useBottomSheetStore((s) => s.registry);
  const openSheets = useBottomSheetStore((s) => s.openSheets);
  const openIds = Object.keys(openSheets).filter((id) => openSheets[id]);
  if (openIds.length === 0) return null;
  const topId = openIds[openIds.length - 1] as string;
  return registry[topId] ?? null;
}
