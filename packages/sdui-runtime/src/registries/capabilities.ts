/**
 * Capability handler registry — maps all capability type strings to their
 * handler functions.
 *
 * Task 11 created this as an empty placeholder. Task 23 populates it with
 * all 13 capability handler implementations (16 entries total, since auth
 * and notifications have multiple sub-operations sharing a handler).
 */
import type { CapabilityHandler } from "../action-engine/types.js";
import { handleFiles } from "../capabilities/files/handler.js";
import { handleCamera } from "../capabilities/camera/handler.js";
import { handleNotifications } from "../capabilities/notifications/handler.js";
import { handleLinkingOpen } from "../capabilities/linking-open/handler.js";
import { handleLinkingOpenOAuth } from "../capabilities/linking-open-oauth/handler.js";
import { handleDeepLink } from "../capabilities/deep-link/handler.js";
import { handleShare } from "../capabilities/share/handler.js";
import { handleClipboard } from "../capabilities/clipboard/handler.js";
import { handleHaptics } from "../capabilities/haptics/handler.js";
import { handleAuth } from "../capabilities/auth/handler.js";
import { handlePhone } from "../capabilities/phone/handler.js";
import { handleUiTooltip } from "../capabilities/ui-tooltip/handler.js";
import { handleAppRefresh } from "../capabilities/app-refresh/handler.js";

export const capabilityHandlers: Record<string, CapabilityHandler> = {
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

/** @deprecated Use `capabilityHandlers` — kept for backward compatibility with foundation exports. */
export const capabilityHandlerRegistry = capabilityHandlers;
