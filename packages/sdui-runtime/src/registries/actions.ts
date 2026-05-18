/**
 * Action verb registry — maps all 13 verb strings to their handler functions.
 *
 * Task 11 created this as an empty placeholder. Task 23 populates it with
 * all handler implementations.
 */
import type { ActionHandler } from "../action-engine/types.js";
import { handleNavigate } from "../action-engine/handlers/navigate.js";
import { handleBffCall } from "../action-engine/handlers/bff-call.js";
import { handleSheet } from "../action-engine/handlers/sheet.js";
import { handleDismiss } from "../action-engine/handlers/dismiss.js";
import { handleToast } from "../action-engine/handlers/toast.js";
import { handleReloadSection } from "../action-engine/handlers/reload-section.js";
import { handleReplaceSection } from "../action-engine/handlers/replace-section.js";
import { handleAppendItems } from "../action-engine/handlers/append-items.js";
import { handleSetLocal } from "../action-engine/handlers/set-local.js";
import { handleEmitTelemetry } from "../action-engine/handlers/emit-telemetry.js";
import { handleCompound } from "../action-engine/handlers/compound.js";
import { handleCapability } from "../action-engine/handlers/capability.js";
import { handleDeeplink } from "../action-engine/handlers/deeplink.js";

/**
 * All 13 action verb handlers.
 *
 * Note: "capability" is not a real verb in the ActionType enum; actions
 * starting with "capability:" are routed by the engine directly. It is
 * included here for completeness so the registry can be used as a fallback.
 */
export const actionHandlers: Record<string, ActionHandler> = {
  navigate: handleNavigate,
  bff_call: handleBffCall,
  sheet: handleSheet,
  dismiss: handleDismiss,
  toast: handleToast,
  reload_section: handleReloadSection,
  replace_section: handleReplaceSection,
  append_items: handleAppendItems,
  set_local: handleSetLocal,
  emit_telemetry: handleEmitTelemetry,
  compound: handleCompound,
  capability: handleCapability,
  deeplink: handleDeeplink,
};

/** @deprecated Use `actionHandlers` — kept for backward compatibility with foundation exports. */
export const actionHandlerRegistry = actionHandlers;
