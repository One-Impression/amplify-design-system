import { AppendItemsPayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine } from "../types.js";

/**
 * append_items — appends items to a target list node in the page store.
 * Supports cursor and has_more for infinite scroll pagination.
 */
export async function handleAppendItems(
  action: Action,
  _config: ActionEngineConfig,
  _engine: ActionEngine,
): Promise<void> {
  const payload = AppendItemsPayloadSchema.parse(action.payload);

  const { usePageStore } = await import("../../stores/page-store.js");
  usePageStore.getState().appendItems(payload.target, payload.items, {
    cursor: payload.cursor,
    hasMore: payload.has_more,
  });
}
