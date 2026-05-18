import type { ComponentType } from "react";
import type { Page } from "@one-impression/sdk-native-sdui";

/**
 * Registry mapping page layout strings to page container renderers.
 * Populated by task 026 (sdui-page-renderers).
 *
 * Shape: { "standard": PageStandard, "feed": PageFeed, ... }
 */
export const pageContainerRegistry: Record<
  string,
  ComponentType<{ page: Page }>
> = {};
