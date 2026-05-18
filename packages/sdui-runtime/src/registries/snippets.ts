import type { ComponentType } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";

/**
 * Registry mapping wire type strings to snippet renderers.
 * Populated by task 025 (sdui-snippet-renderers).
 *
 * Shape: { "creator.snippet.info_row": InfoRowRenderer, ... }
 */
export const snippetRegistry: Record<
  string,
  ComponentType<Node>
> = {};
