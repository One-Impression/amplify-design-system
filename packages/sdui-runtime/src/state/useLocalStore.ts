/**
 * useLocalStore — Zustand store for ephemeral local state.
 *
 * Action handlers (`set_local`, `compound` branch conditions) read and write
 * to this store via `.getState()`. The state is a flat `Record<string, unknown>`
 * keyed by dot-path strings (e.g. "form.submitted").
 */
import { create } from 'zustand';

export interface LocalStoreState {
  /** The local state map. */
  data: Record<string, unknown>;
}

export interface LocalStoreActions {
  /** Set a key to an arbitrary value. */
  set: (key: string, value: unknown) => void;
  /** Shallow-merge an object into an existing record value. */
  merge: (key: string, value: Record<string, unknown>) => void;
  /** Toggle a boolean key (falsy becomes true, truthy becomes false). */
  toggle: (key: string) => void;
  /** Increment a numeric key by `amount` (defaults to treating missing as 0). */
  increment: (key: string, amount: number) => void;
  /** Remove a key from the store. */
  remove: (key: string) => void;
  /** Read a key's current value. */
  get: (key: string) => unknown;
}

export const useLocalStore = create<LocalStoreState & LocalStoreActions>(
  (set, get) => ({
    data: {},

    set: (key, value) =>
      set((state) => ({ data: { ...state.data, [key]: value } })),

    merge: (key, value) =>
      set((state) => {
        const existing = state.data[key];
        const base =
          existing && typeof existing === 'object' && !Array.isArray(existing)
            ? (existing as Record<string, unknown>)
            : {};
        return { data: { ...state.data, [key]: { ...base, ...value } } };
      }),

    toggle: (key) =>
      set((state) => ({ data: { ...state.data, [key]: !state.data[key] } })),

    increment: (key, amount) =>
      set((state) => {
        const current = typeof state.data[key] === 'number' ? (state.data[key] as number) : 0;
        return { data: { ...state.data, [key]: current + amount } };
      }),

    remove: (key) =>
      set((state) => {
        const { [key]: _, ...rest } = state.data;
        return { data: rest };
      }),

    get: (key) => get().data[key],
  }),
);
