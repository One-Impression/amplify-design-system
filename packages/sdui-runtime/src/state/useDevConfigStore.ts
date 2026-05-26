/**
 * useDevConfigStore — Zustand store for developer-only configuration.
 *
 * Holds values that should only ever influence requests against a local
 * BFF (e.g. `http://localhost:3000` or `http://127.0.0.1:3000`). The
 * canonical example is the `X-Dev-Identity` header — a base64-encoded
 * identity payload the creator-app uses to authenticate against a
 * mocked / locally-running gateway when the real auth flow is bypassed.
 *
 * The bff_call handler reads this store and ONLY injects the header
 * when the BFF base URL points at localhost / 127.0.0.1. If the value
 * is unset, the header is silently skipped. Nothing in this store is
 * ever sent to a production BFF.
 */
import { create } from 'zustand';

export interface DevConfigState {
  /**
   * Base64-encoded identity payload sent as the `X-Dev-Identity`
   * request header when the BFF base URL is localhost / 127.0.0.1.
   * `null` disables injection.
   */
  devIdentity: string | null;
}

export interface DevConfigActions {
  /** Set (or clear with `null`) the dev identity header value. */
  setDevIdentity: (value: string | null) => void;
}

export const useDevConfigStore = create<DevConfigState & DevConfigActions>(
  (set) => ({
    devIdentity: null,
    setDevIdentity: (value) => set({ devIdentity: value }),
  }),
);
