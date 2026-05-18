import { NavigatePayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine } from "../types.js";

/**
 * navigate — delegates to config.onNavigate with the parsed op, target, and params.
 */
export async function handleNavigate(
  action: Action,
  config: ActionEngineConfig,
  _engine: ActionEngine,
): Promise<void> {
  const payload = NavigatePayloadSchema.parse(action.payload);
  config.onNavigate(payload.op, payload.target ?? "", payload.params);
}
