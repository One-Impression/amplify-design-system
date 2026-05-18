/**
 * useAeroBarStore — Zustand store for aerobar state.
 *
 * The aerobar is the top notification bar that shows contextual messages
 * (e.g. "No internet connection", "New campaign available", "Profile
 * incomplete"). It can be dismissed, has timed auto-dismiss, and can
 * link to an action.
 *
 * Mirrors the legacy Redux aeroBar slice.
 */
import { create } from 'zustand';

/** Visual variant of the aerobar. */
export type AeroBarVariant = 'info' | 'success' | 'warning' | 'error';

/** An action that can be triggered from the aerobar. */
export interface AeroBarAction {
  /** Label for the action button. */
  label: string;
  /** Action type to dispatch when tapped. */
  actionType: string;
  /** Action payload. */
  payload?: Record<string, unknown>;
}

export interface AeroBarState {
  /** Whether the aerobar is currently visible. */
  visible: boolean;
  /** Message to display. */
  message: string | null;
  /** Visual variant. */
  variant: AeroBarVariant;
  /** Optional action button. */
  action: AeroBarAction | null;
  /** Auto-dismiss duration in ms (0 = no auto-dismiss). */
  autoDismissMs: number;
  /** Whether the bar can be manually dismissed. */
  dismissible: boolean;
}

export interface AeroBarActions {
  /** Show the aerobar with a message. */
  show: (options: {
    message: string;
    variant?: AeroBarVariant;
    action?: AeroBarAction;
    autoDismissMs?: number;
    dismissible?: boolean;
  }) => void;
  /** Hide the aerobar. */
  dismiss: () => void;
}

const initialState: AeroBarState = {
  visible: false,
  message: null,
  variant: 'info',
  action: null,
  autoDismissMs: 0,
  dismissible: true,
};

export const useAeroBarStore = create<AeroBarState & AeroBarActions>((set) => ({
  ...initialState,

  show: ({ message, variant = 'info', action, autoDismissMs = 0, dismissible = true }) =>
    set({
      visible: true,
      message,
      variant,
      action: action ?? null,
      autoDismissMs,
      dismissible,
    }),

  dismiss: () => set({ visible: false }),
}));
