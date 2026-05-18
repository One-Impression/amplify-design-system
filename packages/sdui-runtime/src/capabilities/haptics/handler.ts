import { HapticsPayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig } from "../../action-engine/types.js";

/**
 * haptics.trigger — fires a haptic feedback using expo-haptics.
 * Maps the schema's style enum to expo-haptics feedback types.
 */
export async function handleHaptics(
  action: Action,
  _config: ActionEngineConfig,
): Promise<{ success?: unknown; error?: string }> {
  const payload = HapticsPayloadSchema.parse(action.payload);

  try {
    const Haptics = await import("expo-haptics");

    switch (payload.style) {
      case "light":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case "medium":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case "heavy":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case "selection":
        await Haptics.selectionAsync();
        break;
      case "success":
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case "warning":
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case "error":
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
    }

    return { success: {} };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "unknown" };
  }
}
