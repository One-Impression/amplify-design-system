/**
 * Impression policy for the feed's list-level viewport tracker.
 *
 * Tuning either of these changes when an item counts as "viewed" for
 * the purposes of dispatching `on_view`. Adjust both as one decision —
 * the threshold defines the spatial bar (how much of the item must be
 * on screen) and the dwell time defines the temporal bar (how long it
 * has to stay there).
 */

/** Percentage of an item's pixels that must be on-screen to count. */
export const FEED_ITEM_VISIBLE_PERCENT_THRESHOLD = 50;

/** Milliseconds the item must remain ≥ threshold-visible before firing. */
export const FEED_ITEM_MIN_VIEW_TIME_MS = 100;
