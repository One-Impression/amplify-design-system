import { useEffect } from "react";
import { useBottomSheetStore } from "../bottom-sheet/useBottomSheetStore.js";

/**
 * Syncs form state changes with the bottom-sheet lifecycle.
 * Closes the sheet on successful form submission if closeOnSuccess is true.
 * Ported 1:1 from legacy form-in-sheet pattern.
 */
export function useBottomSheetFormSync(opts: {
  sheetId: string;
  submitted: boolean;
  closeOnSuccess?: boolean;
}): void {
  const close = useBottomSheetStore((s) => s.close);

  useEffect(() => {
    if (opts.submitted && opts.closeOnSuccess) {
      close(opts.sheetId);
    }
  }, [opts.submitted, opts.closeOnSuccess, opts.sheetId, close]);
}
