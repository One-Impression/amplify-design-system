import React from "react";
import type { Node } from "@one-impression/sdk-native-sdui";
import { resolveRenderer } from "../registries/node-registry.js";
import { useTelemetry } from "../telemetry/index.js";
import { Fallback } from "./Fallback.js";
import { normalizeNode } from "./normalize-node.js";

interface InterpreterProps {
  node: Node;
}

/**
 * The SDUI dispatcher. Reads node.type, looks up the renderer
 * from registries, falls back to <Fallback> on unknown types.
 *
 * Before resolving the renderer, the node passes through
 * {@link normalizeNode} so legacy `props`-shaped payloads are rewritten
 * to the canonical `data` field (per `@one-impression/sdui-primitives@1.0.0`).
 */
export function Interpreter({ node }: InterpreterProps): React.ReactElement {
  const telemetry = useTelemetry();
  const { normalized, didNormalize } = normalizeNode(node);

  if (didNormalize) {
    telemetry.emit("sdui.interpreter.props_normalized", {
      type: normalized.type,
      id: normalized.id,
    });
  }

  const Renderer = resolveRenderer(normalized.type);

  if (Renderer) {
    return <Renderer {...normalized} />;
  }

  return <Fallback type={normalized.type} />;
}
