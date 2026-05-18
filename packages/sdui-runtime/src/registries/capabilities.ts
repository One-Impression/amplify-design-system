import type { ActionHandler } from "../action-engine/types.js";

/**
 * Registry mapping capability names to handler functions.
 * Populated by task 023 (sdui-action-handlers).
 *
 * Shape: { "files.pick_and_upload": filePickHandler, ... }
 */
export const capabilityHandlerRegistry: Record<string, ActionHandler> = {};
