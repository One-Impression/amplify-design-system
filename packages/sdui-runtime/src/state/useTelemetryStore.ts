/**
 * useTelemetryStore — Zustand store that delegates telemetry calls to a
 * configured emitter. Action handlers use this store (via `.getState()`)
 * instead of the React-context-based `useTelemetry` hook, which is only
 * available inside a React tree.
 *
 * Call `useTelemetryStore.getState().configure(emitter)` during app bootstrap
 * (e.g. inside `<SduiRuntimeProvider>`) to wire the store to the real
 * telemetry implementation provided via `TelemetryContext`.
 */
import { create } from 'zustand';
import type { TelemetryEmitter } from '../telemetry/useTelemetry.js';

export interface TelemetryStoreState {
  /** The configured emitter (no-op by default). */
  emitter: TelemetryEmitter;
}

export interface TelemetryStoreActions {
  /** Wire a real emitter (call once during bootstrap). */
  configure: (emitter: TelemetryEmitter) => void;
  /** Track an event. Delegates to the configured emitter. */
  track: (
    name: string,
    params?: Record<string, unknown>,
    platforms?: string[],
  ) => void;
}

const noopEmitter: TelemetryEmitter = { emit: () => {} };

export const useTelemetryStore = create<
  TelemetryStoreState & TelemetryStoreActions
>((set, get) => ({
  emitter: noopEmitter,

  configure: (emitter) => set({ emitter }),

  track: (name, params, _platforms) => {
    get().emitter.emit(name, params);
  },
}));
