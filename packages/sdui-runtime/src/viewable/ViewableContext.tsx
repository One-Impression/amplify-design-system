import { createContext, useContext } from "react";

/**
 * Context plumbed by a parent that already does viewport tracking (today:
 * `PageFeedRenderer`, which uses FlatList's `onViewableItemsChanged` to
 * dispatch `on_view` for its top-level items). When `trackedByList` is
 * `true`, child {@link Viewable} wrappers MUST NOT fire `on_view`
 * themselves — the list-level tracker is authoritative and double-firing
 * would dispatch `append_items` / analytics events twice.
 *
 * Default `false` so existing call sites (Viewable inside a plain
 * ScrollView, a snippet, a bottom sheet) keep using the local onLayout
 * fallback.
 *
 * Caveat: any `on_view` attached to a node *nested inside* a tracked
 * top-level item is also suppressed by the surrounding context, because
 * the tracker only observes top-level item visibility. The render layer
 * doesn't currently distinguish "this is the top-level item node" from
 * "this is its descendant", so we trade nested `on_view` for correct
 * top-level deduplication. No SDUI surface emits nested `on_view` today.
 */
export interface ViewableContextValue {
  trackedByList: boolean;
}

export const ViewableContext = createContext<ViewableContextValue>({
  trackedByList: false,
});

export function useViewableContext(): ViewableContextValue {
  return useContext(ViewableContext);
}
