import { SheetPayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine } from "../types.js";
import { presentSheet } from "../../navigation/sheetPresenter.js";

/**
 * sheet — opens a previously-registered bottom sheet by id.
 *
 * The page renderer registers `page.bottom_sheets[]` entries on mount. This
 * handler opens the sheet by id (lookup pattern) — it does NOT stamp a new sheet
 * definition. `presentSheet` routes to the native-stack sheet route when
 * `SduiNavigationHost` is mounted, else to the legacy store-based host.
 */
export async function handleSheet(
  action: Action,
  _config: ActionEngineConfig,
  _engine: ActionEngine,
): Promise<void> {
  const payload = SheetPayloadSchema.parse(action.payload);
  presentSheet(payload.sheet_id);
}
