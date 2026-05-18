import { ToastPayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine } from "../types.js";

/**
 * toast — shows a toast notification via the config callback.
 */
export async function handleToast(
  action: Action,
  config: ActionEngineConfig,
  _engine: ActionEngine,
): Promise<void> {
  const payload = ToastPayloadSchema.parse(action.payload);
  config.onToast(payload.level, payload.message);
}
