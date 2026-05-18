import React, { useCallback } from "react";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useBottomSheetStore } from "./useBottomSheetStore.js";
import { BottomSheetContext } from "./BottomSheetContext.js";
import { Interpreter } from "../interpreter/Interpreter.js";
import type { Node } from "@one-impression/sdk-native-sdui";

const SIZE_TO_SNAP: Record<string, string[]> = {
  small: ["25%"],
  medium: ["50%"],
  large: ["80%"],
  full: ["95%"],
};

/**
 * Singleton host component — mount once at app root in _layout.tsx.
 * Subscribes to the Zustand bottom-sheet store and renders BottomSheetModals
 * for each entry in the stack.
 */
export function BottomSheetHost(): React.ReactElement {
  const stack = useBottomSheetStore((s) => s.stack);
  const close = useBottomSheetStore((s) => s.close);

  const handleDismiss = useCallback(
    (id: string) => {
      close(id);
    },
    [close],
  );

  return (
    <>
      {stack.map((sheet) => (
        <BottomSheetModal
          key={sheet.id}
          snapPoints={SIZE_TO_SNAP[sheet.size] ?? SIZE_TO_SNAP["medium"]}
          enableDynamicSizing={sheet.size === "dynamic"}
          onDismiss={() => handleDismiss(sheet.id)}
        >
          <BottomSheetScrollView>
            <BottomSheetContext.Provider value={{ insideSheet: true }}>
              {(sheet.items as Node[]).map((node, i) => (
                <Interpreter key={node.id ?? i} node={node} />
              ))}
            </BottomSheetContext.Provider>
          </BottomSheetScrollView>
        </BottomSheetModal>
      ))}
    </>
  );
}
