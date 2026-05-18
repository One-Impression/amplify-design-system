import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngine, ActionEngineConfig, ActionHandler } from "./types.js";
import { actionHandlerRegistry } from "../registries/actions.js";
import { capabilityHandlerRegistry } from "../registries/capabilities.js";

export function createActionEngine(config: ActionEngineConfig): ActionEngine {
  const dispatch = (action: Action): void => {
    const { type } = action;

    // Capability actions: type starts with "capability:"
    if (type.startsWith("capability:")) {
      const capName = type.slice("capability:".length);
      const handler = capabilityHandlerRegistry[capName];
      if (handler) {
        handler(action, config);
      }
      return;
    }

    // Standard action verbs
    const handler: ActionHandler | undefined = actionHandlerRegistry[type];
    if (handler) {
      handler(action, config);
    }
    // Unknown action type — silent skip per forward-compat contract
  };

  return { dispatch };
}
