import { create } from "zustand";

const MAX_STACK_DEPTH = 2;

interface SheetEntry {
  id: string;
  title?: string;
  size: string;
  items: unknown[];
  on_dismiss?: unknown;
  on_open?: unknown;
}

interface BottomSheetState {
  stack: SheetEntry[];
  open: (sheet: SheetEntry) => void;
  close: (id?: string) => void;
  closeAll: () => void;
  replace: (sheet: SheetEntry) => void;
}

export const useBottomSheetStore = create<BottomSheetState>((set) => ({
  stack: [],

  open: (sheet) =>
    set((state) => {
      if (state.stack.length >= MAX_STACK_DEPTH) {
        console.warn(
          `[BottomSheetStore] Stack depth limit (${MAX_STACK_DEPTH}) reached — refusing to push "${sheet.id}"`,
        );
        return state;
      }
      return { stack: [...state.stack, sheet] };
    }),

  close: (id) =>
    set((state) => ({
      stack: id
        ? state.stack.filter((s) => s.id !== id)
        : state.stack.slice(0, -1),
    })),

  closeAll: () => set({ stack: [] }),

  replace: (sheet) =>
    set((state) => ({
      stack: [...state.stack.slice(0, -1), sheet],
    })),
}));
