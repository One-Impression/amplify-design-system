import { UiTooltipPayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig } from "../../action-engine/types.js";

/**
 * ui.show_tooltip — shows a tooltip near a target element.
 * Delegates to the tooltip store which the UI layer subscribes to.
 */
export async function handleUiTooltip(
  action: Action,
  _config: ActionEngineConfig,
): Promise<{ success?: unknown; error?: string }> {
  const payload = UiTooltipPayloadSchema.parse(action.payload);

  try {
    const { useTooltipStore } = await import("../../stores/tooltip-store.js");
    useTooltipStore.getState().show({
      target: payload.target,
      text: payload.text,
      position: payload.position,
      autoDismissMs: payload.auto_dismiss_ms,
    });

    return { success: {} };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "unknown" };
  }
}
