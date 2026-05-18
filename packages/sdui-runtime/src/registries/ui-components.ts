import type { ComponentType } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";

/**
 * Registry mapping wire type strings to ui_component renderers.
 * Populated by task 024 (sdui-ui-component-renderers).
 *
 * Shape: { "creator.ui_component.button": ButtonRenderer, ... }
 */
export const uiComponentRegistry: Record<
  string,
  ComponentType<Node>
> = {};
