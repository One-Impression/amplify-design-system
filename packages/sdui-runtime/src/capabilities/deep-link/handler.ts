import { DeepLinkPayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig } from "../../action-engine/types.js";

/**
 * deep_link.resolve — resolves an in-app deep link.
 * Delegates to config.onDeeplink which the host app implements.
 */
export async function handleDeepLink(
  action: Action,
  config: ActionEngineConfig,
): Promise<{ success?: unknown; error?: string }> {
  const payload = DeepLinkPayloadSchema.parse(action.payload);

  try {
    config.onDeeplink(payload.url);
    return { success: { handled: true } };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "unknown" };
  }
}
