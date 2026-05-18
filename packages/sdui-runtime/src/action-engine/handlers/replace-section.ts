import { ReplaceSectionPayloadSchema } from "@one-impression/sdk-native-sdui";
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine } from "../types.js";

/**
 * replace_section — replaces a target node with inline content (no BFF call).
 */
export async function handleReplaceSection(
  action: Action,
  _config: ActionEngineConfig,
  _engine: ActionEngine,
): Promise<void> {
  const payload = ReplaceSectionPayloadSchema.parse(action.payload);

  const { usePageStore } = await import("../../state/usePageStore.js");
  usePageStore.getState().replaceNode(payload.target, payload.with_node);
}
