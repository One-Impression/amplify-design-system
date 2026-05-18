/**
 * Enhanced Action Engine — the central dispatcher for all SDUI actions.
 *
 * Responsibilities:
 * - Routes action verbs to their registered handlers
 * - Routes "capability:*" types to the capability dispatcher
 * - Handles async chains (on_success / on_error)
 * - Provides the ActionEngine interface to handlers for recursive dispatch
 */
import type { Action } from "@one-impression/sdk-native-sdui";
import type { ActionEngineConfig, ActionEngine, ActionHandler } from "./types.js";
import { actionHandlerMap } from "./handlers/index.js";
import { handleCapability } from "./handlers/capability.js";

/**
 * Creates an ActionEngine instance bound to the given config.
 *
 * The engine exposes a single `dispatch` method that handlers use
 * for recursive/chained dispatch (compound, on_success, on_error).
 */
export function createActionEngine(config: ActionEngineConfig): ActionEngine {
  const engine: ActionEngine = {
    dispatch: async (action: Action): Promise<void> => {
      await dispatchAction(action, config, engine);
    },
  };

  return engine;
}

/**
 * Core dispatch logic.
 *
 * 1. If the action type starts with "capability:", route to the capability dispatcher.
 * 2. Otherwise look up the verb handler from the registry.
 * 3. On success, dispatch on_success if present.
 * 4. On error, dispatch on_error if present; otherwise re-throw.
 */
async function dispatchAction(
  action: Action,
  config: ActionEngineConfig,
  engine: ActionEngine,
): Promise<void> {
  const { type } = action;

  // Route capability:* actions to the capability dispatcher.
  if (type.startsWith("capability:")) {
    await handleCapability(action, config, engine);
    return;
  }

  // Look up the verb handler.
  const handler: ActionHandler | undefined = actionHandlerMap[type];
  if (!handler) {
    console.warn(`action-engine: unknown action type "${type}"`);
    return;
  }

  try {
    await handler(action, config, engine);

    // The handler executed successfully.
    // For most handlers, on_success chaining is handled inside the handler
    // itself (e.g., bff_call). For simple handlers that don't manage their
    // own chains, we dispatch on_success here as a fallback.
    // bff_call and capability already handle their own on_success internally,
    // so they won't have on_success remaining at this level unless the
    // handler explicitly leaves it to the engine.
    if (action.on_success && type !== "bff_call") {
      await engine.dispatch(action.on_success as Action);
    }
  } catch (err) {
    if (action.on_error) {
      await engine.dispatch(action.on_error as Action);
    } else {
      throw err;
    }
  }
}
