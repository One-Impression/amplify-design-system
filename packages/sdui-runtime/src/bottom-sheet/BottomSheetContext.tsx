import { createContext, useContext } from "react";

interface BottomSheetContextValue {
  insideSheet: boolean;
}

export const BottomSheetContext = createContext<BottomSheetContextValue>({
  insideSheet: false,
});

/**
 * Returns whether the current render tree is inside a bottom sheet.
 * Sheet-aware renderers use this to swap RN ScrollView → BottomSheetScrollView,
 * FlatList → BottomSheetFlatList, TextInput → BottomSheetTextInput.
 */
export function useInsideSheet(): boolean {
  return useContext(BottomSheetContext).insideSheet;
}
