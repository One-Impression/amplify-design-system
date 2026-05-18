/**
 * useSearchParamsStore — Zustand store for search/filter params.
 *
 * Tracks search query text and active filter selections per page.
 * Used by search bars, filter chips, and list endpoints that accept
 * search/filter params.
 *
 * Mirrors the legacy Redux searchParams slice.
 */
import { create } from 'zustand';

/** Active filter selection. */
export interface FilterSelection {
  /** Filter key (e.g. "category", "status", "platform"). */
  key: string;
  /** Selected value(s). */
  values: string[];
  /** Display label for the filter. */
  label?: string;
}

export interface SearchParamsState {
  /** Current search query text. */
  query: string;
  /** Active filter selections. */
  filters: Record<string, FilterSelection>;
  /** Sort field and direction. */
  sort: { field: string; direction: 'asc' | 'desc' } | null;
  /** Page identifier these params belong to. */
  pageId: string | null;
}

export interface SearchParamsActions {
  /** Set the search query text. */
  setQuery: (query: string) => void;
  /** Set a filter selection. */
  setFilter: (key: string, values: string[], label?: string) => void;
  /** Remove a filter. */
  removeFilter: (key: string) => void;
  /** Clear all filters (keep query). */
  clearFilters: () => void;
  /** Set sort field and direction. */
  setSort: (field: string, direction: 'asc' | 'desc') => void;
  /** Clear sort. */
  clearSort: () => void;
  /** Bind params to a specific page. */
  setPageId: (pageId: string) => void;
  /** Reset all search params. */
  reset: () => void;
}

const initialState: SearchParamsState = {
  query: '',
  filters: {},
  sort: null,
  pageId: null,
};

export const useSearchParamsStore = create<
  SearchParamsState & SearchParamsActions
>((set) => ({
  ...initialState,

  setQuery: (query) => set({ query }),

  setFilter: (key, values, label) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: { key, values, label },
      },
    })),

  removeFilter: (key) =>
    set((state) => {
      const { [key]: _, ...rest } = state.filters;
      return { filters: rest };
    }),

  clearFilters: () => set({ filters: {} }),

  setSort: (field, direction) => set({ sort: { field, direction } }),

  clearSort: () => set({ sort: null }),

  setPageId: (pageId) => set({ pageId }),

  reset: () => set(initialState),
}));
