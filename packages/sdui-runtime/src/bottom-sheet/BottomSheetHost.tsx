import React, { useCallback, useEffect, useRef } from "react";
import {
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import type { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useBottomSheetStore, type SheetEntry } from "./useBottomSheetStore.js";
import { BottomSheetContext } from "./BottomSheetContext.js";
import { Interpreter } from "../interpreter/Interpreter.js";
import { GutterItem } from "../layout/page-gutter.js";

const SIZE_TO_SNAP: Record<string, string[]> = {
  small: ["25%"],
  medium: ["50%"],
  large: ["80%"],
  full: ["95%"],
};

interface BottomSheetHostSheetProps {
  sheet: SheetEntry;
  open: boolean;
  onDismiss: () => void;
}

/**
 * Per-sheet renderer that owns its own gorhom modal ref.
 *
 * gorhom's `BottomSheetModal` is an imperative API — it does NOT take a
 * `visible` / `open` prop. To present a sheet you must call `ref.present()`,
 * and to hide it you call `ref.dismiss()`. This child component bridges the
 * declarative `open` flag from `useBottomSheetStore` to those imperative
 * calls via a `useEffect` keyed on `open`.
 */
function BottomSheetHostSheet({
  sheet,
  open,
  onDismiss,
}: BottomSheetHostSheetProps): React.ReactElement {
  const ref = useRef<BottomSheetModalMethods>(null);

  useEffect(() => {
    if (open) {
      ref.current?.present();
    } else {
      ref.current?.dismiss();
    }
  }, [open]);

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={SIZE_TO_SNAP[sheet.size] ?? SIZE_TO_SNAP["medium"]}
      enableDynamicSizing={sheet.size === "dynamic"}
      onDismiss={onDismiss}
    >
      <BottomSheetScrollView>
        <BottomSheetContext.Provider value={{ insideSheet: true }}>
          {/* Wrap each item in GutterItem so sheet content shares the SAME
              gutter + inter-item gap model as page layouts (PageStandard /
              PageStickyFooter). Without this the sheet sat outside the
              page-gutter system and relied on each snippet's own margins. */}
          {sheet.items.map((node, i) => (
            <GutterItem key={node.id ?? i} node={node}>
              <Interpreter node={node} />
            </GutterItem>
          ))}
        </BottomSheetContext.Provider>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}

/**
 * Singleton host component — mount once at app root in `_layout.tsx`.
 *
 * Subscribes to the Zustand bottom-sheet store and renders a child
 * `BottomSheetHostSheet` for every sheet currently in the registry. Each
 * child holds its own gorhom modal ref and reacts to its open state.
 */
export function BottomSheetHost(): React.ReactElement {
  const registry = useBottomSheetStore((s) => s.registry);
  const openSheets = useBottomSheetStore((s) => s.openSheets);
  const close = useBottomSheetStore((s) => s.close);

  const handleDismiss = useCallback(
    (id: string) => {
      close(id);
    },
    [close],
  );

  const entries = Object.values(registry);

  return (
    <>
      {entries.map((sheet) => (
        <BottomSheetHostSheet
          key={sheet.id}
          sheet={sheet}
          open={openSheets[sheet.id] === true}
          onDismiss={() => handleDismiss(sheet.id)}
        />
      ))}
    </>
  );
}
