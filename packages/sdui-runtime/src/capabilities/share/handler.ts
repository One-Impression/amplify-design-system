import { SharePayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig } from "../../action-engine/types.js";

/**
 * share.send — opens the native share sheet with text, URL, or image.
 * Uses expo-sharing via dynamic import.
 */
export async function handleShare(
  action: Action,
  _config: ActionEngineConfig,
): Promise<{ success?: unknown; error?: string }> {
  const payload = SharePayloadSchema.parse(action.payload);

  try {
    const { Share } = await import("react-native");

    const content: { message?: string; url?: string; title?: string } = {};
    if (payload.text) content.message = payload.text;
    if (payload.url) content.url = payload.url;

    const result = await Share.share(content);

    if (result.action === Share.dismissedAction) {
      return { error: "user_cancelled" };
    }

    return { success: { shared: true } };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "user_cancelled" };
  }
}
