import { AppendItemsPayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action, Node } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine } from "../types.js";

/**
 * append_items — appends items to a target list node in the page store.
 * Supports cursor and has_more for infinite scroll pagination.
 *
 * We validate the envelope (target / cursor / has_more) but append the RAW
 * item nodes rather than the strict-parsed ones: appended nodes are validated
 * at render time by SduiNode, and a strict node parse here would silently strip
 * node-level fields the installed SDK doesn't yet model (e.g. `viewability`),
 * which would break the very triggers driving pagination. Keeping the raw nodes
 * is also forward-compatible with any future node field.
 */
export async function handleAppendItems(
  action: Action,
  _config: ActionEngineConfig,
  _engine: ActionEngine,
): Promise<void> {
  const payload = AppendItemsPayloadSchema.parse(action.payload);
  const rawItems =
    ((action.payload as { items?: Node[] } | undefined)?.items) ?? payload.items;

  const { usePageStore } = await import("../../state/usePageStore.js");
  usePageStore.getState().appendItems(payload.target, rawItems, {
    cursor: payload.cursor,
    hasMore: payload.has_more,
  });
}
