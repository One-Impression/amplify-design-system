import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine } from "../types.js";
import { capabilityHandlers } from "../../registries/capabilities.js";

/**
 * capability — dispatcher for `capability:*` action types.
 *
 * Strips the "capability:" prefix, looks up the handler in the capability
 * registry, and invokes it. On failure, dispatches the action's on_error
 * chain if present.
 */
export async function handleCapability(
  action: Action,
  config: ActionEngineConfig,
  engine: ActionEngine,
): Promise<void> {
  const capabilityType = action.type.replace(/^capability:/, "");

  const handler = capabilityHandlers[capabilityType];
  if (!handler) {
    const errorMsg = `capability: unknown capability type "${capabilityType}"`;
    console.warn(errorMsg);
    if (action.on_error) {
      await engine.dispatch(action.on_error as Action);
    }
    return;
  }

  try {
    const result = await handler(action, config);

    if (result.error) {
      console.warn(`capability:${capabilityType} error:`, result.error);
      if (action.on_error) {
        await engine.dispatch(action.on_error as Action);
      }
      return;
    }

    // Success — dispatch on_success chain if present.
    if (action.on_success) {
      await engine.dispatch(action.on_success as Action);
    }
  } catch (err) {
    console.warn(`capability:${capabilityType} threw:`, err);
    if (action.on_error) {
      await engine.dispatch(action.on_error as Action);
    }
  }
}
