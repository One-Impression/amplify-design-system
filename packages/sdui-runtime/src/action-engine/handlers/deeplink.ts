import { DeeplinkPayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine } from "../types.js";

/**
 * deeplink — delegates to config.onDeeplink to handle an in-app or external deep link.
 */
export async function handleDeeplink(
  action: Action,
  config: ActionEngineConfig,
  _engine: ActionEngine,
): Promise<void> {
  const payload = DeeplinkPayloadSchema.parse(action.payload);
  config.onDeeplink(payload.url);
}
