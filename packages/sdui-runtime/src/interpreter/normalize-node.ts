import type { Node } from "@one-impression/sdk-native-sdui";

/**
 * Result of running {@link normalizeNode} against a wire payload.
 *
 * `normalized` is the (possibly rewritten) node ready for rendering.
 * `didNormalize` is true when `props` was copied into `data` so the
 * caller can emit a telemetry warning (legacy / stale emit detected).
 */
export interface NormalizeResult {
  normalized: Node;
  didNormalize: boolean;
}

/**
 * Defensive normalization at the Interpreter boundary.
 *
 * The current wire contract (per `@one-impression/sdui-primitives@1.0.0`)
 * places renderer payloads under `node.data`. Stale or legacy handler
 * emits sometimes still ship them under `node.props`. To keep the page
 * rendering correctly during the SDUI migration window, copy `props`
 * into `data` when — and only when — `data` is undefined and `props`
 * is present. Nodes that already have `data` are passed through
 * untouched (we never overwrite the canonical field).
 */
export function normalizeNode(node: Node): NormalizeResult {
  // Treat the node as a loose record so we can probe for the legacy
  // `props` key without widening the Node type itself.
  const raw = node as Node & { props?: unknown };
  const hasData = raw.data !== undefined;
  const hasProps = raw.props !== undefined;

  if (!hasData && hasProps) {
    // Clone so we never mutate the caller's input — Interpreter is a
    // pure render boundary and the same node may be reused upstream.
    const { props, ...rest } = raw;
    return {
      normalized: { ...rest, data: props } as Node,
      didNormalize: true,
    };
  }

  return { normalized: node, didNormalize: false };
}
