import type { Node } from "@one-impression/sdk-native-sdui";

/**
 * Apply an `active_index` to a list of tab Nodes by overriding each Node's
 * `data.active` flag.
 *
 * - The Node at `activeIndex` gets `data.active = true`.
 * - All other Nodes get `data.active = false` so they reset to inactive
 *   even if the producer pre-set them as active.
 * - When `activeIndex` is `undefined`, items are returned unchanged so a
 *   producer can opt out of selection management and rely on each tab's
 *   own `data.active` value.
 *
 * Returns a new array of new Node objects — never mutates the inputs.
 * Nodes with non-object `data` are passed through untouched.
 */
export function applyActiveIndex<T extends Node>(
  items: T[],
  activeIndex: number | undefined,
): T[] {
  if (activeIndex === undefined) return items;
  return items.map((item, i) => {
    if (!item || typeof item.data !== "object" || item.data === null) {
      return item;
    }
    return {
      ...item,
      data: {
        ...(item.data as Record<string, unknown>),
        active: i === activeIndex,
      },
    } as T;
  });
}
