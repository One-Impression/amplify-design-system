/**
 * useAuthStore — Zustand store for auth state.
 *
 * Manages JWT access token, refresh token, and basic user info.
 * The BFF client reads from this store for auth headers; the auth
 * refresh interceptor writes back after a successful token refresh.
 *
 * Mirrors the legacy Redux auth slice.
 */
import { create } from 'zustand';

/** Minimal user info stored alongside tokens. */
export interface AuthUser {
  /** User/creator ID. */
  id: string;
  /** Display name. */
  name: string | null;
  /** Phone number (used for OTP login). */
  phone: string | null;
  /** Profile image URL. */
  avatarUrl: string | null;
}

export interface AuthState {
  /** JWT access token. */
  accessToken: string | null;
  /** Refresh token for session renewal. */
  refreshToken: string | null;
  /** Whether the user is authenticated. */
  isAuthenticated: boolean;
  /** Whether auth state is being loaded from storage. */
  isLoading: boolean;
  /** Basic user info. */
  user: AuthUser | null;
}

export interface AuthActions {
  /** Set tokens after successful login or refresh. */
  setTokens: (accessToken: string, refreshToken: string) => void;
  /** Set user info. */
  setUser: (user: AuthUser) => void;
  /** Update the access token after a refresh (keeps existing refresh token). */
  refreshAccessToken: (accessToken: string) => void;
  /** Set loading state (during hydration from secure storage). */
  setLoading: (isLoading: boolean) => void;
  /** Clear all auth state (logout). */
  logout: () => void;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  ...initialState,

  setTokens: (accessToken, refreshToken) =>
    set({
      accessToken,
      refreshToken,
      isAuthenticated: true,
      isLoading: false,
    }),

  setUser: (user) => set({ user }),

  refreshAccessToken: (accessToken) => set({ accessToken }),

  setLoading: (isLoading) => set({ isLoading }),

  logout: () =>
    set({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      user: null,
    }),
}));
