import { useBottomSheetStore } from "../bottom-sheet/useBottomSheetStore.js";

/**
 * Indirection between the `sheet` / `dismiss` action handlers and whichever
 * bottom-sheet host is mounted, so the handlers don't hard-depend on either.
 *
 * Two hosts exist:
 *  - **Route-based** (the structural model): `SduiNavigationHost` registers a
 *    presenter here that pushes/pops a `SduiSheet` native-stack route. Sheet
 *    *presence is the route existing on the stack* — there is no imperative
 *    present()/dismiss() bridge to fall out of sync with, which is the entire
 *    class of bug (dead-touch overlay, hardware-back-doesn't-close) the route
 *    model eliminates.
 *  - **Legacy store-based** (fallback): when no presenter is registered (e.g. an
 *    app that mounts `BottomSheetHost` directly under expo-router rather than
 *    using `SduiNavigationHost`), calls fall back to the zustand store's
 *    open()/close() that the gorhom modal host bridges imperatively.
 */
export type SheetChrome = { title?: string; subtitle?: string };
export type SheetPresenter = (
  sheetId: string,
  contentPath?: string,
  chrome?: SheetChrome,
) => void;
export type SheetDismisser = (sheetId?: string) => void;

let _present: SheetPresenter | null = null;
let _dismiss: SheetDismisser | null = null;

/**
 * Register route-based present/dismiss. `SduiNavigationHost` calls this on mount
 * and the returned disposer on unmount. Last registration wins (there is only
 * ever one host).
 */
export function setSheetPresenter(
  present: SheetPresenter,
  dismiss: SheetDismisser,
): () => void {
  _present = present;
  _dismiss = dismiss;
  return () => {
    if (_present === present) _present = null;
    if (_dismiss === dismiss) _dismiss = null;
  };
}

/**
 * Open a sheet by id. Route-based if a host is mounted. `contentPath` (optional)
 * makes it an addressable sheet that fetches its own document from that path on
 * open; the legacy store host ignores it (static sheets only).
 */
export function presentSheet(
  sheetId: string,
  contentPath?: string,
  chrome?: SheetChrome,
): void {
  if (_present) {
    _present(sheetId, contentPath, chrome);
    return;
  }
  // Legacy store host has no fetch-on-open path; static registry sheets only.
  useBottomSheetStore.getState().open(sheetId);
}

/** Dismiss a sheet (the topmost if no id is given). */
export function dismissSheet(sheetId?: string): void {
  if (_dismiss) {
    _dismiss(sheetId);
    return;
  }
  useBottomSheetStore.getState().close(sheetId);
}
