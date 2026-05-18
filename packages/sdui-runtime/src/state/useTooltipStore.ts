/**
 * useTooltipStore — Zustand store for imperative tooltip display.
 *
 * The `ui.show_tooltip` capability handler calls `.getState().show(...)`.
 * The UI layer subscribes to the store to render the tooltip overlay.
 */
import { create } from 'zustand';

export interface TooltipRequest {
  target: string;
  text: string;
  position?: string;
  autoDismissMs?: number;
}

export interface TooltipStoreState {
  /** The currently active tooltip request, or null. */
  active: TooltipRequest | null;
}

export interface TooltipStoreActions {
  /** Show a tooltip. */
  show: (request: TooltipRequest) => void;
  /** Dismiss the active tooltip. */
  dismiss: () => void;
}

export const useTooltipStore = create<TooltipStoreState & TooltipStoreActions>(
  (set) => ({
    active: null,

    show: (request) => set({ active: request }),

    dismiss: () => set({ active: null }),
  }),
);
