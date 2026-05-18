import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig } from "../../action-engine/types.js";

/**
 * notifications.request_permission / notifications.get_token
 *
 * The handler determines which sub-operation to run based on the action's
 * full capability type (passed through action.type after "capability:" prefix
 * stripping). The capability registry maps both sub-operations to this handler.
 */
export async function handleNotifications(
  action: Action,
  _config: ActionEngineConfig,
): Promise<{ success?: unknown; error?: string }> {
  const capType = action.type.replace(/^capability:/, "");

  if (capType === "notifications.request_permission") {
    return requestPermission();
  }
  if (capType === "notifications.get_token") {
    return getToken();
  }

  return { error: `unknown notification sub-operation: ${capType}` };
}

/**
 * Request push notification permission.
 * Shows a pre-prompt UX before invoking the OS dialog.
 */
async function requestPermission(): Promise<{ success?: unknown; error?: string }> {
  try {
    const Notifications = await import("expo-notifications");

    const { status: existing } =
      await Notifications.getPermissionsAsync();

    if (existing === "granted") {
      return { success: { status: "granted" } };
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return { success: { status } };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "permission_denied" };
  }
}

/**
 * Retrieve the FCM/APNs push token.
 */
async function getToken(): Promise<{ success?: unknown; error?: string }> {
  try {
    const Notifications = await import("expo-notifications");
    const { Platform } = await import("react-native");

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      return { error: "permission_denied" };
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();

    return {
      success: {
        token: tokenData.data,
        platform: Platform.OS === "ios" ? "ios" : "android",
      },
    };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "permission_denied" };
  }
}
