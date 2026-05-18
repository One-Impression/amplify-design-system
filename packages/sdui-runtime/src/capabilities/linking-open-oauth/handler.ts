import { LinkingOpenOAuthPayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig } from "../../action-engine/types.js";

/**
 * linking.open_oauth — opens an in-app browser (SFAuthenticationSession
 * on iOS, Custom Tabs on Android) for OAuth flows.
 * Uses expo-web-browser via dynamic import.
 */
export async function handleLinkingOpenOAuth(
  action: Action,
  _config: ActionEngineConfig,
): Promise<{ success?: unknown; error?: string }> {
  const payload = LinkingOpenOAuthPayloadSchema.parse(action.payload);

  try {
    const WebBrowser = await import("expo-web-browser");

    const result = await WebBrowser.openAuthSessionAsync(
      payload.url,
      payload.callback_url_pattern,
    );

    if (result.type === "cancel" || result.type === "dismiss") {
      return { error: "user_cancelled" };
    }

    if (result.type === "success" && result.url) {
      const url = new URL(result.url);
      const query: Record<string, string> = {};
      url.searchParams.forEach((value, key) => {
        query[key] = value;
      });
      return {
        success: {
          callback_url: result.url,
          query,
        },
      };
    }

    return { error: "browser_unavailable" };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "browser_unavailable" };
  }
}
