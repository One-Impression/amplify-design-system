import type { ComponentType } from "react";
import type { Page } from "@one-impression/sdk-native-sdui";
import { PageStandardRenderer } from "../pages/PageStandard/index.js";
import { PageStickyFooterRenderer } from "../pages/PageStickyFooter/index.js";
import { PageFeedRenderer } from "../pages/PageFeed/index.js";
import { WebViewPageRenderer } from "../pages/WebViewPage/index.js";
import { WebViewPageWithActionRenderer } from "../pages/WebViewPageWithAction/index.js";

/**
 * Registry mapping page layout strings to page container renderers.
 * Consumed by PageRoot to dispatch to the correct page container
 * based on the BFF page envelope's `layout` field.
 *
 * Layout keys correspond to the PageLayout enum from sdk-native-sdui:
 * "standard" | "sticky_footer" | "feed" | "web_view" | "web_view_action"
 */
export const pageContainerRegistry: Record<
  string,
  ComponentType<{ page: Page }>
> = {
  standard: PageStandardRenderer,
  sticky_footer: PageStickyFooterRenderer,
  feed: PageFeedRenderer,
  web_view: WebViewPageRenderer,
  web_view_action: WebViewPageWithActionRenderer,
};
