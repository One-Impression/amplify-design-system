/**
 * usePageStore — Zustand store for page-level state.
 *
 * Mirrors the legacy Redux page slice. Tracks the current page's sections
 * map with support for reload, replace, and append operations on individual
 * sections.
 */
import { create } from 'zustand';

/** A single section's data within a page. */
export interface PageSection {
  /** Unique section identifier. */
  id: string;
  /** The section's SDUI node data (opaque at this layer). */
  data: unknown;
  /** Whether this section is currently loading. */
  loading: boolean;
  /** Error message if the section failed to load. */
  error: string | null;
  /** Pagination cursor for append operations. */
  cursor: string | null;
  /** Whether more data is available for this section. */
  hasMore: boolean;
}

export interface PageStoreState {
  /** Current page identifier. */
  pageId: string | null;
  /** Sections map keyed by section ID. */
  sections: Record<string, PageSection>;
  /** Whether the full page is loading. */
  loading: boolean;
  /** Page-level error. */
  error: string | null;
}

export interface PageStoreActions {
  /** Set the current page and its initial sections. */
  setPage: (pageId: string, sections: Record<string, PageSection>) => void;
  /** Replace a section's data entirely (used for reload/refresh). */
  replaceSection: (sectionId: string, data: unknown) => void;
  /** Append data to a section (used for pagination/infinite scroll). */
  appendSection: (sectionId: string, data: unknown, cursor: string | null, hasMore: boolean) => void;
  /** Set loading state for a specific section. */
  setSectionLoading: (sectionId: string, loading: boolean) => void;
  /** Set error state for a specific section. */
  setSectionError: (sectionId: string, error: string | null) => void;
  /** Set page-level loading state. */
  setLoading: (loading: boolean) => void;
  /** Set page-level error. */
  setError: (error: string | null) => void;
  /** Clear all page state. */
  reset: () => void;
}

const initialState: PageStoreState = {
  pageId: null,
  sections: {},
  loading: false,
  error: null,
};

export const usePageStore = create<PageStoreState & PageStoreActions>((set) => ({
  ...initialState,

  setPage: (pageId, sections) =>
    set({ pageId, sections, loading: false, error: null }),

  replaceSection: (sectionId, data) =>
    set((state) => ({
      sections: {
        ...state.sections,
        [sectionId]: {
          ...state.sections[sectionId],
          id: sectionId,
          data,
          loading: false,
          error: null,
        },
      },
    })),

  appendSection: (sectionId, data, cursor, hasMore) =>
    set((state) => {
      const existing = state.sections[sectionId];
      const existingData = existing?.data;
      // If both existing and new data are arrays, concatenate
      const mergedData =
        Array.isArray(existingData) && Array.isArray(data)
          ? [...existingData, ...data]
          : data;

      return {
        sections: {
          ...state.sections,
          [sectionId]: {
            ...existing,
            id: sectionId,
            data: mergedData,
            cursor,
            hasMore,
            loading: false,
            error: null,
          },
        },
      };
    }),

  setSectionLoading: (sectionId, loading) =>
    set((state) => ({
      sections: {
        ...state.sections,
        [sectionId]: {
          ...state.sections[sectionId],
          id: sectionId,
          loading,
          data: state.sections[sectionId]?.data ?? null,
          error: state.sections[sectionId]?.error ?? null,
          cursor: state.sections[sectionId]?.cursor ?? null,
          hasMore: state.sections[sectionId]?.hasMore ?? false,
        },
      },
    })),

  setSectionError: (sectionId, error) =>
    set((state) => ({
      sections: {
        ...state.sections,
        [sectionId]: {
          ...state.sections[sectionId],
          id: sectionId,
          error,
          loading: false,
          data: state.sections[sectionId]?.data ?? null,
          cursor: state.sections[sectionId]?.cursor ?? null,
          hasMore: state.sections[sectionId]?.hasMore ?? false,
        },
      },
    })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error, loading: false }),

  reset: () => set(initialState),
}));
