import { AppRefreshPayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig } from "../../action-engine/types.js";

/**
 * app.refresh — triggers a full app refresh.
 * Invalidates the page store cache and re-fetches the current page.
 */
export async function handleAppRefresh(
  action: Action,
  _config: ActionEngineConfig,
): Promise<{ success?: unknown; error?: string }> {
  AppRefreshPayloadSchema.parse(action.payload);

  try {
    const { usePageStore } = await import("../../state/usePageStore.js");
    usePageStore.getState().refresh();
    return { success: {} };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "unknown" };
  }
}
