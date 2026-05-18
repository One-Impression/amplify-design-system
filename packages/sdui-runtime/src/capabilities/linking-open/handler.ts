import { LinkingOpenPayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig } from "../../action-engine/types.js";

/**
 * linking.open — opens an external URL via React Native Linking.
 */
export async function handleLinkingOpen(
  action: Action,
  _config: ActionEngineConfig,
): Promise<{ success?: unknown; error?: string }> {
  const payload = LinkingOpenPayloadSchema.parse(action.payload);

  try {
    const { Linking } = await import("react-native");

    const canOpen = await Linking.canOpenURL(payload.url);
    if (!canOpen) {
      return { error: "no_handler" };
    }

    await Linking.openURL(payload.url);
    return { success: {} };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "invalid_url" };
  }
}
