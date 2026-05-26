import { create } from "zustand";
import type { Node } from "@one-impression/sdk-native-sdui";

/**
 * Inline bottom-sheet record stored in the registry.
 *
 * Mirrors the `InlineBottomSheetSchema` payload from
 * `@one-impression/sdk-native-sdui` (id, size, items, optional title +
 * lifecycle triggers). The registry holds these by `sheet_id` so the
 * `sheet` action handler can open them by id without re-defining the sheet.
 */
export interface SheetEntry {
  id: string;
  title?: string;
  size: string;
  items: Node[];
  on_dismiss?: unknown;
  on_open?: unknown;
}

interface BottomSheetState {
  /** All sheets declared by the active page, keyed by sheet_id. */
  registry: Record<string, SheetEntry>;
  /** Which registered sheets are currently presented. */
  openSheets: Record<string, boolean>;
  /** Per-sheet runtime context payload, stamped at open() time. */
  contexts: Record<string, Record<string, unknown> | undefined>;

  /**
   * Register a sheet definition without opening it. Called by page renderers
   * on mount for each `page.bottom_sheets[]` entry. Idempotent — overwrites
   * any existing entry with the same id.
   */
  register: (sheetId: string, sheet: SheetEntry) => void;

  /**
   * Open a previously-registered sheet. Looks up the sheet by id from the
   * registry; if no sheet was registered the call is a no-op (and logs a
   * warning). An optional `contextPayload` is stamped against the sheet id
   * so renderers / handlers inside the sheet can access it.
   */
  open: (sheetId: string, contextPayload?: Record<string, unknown>) => void;

  /** Close a sheet by id; if omitted, closes the most-recently opened sheet. */
  close: (sheetId?: string) => void;

  /** Close every currently-open sheet (registry is preserved). */
  closeAll: () => void;
}

export const useBottomSheetStore = create<BottomSheetState>((set, get) => ({
  registry: {},
  openSheets: {},
  contexts: {},

  register: (sheetId, sheet) =>
    set((state) => ({
      registry: { ...state.registry, [sheetId]: sheet },
    })),

  open: (sheetId, contextPayload) => {
    const sheet = get().registry[sheetId];
    if (!sheet) {
      console.warn(
        `[BottomSheetStore] open("${sheetId}") — no sheet registered with that id`,
      );
      return;
    }
    set((state) => ({
      openSheets: { ...state.openSheets, [sheetId]: true },
      contexts: { ...state.contexts, [sheetId]: contextPayload },
    }));
  },

  close: (sheetId) =>
    set((state) => {
      if (sheetId) {
        const { [sheetId]: _, ...remaining } = state.openSheets;
        const { [sheetId]: __, ...remainingCtx } = state.contexts;
        return { openSheets: remaining, contexts: remainingCtx };
      }
      // No id: close the most-recently opened sheet.
      const openIds = Object.keys(state.openSheets);
      if (openIds.length === 0) return state;
      const last = openIds[openIds.length - 1] as string;
      const { [last]: _, ...remaining } = state.openSheets;
      const { [last]: __, ...remainingCtx } = state.contexts;
      return { openSheets: remaining, contexts: remainingCtx };
    }),

  closeAll: () => set({ openSheets: {}, contexts: {} }),
}));
