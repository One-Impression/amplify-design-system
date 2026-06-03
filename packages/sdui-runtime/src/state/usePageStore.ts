/**
 * usePageStore — Zustand store for page-level state.
 *
 * Tracks two layers:
 *
 *   1. A legacy `sections` map, kept for back-compat with renderers that
 *      address content by section id (reload / refresh / append at section
 *      granularity). Mirrors the legacy Redux page slice.
 *   2. A `page` tree — the full SDUI page envelope. Action handlers
 *      (`replace_section`, `reload_section`, `append_items`) mutate nodes
 *      anywhere in the tree by id via {@link PageStoreActions.replaceNode}
 *      and {@link PageStoreActions.appendItems}.
 */
import { create } from 'zustand';
import type { Node, Page } from '@one-impression/sdk-native-sdui';

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

/** Options for {@link PageStoreActions.appendItems}. */
export interface AppendItemsOptions {
  cursor?: string;
  hasMore?: boolean;
}

export interface PageStoreState {
  /** Current page identifier. */
  pageId: string | null;
  /** The full SDUI page envelope, when one is loaded. */
  page: Page | null;
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
  /** Set the full SDUI page envelope (used by the page loader on initial fetch). */
  setPageTree: (page: Page) => void;
  /** Replace a section's data entirely (used for reload/refresh). */
  replaceSection: (sectionId: string, data: unknown) => void;
  /** Append data to a section (used for pagination/infinite scroll). */
  appendSection: (sectionId: string, data: unknown, cursor: string | null, hasMore: boolean) => void;
  /**
   * Replace a node anywhere in the page tree (matched by `node.id`).
   *
   * Walks `page.items` recursively, descending into each node's
   * `data.items` (when present). The matched node is replaced wholesale
   * with `next`. If no node matches `targetId`, the call is a no-op and a
   * warning is logged.
   *
   * Consumers: `handleReloadSection`, `handleReplaceSection`.
   */
  replaceNode: (targetId: string, next: Node) => void;
  /**
   * Append `items` to the `data.items` array of the node identified by
   * `targetId`. If the target is found but has no array at `data.items`,
   * the call is a no-op and a warning is logged. If the target is not
   * found at all, the call is also a no-op (with a warning).
   *
   * `options.cursor` / `options.hasMore` are merged into the target's
   * `data` so a feed renderer can observe pagination state from a single
   * tree.
   *
   * Consumer: `handleAppendItems`.
   */
  appendItems: (targetId: string, items: Node[], options?: AppendItemsOptions) => void;
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
  page: null,
  sections: {},
  loading: false,
  error: null,
};

/**
 * Recursively rebuild `nodes`, replacing the first node whose `id === targetId`
 * with `next`. Returns `[newNodes, matched]`. Exported for unit-tests via
 * the `__internal` namespace at the bottom of this module.
 */
function replaceNodeInTree(
  nodes: Node[],
  targetId: string,
  next: Node,
): [Node[], boolean] {
  let matched = false;
  const out: Node[] = [];
  for (const n of nodes) {
    if (matched) {
      out.push(n);
      continue;
    }
    if (n.id === targetId) {
      out.push(next);
      matched = true;
      continue;
    }
    // Descend into common container fields. `data.items` is the canonical
    // child list for snippets / feed nodes in the SDUI wire format.
    const data = (n.data ?? {}) as Record<string, unknown>;
    const childItems = data['items'];
    if (Array.isArray(childItems)) {
      const [nextChildren, didMatch] = replaceNodeInTree(
        childItems as Node[],
        targetId,
        next,
      );
      if (didMatch) {
        out.push({ ...n, data: { ...data, items: nextChildren } });
        matched = true;
        continue;
      }
    }
    out.push(n);
  }
  return [out, matched];
}

/**
 * Recursively rebuild `nodes`, appending `items` to the `data.items` of the
 * node whose `id === targetId`. Returns `[newNodes, matched, mutated]`,
 * where `mutated` is `true` iff a target was found *and* its `data.items`
 * was a real array we could append to.
 */
function appendItemsInTree(
  nodes: Node[],
  targetId: string,
  items: Node[],
  options: AppendItemsOptions,
): [Node[], boolean, boolean] {
  let matched = false;
  let mutated = false;
  const out: Node[] = [];
  for (const n of nodes) {
    if (matched) {
      out.push(n);
      continue;
    }
    if (n.id === targetId) {
      matched = true;
      const data = (n.data ?? {}) as Record<string, unknown>;
      const existing = data['items'];
      if (Array.isArray(existing)) {
        const nextData: Record<string, unknown> = {
          ...data,
          items: [...(existing as Node[]), ...items],
        };
        if (options.cursor !== undefined) nextData['cursor'] = options.cursor;
        if (options.hasMore !== undefined) nextData['has_more'] = options.hasMore;
        out.push({ ...n, data: nextData });
        mutated = true;
      } else {
        out.push(n);
      }
      continue;
    }
    const data = (n.data ?? {}) as Record<string, unknown>;
    const childItems = data['items'];
    if (Array.isArray(childItems)) {
      const [nextChildren, didMatch, didMutate] = appendItemsInTree(
        childItems as Node[],
        targetId,
        items,
        options,
      );
      if (didMatch) {
        out.push({ ...n, data: { ...data, items: nextChildren } });
        matched = true;
        if (didMutate) mutated = true;
        continue;
      }
    }
    out.push(n);
  }
  return [out, matched, mutated];
}

export const usePageStore = create<PageStoreState & PageStoreActions>((set) => ({
  ...initialState,

  setPage: (pageId, sections) =>
    set({ pageId, sections, loading: false, error: null }),

  setPageTree: (page) =>
    set({ page, pageId: page.id, loading: false, error: null }),

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

  replaceNode: (targetId, next) =>
    set((state) => {
      if (!state.page) {
        console.warn(
          `[usePageStore.replaceNode] no page loaded; ignoring replaceNode("${targetId}")`,
        );
        return {};
      }
      const [nextItems, matched] = replaceNodeInTree(
        state.page.items,
        targetId,
        next,
      );
      if (!matched) {
        console.warn(
          `[usePageStore.replaceNode] no node with id "${targetId}" in page "${state.page.id}"`,
        );
        return {};
      }
      return { page: { ...state.page, items: nextItems } };
    }),

  appendItems: (targetId, items, options = {}) =>
    set((state) => {
      if (!state.page) {
        console.warn(
          `[usePageStore.appendItems] no page loaded; ignoring appendItems("${targetId}")`,
        );
        return {};
      }
      const [nextItems, matched, mutated] = appendItemsInTree(
        state.page.items,
        targetId,
        items,
        options,
      );
      if (!matched) {
        console.warn(
          `[usePageStore.appendItems] no node with id "${targetId}" in page "${state.page.id}"`,
        );
        return {};
      }
      if (!mutated) {
        console.warn(
          `[usePageStore.appendItems] node "${targetId}" has no data.items array; nothing to append to`,
        );
        return {};
      }
      return { page: { ...state.page, items: nextItems } };
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

/** Exported only for unit-tests — do not consume from app code. */
export const __internal = { replaceNodeInTree, appendItemsInTree };
