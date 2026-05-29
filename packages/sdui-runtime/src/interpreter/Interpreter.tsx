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
  // Guard against malformed nodes from the wire (`null`, missing `type`,
  // a non-string `type`). These slip through when the BFF emits an
  // unexpected shape or a `replace_section` payload carries a stub with
  // no `type`. Without this guard, `resolveRenderer` crashes on the
  // first downstream `String.startsWith` call.
  const type = node?.type;
  if (typeof type !== "string") {
    return <Fallback type={typeof type === "undefined" ? "<missing>" : String(type)} />;
  }

  const Renderer = resolveRenderer(type);

  if (Renderer) {
    return <Renderer {...node} />;
  }

  return <Fallback type={type} />;
}
