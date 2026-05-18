import { PhonePayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig } from "../../action-engine/types.js";

/**
 * phone.dial — opens the phone dialer with the given number.
 * Uses React Native Linking.openURL('tel:...').
 */
export async function handlePhone(
  action: Action,
  _config: ActionEngineConfig,
): Promise<{ success?: unknown; error?: string }> {
  const payload = PhonePayloadSchema.parse(action.payload);

  try {
    const { Linking } = await import("react-native");
    const telUrl = `tel:${payload.number}`;

    const canOpen = await Linking.canOpenURL(telUrl);
    if (!canOpen) {
      return { error: "no_handler" };
    }

    await Linking.openURL(telUrl);
    return { success: {} };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "no_handler" };
  }
}
