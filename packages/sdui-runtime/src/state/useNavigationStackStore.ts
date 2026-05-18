/**
 * useNavigationStackStore — Zustand store for navigation stack tracking.
 *
 * Tracks the SDUI navigation history so the action engine can implement
 * "back" behavior and the app can show/hide back buttons appropriately.
 *
 * This is NOT a replacement for React Navigation — it tracks the SDUI
 * logical navigation within a single native screen/tab. The native
 * navigator handles top-level routing; this tracks SDUI page transitions
 * within that context.
 *
 * Mirrors the legacy Redux navigationStack slice.
 */
import { create } from 'zustand';

/** A single entry in the navigation stack. */
export interface NavigationEntry {
  /** Page identifier (e.g. "home", "campaigns/123"). */
  pageId: string;
  /** Endpoint used to fetch this page. */
  endpointId: string;
  /** Params used to fetch this page (for back-navigation refetch). */
  params?: Record<string, string>;
  /** Query params used. */
  query?: Record<string, string>;
  /** Timestamp of when this entry was pushed. */
  timestamp: number;
  /** Optional title for display in breadcrumbs. */
  title?: string;
}

export interface NavigationStackState {
  /** The navigation stack (last element is current). */
  stack: NavigationEntry[];
  /** Whether back navigation is possible. */
  canGoBack: boolean;
}

export interface NavigationStackActions {
  /** Push a new page onto the stack. */
  push: (entry: Omit<NavigationEntry, 'timestamp'>) => void;
  /** Pop the current page and return to previous. */
  pop: () => NavigationEntry | undefined;
  /** Replace the current (top) page without adding to history. */
  replace: (entry: Omit<NavigationEntry, 'timestamp'>) => void;
  /** Reset the stack to a single root entry. */
  resetTo: (entry: Omit<NavigationEntry, 'timestamp'>) => void;
  /** Get the current (top) entry. */
  current: () => NavigationEntry | undefined;
  /** Clear the entire stack. */
  clear: () => void;
}

const initialState: NavigationStackState = {
  stack: [],
  canGoBack: false,
};

export const useNavigationStackStore = create<
  NavigationStackState & NavigationStackActions
>((set, get) => ({
  ...initialState,

  push: (entry) =>
    set((state) => {
      const newEntry: NavigationEntry = { ...entry, timestamp: Date.now() };
      const stack = [...state.stack, newEntry];
      return { stack, canGoBack: stack.length > 1 };
    }),

  pop: () => {
    const state = get();
    if (state.stack.length <= 1) return undefined;

    const popped = state.stack[state.stack.length - 1];
    const stack = state.stack.slice(0, -1);
    set({ stack, canGoBack: stack.length > 1 });
    return popped;
  },

  replace: (entry) =>
    set((state) => {
      const newEntry: NavigationEntry = { ...entry, timestamp: Date.now() };
      const stack =
        state.stack.length > 0
          ? [...state.stack.slice(0, -1), newEntry]
          : [newEntry];
      return { stack, canGoBack: stack.length > 1 };
    }),

  resetTo: (entry) => {
    const newEntry: NavigationEntry = { ...entry, timestamp: Date.now() };
    set({ stack: [newEntry], canGoBack: false });
  },

  current: () => {
    const state = get();
    return state.stack[state.stack.length - 1];
  },

  clear: () => set(initialState),
}));
