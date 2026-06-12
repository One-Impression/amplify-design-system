import { DismissPayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine } from "../types.js";
import { dismissSheet } from "../../navigation/sheetPresenter.js";

/**
 * dismiss — closes a bottom sheet (or the topmost if no target specified).
 *
 * `dismissSheet` pops the native-stack sheet route when `SduiNavigationHost` is
 * mounted, else closes via the legacy store-based host. (Static import: a
 * dynamic `import()` here silently no-ops under the playground's metro src-alias.)
 */
export async function handleDismiss(
  action: Action,
  _config: ActionEngineConfig,
  _engine: ActionEngine,
): Promise<void> {
  const payload = DismissPayloadSchema.parse(action.payload);
  dismissSheet(payload.target);
}
