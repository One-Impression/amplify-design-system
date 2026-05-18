/**
 * Capability handlers barrel — exports all 13 capability handler functions
 * and the complete capability handler map.
 */
import type { CapabilityHandler } from "../action-engine/types.js";
import { handleFiles } from "./files/handler.js";
import { handleCamera } from "./camera/handler.js";
import { handleNotifications } from "./notifications/handler.js";
import { handleLinkingOpen } from "./linking-open/handler.js";
import { handleLinkingOpenOAuth } from "./linking-open-oauth/handler.js";
import { handleDeepLink } from "./deep-link/handler.js";
import { handleShare } from "./share/handler.js";
import { handleClipboard } from "./clipboard/handler.js";
import { handleHaptics } from "./haptics/handler.js";
import { handleAuth } from "./auth/handler.js";
import { handlePhone } from "./phone/handler.js";
import { handleUiTooltip } from "./ui-tooltip/handler.js";
import { handleAppRefresh } from "./app-refresh/handler.js";

export {
  handleFiles,
  handleCamera,
  handleNotifications,
  handleLinkingOpen,
  handleLinkingOpenOAuth,
  handleDeepLink,
  handleShare,
  handleClipboard,
  handleHaptics,
  handleAuth,
  handlePhone,
  handleUiTooltip,
  handleAppRefresh,
};

/**
 * Complete capability handler map — keyed by CapabilityType values.
 * Multiple auth/notification sub-operations share a single handler.
 */
export const capabilityHandlerMap: Record<string, CapabilityHandler> = {
  "files.pick_and_upload": handleFiles,
  "camera.capture": handleCamera,
  "notifications.request_permission": handleNotifications,
  "notifications.get_token": handleNotifications,
  "linking.open": handleLinkingOpen,
  "linking.open_oauth": handleLinkingOpenOAuth,
  "deep_link.resolve": handleDeepLink,
  "share.send": handleShare,
  "clipboard.copy": handleClipboard,
  "haptics.trigger": handleHaptics,
  "auth.store": handleAuth,
  "auth.refresh": handleAuth,
  "auth.clear": handleAuth,
  "phone.dial": handlePhone,
  "ui.show_tooltip": handleUiTooltip,
  "app.refresh": handleAppRefresh,
};
