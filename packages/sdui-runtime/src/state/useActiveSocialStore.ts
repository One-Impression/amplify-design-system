/**
 * useActiveSocialStore — Zustand store for the active-social context the
 * creator-app uses to scope every BFF read it issues.
 *
 * A creator may have multiple linked social influencer profiles (one per
 * platform per account). The active selection is held in this store and
 * threaded into every `bff_call` as the `X-Active-Influencer-Id` header.
 * The server uses this to scope catalog, earnings, and feed reads to the
 * influencer the creator is currently acting as.
 *
 * Unlike `useDevConfigStore`'s `X-Dev-Identity` — which is localhost-only
 * — `X-Active-Influencer-Id` ships on EVERY environment. It is normal
 * production traffic, not a dev affordance.
 */
import { create } from 'zustand';

export interface ActiveSocialState {
  /**
   * The influencer id the creator is currently acting as, threaded into
   * each BFF read as the `X-Active-Influencer-Id` header. `null` means no
   * active selection — the header is omitted and the server falls back
   * to its default scoping for the authenticated creator.
   */
  activeInfluencerId: string | null;
}

export interface ActiveSocialActions {
  /** Set (or clear with `null`) the active influencer id. */
  setActiveInfluencerId: (value: string | null) => void;
}

export const useActiveSocialStore = create<
  ActiveSocialState & ActiveSocialActions
>((set) => ({
  activeInfluencerId: null,
  setActiveInfluencerId: (value) => set({ activeInfluencerId: value }),
}));
