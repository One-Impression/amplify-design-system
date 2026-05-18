import { DismissPayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine } from "../types.js";

/**
 * dismiss — closes a bottom sheet (or the topmost if no target specified).
 */
export async function handleDismiss(
  action: Action,
  _config: ActionEngineConfig,
  _engine: ActionEngine,
): Promise<void> {
  const payload = DismissPayloadSchema.parse(action.payload);

  const { useBottomSheetStore } = await import("../../stores/bottom-sheet-store.js");
  useBottomSheetStore.getState().close(payload.target);
}
