/**
 * Action verb handlers — maps each verb string to its handler function.
 */
import type { ActionHandler } from "../types.js";
import { handleNavigate } from "./navigate.js";
import { handleBffCall } from "./bff-call.js";
import { handleSheet } from "./sheet.js";
import { handleDismiss } from "./dismiss.js";
import { handleToast } from "./toast.js";
import { handleReloadSection } from "./reload-section.js";
import { handleReplaceSection } from "./replace-section.js";
import { handleAppendItems } from "./append-items.js";
import { handleSetLocal } from "./set-local.js";
import { handleEmitTelemetry } from "./emit-telemetry.js";
import { handleCompound } from "./compound.js";
import { handleCapability } from "./capability.js";
import { handleDeeplink } from "./deeplink.js";
import { handleBranch } from "./branch.js";

export {
  handleNavigate,
  handleBffCall,
  handleSheet,
  handleDismiss,
  handleToast,
  handleReloadSection,
  handleReplaceSection,
  handleAppendItems,
  handleSetLocal,
  handleEmitTelemetry,
  handleCompound,
  handleCapability,
  handleDeeplink,
  handleBranch,
};

/**
 * Complete handler map — used by the action engine to dispatch by verb.
 * The "capability" key is a catch-all routed by the action engine itself
 * (any type starting with "capability:" is routed to handleCapability).
 */
export const actionHandlerMap: Record<string, ActionHandler> = {
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
  deeplink: handleDeeplink,
  branch: handleBranch,
};
