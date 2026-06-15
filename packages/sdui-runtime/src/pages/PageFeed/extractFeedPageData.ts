import type { Action, Node } from "@one-impression/sdk-native-sdui";
import type { GradientItem } from "../../gradient/index.js";

/**
 * Bag of optional fields the feed renderer reads off `page.data`.
 *
 * `config` / `footer` are additive fields on the upstream PageFeed schema.
 * Until the schema package republishes with those fields exposed, the
 * renderer reads them through {@link extractFeedPageData}, which casts the
 * bag from the parent schema's loose `data?: object` to this augmented
 * shape. Once the upstream types catch up the cast becomes a no-op.
 */
export interface FeedPageData {
  header?: Node;
  filters?: Node[];
  on_load_more?: Action;
  loader?: Node;
  empty_state?: Node;
  config?: FeedPageConfig;
  footer?: Node;
  /**
   * BFF-provided skeleton shown over the content area while a reload is in
   * flight (filter change → content-only; tab switch → whole page). Lives in
   * the page envelope so it's cached client-side and renders instantly, with no
   * round-trip. A list of placeholder nodes (e.g. shimmer cards).
   */
  skeleton?: Node[];
}

export interface FeedPageConfig {
  gradient?: GradientItem;
  bg_color?: { type: string };
  scroll_header_color?: { type: string };
}

/**
 * Type-safe accessor for the loose `page.data` bag. Returns an object — never
 * `null` / `undefined` — so callers can always destructure.
 */
export function extractFeedPageData(data: unknown): FeedPageData {
  if (!data || typeof data !== "object") return {};
  return data as FeedPageData;
}
