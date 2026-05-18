import { ClipboardPayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig } from "../../action-engine/types.js";

/**
 * clipboard.copy — copies text to the system clipboard.
 * Uses expo-clipboard via dynamic import.
 */
export async function handleClipboard(
  action: Action,
  _config: ActionEngineConfig,
): Promise<{ success?: unknown; error?: string }> {
  const payload = ClipboardPayloadSchema.parse(action.payload);

  try {
    const Clipboard = await import("expo-clipboard");
    await Clipboard.setStringAsync(payload.text);
    return { success: {} };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "unknown" };
  }
}
