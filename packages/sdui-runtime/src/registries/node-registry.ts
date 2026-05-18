import type { ComponentType } from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { uiComponentRegistry } from "./ui-components.js";
import { snippetRegistry } from "./snippets.js";

/**
 * Composed registry the Interpreter consults.
 * Resolves a wire `type` string to the correct renderer.
 */
export function resolveRenderer(
  type: string,
): ComponentType<Node> | undefined {
  if (type.startsWith("creator.ui_component.")) {
    return uiComponentRegistry[type];
  }
  if (type.startsWith("creator.snippet.")) {
    return snippetRegistry[type];
  }
  return undefined;
}
