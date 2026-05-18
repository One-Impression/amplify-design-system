import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { resolveRenderer } from "../registries/node-registry.js";
import { Fallback } from "./Fallback.js";

interface InterpreterProps {
  node: Node;
}

/**
 * The SDUI dispatcher. Reads node.type, looks up the renderer
 * from registries, falls back to <Fallback> on unknown types.
 */
export function Interpreter({ node }: InterpreterProps): React.ReactElement {
  const Renderer = resolveRenderer(node.type);

  if (Renderer) {
    return <Renderer {...node} />;
  }

  return <Fallback type={node.type} />;
}
