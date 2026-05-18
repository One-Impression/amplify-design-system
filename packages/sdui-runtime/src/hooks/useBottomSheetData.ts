import { useBottomSheetStore } from "../bottom-sheet/useBottomSheetStore.js";

/**
 * Returns the currently active (topmost) bottom sheet entry, or null if none open.
 * Ported 1:1 from legacy — consumers read sheet data for conditional rendering.
 */
export function useBottomSheetData() {
  const stack = useBottomSheetStore((s) => s.stack);
  return stack.length > 0 ? stack[stack.length - 1] : null;
}
