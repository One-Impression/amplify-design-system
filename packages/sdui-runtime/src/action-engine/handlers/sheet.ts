import { SheetPayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine } from "../types.js";

/**
 * sheet — opens a bottom sheet by its ID via the shared bottom-sheet store.
 */
export async function handleSheet(
  action: Action,
  _config: ActionEngineConfig,
  _engine: ActionEngine,
): Promise<void> {
  const payload = SheetPayloadSchema.parse(action.payload);

  // Dynamic import to avoid hard dependency on bottom-sheet store at module level.
  const { useBottomSheetStore } = await import("../../bottom-sheet/useBottomSheetStore.js");
  useBottomSheetStore.getState().open({ id: payload.sheet_id });
}
