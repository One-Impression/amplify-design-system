/**
 * useBottomSheetDataStore — Zustand store for bottom sheet data.
 *
 * Separate from the bottom-sheet manager's stack store (Task 11).
 * This store holds the data payload for the currently displayed
 * bottom sheet — form defaults, list items, configuration, etc.
 *
 * Mirrors the legacy Redux bottomSheetData slice.
 */
import { create } from 'zustand';

export interface BottomSheetDataState {
  /** Identifier of the bottom sheet whose data is stored. */
  sheetId: string | null;
  /** The sheet's data payload (opaque shape — varies per sheet type). */
  data: Record<string, unknown> | null;
  /** Metadata about the sheet (title, subtitle, etc). */
  meta: Record<string, unknown> | null;
}

export interface BottomSheetDataActions {
  /** Set data for a bottom sheet. */
  setSheetData: (
    sheetId: string,
    data: Record<string, unknown>,
    meta?: Record<string, unknown>,
  ) => void;
  /** Update specific fields in the current sheet's data. */
  updateSheetData: (partial: Record<string, unknown>) => void;
  /** Clear sheet data. */
  clear: () => void;
}

const initialState: BottomSheetDataState = {
  sheetId: null,
  data: null,
  meta: null,
};

export const useBottomSheetDataStore = create<
  BottomSheetDataState & BottomSheetDataActions
>((set) => ({
  ...initialState,

  setSheetData: (sheetId, data, meta) =>
    set({ sheetId, data, meta: meta ?? null }),

  updateSheetData: (partial) =>
    set((state) => ({
      data: state.data ? { ...state.data, ...partial } : partial,
    })),

  clear: () => set(initialState),
}));
