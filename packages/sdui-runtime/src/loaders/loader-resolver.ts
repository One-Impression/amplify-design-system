import type { ComponentType } from "react";
import { skeletonRegistry } from "./skeleton-registry.js";

/**
 * 3-tier loader resolution priority:
 *   1. Action loading_hint (from the navigate action's payload.loading_hint)
 *   2. Endpoint x-loader-skeleton (from BFF OpenAPI x-loader-skeleton extension)
 *   3. Global default (DefaultPageSkeleton)
 *
 * Returns the resolved skeleton component.
 */
export function resolveLoader(opts: {
  actionHint?: string;
  endpointHint?: string;
}): ComponentType {
  // Tier 1: action-level loading hint
  if (opts.actionHint && skeletonRegistry[opts.actionHint]) {
    return skeletonRegistry[opts.actionHint];
  }

  // Tier 2: endpoint-level skeleton hint
  if (opts.endpointHint && skeletonRegistry[opts.endpointHint]) {
    return skeletonRegistry[opts.endpointHint];
  }

  // Tier 3: global default
  return skeletonRegistry["default"];
}
