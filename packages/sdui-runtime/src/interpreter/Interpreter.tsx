import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { resolveRenderer } from "../registries/node-registry.js";
import { Fallback } from "./Fallback.js";
import { ConditionalGate } from "./ConditionalGate.js";

interface InterpreterProps {
  node: Node;
}

/**
 * The SDUI dispatcher. Reads node.type, looks up the renderer
 * from registries, falls back to <Fallback> on unknown types.
 *
 * A node carrying `show_when` is wrapped in <ConditionalGate>, which renders it
 * only while its rule holds (and drops a hidden form field out of validation).
 * Whether a node has `show_when` is a stable wire property, so the branch is
 * consistent across renders — the gate's hooks mount only where needed.
 */
export function Interpreter({ node }: InterpreterProps): React.ReactElement {
  const Renderer = resolveRenderer(node.type);

  if (!Renderer) {
    return <Fallback type={node.type} />;
  }

  if ((node as { show_when?: unknown }).show_when) {
    return <ConditionalGate node={node} Renderer={Renderer} />;
  }

  return <Renderer {...node} />;
}
