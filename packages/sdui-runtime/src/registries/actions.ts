import type { ActionHandler } from "../action-engine/types.js";

/**
 * Registry mapping action verb strings to handler functions.
 * Populated by task 023 (sdui-action-handlers).
 *
 * Shape: { "navigate": navigateHandler, "bff_call": bffCallHandler, ... }
 */
export const actionHandlerRegistry: Record<string, ActionHandler> = {};
