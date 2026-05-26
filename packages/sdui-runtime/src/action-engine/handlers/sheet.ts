import { SheetPayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine } from "../types.js";

/**
 * sheet — opens a previously-registered bottom sheet by id.
 *
 * The page renderer registers `page.bottom_sheets[]` entries on mount via
 * `useBottomSheetStore.register()`. This handler simply opens the sheet by
 * id (lookup pattern) — it does NOT stamp a new sheet definition.
 */
export async function handleSheet(
  action: Action,
  _config: ActionEngineConfig,
  _engine: ActionEngine,
): Promise<void> {
  const payload = SheetPayloadSchema.parse(action.payload);

  // Dynamic import to avoid hard dependency on bottom-sheet store at module level.
  const { useBottomSheetStore } = await import(
    "../../bottom-sheet/useBottomSheetStore.js"
  );
  useBottomSheetStore.getState().open(payload.sheet_id);
}
