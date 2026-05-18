import React from "react";
import { resolveLoader } from "./loader-resolver.js";

interface ContainerLoaderProps {
  actionHint?: string;
  endpointHint?: string;
}

/**
 * Renders the appropriate skeleton loader for a container screen.
 * Uses the 3-tier resolution: action hint → endpoint hint → default.
 */
export function ContainerLoader({
  actionHint,
  endpointHint,
}: ContainerLoaderProps): React.ReactElement {
  const Skeleton = resolveLoader({ actionHint, endpointHint });
  return <Skeleton />;
}
